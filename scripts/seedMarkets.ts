import dotenv from 'dotenv';
import path from 'path';
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

import mongoose from 'mongoose';
import Market from '../models/Market';


const categories = ['sports', 'politics', 'entertainment', 'technology', 'crypto', 'finance', 'weather', 'science'];
const statuses = ['open', 'closed', 'settled'];

const generateMarkets = (count: number) => {
  const markets = [];
  
  for (let i = 1; i <= count; i++) {
    const category = categories[Math.floor(Math.random() * categories.length)];
    const status = i <= 400 ? 'open' : statuses[Math.floor(Math.random() * statuses.length)]; // Most open
    
    // Generate random end date (1-90 days from now)
    const endDate = new Date();
    endDate.setDate(endDate.getDate() + Math.floor(Math.random() * 90) + 1);
    
    // Generate random bet amounts
    const yesAmount = Math.floor(Math.random() * 50000);
    const noAmount = Math.floor(Math.random() * 50000);
    
    markets.push({
      title: `Market ${i}: Will ${category} event happen in ${endDate.getFullYear()}?`,
      description: `This is a prediction market for ${category}. Users can bet on the outcome of this event. Market #${i} created for testing virtualization with large datasets.`,
      category: category.toLowerCase(),
      status,
      endDate,
      winningOutcome: status === 'settled' ? (Math.random() > 0.5 ? 'Yes' : 'No') : undefined,
      totalBetAmount: {
        yes: yesAmount,
        no: noAmount
      }
    });
  }
  
  return markets;
};

async function seedMarkets() {
  try {
    // Connect to MongoDB
    const mongoUri = process.env.MONGODB_URI || 'your-mongodb-connection-string';
    console.log(mongoUri, '---mongoUri')
    await mongoose.connect(mongoUri);
    
    console.log('Connected to MongoDB');
    
    // Optional: Clear existing markets (uncomment if you want fresh data)
    // await Market.deleteMany({});
    // console.log('Cleared existing markets');
    
    // Generate and insert markets
    const markets = generateMarkets(500);
    await Market.insertMany(markets);
    
    console.log('✅ Successfully seeded 500 markets!');
    
    // Close connection
    await mongoose.connection.close();
    console.log('Database connection closed');
  } catch (error) {
    console.error('❌ Error seeding markets:', error);
    process.exit(1);
  }
}

seedMarkets();