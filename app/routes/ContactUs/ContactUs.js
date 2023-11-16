
const express = require('express');
const router = express.Router();
const controller = require("../../controllers/Contact_us/contactUs")

router.post("/createContact" , controller.createContact);
router.post("/updateContact" , controller.updateContact);
router.post("/deleteContact" , controller.deleteContact);
router.post("/deleteAllContact" , controller.deleteAllContact);
router.get("/getAllContacts" , controller.getAllContacts);
router.post("/getContactDetails" , controller.getContactDetails);

module.exports = router;