import { consumer } from './kafka';
import { prisma } from './db';

export const startMediaProcessor = async () => {
  try {
    await consumer.subscribe({ topic: 'reel.uploaded', fromBeginning: true });

    await consumer.run({
      eachMessage: async ({ topic, partition, message }) => {
        if (!message.value) return;

        const event = JSON.parse(message.value.toString());
        console.log(`📥 Received processing job for Reel: ${event.reelId}`);

        try {
          // 1. Simulate Media Processing (Transcoding, Thumbnails, Virus Scan)
          console.log(`   ⏳ Transcoding ${event.fileType} from ${event.s3Key}...`);
          
          // Simulate 3 seconds of processing
          await new Promise((resolve) => setTimeout(resolve, 3000));
          
          const processedUrl = `http://localhost:9000/${event.bucket}/${event.s3Key}`;
          const thumbnailUrl = `http://localhost:9000/${event.bucket}/thumb_${event.reelId}.jpg`;

          // 2. Update Database Status to 'published'
          await prisma.reel.update({
            where: { id: event.reelId },
            data: {
              status: 'published',
              mediaUrl: processedUrl,
              thumbnailUrl: thumbnailUrl,
              duration: 15 // simulated duration
            }
          });

          console.log(`✅ Finished processing Reel: ${event.reelId}. Status updated to Published.`);
          
        } catch (error) {
          console.error(`❌ Failed processing Reel: ${event.reelId}`, error);
          
          // Mark as failed in DB
          await prisma.reel.update({
            where: { id: event.reelId },
            data: { status: 'failed' }
          }).catch(console.error);
        }
      },
    });
  } catch (error) {
    console.error('Consumer error', error);
  }
};
