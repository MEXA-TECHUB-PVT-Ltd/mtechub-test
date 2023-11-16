
const express = require('express');
const router = express.Router();
const controller = require("../../controllers/FEATURES/featuresController")

router.post("/createFeatures" , controller.createFeatures);
router.post("/updateFeatures" , controller.updateFeatures);
router.post("/updateFeatures" , controller.updateFeatures);
router.post("/deleteFeatures" , controller.deleteFeatures);
router.post("/deleteAllFeatures" , controller.deleteAllFeatures);

module.exports = router;