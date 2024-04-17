const router = require("express").Router();
const warehouseController = require("../controllers/warehouse-controller");
router.route("/").get(warehouseController.getAll);
const express = require("express");
const { v4: uuidv4 } = require("uuid");
const knex = require("../knexfile");

// Function to validate email address using regex
const isValidEmail = (email) => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
};

// Function to validate phone number using regex
const isValidPhoneNumber = (phone) => {
  const regex = /^\+\d{1,3} \(\d{3}\) \d{3}-\d{4}$/;
  return regex.test(phone);
};

// Middleware to validate request body
const validateRequestBody = (req, res, next) => {
  const {
    warehouse_name,
    address,
    city,
    country,
    contact_name,
    contact_position,
    contact_phone,
    contact_email,
  } = req.body;

  if (
    !warehouse_name ||
    !address ||
    !city ||
    !country ||
    !contact_name ||
    !contact_position ||
    !contact_phone ||
    !contact_email
  ) {
    return res
      .status(400)
      .json({ error: "Missing required properties in the request body" });
  }

  if (!isValidEmail(contact_email) || !isValidPhoneNumber(contact_phone)) {
    return res
      .status(400)
      .json({ error: "Invalid email address or phone number" });
  }

  next(); // Move to the next middleware or route handler
};

// Create a new warehouse
router.post("/", validateRequestBody, async (req, res) => {
  const {
    warehouse_name,
    address,
    city,
    country,
    contact_name,
    contact_position,
    contact_phone,
    contact_email,
  } = req.body;

  try {
    await knex("warehouses").insert({
      id: uuidv4(),
      warehouse_name,
      address,
      city,
      country,
      contact_name,
      contact_position,
      contact_phone,
      contact_email,
    });

    res.status(201).json({
      id: uuidv4(),
      warehouse_name,
      address,
      city,
      country,
      contact_name,
      contact_position,
      contact_phone,
      contact_email,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to create warehouse" });
  }
});

module.exports = router;
