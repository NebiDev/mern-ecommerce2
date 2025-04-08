import express from 'express';
import {createProducts, getAllProducts, updateProduct, deleteProduct, getSingleProduct, getAdminProducts, createProductReview, getProductReviews, deleteProductReview } from '../controller/productController.js';
import { verifyUserAuth, roleBasedAccess } from '../middleware/userAuth.js';
const router = express.Router();



// routes
// verifyUserAuth Middleware added to verify the user is logged in to have access to perform (get) operations
// roleBasedAccess Middleware added to verify the user has the role of admin to have access to perform (create, update and delete) operations
router.route('/products')
.get(getAllProducts)

router.route('/admin/products')
.get(verifyUserAuth, roleBasedAccess("admin"), getAdminProducts)


router.route('/admin/product/create')
.post(verifyUserAuth, roleBasedAccess("admin"), createProducts)

router.route('/admin/product/:id')
.put(verifyUserAuth, roleBasedAccess("admin"), updateProduct)
.delete(verifyUserAuth, roleBasedAccess("admin"), deleteProduct)

router.route('/product/:id').get(getSingleProduct)
router.route('/review').put(verifyUserAuth, createProductReview)
router.route('/reviews').get(getProductReviews).delete(verifyUserAuth, deleteProductReview)



export default router;