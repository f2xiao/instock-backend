const router = require("express").Router();

router.get("/", (req, res) => {
  res.json({message:"warehouses data"})
});


module.exports = router;

