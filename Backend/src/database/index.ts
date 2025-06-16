import mongoose from "mongoose";
import { BookingCar, Car } from "../models/car";
import { Season } from "../models/season";
import { SUCCESS_MESSAGES, ERROR_MESSAGES } from "../shared/constant";
import { envConfig } from "../shared/config";

const initializeSeasons = async () => {
  const seasons = [
    {
      name: "Peak Season",
      code: "peakSeasonPrice",
      periods: [
        {
          startDate: new Date("2025-06-01"),
          endDate: new Date("2025-09-15"),
        },
      ],
    },
    {
      name: "Mid Season",
      code: "midSeasonPrice",
      periods: [
        {
          startDate: new Date("2025-03-01"),
          endDate: new Date("2025-05-31"),
        },
        {
          startDate: new Date("2025-09-16"),
          endDate: new Date("2025-10-31"),
        },
      ],
    },
    {
      name: "Off Season",
      code: "offSeasonPrice",
      periods: [
        {
          startDate: new Date("2025-11-01"),
          endDate: new Date("2026-03-01"),
        },
      ],
    },
  ];

  await Season.insertMany(seasons);
};

const initializeCars = async () => {
  const cars = [
    {
      brand: "Toyota",
      model: "Yaris",
      stock: 3,
      peakSeasonPrice: 98.43,
      midSeasonPrice: 76.89,
      offSeasonPrice: 53.65,
    },
    {
      brand: "Seat",
      model: "Ibiza",
      stock: 5,
      peakSeasonPrice: 85.12,
      midSeasonPrice: 65.73,
      offSeasonPrice: 46.85,
    },
    {
      brand: "Nissan",
      model: "Qashqai",
      stock: 2,
      peakSeasonPrice: 101.46,
      midSeasonPrice: 82.94,
      offSeasonPrice: 59.87,
    },
    {
      brand: "Jaguar",
      model: "e-pace",
      stock: 1,
      peakSeasonPrice: 120.54,
      midSeasonPrice: 91.35,
      offSeasonPrice: 70.27,
    },
    {
      brand: "Mercedes",
      model: "Vito",
      stock: 2,
      peakSeasonPrice: 109.16,
      midSeasonPrice: 89.64,
      offSeasonPrice: 64.97,
    },
  ];

  await Car.insertMany(cars);
};

export const connectDB = async () => {
  try {
    const mongoURI = envConfig.mongoURI;
    if (!mongoURI) {
      throw new Error(ERROR_MESSAGES.DATABASE_CONNECT);
    }
    await mongoose.connect(mongoURI, {});
    console.log(SUCCESS_MESSAGES.DATABASE_CONNECT);
    await Car.deleteMany({});
    await Season.deleteMany({});
    await BookingCar.deleteMany({});
    await initializeSeasons();
    await initializeCars();
    console.log(SUCCESS_MESSAGES.DATABASE_INITED);
  } catch (error) {
    console.log("Error connecting to MongoDB:", error);
  }
};
