import mongoose, { Schema } from 'mongoose';
import { ICar, IBookingCar } from '../interface';

export const carSchema: Schema = new Schema({
  brand: { type: String, required: true },
  model: { type: String, required: true },
  stock: { type: Number, required: true },
  peakSeasonPrice: { type: Number, required: true },
  midSeasonPrice: { type: Number, required: true },
  offSeasonPrice: { type: Number, required: true },
});

export const Car = mongoose.model<ICar>('Car', carSchema);

export const bookingSchema: Schema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  drivingLicenseExpiry: { type: Date, required: true },
  carId: { type: Schema.Types.ObjectId, ref: 'Car', required: true },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  totalPrice: { type: Number, required: true },
});

export const BookingCar = mongoose.model<IBookingCar>('BookingCar', bookingSchema);