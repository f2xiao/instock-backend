const knex = require("knex")(require("../knexfile"));

const getAll = async (_req, res) => {
  try {
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
      .join("warehouses", "inventories.warehouse_id", "warehouses.id");

    res.status(200).json(data);
  } catch (err) {
    res.status(400).send(`Error retrieving Warehouses: ${err}`);
  }
};

module.exports = {
  getAll,
};
