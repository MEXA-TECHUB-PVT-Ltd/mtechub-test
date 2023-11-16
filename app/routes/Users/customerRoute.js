const express = require('express');
const router = express.Router();
const controller = require("../../controllers/USERS/customerController")

router.post("/register", controller.registerCustomer);
router.post("/getAllUsers", controller.getAllCustomers);
router.post("/adminGetAllusers", controller.admingetAllCustomers);
router.post("/updateUsername", controller.updateUsername);
router.post("/updatePassword", controller.updatePassword);

router.post("/verifyEmail", controller.verifyEmail);
router.post("/getUserByUniqId", controller.getUserByUniqId);
router.post("/getUserByEmail", controller.getUserByEmail);
router.post("/getUserSubscripedProducts", controller.getUserSubscripedProducts);

router.post("/getUserSubscripedProductSingle", controller.getUserSubscripedProductSingle);
router.post("/cardsCountGetDashboard", controller.cardsCountGetDashboard);
router.post("/cancelSubscriptionReq", controller.cancelSubscriptionReq);

router.post("/ProductDetailedSubscriptionAdd", controller.ProductDetailedSubscriptionAdd);
// Add Subscription Product Detail 
// get Suvscrition Product Detail
router.post("/getUserSubscripedProductsDetails", controller.getUserSubscripedProductsDetails);
// delete Detail 
router.post("/DeleteUserSubscripedProductsDetails", controller.DeleteUserSubscripedProductsDetails);

// Help and support 
router.post("/helpAndSupportMessage", controller.helpAndSupportMessage);
router.get("/getAllHelpAndSupport", controller.getAllHelpAndSupport);
router.post("/getAllHelpAndSupportByUserId", controller.getAllHelpAndSupportByUserId);
router.post("/helpAndSupportMessageUpdateStatus", controller.helpAndSupportMessageUpdateStatus);
router.post("/getUserSubscripedByProductId", controller.getUserSubscripedByProductId);

router.post("/getUserSubscripedByUserId", controller.getUserSubscripedByUserId);


router.post("/dashboardAdminCount", controller.dashboardAdminCount);











router.post("/login", controller.login);
router.post("/adminlogin", controller.adminlogin);

router.post("/logout", controller.logout);








module.exports = router;