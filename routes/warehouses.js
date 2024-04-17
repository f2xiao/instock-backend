const router = require("express").Router();

const warehouseController = require("../controllers/warehouse-controller");

router.route("/").get(warehouseController.getAll);

module.exports = router;

