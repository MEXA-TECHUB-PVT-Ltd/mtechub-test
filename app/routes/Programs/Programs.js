
const express = require('express');
const router = express.Router();
const controller = require("../../controllers/Programs/programs")

router.post("/add" , controller.createProgram);
router.post("/updateProgram" , controller.updateProgram);
router.post("/deleteProgram" , controller.deleteProgram);
router.post("/deleteAllProgram" , controller.deleteAllProgram);
router.get("/get" , controller.getAllPrograms);
router.get("/get/:id" , controller.getProgramById);

module.exports = router;