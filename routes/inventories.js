const router = require("express").Router();

const inventoryController = require("../controllers/inventory-controller");

router.route("/").get(inventoryController.getAll);

// Create a new inventory item
router.post(
  "/",
  inventoryController.validateRequestBody,
  inventoryController.createInventory
);

module.exports = router;
