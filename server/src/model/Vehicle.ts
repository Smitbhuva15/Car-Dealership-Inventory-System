import mongoose, { Schema } from 'mongoose';

// Define the interface for our Vehicle 
export interface IVehicle{
  make: string;
  model: string;
  category: string;
  price: number;
  quantity: number;
}

// Define the Mongoose schema
const vehicleSchema = new Schema<IVehicle>(
  {
    make: { type: String, required: true },
    model: { type: String, required: true },
    category: { type: String, required: true },
    price: { type: Number, required: true, min: 0 },
    quantity: { type: Number, required: true, min: 0, default: 0 }
  },
  { timestamps: true }
);

export const Vehicle = mongoose.model<IVehicle>('Vehicle', vehicleSchema);