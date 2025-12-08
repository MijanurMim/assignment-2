import { Request, Response } from "express";
import { vehicleServices } from "./vehicle.service";
import { pool } from "../../config/db";

const createVehicle = async (req: Request, res: Response) => {
  try {
    console.log("Vehicle Create Param:", req.body);
    const result = await vehicleServices.createVehicle(req.body);

    res.status(201).json({
      success: true,
      message: "Vehicle created successfully",
      data: result.rows[0],
    });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const getVehicle = async (req: Request, res: Response) => {
  try {
    const result = await vehicleServices.getVehicle();

    res.status(200).json({
      success: true,
      message: result.rows.length
        ? "Vehicles retrieved successfully"
        : "No vehicles found",
      data: result.rows,
    });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const getSingleVehicle = async (req: Request, res: Response) => {
  try {
    const id = req.params.id || "";
    const result = await vehicleServices.getSingleVehicle(id);

    if (!result.rows.length)
      return res
        .status(404)
        .json({ success: false, message: "Vehicle not found" });

    res.status(200).json({
      success: true,
      message: "Vehicle retrieved successfully",
      data: result.rows[0],
    });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const updateVehicle = async (req: Request, res: Response) => {
  try {
    const result = await vehicleServices.updateVehicle(
      Number(req.params.id),
      req.body
    );

    if (!result.rows.length)
      return res
        .status(404)
        .json({ success: false, message: "Vehicle not found" });

    res.status(200).json({
      success: true,
      message: "Vehicle updated successfully",
      data: result.rows[0],
    });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const deleteVehicle = async (req: Request, res: Response) => {
  try {
    const id = req.params.id || "";

    // Check if vehicle has active bookings
    const activeBookings = await pool.query(
      `SELECT * FROM bookings WHERE vehicle_id=$1 AND status='active'`,
      [id]
    );

    if (activeBookings.rows.length > 0) {
      return res.status(400).json({
        success: false,
        message: "Cannot delete vehicle with active bookings",
      });
    }

    const result = await vehicleServices.deleteVehicle(id);

    if (result.rowCount === 0) {
      return res
        .status(404)
        .json({ success: false, message: "Vehicle not found" });
    }

    res.status(200).json({
      success: true,
      message: "Vehicle deleted successfully",
    });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const vehicleControllers = {
  createVehicle,
  getVehicle,
  getSingleVehicle,
  updateVehicle,
  deleteVehicle,
};
