export interface Car {
  _id?: string;
  brand: string;
  model: string;
  stock: number;
  peakSeasonPrice: number;
  midSeasonPrice: number;
  offSeasonPrice: number;
}