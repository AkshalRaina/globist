import { Router } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { prisma } from '../services/db';
import { redisClient } from '../services/redis';
import { producer } from '../services/kafka';
import { generatePresignedUrl } from '../services/s3';

const router = Router();

// POST /api/reels/upload-url - Request Presigned URL
router.post('/upload-url', async (req, res) => {
  try {
    const { fileName, fileType, caption, userId } = req.body;
    
    if (!userId || !fileName || !fileType) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const isVideo = fileType.startsWith('video/');
    const extension = fileName.split('.').pop();
    const s3Key = `raw/${uuidv4()}.${extension}`;
    const bucket = process.env.S3_BUCKET_NAME || 'reels';

    // 1. Generate Presigned URL
    const uploadUrl = await generatePresignedUrl(bucket, s3Key, fileType);

    // 2. Create pending Reel in DB
    const reel = await prisma.reel.create({
      data: {
        userId,
        caption,
        mediaType: isVideo ? 'video' : 'image',
        mediaUrl: `s3://${bucket}/${s3Key}`, // Will be updated to CDN URL after processing
        status: 'processing'
      }
    });

    // 3. Emit Kafka event for processing queue
    await producer.send({
      topic: 'reel.uploaded',
      messages: [
        {
          key: reel.id,
          value: JSON.stringify({
            reelId: reel.id,
            s3Key,
            bucket,
            fileType,
            userId
          })
        }
      ]
    });

    res.json({ uploadUrl, reelId: reel.id });
  } catch (error) {
    console.error('Upload URL Error:', error);
    res.status(500).json({ error: 'Failed to generate upload URL' });
  }
});

// GET /api/reels/feed - Cursor-based feed fetching
router.get('/feed', async (req, res) => {
  try {
    const limit = Number(req.query.limit) || 10;
    const cursor = req.query.cursor as string;

    // Check Redis Cache first (for global feed performance)
    const cacheKey = `feed:global:${cursor || 'latest'}`;
    const cached = await redisClient.get(cacheKey);
    if (cached) {
      return res.json(JSON.parse(cached));
    }

    // Fallback to PostgreSQL
    const reels = await prisma.reel.findMany({
      take: limit + 1, // Fetch one extra to determine hasMore
      where: {
        status: 'published'
      },
      orderBy: {
        createdAt: 'desc'
      },
      cursor: cursor ? { id: cursor } : undefined,
      include: {
        user: { select: { id: true, username: true, profilePicUrl: true } }
      }
    });

    let hasMore = false;
    let nextCursor = null;

    if (reels.length > limit) {
      hasMore = true;
      const nextItem = reels.pop();
      nextCursor = nextItem?.id;
    }

    const responseData = { reels, nextCursor, hasMore };

    // Cache the page for 60 seconds
    await redisClient.setEx(cacheKey, 60, JSON.stringify(responseData));

    res.json(responseData);
  } catch (error) {
    console.error('Feed Error:', error);
    res.status(500).json({ error: 'Failed to fetch feed' });
  }
});

export default router;
