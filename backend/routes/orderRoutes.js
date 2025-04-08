import express from 'express';
import { verifyUserAuth, roleBasedAccess } from '../middleware/userAuth.js';
import { createNewOrder, getSingleOrder, getAllMyOrders, getAllOrders, updateOrderStatus , deleteOrder} from '../controller/orderController.js';

const router = express.Router();


router.route('/new/orders').post(verifyUserAuth, createNewOrder);
router.route('/admin/order/:id')
.get(verifyUserAuth, roleBasedAccess('admin'), getSingleOrder)
.put(verifyUserAuth, roleBasedAccess('admin'), updateOrderStatus)
.delete(verifyUserAuth, roleBasedAccess('admin'), deleteOrder);
router.route('/admin/orders').get(verifyUserAuth, roleBasedAccess('admin'), getAllOrders);
router.route('/orders/user').get(verifyUserAuth, getAllMyOrders);









export default router;