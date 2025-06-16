import { Document } from "mongoose";

export interface ICar extends Document {
  _id: string;
  brand: string;
  carModel: string;
  stock: number;
  peakSeasonPrice: number;
  midSeasonPrice: number;
  offSeasonPrice: number;
}

export interface IBookingCar extends Document {
  name: string;
  email: string;
  phone: string;
  drivingLicenseExpiry: Date;
  carId: string;
  startDate: Date;
  endDate: Date;
  price: number;
}
