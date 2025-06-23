const router = require("express").Router();
const { getPanel } = require("../controllers/renderPanel")

router.route("/").get(getPanel);


module.exports = router;