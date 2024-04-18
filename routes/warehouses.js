const router = require("express").Router();
const express = require("express");
const warehouseController = require("../controllers/warehouse-controller");

// CREATE A NEW WAREHOUSE
router.post(
  "/",
  warehouseController.validateRequestBody,
  warehouseController.createWarehouse
);

// UPDATE A WAREHOUSE
router.put(
  "/:id",
  warehouseController.validateRequestBody,
  warehouseController.updateWarehouse
);

// Retrieve all warehouses
router.route("/").get(warehouseController.getAll);

router.route("/:id").get(warehouseController.findOne);

module.exports = router;
