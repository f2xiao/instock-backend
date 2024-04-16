const router = require("express").Router();

router.get("/", (req, res) => {
  res.json({message:"inventories data"})
});


module.exports = router;
