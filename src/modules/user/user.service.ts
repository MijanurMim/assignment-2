import { pool } from "../../config/db";

const getUser = async () => {
  const result = await pool.query(
    `SELECT id, name, email,phone, role FROM users`
  );
  return result;
};

const updateUser = async (id: number, fields: any) => {
  const keys = Object.keys(fields);
  if (keys.length === 0) return { rows: [] };

  const values = Object.values(fields);

  const setQuery = keys.map((key, i) => `${key}=$${i + 1}`).join(", ");

  const query = `
    UPDATE users
    SET ${setQuery}
    WHERE id=$${keys.length + 1}
    RETURNING id, name, email, phone, role
  `;

  const result = await pool.query(query, [...values, id]);
  return result;
};

const deleteUser = async (id: string) => {
  const result = await pool.query(`DELETE FROM users WHERE id = $1`, [id]);

  return result;
};

export const userServices = {
  getUser,
  updateUser,
  deleteUser,
};
