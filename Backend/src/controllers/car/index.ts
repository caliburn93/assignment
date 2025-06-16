import { ERROR_MESSAGES, CAR_MESSAGES } from "../../shared/constant";
import { CarService } from "../../services/car.service";

const carService = new CarService();

export const getCars = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    
    if (!startDate || !endDate) {
      return res.status(400).json({ message: ERROR_MESSAGES.PERIOD_REQUIRED });
    }

    if (new Date(startDate as string) > new Date(endDate as string)) {
      return res.status(400).json({
        message: ERROR_MESSAGES.PERIOD_INVALID,
      });
    }

    const cars = await carService.getCars(
      startDate as string,
      endDate as string
    );
    return res.status(200).json(cars);
  } catch (error) {
    return res.status(500).json({ message: ERROR_MESSAGES.SERVER_ERROR });
  }
};

export const createBooking = async (req, res) => {
  let isValidBooking = true;
  try {
    const {
      name,
      email,
      phone,
      drivingLicenseExpiry,
      carId,
      startDate,
      endDate,
    } = req.body;
    if (
      !name ||
      name === "" ||
      !phone ||
      phone === "" ||
      !email ||
      email === "" ||
      !drivingLicenseExpiry ||
      drivingLicenseExpiry === "" ||
      !carId ||
      carId === "" ||
      !startDate ||
      startDate === "" ||
      !endDate ||
      endDate === ""
    ) {
      isValidBooking = false;
    }

    if (!isValidBooking) {
      return res
        .status(400)
        .json({ message: CAR_MESSAGES.REQUIRED_BOOKING_FIELDS });
    }
    const booking = await carService.bookACar(req.body);
    return res.json({
      message: CAR_MESSAGES.BOOKED,
      booking,
    });
  } catch (error: any) {
    return res.status(500).json({
      message: error.message || CAR_MESSAGES.ERROR_MESSAGE,
    });
  }
};
