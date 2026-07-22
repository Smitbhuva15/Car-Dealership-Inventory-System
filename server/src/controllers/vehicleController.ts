
import { Request, Response } from "express";
import { addVehicle } from "../services/addVehicle";
import { updateVehicle } from "../services/updateVehicle";


export const addVehicleController = async (req: Request, res: Response) => {
  try {
    const vehicle = await addVehicle(req.body);

    return res.status(201).json({
      message: "Vehicle created successfully.",
      data: vehicle,
    });
  } catch (error: any) {
    console.error(error);

    if (error.name === "ValidationError") {
      return res.status(400).json({
        message: "Validation failed.",
        error: error.message,
      });
    }

    if (
      error.message.includes("required") ||
      error.message.includes("must")
    ) {
      return res.status(400).json({
        message: "Invalid request data.",
        error: error.message,
      });
    }

    return res.status(500).json({
      message: "Internal Server Error.",
      error: "Something went wrong. Please try again later.",
    });
  }
};

export const updateVehicleController = async (
  req: Request,
  res: Response
) => {
  try {
    const updated = await updateVehicle(req.params.id as string, req.body);

    return res.status(200).json({
      message: "Vehicle updated successfully.",
      vehicle: updated,
    });
  } catch (error: any) {
    if (
      error.message.includes("Invalid vehicle ID") ||
      error.message.includes("Vehicle not found") ||
      error.message.includes("must")
    ) {
      return res.status(400).json({
        error: error.message,
      });
    }

    return res.status(500).json({
      error: "Internal Server Error.",
    });
  }
};