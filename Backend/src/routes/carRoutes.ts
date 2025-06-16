import { Router } from "express";
import { createBooking, getCars } from "../controllers/car";

export const carRoutes = Router();

carRoutes.get("/getCars", getCars);
carRoutes.post("/book", createBooking);
