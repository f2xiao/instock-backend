const knex = require("knex")(require("../knexfile"));

const getAll = async (_req, res) => {
  try {
    const searchParam = _req.query.s ? _req.query.s : '';
    const orderBy = _req.query.order_by ? _req.query.order_by : 'asc';
    const sortBy = _req.query.sort_by ? _req.query.sort_by : 'item_name';

    const data = await knex
      .select(
        "inventories.id",
        "warehouses.warehouse_name",
        "inventories.item_name",
        "inventories.description",
        "inventories.category",
        "inventories.status",
        "inventories.quantity"
      )
      .from("inventories")
      .join("warehouses", "inventories.warehouse_id", "warehouses.id")
      .where('item_name', 'like', `%${searchParam}%`)
      .orWhere('warehouse_name', 'like', `%${searchParam}%`)
      .orWhere('category', 'like', `%${searchParam}%`)
      .orWhere('status', 'like', `%${searchParam}%`)
      .orWhere('quantity', 'like', `%${searchParam}%`)
      .orderBy(sortBy, orderBy);

    res.status(200).json(data);
  } catch (err) {
    res.status(400).send(`Error retrieving Warehouses: ${err}`);
  }
};

const validateRequestBody = (req, res, next) => {
  const { item_name, description, category, status, quantity } = req.body;

  if (isNaN(quantity)) {
    return res.status(400).json({ error: "Quantity must be a number" });
  }

  if (!item_name || !description || !category || !status) {
    return res
      .status(400)
      .json({ error: "Missing required properties in the request body" });
  }

  next();
};

const createInventory = async (req, res) => {
  const { warehouse_id, item_name, description, category, status, quantity } =
    req.body;

  try {
    const [id] = await knex("inventories").insert({
      warehouse_id,
      item_name,
      description,
      category,
      status,
      quantity,
    });

    const inventoryItem = {
      id,
      warehouse_id,
      item_name,
      description,
      category,
      status,
      quantity,
    };

    res.status(201).json(inventoryItem);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to create inventory item" });
  }
};

const updateInventory = async (req, res) => {
  const { id } = req.params;
  const { warehouse_id, item_name, description, category, status, quantity } =
    req.body;

  try {
    // Check if the inventory item with the given ID exists
    const inventoryItem = await knex("inventories").where({ id }).first();
    if (!inventoryItem) {
      return res
        .status(404)
        .json({ error: `Inventory item with ID ${id} not found` });
    }

    // Update the inventory item with the new data
    await knex("inventories").where({ id }).update({
      warehouse_id,
      item_name,
      description,
      category,
      status,
      quantity,
    });

    // Fetch the updated inventory item
    const updatedInventoryItem = await knex("inventories")
      .where({ id })
      .first();
    res.status(200).json(updatedInventoryItem);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to update inventory item" });
  }
};

//Get a single inventory
const getInventoryById = async (req, res) => {
  const { id } = req.params;

  try {
    // Retrieve the inventory item with the given ID
    const inventoryItem = await knex("inventories")
      .select(
        "inventories.id",
        "warehouses.warehouse_name",
        "inventories.warehouse_id",
        "inventories.item_name",
        "inventories.description",
        "inventories.category",
        "inventories.status",
        "inventories.quantity"
      )
      .where("inventories.id", id)
      .join("warehouses", "inventories.warehouse_id", "warehouses.id")
      .first();

    if (!inventoryItem) {
      return res
        .status(404)
        .json({ error: `Inventory item with ID ${id} not found` });
    }

    res.status(200).json(inventoryItem);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to retrieve inventory item" });
  }
};

const deleteInventory = async (req, res) => {
  const { id } = req.params;

  try {
    // Check if the inventory item with the given ID exists
    const inventoryItem = await knex("inventories").where({ id }).first();
    if (!inventoryItem) {
      return res
        .status(404)
        .json({ error: `Inventory item with ID ${id} not found` });
    }

    // Delete the inventory item from the database
    await knex("inventories").where({ id }).del();

    // Send a success response
    res.sendStatus(204);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to delete inventory item" });
  }
};

module.exports = {
  getAll,
  validateRequestBody,
  createInventory,
  updateInventory,
  getInventoryById,
  deleteInventory,
};
