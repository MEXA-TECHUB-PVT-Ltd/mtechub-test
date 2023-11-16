
const express = require('express');
const router = express.Router();
const controller = require("../../controllers/program_videos/programVideos")

router.post("/add" , controller.createVideo);
router.post("/updateVideo" , controller.updateVideo);
router.post("/deleteVideo" , controller.deleteVideo);
router.post("/deleteAllVideo" , controller.deleteAllVideo);
router.get("/getAllVideos" , controller.getAllVideos);
router.post("/getVideoDetails" , controller.getVideoDetails);

module.exports = router;