import express from 'express';
import authUser from '../middlewares/authUser.js';
import { confirmOrderPayment, getAllOrders, getUserOrders, placeOrderCOD, updateOrderStatus } from '../controllers/orderController.js';
import authSeller from '../middlewares/authSeller.js';

const orderRouter = express.Router();

orderRouter.post('/cod', authUser, placeOrderCOD)
orderRouter.post('/payment', authSeller, confirmOrderPayment)
orderRouter.post('/status', authSeller, updateOrderStatus)
orderRouter.get('/user', authUser, getUserOrders)
orderRouter.get('/seller', authSeller, getAllOrders)

export default orderRouter;
