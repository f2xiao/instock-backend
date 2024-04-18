const knex = require("knex")(require("../knexfile"));

const getAll = async (_req, res) => {
  try {
    const data = await knex("inventories");
    res.status(200).json(data);
  } catch (err) {
    res.status(400).send(`Error retrieving Warehouses: ${err}`);
  }
};

const validateRequestBody = (req, res, next) => {
  const { item_name, description, category, status, quantity } = req.body;

  if (!item_name || !description || !category || !status || !quantity) {
    return res
      .status(400)
      .json({ error: "Missing required properties in the request body" });
  }

  if (isNaN(quantity)) {
    return res.status(400).json({ error: "Quantity must be a number" });
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

module.exports = {
  getAll,
  validateRequestBody,
  createInventory,
  updateInventory,
};
