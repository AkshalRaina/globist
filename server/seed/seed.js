const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const Region = require('../models/Region');
const Agency = require('../models/Agency');
const Trip = require('../models/Trip');
const Booking = require('../models/Booking');
const Reel = require('../models/Reel');

async function seedDatabase() {
  console.log('🌱 Seeding database...');

  // ── REGIONS ──
  const regions = await Region.insertMany([
    {
      name: 'Himachal Pradesh',
      spotCount: 42,
      verifiedAgencies: 12,
      imageType: 'mountain',
      subLocations: ['Manali', 'Kasol', 'Shimla', 'Spiti'],
      description: 'The land of snow-capped mountains, lush valleys, and ancient temples.',
      isFeatured: true
    },
    {
      name: 'Uttarakhand',
      spotCount: 35,
      verifiedAgencies: 8,
      imageType: 'valley',
      subLocations: ['Rishikesh', 'Auli', 'Nainital', 'Mussoorie'],
      description: 'The abode of the gods with majestic Himalayan peaks and holy rivers.',
      isFeatured: true
    },
    {
      name: 'Rajasthan',
      spotCount: 28,
      verifiedAgencies: 6,
      imageType: 'desert',
      subLocations: ['Jaipur', 'Udaipur', 'Jaisalmer', 'Jodhpur'],
      description: 'Land of kings, vibrant colors, and desert adventures.',
      isFeatured: true
    },
    {
      name: 'Kerala',
      spotCount: 30,
      verifiedAgencies: 7,
      imageType: 'beach',
      subLocations: ['Alleppey', 'Munnar', 'Kochi', 'Wayanad'],
      description: 'God\'s own country with backwaters, tea plantations, and tropical beaches.',
      isFeatured: true
    }
  ]);
  console.log(`  ✓ ${regions.length} regions created`);

  // ── DEMO USER ──
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash('123456', salt);

  const demoUser = await User.create({
    name: 'Arjun Sharma',
    phone: '+91 98765 43210',
    password: hashedPassword,
    role: 'creator',
    interests: ['Trekking', 'Camping', 'Snow'],
    bio: 'Adventure seeker and mountain lover. Exploring the hidden gems of the Himalayas one trek at a time. ⛰️🎒',
    location: 'New Delhi, India',
    avatar: '',
    referralPoints: 2450,
    explorerTier: 'gold',
    stats: {
      trips: 24,
      followers: 1200,
      bookingsInspired: 38,
      reviews: 15
    },
    isVerified: true
  });
  console.log(`  ✓ Demo user created: ${demoUser.name}`);

  // ── AGENCIES ──
  const agencies = await Agency.insertMany([
    {
      name: 'Himalayan High Treks',
      description: 'Expert-led expeditions to Spiti and Pin Valley. Specializing in high-altitude survival and local culture experiences.',
      location: 'Manali, Himachal Pradesh',
      region: regions[0]._id,
      categories: ['Adventure', 'Treks'],
      rating: 4.9,
      reviewCount: 1240,
      isVerified: true,
      startingPrice: 12500,
      imageType: 'mountain'
    },
    {
      name: 'Ganges Valley Treks',
      description: 'Rafting, camping, and spiritual journeys along the sacred Ganges river.',
      location: 'Rishikesh, Uttarakhand',
      region: regions[1]._id,
      categories: ['Adventure', 'Rafting'],
      rating: 4.8,
      reviewCount: 856,
      isVerified: true,
      startingPrice: 8000,
      imageType: 'valley'
    },
    {
      name: 'Auli Snow Escapes',
      description: 'Premium skiing and snowboarding experiences in the heart of the Garhwal Himalayas.',
      location: 'Auli, Uttarakhand',
      region: regions[1]._id,
      categories: ['Snow', 'Skiing'],
      rating: 4.7,
      reviewCount: 623,
      isVerified: true,
      startingPrice: 18000,
      imageType: 'snow'
    },
    {
      name: 'Manali Luxury Escapes',
      description: 'Bespoke riverside villas and wellness retreats in the heart of Old Manali. Premium transport included.',
      location: 'Old Manali, Himachal Pradesh',
      region: regions[0]._id,
      categories: ['Luxury', 'Family'],
      rating: 4.7,
      reviewCount: 850,
      isVerified: true,
      startingPrice: 25000,
      imageType: 'valley'
    },
    {
      name: 'Shimla Heritage Walks',
      description: 'Deep dive into colonial history. Authentic local food and hidden trail experiences.',
      location: 'Shimla, Himachal Pradesh',
      region: regions[0]._id,
      categories: ['City Tours', 'Culture'],
      rating: 4.8,
      reviewCount: 620,
      isVerified: false,
      startingPrice: 4500,
      imageType: 'snow'
    },
    {
      name: 'Kerala Backwater Cruises',
      description: 'Luxury houseboat stays and backwater explorations in Alleppey.',
      location: 'Alleppey, Kerala',
      region: regions[3]._id,
      categories: ['Luxury', 'Beach'],
      rating: 4.6,
      reviewCount: 430,
      isVerified: true,
      startingPrice: 15000,
      imageType: 'beach'
    }
  ]);
  console.log(`  ✓ ${agencies.length} agencies created`);

  // ── TRIPS ──
  const trips = await Trip.insertMany([
    {
      agency: agencies[0]._id,
      name: 'Spiti Valley Expedition',
      description: 'Expert-led expeditions to Spiti and Pin Valley. Specializing in high-altitude survival techniques and immersive local culture experiences with certified guides.',
      pricePerPerson: 12500,
      duration: 6,
      difficulty: 'moderate',
      groupSize: { min: 2, max: 15 },
      nextSlot: new Date('2025-12-12'),
      itinerary: [
        { day: 1, title: 'Arrival · Manali', description: 'Pick-up from bus stand. Check-in, orientation and acclimatization walk.' },
        { day: 2, title: 'Solang Valley Trek', description: '10km trek through alpine meadows. Camping overnight.' },
        { day: 3, title: 'Beas Kund Summit', description: 'High altitude trek to glacial lake at 3,700m elevation.' },
        { day: 4, title: 'Rohtang Pass Crossing', description: 'Cross the legendary Rohtang Pass at 3,978m. Visit Keylong.' },
        { day: 5, title: 'Spiti Valley Exploration', description: 'Visit Ki Monastery and Chicham Bridge. Local homestay.' },
        { day: 6, title: 'Departure', description: 'Morning meditation at monastery. Return to Manali.' }
      ],
      imageType: 'mountain',
      activeUsers: 34,
      region: regions[0]._id,
      isFeatured: true
    },
    {
      agency: agencies[1]._id,
      name: 'Rishikesh Rafting Adventure',
      description: 'White water rafting on Grade III-IV rapids with professional instructors. Includes riverside camping.',
      pricePerPerson: 8000,
      duration: 3,
      difficulty: 'moderate',
      groupSize: { min: 4, max: 20 },
      nextSlot: new Date('2026-01-05'),
      itinerary: [
        { day: 1, title: 'Arrival · Rishikesh', description: 'Check-in at riverside camp. Evening aarti at Triveni Ghat.' },
        { day: 2, title: 'White Water Rafting', description: '16km rafting from Shivpuri to Laxman Jhula. Grade III-IV rapids.' },
        { day: 3, title: 'Bungee & Departure', description: 'Optional bungee jumping. Departure after lunch.' }
      ],
      imageType: 'valley',
      activeUsers: 22,
      region: regions[1]._id,
      isFeatured: true
    },
    {
      agency: agencies[2]._id,
      name: 'Auli Skiing Experience',
      description: 'Professional skiing lessons with equipment. Includes gondola rides and panoramic Himalayan views.',
      pricePerPerson: 18000,
      duration: 4,
      difficulty: 'easy',
      groupSize: { min: 2, max: 10 },
      nextSlot: new Date('2025-12-20'),
      itinerary: [
        { day: 1, title: 'Arrival · Joshimath', description: 'Travel to Joshimath, cable car to Auli.' },
        { day: 2, title: 'Skiing Basics', description: 'Professional skiing lessons on beginner slopes.' },
        { day: 3, title: 'Advanced Slopes', description: 'Intermediate skiing with guide. Evening bonfire.' },
        { day: 4, title: 'Free Run & Departure', description: 'Free skiing. Return to Joshimath.' }
      ],
      imageType: 'snow',
      activeUsers: 12,
      region: regions[1]._id,
      isFeatured: true
    },
    {
      agency: agencies[3]._id,
      name: 'Manali Riverside Luxury Stay',
      description: 'Premium riverside villa with spa, organic meals, and guided valley walks.',
      pricePerPerson: 25000,
      duration: 5,
      difficulty: 'easy',
      groupSize: { min: 2, max: 8 },
      nextSlot: new Date('2025-12-15'),
      itinerary: [
        { day: 1, title: 'Welcome · Old Manali', description: 'Private transfer, villa check-in, welcome dinner.' },
        { day: 2, title: 'Spa & Wellness', description: 'Morning yoga, ayurvedic spa, organic cooking class.' },
        { day: 3, title: 'Valley Walk', description: 'Guided walk through Jogini Waterfall trail.' },
        { day: 4, title: 'Cultural Experience', description: 'Visit Hadimba Temple, local market tour.' },
        { day: 5, title: 'Departure', description: 'Farewell breakfast, private transfer.' }
      ],
      imageType: 'valley',
      activeUsers: 8,
      region: regions[0]._id
    },
    {
      agency: agencies[4]._id,
      name: 'Shimla Heritage Trail',
      description: 'Walk through colonial-era architecture, taste authentic Himachali cuisine, and explore hidden trails.',
      pricePerPerson: 4500,
      duration: 2,
      difficulty: 'easy',
      groupSize: { min: 5, max: 25 },
      nextSlot: new Date('2026-01-10'),
      itinerary: [
        { day: 1, title: 'Ridge Walk', description: 'Walk along the Ridge, visit Christ Church, and explore Mall Road.' },
        { day: 2, title: 'Hidden Trails', description: 'Nature trail to Jakhu Temple, local food tour.' }
      ],
      imageType: 'snow',
      activeUsers: 18,
      region: regions[0]._id
    },
    {
      agency: agencies[5]._id,
      name: 'Kerala Backwater Cruise',
      description: 'Luxury houseboat cruise through the backwaters of Alleppey with local cuisine.',
      pricePerPerson: 15000,
      duration: 3,
      difficulty: 'easy',
      groupSize: { min: 2, max: 6 },
      nextSlot: new Date('2026-02-01'),
      itinerary: [
        { day: 1, title: 'Board Houseboat', description: 'Board premium houseboat, welcome drinks, sunset cruise.' },
        { day: 2, title: 'Village Tour', description: 'Visit toddy shops, coir-making villages, and spice gardens.' },
        { day: 3, title: 'Departure', description: 'Morning bird watching, Kerala breakfast, disembark.' }
      ],
      imageType: 'beach',
      activeUsers: 6,
      region: regions[3]._id
    }
  ]);
  console.log(`  ✓ ${trips.length} trips created`);

  // Add trips to user wishlist
  demoUser.wishlist = [trips[0]._id, trips[1]._id, trips[5]._id];
  await demoUser.save();

  // ── BOOKINGS ──
  const bookings = await Booking.insertMany([
    {
      user: demoUser._id,
      trip: trips[0]._id,
      agency: agencies[0]._id,
      checkIn: new Date('2025-12-12'),
      checkOut: new Date('2025-12-18'),
      adults: 2,
      children: 0,
      totalAmount: 24300,
      discount: 1200,
      platformFee: 500,
      paymentMethod: 'upi',
      referralPointsUsed: 0,
      status: 'confirmed'
    },
    {
      user: demoUser._id,
      trip: trips[1]._id,
      agency: agencies[1]._id,
      checkIn: new Date('2026-01-05'),
      checkOut: new Date('2026-01-08'),
      adults: 1,
      children: 0,
      totalAmount: 7300,
      discount: 1200,
      platformFee: 500,
      paymentMethod: 'upi',
      referralPointsUsed: 0,
      status: 'confirmed'
    }
  ]);
  console.log(`  ✓ ${bookings.length} bookings created`);

  // ── REELS ──
  const reels = await Reel.insertMany([
    {
      user: demoUser._id,
      agency: agencies[0]._id,
      booking: bookings[0]._id,
      caption: 'Waking up to the serene peaks of Manali. The air is different up here. ⛰️',
      tags: ['#Himachal', '#RoamFlow', '#Manali'],
      location: 'Manali, Himachal Pradesh',
      isAffiliate: true,
      likes: 12400,
      comments: 842,
      shares: 2100,
      imageType: 'mountain',
      musicTitle: 'Local Folk - Mountain Spirit',
      creatorHandle: '@mountain_explorer',
      creatorTier: 'gold'
    },
    {
      user: demoUser._id,
      agency: agencies[1]._id,
      caption: 'White water rafting in Rishikesh! The adrenaline rush is real 🌊',
      tags: ['#Rishikesh', '#Rafting', '#Adventure'],
      location: 'Rishikesh, Uttarakhand',
      isAffiliate: true,
      likes: 8200,
      comments: 521,
      shares: 1500,
      imageType: 'valley',
      musicTitle: 'River Sounds - Nature Mix',
      creatorHandle: '@rishikesh_vibes',
      creatorTier: 'silver'
    },
    {
      user: demoUser._id,
      agency: agencies[2]._id,
      caption: 'Skiing at Auli is a dream come true! Perfect powder snow ❄️',
      tags: ['#Auli', '#Skiing', '#Snow'],
      location: 'Auli, Uttarakhand',
      isAffiliate: false,
      likes: 6100,
      comments: 318,
      shares: 900,
      imageType: 'snow',
      musicTitle: 'Winter Vibes - Chill Mix',
      creatorHandle: '@auli_diaries',
      creatorTier: 'bronze'
    },
    {
      user: demoUser._id,
      agency: agencies[3]._id,
      caption: 'Old Manali riverside luxury is unmatched. Pure bliss 🏔️✨',
      tags: ['#Manali', '#Luxury', '#Riverside'],
      location: 'Old Manali, Himachal Pradesh',
      isAffiliate: true,
      likes: 4500,
      comments: 230,
      shares: 680,
      imageType: 'jungle',
      musicTitle: 'Ambient River - Calm',
      creatorHandle: '@luxury_explorer',
      creatorTier: 'gold'
    },
    {
      user: demoUser._id,
      agency: agencies[5]._id,
      caption: 'Kerala backwaters are magical at sunset 🌅 Houseboat life is the best!',
      tags: ['#Kerala', '#Backwaters', '#Sunset'],
      location: 'Alleppey, Kerala',
      isAffiliate: false,
      likes: 3800,
      comments: 195,
      shares: 420,
      imageType: 'beach',
      musicTitle: 'Tropical Dreams - Kerala Mix',
      creatorHandle: '@kerala_wanderer',
      creatorTier: 'silver'
    }
  ]);
  console.log(`  ✓ ${reels.length} reels created`);
  console.log('✅ Database seeded successfully!');
  
  return { regions, demoUser, agencies, trips, bookings, reels };
}

module.exports = seedDatabase;
