import { pool } from "../../config/db";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import config from "../../config";

// Registering user
const registerUser = async (payload: Record<string, unknown>) => {
  const { name, email, password, phone, role } = payload;

  const normalizedEmail = (email as string).toLowerCase();

  if ((password as string).length < 6) {
    throw new Error("Password length should be more than 6 characters");
  }

  if (role !== "admin" && role !== "customer") {
    throw new Error("Invalid role");
  }

  const hashedPass = await bcrypt.hash(password as string, 10);

  const result = await pool.query(
    `INSERT INTO users(name, email, password, phone, role) VALUES($1, $2, $3, $4 , $5) RETURNING id, name, email, password, phone, role`,
    [name, normalizedEmail, hashedPass, phone, role]
  );

  // Removing password in response
  delete result.rows[0].password;

  return result;
};

// Signin user
const signinUser = async (email: string, password: string) => {
  const result = await pool.query(`SELECT * FROM users WHERE email=$1`, [
    email,
  ]);

  if (result.rows.length === 0) {
    return null;
  }

  const user = result.rows[0];

  const match = await bcrypt.compare(password, user.password);

  if (!match) {
    return false;
  }

  const token = jwt.sign(
    { name: user.name, email: user.email, role: user.role },
    config.jwtSecret as string,
    {
      expiresIn: "7d",
    }
  );

  // Remove password before sending response
  const filteredUser = {
    id: user.id,
    name: user.name,
    email: user.email,
    phone: user.phone,
    role: user.role,
  };

  return { token, user: filteredUser };
};

export const authServices = {
  registerUser,
  signinUser,
};
