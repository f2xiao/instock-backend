const router = require("express").Router();
const warehouseController = require("../controllers/warehouse-controller");
router.route("/").get(warehouseController.getAll);

// CREATE A NEW WAREHOUSE
router.post(
  "/",
  warehouseController.validateRequestBody,
  warehouseController.createWarehouse
);

module.exports = router;
