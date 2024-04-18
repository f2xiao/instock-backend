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

module.exports = {
  getAll,
  validateRequestBody,
  createInventory,
};
