import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Car } from '../models/car.model';
import { environment } from '../environments/environment';
import { BookingCar } from '../models/booking.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CarService {
  private baseURL = environment.apiUrl;
  constructor(private http: HttpClient) {}

  getCars(startDate: string, endDate: string): Observable<Car[]> {
    return this.http.get<Car[]>(
      `${this.baseURL}/car/getCars?startDate=${startDate}&endDate=${endDate}`
    );
  }

  bookingCar(body: BookingCar) {
    return this.http.post(`${this.baseURL}/car/book`, body);
  }
}
