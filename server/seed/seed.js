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
    },
    {
      name: 'Goa',
      spotCount: 22,
      verifiedAgencies: 5,
      imageType: 'beach',
      subLocations: ['Panjim', 'Calangute', 'Baga', 'Anjuna'],
      description: 'Sun, sand, seafood, and an electrifying nightlife on India\'s western coast.',
      isFeatured: true
    },
    {
      name: 'Ladakh',
      spotCount: 18,
      verifiedAgencies: 4,
      imageType: 'mountain',
      subLocations: ['Leh', 'Nubra Valley', 'Pangong', 'Zanskar'],
      description: 'The roof of the world — stark landscapes, ancient monasteries, and high-altitude lakes.',
      isFeatured: true
    },
    {
      name: 'Meghalaya',
      spotCount: 15,
      verifiedAgencies: 3,
      imageType: 'jungle',
      subLocations: ['Shillong', 'Cherrapunji', 'Dawki', 'Mawlynnong'],
      description: 'The abode of clouds with living root bridges, waterfalls, and pristine caves.',
      isFeatured: false
    },
    {
      name: 'Karnataka',
      spotCount: 25,
      verifiedAgencies: 5,
      imageType: 'valley',
      subLocations: ['Coorg', 'Hampi', 'Bangalore', 'Mysore'],
      description: 'Heritage temples, misty hill stations, and the Silicon Valley of India.',
      isFeatured: false
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
  // Indices: [0] Himachal, [1] Uttarakhand, [2] Rajasthan, [3] Kerala, [4] Goa, [5] Ladakh, [6] Meghalaya, [7] Karnataka
  const agencies = await Agency.insertMany([
    // ── Himachal Pradesh ──
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
      name: 'Manali Luxury Escapes',
      description: 'Bespoke riverside villas and wellness retreats in the heart of Old Manali. Premium transport included.',
      location: 'Old Manali, Himachal Pradesh',
      region: regions[0]._id,
      categories: ['Luxury'],
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
      categories: ['City Tours'],
      rating: 4.8,
      reviewCount: 620,
      isVerified: true,
      startingPrice: 4500,
      imageType: 'snow'
    },
    {
      name: 'Kasol Adventure Camp',
      description: 'Riverside camping, cliff jumping, and the legendary Kheerganga trek through pine forests.',
      location: 'Kasol, Himachal Pradesh',
      region: regions[0]._id,
      categories: ['Adventure', 'Treks'],
      rating: 4.6,
      reviewCount: 430,
      isVerified: true,
      startingPrice: 6500,
      imageType: 'jungle'
    },
    // ── Uttarakhand ──
    {
      name: 'Ganges Valley Treks',
      description: 'Rafting, camping, and spiritual journeys along the sacred Ganges river.',
      location: 'Rishikesh, Uttarakhand',
      region: regions[1]._id,
      categories: ['Adventure', 'Treks'],
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
      categories: ['Adventure'],
      rating: 4.7,
      reviewCount: 623,
      isVerified: true,
      startingPrice: 18000,
      imageType: 'snow'
    },
    {
      name: 'Nainital Lake Retreats',
      description: 'Luxury lakeside cottages with private views of Naini Lake and curated city walking tours.',
      location: 'Nainital, Uttarakhand',
      region: regions[1]._id,
      categories: ['Luxury', 'City Tours'],
      rating: 4.5,
      reviewCount: 312,
      isVerified: true,
      startingPrice: 15000,
      imageType: 'valley'
    },
    // ── Rajasthan ──
    {
      name: 'Royal Desert Safaris',
      description: 'Camel safaris, desert camping under the stars, and Rajput fort explorations in the Thar.',
      location: 'Jaisalmer, Rajasthan',
      region: regions[2]._id,
      categories: ['Adventure'],
      rating: 4.8,
      reviewCount: 920,
      isVerified: true,
      startingPrice: 9500,
      imageType: 'desert'
    },
    {
      name: 'Udaipur Heritage Tours',
      description: 'Guided palace tours, boat rides on Lake Pichola, and authentic Rajasthani cuisine experiences.',
      location: 'Udaipur, Rajasthan',
      region: regions[2]._id,
      categories: ['City Tours', 'Luxury'],
      rating: 4.9,
      reviewCount: 1100,
      isVerified: true,
      startingPrice: 12000,
      imageType: 'desert'
    },
    {
      name: 'Jaipur Walking Tours',
      description: 'Explore the Pink City on foot — Hawa Mahal, Amber Fort, local bazaars, and street food trails.',
      location: 'Jaipur, Rajasthan',
      region: regions[2]._id,
      categories: ['City Tours'],
      rating: 4.6,
      reviewCount: 540,
      isVerified: false,
      startingPrice: 3500,
      imageType: 'desert'
    },
    // ── Kerala ──
    {
      name: 'Kerala Backwater Cruises',
      description: 'Luxury houseboat stays and backwater explorations in Alleppey.',
      location: 'Alleppey, Kerala',
      region: regions[3]._id,
      categories: ['Luxury'],
      rating: 4.6,
      reviewCount: 430,
      isVerified: true,
      startingPrice: 15000,
      imageType: 'beach'
    },
    {
      name: 'Munnar Tea Trail Treks',
      description: 'Trek through endless tea plantations, visit spice gardens, and stay in hilltop eco-lodges.',
      location: 'Munnar, Kerala',
      region: regions[3]._id,
      categories: ['Treks', 'Adventure'],
      rating: 4.7,
      reviewCount: 380,
      isVerified: true,
      startingPrice: 7500,
      imageType: 'jungle'
    },
    {
      name: 'Kochi Heritage Walks',
      description: 'Explore Fort Kochi\'s colonial architecture, Chinese fishing nets, and spice markets on foot.',
      location: 'Kochi, Kerala',
      region: regions[3]._id,
      categories: ['City Tours'],
      rating: 4.5,
      reviewCount: 290,
      isVerified: true,
      startingPrice: 3000,
      imageType: 'beach'
    },
    // ── Goa ──
    {
      name: 'Goa Beach Luxury',
      description: 'Private beach villas, yacht tours, sunset dinners, and premium spa experiences.',
      location: 'South Goa, Goa',
      region: regions[4]._id,
      categories: ['Luxury'],
      rating: 4.8,
      reviewCount: 670,
      isVerified: true,
      startingPrice: 22000,
      imageType: 'beach'
    },
    {
      name: 'Goa Adventure Sports',
      description: 'Parasailing, scuba diving, jet skiing, and island hopping adventures along the Goan coastline.',
      location: 'Baga, Goa',
      region: regions[4]._id,
      categories: ['Adventure'],
      rating: 4.5,
      reviewCount: 450,
      isVerified: true,
      startingPrice: 5500,
      imageType: 'beach'
    },
    {
      name: 'Old Goa Heritage Trail',
      description: 'Walk through Portuguese churches, Latin Quarter, and taste authentic Goan-Portuguese fusion cuisine.',
      location: 'Panjim, Goa',
      region: regions[4]._id,
      categories: ['City Tours'],
      rating: 4.4,
      reviewCount: 280,
      isVerified: false,
      startingPrice: 2500,
      imageType: 'beach'
    },
    // ── Ladakh ──
    {
      name: 'Ladakh Moto Expeditions',
      description: 'Iconic motorcycle expeditions over Khardung La, Pangong Lake, and Nubra Valley with expert riders.',
      location: 'Leh, Ladakh',
      region: regions[5]._id,
      categories: ['Adventure'],
      rating: 4.9,
      reviewCount: 1050,
      isVerified: true,
      startingPrice: 28000,
      imageType: 'mountain'
    },
    {
      name: 'Zanskar Valley Treks',
      description: 'Multi-day treks through the frozen Chadar river and remote Zanskar villages.',
      location: 'Zanskar, Ladakh',
      region: regions[5]._id,
      categories: ['Treks'],
      rating: 4.8,
      reviewCount: 420,
      isVerified: true,
      startingPrice: 35000,
      imageType: 'snow'
    },
    {
      name: 'Leh Palace & Monastery Tours',
      description: 'Guided cultural tours of ancient Buddhist monasteries, Leh Palace, and local Ladakhi homes.',
      location: 'Leh, Ladakh',
      region: regions[5]._id,
      categories: ['City Tours'],
      rating: 4.6,
      reviewCount: 310,
      isVerified: true,
      startingPrice: 5000,
      imageType: 'mountain'
    },
    // ── Meghalaya ──
    {
      name: 'Living Root Bridge Treks',
      description: 'Multi-day treks to the famous double-decker living root bridges of Nongriat.',
      location: 'Cherrapunji, Meghalaya',
      region: regions[6]._id,
      categories: ['Treks', 'Adventure'],
      rating: 4.7,
      reviewCount: 260,
      isVerified: true,
      startingPrice: 8500,
      imageType: 'jungle'
    },
    {
      name: 'Shillong City Escapes',
      description: 'Rock capital of India — live music, cafe hopping, Ward\'s Lake, and Don Bosco Museum.',
      location: 'Shillong, Meghalaya',
      region: regions[6]._id,
      categories: ['City Tours', 'Luxury'],
      rating: 4.4,
      reviewCount: 180,
      isVerified: false,
      startingPrice: 6000,
      imageType: 'jungle'
    },
    // ── Karnataka ──
    {
      name: 'Coorg Coffee Trail',
      description: 'Stay in plantation bungalows, trek through coffee estates, and visit Abbey Falls.',
      location: 'Coorg, Karnataka',
      region: regions[7]._id,
      categories: ['Treks', 'Luxury'],
      rating: 4.6,
      reviewCount: 520,
      isVerified: true,
      startingPrice: 11000,
      imageType: 'jungle'
    },
    {
      name: 'Hampi Heritage Expeditions',
      description: 'Explore the ancient Vijayanagara Empire ruins, boulder climbing, and coracle rides on the Tungabhadra.',
      location: 'Hampi, Karnataka',
      region: regions[7]._id,
      categories: ['City Tours', 'Adventure'],
      rating: 4.7,
      reviewCount: 390,
      isVerified: true,
      startingPrice: 4500,
      imageType: 'desert'
    }
  ]);
  console.log(`  ✓ ${agencies.length} agencies created`);

  // ── TRIPS ──
  const trips = await Trip.insertMany([
    // ── Himachal Pradesh Trips ──
    {
      agency: agencies[0]._id,
      name: 'Spiti Valley Expedition',
      description: 'Expert-led expeditions to Spiti and Pin Valley. Specializing in high-altitude survival techniques and immersive local culture experiences with certified guides.',
      pricePerPerson: 12500,
      duration: 6,
      difficulty: 'moderate',
      groupSize: { min: 2, max: 15 },
      nextSlot: new Date('2026-07-15'),
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
      name: 'Manali Riverside Luxury Stay',
      description: 'Premium riverside villa with spa, organic meals, and guided valley walks.',
      pricePerPerson: 25000,
      duration: 5,
      difficulty: 'easy',
      groupSize: { min: 2, max: 8 },
      nextSlot: new Date('2026-07-20'),
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
      agency: agencies[2]._id,
      name: 'Shimla Heritage Trail',
      description: 'Walk through colonial-era architecture, taste authentic Himachali cuisine, and explore hidden trails.',
      pricePerPerson: 4500,
      duration: 2,
      difficulty: 'easy',
      groupSize: { min: 5, max: 25 },
      nextSlot: new Date('2026-08-10'),
      itinerary: [
        { day: 1, title: 'Ridge Walk', description: 'Walk along the Ridge, visit Christ Church, and explore Mall Road.' },
        { day: 2, title: 'Hidden Trails', description: 'Nature trail to Jakhu Temple, local food tour.' }
      ],
      imageType: 'snow',
      activeUsers: 18,
      region: regions[0]._id
    },
    {
      agency: agencies[3]._id,
      name: 'Kheerganga Trek & Camp',
      description: 'Trek through Parvati Valley pine forests to the legendary Kheerganga hot springs at 2,960m.',
      pricePerPerson: 6500,
      duration: 3,
      difficulty: 'moderate',
      groupSize: { min: 4, max: 20 },
      nextSlot: new Date('2026-07-01'),
      itinerary: [
        { day: 1, title: 'Kasol to Barshaini', description: 'Drive to Barshaini, begin 12km trek through Parvati Valley.' },
        { day: 2, title: 'Kheerganga Summit', description: 'Reach hot springs, soak under the stars, bonfire night.' },
        { day: 3, title: 'Descent & Departure', description: 'Morning trek down, lunch in Kasol, departure.' }
      ],
      imageType: 'jungle',
      activeUsers: 26,
      region: regions[0]._id,
      isFeatured: true
    },
    // ── Uttarakhand Trips ──
    {
      agency: agencies[4]._id,
      name: 'Rishikesh Rafting Adventure',
      description: 'White water rafting on Grade III-IV rapids with professional instructors. Includes riverside camping.',
      pricePerPerson: 8000,
      duration: 3,
      difficulty: 'moderate',
      groupSize: { min: 4, max: 20 },
      nextSlot: new Date('2026-08-05'),
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
      agency: agencies[5]._id,
      name: 'Auli Skiing Experience',
      description: 'Professional skiing lessons with equipment. Includes gondola rides and panoramic Himalayan views.',
      pricePerPerson: 18000,
      duration: 4,
      difficulty: 'easy',
      groupSize: { min: 2, max: 10 },
      nextSlot: new Date('2026-12-20'),
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
      agency: agencies[6]._id,
      name: 'Nainital Lakeside Getaway',
      description: 'Luxury cottage stay overlooking Naini Lake with guided boat rides, Mall Road tour, and sunset point visits.',
      pricePerPerson: 15000,
      duration: 3,
      difficulty: 'easy',
      groupSize: { min: 2, max: 6 },
      nextSlot: new Date('2026-09-01'),
      itinerary: [
        { day: 1, title: 'Check-in · Lake View', description: 'Private cottage check-in, evening boat ride on Naini Lake.' },
        { day: 2, title: 'Mall Road & Temples', description: 'Guided walk through Mall Road, Naina Devi Temple visit.' },
        { day: 3, title: 'Sunrise & Departure', description: 'Early morning Tiffin Top hike, breakfast, departure.' }
      ],
      imageType: 'valley',
      activeUsers: 10,
      region: regions[1]._id
    },
    // ── Rajasthan Trips ──
    {
      agency: agencies[7]._id,
      name: 'Desert Safari & Camping',
      description: 'Camel ride through golden sand dunes, overnight desert camp with folk music and stargazing.',
      pricePerPerson: 9500,
      duration: 3,
      difficulty: 'easy',
      groupSize: { min: 4, max: 16 },
      nextSlot: new Date('2026-11-15'),
      itinerary: [
        { day: 1, title: 'Arrival · Jaisalmer', description: 'Fort tour, visit Patwon Ki Haveli.' },
        { day: 2, title: 'Desert Safari', description: 'Camel safari to Sam Sand Dunes. Overnight luxury camp with Rajasthani folk dance.' },
        { day: 3, title: 'Sunrise & Departure', description: 'Desert sunrise, jeep ride back, departure.' }
      ],
      imageType: 'desert',
      activeUsers: 28,
      region: regions[2]._id,
      isFeatured: true
    },
    {
      agency: agencies[8]._id,
      name: 'Udaipur Royal Experience',
      description: 'Stay in heritage haveli, private boat on Lake Pichola, City Palace tour, and Rajasthani thali dinner.',
      pricePerPerson: 12000,
      duration: 4,
      difficulty: 'easy',
      groupSize: { min: 2, max: 10 },
      nextSlot: new Date('2026-10-01'),
      itinerary: [
        { day: 1, title: 'Arrival · Udaipur', description: 'Heritage haveli check-in, evening at Gangaur Ghat.' },
        { day: 2, title: 'City Palace & Lake', description: 'Guided City Palace tour, private boat ride on Lake Pichola.' },
        { day: 3, title: 'Monsoon Palace & Sunset', description: 'Visit Sajjangarh Monsoon Palace, sunset dinner at rooftop.' },
        { day: 4, title: 'Local Market & Departure', description: 'Shopping at Hathi Pol Bazaar, departure.' }
      ],
      imageType: 'desert',
      activeUsers: 15,
      region: regions[2]._id
    },
    {
      agency: agencies[9]._id,
      name: 'Pink City Walking Tour',
      description: 'Full-day walking tour of Jaipur — Hawa Mahal, Amber Fort, local bazaars, and authentic street food.',
      pricePerPerson: 3500,
      duration: 1,
      difficulty: 'easy',
      groupSize: { min: 6, max: 30 },
      nextSlot: new Date('2026-09-15'),
      itinerary: [
        { day: 1, title: 'Jaipur City Walk', description: 'Hawa Mahal at sunrise, Amber Fort, Jantar Mantar, local chai and street food trail.' }
      ],
      imageType: 'desert',
      activeUsers: 40,
      region: regions[2]._id
    },
    // ── Kerala Trips ──
    {
      agency: agencies[10]._id,
      name: 'Kerala Backwater Cruise',
      description: 'Luxury houseboat cruise through the backwaters of Alleppey with local cuisine.',
      pricePerPerson: 15000,
      duration: 3,
      difficulty: 'easy',
      groupSize: { min: 2, max: 6 },
      nextSlot: new Date('2026-09-01'),
      itinerary: [
        { day: 1, title: 'Board Houseboat', description: 'Board premium houseboat, welcome drinks, sunset cruise.' },
        { day: 2, title: 'Village Tour', description: 'Visit toddy shops, coir-making villages, and spice gardens.' },
        { day: 3, title: 'Departure', description: 'Morning bird watching, Kerala breakfast, disembark.' }
      ],
      imageType: 'beach',
      activeUsers: 6,
      region: regions[3]._id
    },
    {
      agency: agencies[11]._id,
      name: 'Munnar Tea Plantation Trek',
      description: 'Trek through rolling tea gardens, visit Eravikulam National Park, and stay in eco-lodge.',
      pricePerPerson: 7500,
      duration: 3,
      difficulty: 'moderate',
      groupSize: { min: 4, max: 12 },
      nextSlot: new Date('2026-08-15'),
      itinerary: [
        { day: 1, title: 'Arrival · Munnar', description: 'Eco-lodge check-in, evening tea tasting session.' },
        { day: 2, title: 'Tea Garden Trek', description: 'Full-day trek through tea plantations and spice gardens.' },
        { day: 3, title: 'Eravikulam & Departure', description: 'Morning visit to Eravikulam National Park, departure.' }
      ],
      imageType: 'jungle',
      activeUsers: 14,
      region: regions[3]._id,
      isFeatured: true
    },
    {
      agency: agencies[12]._id,
      name: 'Fort Kochi Heritage Walk',
      description: 'Walk through Fort Kochi\'s colonial streets, Chinese fishing nets, spice markets, and Jew Town.',
      pricePerPerson: 3000,
      duration: 1,
      difficulty: 'easy',
      groupSize: { min: 5, max: 20 },
      nextSlot: new Date('2026-08-01'),
      itinerary: [
        { day: 1, title: 'Fort Kochi Walk', description: 'Chinese fishing nets, St. Francis Church, Mattancherry Palace, Jew Town, and spice market.' }
      ],
      imageType: 'beach',
      activeUsers: 20,
      region: regions[3]._id
    },
    // ── Goa Trips ──
    {
      agency: agencies[13]._id,
      name: 'South Goa Luxury Retreat',
      description: 'Private beach villa, yacht sunset cruise, candlelight dinner, and premium spa package.',
      pricePerPerson: 22000,
      duration: 4,
      difficulty: 'easy',
      groupSize: { min: 2, max: 4 },
      nextSlot: new Date('2026-11-01'),
      itinerary: [
        { day: 1, title: 'Villa Check-in', description: 'Private beach villa, welcome cocktails, sunset swim.' },
        { day: 2, title: 'Yacht Cruise', description: 'Private yacht cruise along the Goan coast, dolphin spotting.' },
        { day: 3, title: 'Spa & Cuisine', description: 'Full-day spa, Goan cooking class, candlelight dinner.' },
        { day: 4, title: 'Departure', description: 'Beach brunch, private transfer.' }
      ],
      imageType: 'beach',
      activeUsers: 5,
      region: regions[4]._id
    },
    {
      agency: agencies[14]._id,
      name: 'Goa Water Sports Package',
      description: 'Parasailing, scuba diving, jet skiing, and banana boat rides — the ultimate Goa adrenaline rush.',
      pricePerPerson: 5500,
      duration: 2,
      difficulty: 'moderate',
      groupSize: { min: 2, max: 12 },
      nextSlot: new Date('2026-10-15'),
      itinerary: [
        { day: 1, title: 'Beach Sports', description: 'Parasailing, jet skiing, banana boat at Baga Beach.' },
        { day: 2, title: 'Scuba Diving', description: 'Scuba diving at Grande Island, snorkeling, island lunch.' }
      ],
      imageType: 'beach',
      activeUsers: 30,
      region: regions[4]._id,
      isFeatured: true
    },
    {
      agency: agencies[15]._id,
      name: 'Old Goa Heritage Walk',
      description: 'Portuguese churches, Latin Quarter stroll, and Goan-Portuguese fusion cuisine tasting.',
      pricePerPerson: 2500,
      duration: 1,
      difficulty: 'easy',
      groupSize: { min: 6, max: 25 },
      nextSlot: new Date('2026-10-01'),
      itinerary: [
        { day: 1, title: 'Heritage Walk', description: 'Basilica of Bom Jesus, Se Cathedral, Fontainhas Latin Quarter, local cuisine trail.' }
      ],
      imageType: 'beach',
      activeUsers: 22,
      region: regions[4]._id
    },
    // ── Ladakh Trips ──
    {
      agency: agencies[16]._id,
      name: 'Leh-Ladakh Moto Expedition',
      description: 'Iconic 10-day motorcycle ride over the highest motorable passes in the world.',
      pricePerPerson: 28000,
      duration: 10,
      difficulty: 'hard',
      groupSize: { min: 4, max: 12 },
      nextSlot: new Date('2026-07-01'),
      itinerary: [
        { day: 1, title: 'Arrival · Leh', description: 'Acclimatization day, Leh Market, Shanti Stupa.' },
        { day: 2, title: 'Magnetic Hill & Confluence', description: 'Visit Magnetic Hill, Zanskar-Indus confluence.' },
        { day: 3, title: 'Khardung La', description: 'Ride over Khardung La (5,359m), descend to Nubra Valley.' },
        { day: 4, title: 'Nubra Valley', description: 'Diskit Monastery, double-humped camel ride.' },
        { day: 5, title: 'Pangong Lake', description: 'Ride to Pangong Tso lake, overnight lakeside camp.' },
        { day: 6, title: 'Return to Leh', description: 'Return via Chang La pass.' }
      ],
      imageType: 'mountain',
      activeUsers: 16,
      region: regions[5]._id,
      isFeatured: true
    },
    {
      agency: agencies[17]._id,
      name: 'Chadar Frozen River Trek',
      description: 'Walk on the frozen Zanskar River through one of the most extreme treks in the world.',
      pricePerPerson: 35000,
      duration: 9,
      difficulty: 'hard',
      groupSize: { min: 6, max: 14 },
      nextSlot: new Date('2027-01-15'),
      itinerary: [
        { day: 1, title: 'Arrival · Leh', description: 'Acclimatization, gear check.' },
        { day: 2, title: 'Drive to Chilling', description: 'Drive to trek starting point at Chilling village.' },
        { day: 3, title: 'Frozen River Walk', description: 'Begin walking on the frozen Zanskar River.' },
        { day: 4, title: 'Deep Canyon', description: 'Navigate through narrow ice canyon.' },
        { day: 5, title: 'Nerak Waterfall', description: 'Reach the frozen Nerak waterfall — the ultimate reward.' }
      ],
      imageType: 'snow',
      activeUsers: 8,
      region: regions[5]._id
    },
    {
      agency: agencies[18]._id,
      name: 'Leh Monastery Circuit',
      description: 'Cultural tour of Ladakh\'s most iconic Buddhist monasteries and palaces.',
      pricePerPerson: 5000,
      duration: 2,
      difficulty: 'easy',
      groupSize: { min: 4, max: 20 },
      nextSlot: new Date('2026-08-01'),
      itinerary: [
        { day: 1, title: 'Leh Monastery Tour', description: 'Leh Palace, Thiksey Monastery (mini Potala), Hemis Monastery.' },
        { day: 2, title: 'Alchi & Likir', description: 'Drive to 1,000-year-old Alchi monastery, Likir Monastery.' }
      ],
      imageType: 'mountain',
      activeUsers: 25,
      region: regions[5]._id
    },
    // ── Meghalaya Trips ──
    {
      agency: agencies[19]._id,
      name: 'Double Root Bridge Trek',
      description: 'Trek to the famous double-decker living root bridge of Nongriat in the Khasi Hills.',
      pricePerPerson: 8500,
      duration: 3,
      difficulty: 'moderate',
      groupSize: { min: 4, max: 15 },
      nextSlot: new Date('2026-10-01'),
      itinerary: [
        { day: 1, title: 'Arrival · Cherrapunji', description: 'Drive from Shillong, visit Seven Sisters Falls.' },
        { day: 2, title: 'Root Bridge Trek', description: 'Descend 3,500 steps to Nongriat village and the double-decker living root bridge.' },
        { day: 3, title: 'Rainbow Falls & Return', description: 'Trek to Rainbow Falls, ascend back, departure.' }
      ],
      imageType: 'jungle',
      activeUsers: 12,
      region: regions[6]._id,
      isFeatured: true
    },
    {
      agency: agencies[20]._id,
      name: 'Shillong City & Cafe Hop',
      description: 'Explore the Scotland of the East — live music venues, cozy cafes, and Ward\'s Lake.',
      pricePerPerson: 6000,
      duration: 2,
      difficulty: 'easy',
      groupSize: { min: 2, max: 10 },
      nextSlot: new Date('2026-09-15'),
      itinerary: [
        { day: 1, title: 'City Tour', description: 'Ward\'s Lake, Don Bosco Museum, Police Bazaar, live music at a local cafe.' },
        { day: 2, title: 'Day Trip', description: 'Drive to Dawki river (crystal clear), Mawlynnong (cleanest village).' }
      ],
      imageType: 'jungle',
      activeUsers: 8,
      region: regions[6]._id
    },
    // ── Karnataka Trips ──
    {
      agency: agencies[21]._id,
      name: 'Coorg Coffee Estate Stay',
      description: 'Stay in a colonial-era plantation bungalow, trek through coffee estates, and visit Abbey Falls.',
      pricePerPerson: 11000,
      duration: 3,
      difficulty: 'easy',
      groupSize: { min: 2, max: 8 },
      nextSlot: new Date('2026-09-01'),
      itinerary: [
        { day: 1, title: 'Plantation Check-in', description: 'Arrive at coffee estate bungalow, evening plantation walk, bonfire.' },
        { day: 2, title: 'Trek & Waterfalls', description: 'Trek to Abbey Falls, Mandalpatti viewpoint, coffee tasting.' },
        { day: 3, title: 'Bylakuppe & Departure', description: 'Visit Tibetan Golden Temple at Bylakuppe, departure.' }
      ],
      imageType: 'jungle',
      activeUsers: 10,
      region: regions[7]._id
    },
    {
      agency: agencies[22]._id,
      name: 'Hampi Ruins Expedition',
      description: 'Explore the UNESCO World Heritage ruins of Vijayanagara Empire — boulder climbing and coracle rides.',
      pricePerPerson: 4500,
      duration: 2,
      difficulty: 'easy',
      groupSize: { min: 4, max: 20 },
      nextSlot: new Date('2026-10-15'),
      itinerary: [
        { day: 1, title: 'Temple Circuit', description: 'Virupaksha Temple, Vittala Temple with Stone Chariot, sunset at Hemakuta Hill.' },
        { day: 2, title: 'Adventure Day', description: 'Boulder climbing, coracle ride on Tungabhadra, hippie island exploration.' }
      ],
      imageType: 'desert',
      activeUsers: 18,
      region: regions[7]._id,
      isFeatured: true
    }
  ]);
  console.log(`  ✓ ${trips.length} trips created`);

  // Add trips to user wishlist
  demoUser.wishlist = [trips[0]._id, trips[4]._id, trips[10]._id];
  await demoUser.save();

  // ── BOOKINGS ──
  const bookings = await Booking.insertMany([
    {
      user: demoUser._id,
      trip: trips[0]._id,
      agency: agencies[0]._id,
      checkIn: new Date('2026-07-15'),
      checkOut: new Date('2026-07-21'),
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
      trip: trips[4]._id,
      agency: agencies[4]._id,
      checkIn: new Date('2026-08-05'),
      checkOut: new Date('2026-08-08'),
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
      agency: agencies[4]._id,
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
      agency: agencies[5]._id,
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
      agency: agencies[1]._id,
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
      agency: agencies[10]._id,
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
