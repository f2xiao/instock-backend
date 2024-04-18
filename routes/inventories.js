const router = require("express").Router();
const inventoryController = require("../controllers/inventory-controller");

// Retrieve all inventory items
router.route("/").get(inventoryController.getAll);

// Create a new inventory item
router.post(
  "/",
  inventoryController.validateRequestBody,
  inventoryController.createInventory
);

// Update a single inventory item
router.put(
  "/:id",
  inventoryController.validateRequestBody,
  inventoryController.updateInventory
);

// Get details about a single inventory item
router.get("/:id", inventoryController.getInventoryById);

module.exports = router;
