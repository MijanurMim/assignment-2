# Assignment 2 - Vehicle Rental Management System

**Live URL:** [https://assignment-2-mocha-delta.vercel.app/](https://assignment-2-mocha-delta.vercel.app/)

---

## **Project Overview**

A comprehensive vehicle rental management system that allows **customers** to book vehicles and **admins** to manage vehicles, bookings, and users.  
The system handles **automatic price calculation**, **vehicle availability status**, and **booking management**.

---

## **Features**

- **User Management**
  - Admin can manage users.
  - Customers can view their own bookings.
- **Vehicle Management**
  - Admin can add, update, or delete vehicles.
  - Vehicle availability updates automatically on booking, return, or cancellation.
- **Booking Management**
  - Create bookings with start/end dates.
  - Automatic price calculation: `total_price = daily_rent_price × number_of_days`.
  - Role-based booking retrieval:
    - Admin sees all bookings.
    - Customer sees own bookings.
  - Booking cancellation & return logic.
  - Auto-return expired bookings.
- **Deletion Constraints**
  - Users/vehicles with active bookings cannot be deleted.

---

## **Technology Stack**

- **Backend:** Node.js, Express.js, TypeScript
- **Database:** PostgreSQL
- **Authentication:** JWT (JSON Web Tokens)
- **API Testing:** Postman
- **Other Libraries:** bcrypt, dotenv

---
