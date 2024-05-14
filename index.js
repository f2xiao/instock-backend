require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");
const warehousesRoutes = require("./routes/warehouses");
const inventoriesRoutes = require("./routes/inventories");

app.use(
  cors({
    origin: process.env.CLIENT_URL,
  })
);
app.use(express.json());

app.use("/api/warehouses", warehousesRoutes);
app.use("/api/inventories", inventoriesRoutes);

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`server is runnning on port ${PORT}`);
});
