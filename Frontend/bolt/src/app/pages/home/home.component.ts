import { CommonModule } from '@angular/common';
import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatNativeDateModule } from '@angular/material/core';
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
import { MatButton } from '@angular/material/button';
import { CarService } from '../../services/car';
import { Car } from '../../models/car.model';
import { MatTableModule } from '@angular/material/table';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { BookCarComponent } from '../../components/dialog/bookCar/bookCar.component';

@Component({
  selector: 'app-home',
  imports: [
    CommonModule,
    MatDatepickerModule,
    MatFormFieldModule,
    MatNativeDateModule,
    MatInputModule,
    FormsModule,
    ReactiveFormsModule,
    MatButton,
    MatTableModule,
    MatProgressSpinnerModule,
    MatDialogModule,
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent implements OnInit, OnDestroy {
  readonly dialog = inject(MatDialog);

  dateRangeForm: FormGroup;
  isLoading: Boolean = false;
  isShowBookCarPopup: Boolean = false;
  cars: Car[] = [];
  selectedCarForBook!: Car | null;
  displayedColumns: string[] = [
    'brand',
    'model',
    'remainingStock',
    'averagePrice',
    '_id',
  ];

  constructor(private fb: FormBuilder, private carService: CarService) {
    this.dateRangeForm = this.fb.group({
      range: this.fb.group(
        {
          start: [null, Validators.required],
          end: [null, Validators.required],
        },
        { validators: [this.dateRangeValidator] }
      ),
    });
  }

  dateRangeValidator(group: AbstractControl) {
    const start = group.get('start')?.value;
    const end = group.get('end')?.value;
    if (start && end && end < start) {
      return { invalidRange: true };
    }
    return null;
  }

  onSubmit() {
    if (this.dateRangeForm.valid) {
      const startDate = this.dateRangeForm.value.range.start;
      const endDate = this.dateRangeForm.value.range.end;
      this.getCars(
        moment(startDate).format('YYYY-MM-DD'),
        moment(endDate).format('YYYY-MM-DD')
      );
      // Call service, emit event, or process data
    }
  }

  getCars(start: string, end: string) {
    this.isLoading = true;
    this.carService.getCars(start, end).subscribe((res) => {
      this.cars = res;
      this.isLoading = false;
    });
  }

  bookCar(car: Car) {
    this.selectedCarForBook = car;
    this.isShowBookCarPopup = true;
    const startDate = moment(this.dateRangeForm.value.range.start).format(
      'YYYY-MM-DD'
    );
    const endDate = moment(this.dateRangeForm.value.range.end).format(
      'YYYY-MM-DD'
    );

    const dialogRef = this.dialog.open(BookCarComponent, {
      data: {
        car: car,
        startDate: startDate,
        endDate: endDate,
      },
    });
    dialogRef.componentInstance.panelClosed = () => {
      this.selectedCarForBook = null;
      this.isShowBookCarPopup = false;
      dialogRef.close();
    };

    dialogRef.afterClosed().subscribe((result) => {
      this.selectedCarForBook = null;
      this.isShowBookCarPopup = false;
    });
  }

  ngOnInit() {}
  ngOnDestroy() {}
}
