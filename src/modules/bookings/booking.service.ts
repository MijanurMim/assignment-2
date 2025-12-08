import { pool } from "../../config/db";

const createBooking = async (payload: any, user: any) => {
  const { customer_id, vehicle_id, rent_start_date, rent_end_date } = payload;

  // Get vehicle info + availability
  const vehicle = await pool.query(
    `SELECT daily_rent_price, availability_status FROM vehicles WHERE id=$1`,
    [vehicle_id]
  );

  if (!vehicle.rows.length) throw new Error("Vehicle not found");
  if (vehicle.rows[0].availability_status !== "available")
    throw new Error("Vehicle not available for booking");

  // Calculate booking duration & total cost
  const start = new Date(rent_start_date);
  const end = new Date(rent_end_date);
  const days = Math.ceil(
    (end.getTime() - start.getTime()) / (1000 * 3600 * 24)
  );

  const total_price = vehicle.rows[0].daily_rent_price * days;

  // Insert booking
  const booking = await pool.query(
    `INSERT INTO bookings (customer_id, vehicle_id, rent_start_date, rent_end_date, total_price, status)
     VALUES ($1,$2,$3,$4,$5,'active')
     RETURNING *`,
    [customer_id, vehicle_id, rent_start_date, rent_end_date, total_price]
  );

  // Update vehicle availability
  await pool.query(
    `UPDATE vehicles SET availability_status='booked' WHERE id=$1`,
    [vehicle_id]
  );

  return booking.rows[0];
};

const getBookings = async (user: any) => {
  if (user.role === "admin") {
    const result = await pool.query(`
      SELECT b.*, c.name AS customer_name, v.vehicle_name, v.registration_number
      FROM bookings b
      JOIN customers c ON b.customer_id = c.id
      JOIN vehicles v ON b.vehicle_id = v.id
      ORDER BY b.id DESC
    `);

    return result.rows;
  }

  const result = await pool.query(
    `SELECT b.*, v.vehicle_name, v.registration_number, v.type
     FROM bookings b
     JOIN vehicles v ON b.vehicle_id = v.id
     WHERE customer_id=$1 ORDER BY b.id DESC`,
    [user.id]
  );

  return result.rows;
};

const updateBookingStatus = async (
  bookingId: string,
  status: string,
  user: any
) => {
  const booking = await pool.query(`SELECT * FROM bookings WHERE id=$1`, [
    bookingId,
  ]);
  if (!booking.rows.length) throw new Error("Booking not found");

  const data = booking.rows[0];

  if (status === "cancelled") {
    if (user.role !== "customer") throw new Error("Only customer can cancel");
    if (new Date(data.rent_start_date) <= new Date())
      throw new Error("Booking cannot be cancelled after start date");

    await pool.query(`UPDATE bookings SET status='cancelled' WHERE id=$1`, [
      bookingId,
    ]);
    await pool.query(
      `UPDATE vehicles SET availability_status='available' WHERE id=$1`,
      [data.vehicle_id]
    );
  }

  if (status === "returned") {
    if (user.role !== "admin")
      throw new Error("Only admin can mark as returned");

    await pool.query(`UPDATE bookings SET status='returned' WHERE id=$1`, [
      bookingId,
    ]);
    await pool.query(
      `UPDATE vehicles SET availability_status='available' WHERE id=$1`,
      [data.vehicle_id]
    );
  }

  const updated = await pool.query(`SELECT * FROM bookings WHERE id=$1`, [
    bookingId,
  ]);
  return updated.rows[0];
};

export const bookingServices = {
  createBooking,
  getBookings,
  updateBookingStatus,
};
