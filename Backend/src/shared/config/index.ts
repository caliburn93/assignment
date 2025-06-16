import dotenv from 'dotenv';

dotenv.config();

export const envConfig = {
  port: Number(process.env.PORT) || 3000,
  nodeEnv: process.env.NODE_ENV || 'development',
  mongoURI: process.env.MONGO_URI || '<your uri mongodb>'
};
