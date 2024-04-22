const knex = require("knex")(require("../knexfile"));

const getAll = async (_req, res) => {
  try {
    const searchParam = _req.query.s ? _req.query.s : '';
    const orderBy = _req.query.order_by ? _req.query.order_by : 'asc';
    const sortBy = _req.query.sort_by ? _req.query.sort_by : 'warehouse_name';

    const data = await knex("warehouses")
      .where('warehouse_name', 'like', `%${searchParam}%`)
      .orWhere('city', 'like', `%${searchParam}%`)
      .orWhere('address', 'like', `%${searchParam}%`)
      .orWhere('country', 'like', `%${searchParam}%`)
      .orWhere('contact_name', 'like', `%${searchParam}%`)
      .orWhere('contact_phone', 'like', `%${searchParam}%`)
      .orWhere('contact_email', 'like', `%${searchParam}%`)
      .orderBy(sortBy, orderBy);

    res.status(200).json(data);
  } catch (err) {
    res.status(400).send(`Error retrieving Warehouses: ${err}`);
  }
};

const getInventoriesByWarehouseId = async (req, res) => {
  const warehouseId = req.params.id;

  try {
    // Check if the warehouse with the given ID exists
    const warehouse = await knex("warehouses")
      .where({ id: warehouseId })
      .first();
    if (!warehouse) {
      return res
        .status(404)
        .json({ error: `Warehouse with ID ${warehouseId} not found` });
    }

    // Retrieve all inventories associated with the warehouse
    const inventories = await knex("inventories").where({
      warehouse_id: warehouseId,
    });

    res.status(200).json(inventories);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "Failed to retrieve inventories for the warehouse" });
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
// PUT create new warehouse function
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
    res.status(500).json(error);
  }
};

// PUT/EDIT NEW WAREHOUSE
const updateWarehouse = async (req, res) => {
  const warehouseId = req.params.id;
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
    // Check if warehouse with given ID exists
    const existingWarehouse = await knex("warehouses")
      .where({ id: warehouseId })
      .first();
    if (!existingWarehouse) {
      return res.status(404).json({ error: "Warehouse not found" });
    }

    // Update warehouse details
    await knex("warehouses").where({ id: warehouseId }).update({
      warehouse_name,
      address,
      city,
      country,
      contact_name,
      contact_position,
      contact_phone,
      contact_email,
    });

    // Fetch updated warehouse details
    const updatedWarehouse = await knex("warehouses")
      .where({ id: warehouseId })
      .first();
    res.status(200).json(updatedWarehouse);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to update warehouse" });
  }
};


const deleteWarehouse = async (req, res) => {
  const { id } = req.params;

  try {
    // Check if the warehouse with the given ID exists
    const warehouse = await knex("warehouses").where({ id }).first();
    if (!warehouse) {
      return res
        .status(404)
        .json({ error: `Warehouse with ID ${id} not found` });
    }

    // Delete the warehouse from the database
    await knex("warehouses").where({ id }).del();

    // Send a success response
    res.sendStatus(204);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to delete warehouse" });
  }
};


const findOne = async (req, res) => {
  try {
    const warehousesFound = await knex("warehouses").where({
      id: req.params.id,
    });

    if (warehousesFound.length === 0) {
      return res.status(404).json({
        message: `Warehouse with ID ${req.params.id} not found`,
      });
    }

    const warehouseData = warehousesFound[0];
    res.json(warehouseData);
  } catch (error) {
    res.status(500).json({
      message: `Unable to retrieve warehouse data for warehouse with ID ${req.params.id}`,
    });
  }
};

module.exports = {
  validateRequestBody,
  createWarehouse,
  getInventoriesByWarehouseId,
  updateWarehouse,
  deleteWarehouse,
  getAll,
  findOne,
};
