
import { Request, Response } from "express";
import { addVehicle } from "../services/addVehicle";
import { updateVehicle } from "../services/updateVehicle";
import { deleteVehicle } from "../services/deleteVehicle";
import { restockVehicle } from "../services/restockVehicle";
import { viewAllVehicles } from "../services/viewAllVehicles";
import { searchVehicles } from "../services/searchVehicles";


export const addVehicleController = async (req: Request, res: Response) => {
  try {
    const vehicle = await addVehicle(req.body);

    return res.status(201).json({
      message: "Vehicle created successfully.",
      data: vehicle,
    });
  } catch (error: any) {

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

export const viewAllVehiclesController = async (
  req: Request,
  res: Response
) => {
  try {
    const vehicles = await viewAllVehicles();

    return res.status(200).json(vehicles);
  } catch (error: any) {

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

export const deleteVehicleController = async (req: Request, res: Response) => {
  try {
    const result = await deleteVehicle(req.params.id as string);

    return res.status(200).json(result);
  } catch (error: any) {


    if (
      error.message === "Invalid vehicle ID." ||
      error.message === "Vehicle not found."
    ) {
      return res.status(400).json({
        error: error.message,
      });
    }

    return res.status(500).json({
      message: "Internal Server Error.",
      error: "Something went wrong. Please try again later.",
    });
  }
};

export const searchVehicleController = async (
  req: Request,
  res: Response
) => {
  try {
    const vehicles = await searchVehicles(req.query);

    if (vehicles.length === 0) {
      return res.status(404).json({
        error: "No vehicles found.",
      });
    }

    return res.status(200).json(vehicles);
  } catch (error: any) {
    console.error(error);

    if (
      error.message === "Min price must be a valid number." ||
      error.message === "Max price must be a valid number."
    ) {
      return res.status(400).json({
        error: error.message,
      });
    }

    return res.status(500).json({
      message: "Internal Server Error.",
      error: "Something went wrong. Please try again later.",
    });
  }
};

export const restockVehicleController = async (
  req: Request,
  res: Response
) => {
  try {
    const { quantity } = req.body;

    const result = await restockVehicle(req.params.id as string, quantity);

    return res.status(200).json(result);
  } catch (error: any) {
    console.error(error);

    if (
      error.message === "Invalid vehicle ID." ||
      error.message === "Quantity must be a positive integer." ||
      error.message === "Vehicle not found."
    ) {
      return res.status(400).json({
        error: error.message,
      });
    }

    return res.status(500).json({
      message: "Internal Server Error.",
      error: "Something went wrong. Please try again later.",
    });
  }
};