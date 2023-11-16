
const express = require('express');
const router = express.Router();
const controller = require("../../controllers/PRODUCTS/productsController")

router.post("/createProduct" , controller.createProduct);
router.post("/updateProduct" , controller.updateProduct);
router.post("/archieveProduct" , controller.archieveProduct);
router.post("/deleteProduct" , controller.deleteProduct);
router.post("/deleteAllProduct" , controller.deleteAllProduct);
router.get("/getAllProducts" , controller.getAllProducts);
router.post("/getProductDetails" , controller.getProductDetails);
router.post("/getProductDetailsByStripeId" , controller.getProductDetailsByStripeId);

router.post("/getAllProductsPagination" , controller.getAllProductsPagination);



module.exports = router;