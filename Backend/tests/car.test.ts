import request from "supertest";
import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import app from "../src/app";
import { Car, BookingCar } from "../src/models/car";
import { Season } from "../src/models/season";

let mongoServer: MongoMemoryServer;
let carId;
beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  try {
    if (mongoose.connection.readyState !== 0) {
      await mongoose.disconnect();
    }
    await mongoose.connect(uri);
    await Car.deleteMany({});
    await Season.deleteMany({});
    await BookingCar.deleteMany({});

    // Seed test data
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

    const car = await Car.insertMany({
      brand: "Nissan",
      model: "Qashqai",
      stock: 2,
      peakSeasonPrice: 109.16,
      midSeasonPrice: 89.64,
      offSeasonPrice: 64.97,
    });

    carId = car[0]._id.toString();
  } catch (error) {
    console.log(error);
  }
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

describe("GET /api/car/getCars", () => {
  it("should return available cars with correct price info", async () => {
    const res = await request(app)
      .get("/api/car/getCars")
      .query({ startDate: "2025-06-01", endDate: "2025-06-05" }); // peak season

    expect(res.statusCode).toBe(200);
    expect(res.body.length).toBeGreaterThan(0);
    expect(res.body[0]).toHaveProperty("totalPrice");
    expect(res.body[0].averagePrice).toBe(98.43);
  });
});

describe("POST /api/car/book", () => {
  it("should create a booking if valid", async () => {
    const res = await request(app).post("/api/car/book").send({
      name: "user123",
      email:"test@test.com",
      phone: "123455",
      carId,
      startDate: "2025-06-10",
      endDate: "2025-06-12",
      totalPrice: 492.15000000000003,
      drivingLicenseExpiry: "2025-12-01",
    });

    expect(res.statusCode).toBe(200);
    expect(res.body.booking).toHaveProperty("_id");
  });

  it("should reject duplicate bookings for same dates", async () => {
    const res = await request(app).post("/api/car/book").send({
      name: "user123",
      email:"test@test.com",
      phone: "123455",
      carId,
      startDate: "2025-06-11",
      endDate: "2025-06-13",
      totalPrice: 492.15000000000003,
      drivingLicenseExpiry: "2025-12-01",
    });
    expect(res.statusCode).toBe(500);
    expect(res.body.message).toBe('Duplicate booking');
  });
});
