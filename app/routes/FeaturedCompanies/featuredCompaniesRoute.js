
const express = require('express');
const router = express.Router();
const controller = require("../../controllers/FEATURED_COMPANIES/featuredCompaniesController")

router.post("/createCompany" , controller.createCompany);
router.post("/updateCompany" , controller.updateCompany);
router.post("/deleteCompany" , controller.deleteCompany);
router.post("/deleteAllCompany" , controller.deleteAllCompany);
router.get("/getAllCompanys" , controller.getAllCompanys);
router.post("/getCompanyDetails" , controller.getCompanyDetails);

module.exports = router;