import express from 'express';
import {createProducts, getAllProducts, updateProduct, deleteProduct, getSingleProduct } from '../controller/productController.js';
import { verifyUserAuth, roleBasedAccess } from '../middleware/userAuth.js';
const router = express.Router();



// routes
// verifyUserAuth Middleware added to verify the user is logged in to have access to perform (get) operations
// roleBasedAccess Middleware added to verify the user has the role of admin to have access to perform (create, update and delete) operations
router.route('/products')
.get(verifyUserAuth, getAllProducts)  
.post(verifyUserAuth, roleBasedAccess("admin"), createProducts)

router.route('/product/:id')
.put(verifyUserAuth, roleBasedAccess("admin"), updateProduct)
.delete(verifyUserAuth, roleBasedAccess("admin"), deleteProduct)
.get(verifyUserAuth, getSingleProduct)



export default router;