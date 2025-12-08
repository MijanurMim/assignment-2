import { pool } from "../../config/db";

const createVehicle = async (payload: Record<string, unknown>) => {
  const {
    vehicle_name,
    type,
    registration_number,
    daily_rent_price,
    availability_status,
  } = payload;

  const result = await pool.query(
    `INSERT INTO vehicles (vehicle_name, type, registration_number, daily_rent_price, availability_status)
     VALUES ($1,$2,$3,$4,$5)
     RETURNING id, vehicle_name, type, registration_number, daily_rent_price, availability_status`,
    [
      vehicle_name,
      type,
      registration_number,
      daily_rent_price,
      availability_status,
    ]
  );

  return result;
};

const getVehicle = async () => {
  const result = await pool.query(
    `SELECT id , vehicle_name, type, registration_number, daily_rent_price, availability_status  FROM vehicles ORDER BY id DESC`
  );

  return result;
};

const getSingleVehicle = async (id: string) => {
  const result = await pool.query(
    `SELECT id , vehicle_name, type, registration_number, daily_rent_price, availability_status FROM vehicles WHERE id=$1`,
    [id]
  );

  return result;
};

const updateVehicle = async (id: number, fields: any) => {
  const keys = Object.keys(fields);
  if (!keys.length) return { rows: [] };

  const setQuery = keys.map((k, i) => `${k}=$${i + 1}`).join(", ");
  const values = [...Object.values(fields), id];

  const result = await pool.query(
    `UPDATE vehicles SET ${setQuery} WHERE id=$${keys.length + 1}
     RETURNING id, vehicle_name, type, registration_number, daily_rent_price, availability_status`,
    values
  );

  return result;
};

const deleteVehicle = async (id: string) => {
  const result = await pool.query(`DELETE FROM vehicles WHERE id=$1`, [id]);

  return result;
};

export const vehicleServices = {
  createVehicle,
  getVehicle,
  getSingleVehicle,
  updateVehicle,
  deleteVehicle,
};
