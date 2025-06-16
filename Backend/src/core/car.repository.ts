import { Car, BookingCar } from "../models/car";

export class CarRepository {
  async getAllCars() {
    return Car.find();
  }
  async getCarById(carId: string) {
    return Car.findById(carId);
  }

  async checkBookingValid(start: Date, end: Date) {
    return BookingCar.aggregate([
      {
        $match: {
          $or: [{ startDate: { $lte: end }, endDate: { $gte: start } }],
        },
      },
      {
        $group: {
          _id: "$carId",
          bookingCount: { $sum: 1 },
        },
      },
    ]);
  }
  async create(data: {
    name: string;
    email: string;
    phone: string;
    drivingLicenseExpiry: Date;
    carId: string;
    startDate: Date;
    endDate: Date;
    totalPrice: number;
  }) {
    const booking = new BookingCar(data);
    return booking.save();
  }
}
