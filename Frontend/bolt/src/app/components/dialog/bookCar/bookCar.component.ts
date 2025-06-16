import { CommonModule } from '@angular/common';
import {
  Component,
  Inject,
  inject,
  Input,
  OnDestroy,
  OnInit,
  output,
  Output,
} from '@angular/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import {
  MatNativeDateModule,
  provideNativeDateAdapter,
} from '@angular/material/core';
import { MatInputModule } from '@angular/material/input';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import moment from 'moment';
import { CarService } from '../../../services/car';
import { Car } from '../../../models/car.model';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatButton } from '@angular/material/button';
import { BookingCar } from '../../../models/booking.model';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-book-car',
  imports: [
    CommonModule,
    MatDatepickerModule,
    MatFormFieldModule,
    MatNativeDateModule,
    MatInputModule,
    FormsModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatButton,
  ],
  providers: [provideNativeDateAdapter()],
  templateUrl: './bookCar.component.html',
  styleUrl: './bookCar.component.css',
})
export class BookCarComponent implements OnInit, OnDestroy {
  public startDate!: string;
  public endDate!: string;
  public car!: Car;
  public panelClosed = () => {};
  bookingForm: FormGroup;
  private _snackBar = inject(MatSnackBar);
  constructor(
    private carService: CarService,
    private fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA)
    public data: { car: Car; startDate: string; endDate: string }
  ) {
    this.bookingForm = this.fb.group(
      {
        name: ['', Validators.required],
        phone: ['', Validators.required],
        email: ['', [Validators.required, Validators.email]],
        drivingLicenseIssued: ['', Validators.required],
        drivingLicenseExpiry: ['', Validators.required],
        licenseNumber: ['', Validators.required],
      },
      {
        validators: [this.licenseValidator, this.licenseDatesValidator],
      }
    );
  }

  licenseValidator(group: AbstractControl) {
    const issued = group.get('drivingLicenseIssued')?.value;
    const expiry = group.get('drivingLicenseExpiry')?.value;

    if (issued && expiry && new Date(issued) >= new Date(expiry)) {
      return { licenseIssuedAfterExpiry: true };
    }
    return null;
  }

  licenseDatesValidator(group: AbstractControl) {
    const expiry = group.get('drivingLicenseExpiry')?.value;
    const bookingEndDate = group.get('endDate')?.value;
    if (
      expiry &&
      bookingEndDate &&
      new Date(expiry) > new Date(bookingEndDate)
    ) {
      return { licenseExpired: true };
    }
    return null;
  }

  dateRangeValidator(group: AbstractControl) {
    const start = group.get('start')?.value;
    const end = group.get('end')?.value;
    if (start && end && end < start) {
      return { invalidRange: true };
    }
    if (!start || !end) {
      return { required: true };
    }
    return null;
  }

  onSubmit() {
    const bookingData: BookingCar = {
      name: this.bookingForm.get('name')?.value,
      email: this.bookingForm.get('email')?.value,
      drivingLicenseExpiry: this.bookingForm.get('drivingLicenseExpiry')?.value,
      carId: this.car._id || '',
      startDate: this.startDate || '',
      endDate: this.endDate || '',
      phone: this.bookingForm.get('phone')?.value,
    };
    this.carService.bookingCar(bookingData).subscribe((res) => {
      this._snackBar.open('Booked successfully!');
      this.panelClosed();
    },(err) => {
      this._snackBar.open( err.error.message);
    });
  }

  ngOnInit() {
    this.startDate = this.data.startDate;
    this.endDate = this.data.endDate;
    this.car = this.data.car;
  }
  ngOnDestroy() {}
}
