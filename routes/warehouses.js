const router = require("express").Router();
const warehouseController = require("../controllers/warehouse-controller");

// CREATE A NEW WAREHOUSE
router.post(
  "/",
  warehouseController.validateRequestBody,
  warehouseController.createWarehouse
);

// Retrieve all warehouses
router.route("/").get(warehouseController.getAll);

router.route("/:id").get(warehouseController.findOne);

module.exports = router;
