import { Request, Response } from "express";
import { bookingServices } from "./booking.service";

const createBooking = async (req: Request, res: Response) => {
  try {
    const result = await bookingServices.createBooking(req.body, req.user);

    res.status(201).json({
      success: true,
      message: "Booking created successfully",
      data: result,
    });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
};

const getBookings = async (req: Request, res: Response) => {
  try {
    const result = await bookingServices.getBookings(req.user);

    res.status(200).json({
      success: true,
      message:
        req.user?.role === "admin"
          ? "Bookings retrieved successfully"
          : "Your bookings retrieved successfully",
      data: result,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const updateBookingStatus = async (req: Request, res: Response) => {
  try {
    const result = await bookingServices.updateBookingStatus(
      req.params.bookingId!,
      req.body.status,
      req.user
    );

    res.status(200).json({
      success: true,
      message:
        req.body.status === "cancelled"
          ? "Booking cancelled successfully"
          : "Booking marked as returned. Vehicle is now available",
      data: result,
    });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const bookingController = {
  createBooking,
  getBookings,
  updateBookingStatus,
};
