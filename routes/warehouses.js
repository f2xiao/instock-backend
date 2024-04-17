const router = require("express").Router();

const warehouseController = require("../controllers/warehouse-controller");

router.route("/").get(warehouseController.getAll);

router.route("/:id").get(warehouseController.findOne);

module.exports = router;
