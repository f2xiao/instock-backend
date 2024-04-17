const knex = require("knex")(require("../knexfile"));
const { v4: uuidv4 } = require("uuid");

const getAll = async (_req, res) => {
  try {
    const data = await knex("warehouses");
    res.status(200).json(data);
  } catch (err) {
    res.status(400).send(`Error retrieving Warehouses: ${err}`);
  }
};

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

  next();
};

const createWarehouse = async (req, res) => {
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
};

module.exports = {
  validateRequestBody,
  createWarehouse,
  getAll,
};
