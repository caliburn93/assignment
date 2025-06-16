import { CarRepository } from "../core/car.repository";
import { calculateTotalPrice } from "../shared/helpers";
import { ERROR_MESSAGES, CAR_MESSAGES } from "../shared/constant";

export class CarService {
  constructor(private carRepository = new CarRepository()) {}

  async getCars(startDate, endDate) {
    const start = new Date(startDate);
    const end = new Date(endDate);

    const overlappingBookings = await this.carRepository.checkBookingValid(
      start,
      end
    );
    const bookingCounts = overlappingBookings.reduce((acc, booking) => {
      acc[booking._id.toString()] = booking.bookingCount;
      return acc;
    }, {} as Record<string, number>);

    const cars = await this.carRepository.getAllCars();

    const availableCars = cars
      .map((car) => {
        const bookedCount = bookingCounts[car._id.toString()] || 0;
        const remainingStock = car.stock - bookedCount;
        if (remainingStock > 0) {
          return {
            ...car.toObject(),
            remainingStock,
          };
        }
        return null;
      })
      .filter((car) => car !== null);

    const days =
      Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1;

    const carsWithPricing = await Promise.all(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      availableCars.map(async (car: any) => {
        const totalPrice = await calculateTotalPrice(car, start, end);
        const averagePrice = totalPrice / days;

        return {
          ...car,
          totalPrice,
          averagePrice,
        };
      })
    );

    return carsWithPricing;
  }

  async bookACar(data: {
    name: string;
    email: string;
    phone: string;
    drivingLicenseExpiry: string;
    carId: string;
    startDate: string;
    endDate: string;
  }) {
    const {
      name,
      email,
      phone,
      drivingLicenseExpiry,
      carId,
      startDate,
      endDate,
    } = data;

    const licenseExpiry = new Date(drivingLicenseExpiry);
    if (licenseExpiry < new Date(endDate)) {
      throw {
        status: 400,
        message: ERROR_MESSAGES.LICENSE_INVALID,
      };
    }

    if (new Date(startDate) > new Date(endDate)) {
      throw { status: 400, message: ERROR_MESSAGES.PERIOD_INVALID };
    }

    const car = await this.carRepository.getCarById(carId);
    if (!car) {
      throw { status: 404, message: ERROR_MESSAGES.CAR_NOT_FOUND };
    }

    const start = new Date(startDate);
    const end = new Date(endDate);

    const overlappingBookings = await this.carRepository.checkBookingValid(
      start,
      end
    );

    if (overlappingBookings && overlappingBookings.length > 0) {
      throw { status: 400, message: ERROR_MESSAGES.DUPLICATED_BOOKING };
    }

    const totalPrice = await calculateTotalPrice(
      car,
      new Date(startDate),
      new Date(endDate)
    );

    const booking = await this.carRepository.create({
      name,
      email,
      phone,
      drivingLicenseExpiry: licenseExpiry,
      carId,
      startDate: new Date(startDate),
      endDate: new Date(endDate),
      totalPrice,
    });

    return booking;
  }
}
