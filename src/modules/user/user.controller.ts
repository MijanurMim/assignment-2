import { Request, Response } from "express";
import { userServices } from "./user.service";
import { pool } from "../../config/db";

const getUser = async (req: Request, res: Response) => {
  try {
    const result = await userServices.getUser();

    res.status(200).json({
      success: true,
      message: "Users retrieved successfully",
      data: result.rows,
    });
  } catch (err: any) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

const updateUser = async (req: Request, res: Response) => {
  const userIdToUpdate = Number(req.params.id);
  const loggedInUser = req.user;

  const updates = req.body;

  try {
    if (!loggedInUser) {
      return res.status(401).json({
        success: false,
        message: "User not authenticated",
      });
    }

    // customer can update only own account
    if (
      loggedInUser.role === "customer" &&
      loggedInUser.id !== userIdToUpdate
    ) {
      return res.status(403).json({
        success: false,
        message: "You are only allowed to update your own profile!",
      });
    }

    // Prevent customer from changing role
    if (loggedInUser.role === "customer" && updates.role) {
      delete updates.role;
    }

    const result = await userServices.updateUser(userIdToUpdate, updates);

    if (result.rows.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    res.status(200).json({
      success: true,
      message: "User updated successfully",
      data: result.rows[0],
    });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const deleteUser = async (req: Request, res: Response) => {
  try {
    const userId = req.params.id!;

    // Check if user has active bookings
    const activeBookings = await pool.query(
      `SELECT * FROM bookings WHERE customer_id=$1 AND status='active'`,
      [userId]
    );

    if (activeBookings.rows.length > 0) {
      return res.status(400).json({
        success: false,
        message: "Cannot delete user with active bookings",
      });
    }

    const result = await userServices.deleteUser(userId);

    if (result.rowCount === 0) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "User deleted successfully",
      data: result.rows,
    });
  } catch (err: any) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

export const userControllers = {
  getUser,
  updateUser,
  deleteUser,
};
