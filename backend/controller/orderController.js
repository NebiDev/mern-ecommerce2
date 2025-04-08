import Order from "../models/orderModel.js";
import Product from "../models/productModel.js";
import User from "../models/userModel.js";
import HandleError from "../utils/handleError.js";
import handleAsyncError from "../middleware/handleAsyncError.js";


//create new order
export const createNewOrder = handleAsyncError(async (req, res, next) => {
    const { shippingInfo, orderItems, paymentInfo, itemsPrice, taxPrice, shippingPrice, totalPrice } = req.body;
    
    const order = await Order.create({
        shippingInfo,
        orderItems,
        paymentInfo,
        itemsPrice,
        taxPrice,
        shippingPrice,
        totalPrice,
        paidAt: Date.now(),
        user: req.user._id,
    });

    res.status(201).json({
        success: true,
        order,
    });
});

// get single order - admin
export const getSingleOrder = handleAsyncError(async (req, res, next) => {
    const order = await Order.findById(req.params.id).populate("user", "name email");

    if (!order) {
        return next(new HandleError(`Order not found with id: ${req.params.id}`, 404));
    }

    res.status(200).json({
        success: true,
        order,
    });
});

// get all my orders for any user/admin logged in
export const getAllMyOrders = handleAsyncError(async (req, res, next) => {
    const orders = await Order.find({ user: req.user._id });

    if (!orders) {
        return next(new HandleError(`No orders found for user: ${req.user._id}`, 404));
    }
    res.status(200).json({
        success: true,
        count: orders.length,
        orders,
    });

});

// get all orders - admin
export const getAllOrders = handleAsyncError(async (req, res, next) => {
    const orders = await Order.find().populate("user", "name email");

    if (!orders) {
        return next(new HandleError(`No orders found`, 404));
    }

    let totalAmount = 0;
    orders.forEach((order) => {
        totalAmount += order.totalPrice;
    });

    res.status(200).json({
        success: true,
        count: orders.length,
        totalAmount,
        orders,
    });
});

// Helper: reduce stock with validation
async function updateStock(productId, quantity) {
    const product = await Product.findById(productId);
  
    if (!product) {
      throw new Error(`Product not found with id: ${productId}`);
    }
  
    if (product.stock < quantity) {
      throw new Error(`Insufficient stock for product: ${product.name}`);
    }
  
    product.stock -= quantity;
    await product.save({ validateBeforeSave: false });
  }
  
  // Update order status - admin
  export const updateOrderStatus = handleAsyncError(async (req, res, next) => {
    const { status } = req.body;
  
    const validStatuses = ['Processing', 'Shipped', 'Delivered', 'Cancelled'];
    if (!validStatuses.includes(status)) {
      return next(new HandleError(`Invalid status: ${status}`, 400));
    }
  
    const order = await Order.findById(req.params.id);
    if (!order) {
      return next(new HandleError(`Order not found with id: ${req.params.id}`, 404));
    }
  
    const currentStatus = order.orderStatus;
  
    // Block updates for final statuses
    if (['Cancelled', 'Delivered'].includes(currentStatus)) {
      return next(new HandleError(`This order has already been ${currentStatus.toLowerCase()}`, 400));
    }
  
    // Prevent skipping the shipping step
    if (status === 'Delivered' && currentStatus !== 'Shipped') {
      return next(new HandleError(`You must ship the order before marking it as delivered`, 400));
    }
  
    // Prevent downgrading status after shipped
    if (currentStatus === 'Shipped' && status !== 'Delivered') {
      return next(new HandleError(`This order has already been shipped`, 400));
    }
  
    // Handle stock reduction and timestamps
    if (status === 'Shipped') {
      order.shippedAt = Date.now();

      // Reduce stock for each item in the order
      try {
        await Promise.all(
          order.orderItems.map(item =>
            updateStock(item.product, item.quantity)
          )
        );
      } catch (err) {
        return next(new HandleError(err.message, 400));
      }
    }
  
    if (status === 'Delivered') {
      order.deliveredAt = Date.now();
    }
  
    if (status === 'Cancelled') {
      order.cancelledAt = Date.now();
    }
  
    // Update status and save
    order.orderStatus = status;
    await order.save({ validateBeforeSave: false });
  
    res.status(200).json({
      success: true,
      message: `Order status updated to ${status}`,
    });
  });

// delete order - admin
export const deleteOrder = handleAsyncError(async (req, res, next) => {
    const order = await Order.findById(req.params.id);
  
    if (!order) {
      return next(new HandleError(`Order not found with id: ${req.params.id}`, 404));
    }
  
    // Only allow deleting Cancelled or Delivered orders
    const deletableStatuses = ['Cancelled', 'Delivered'];
    if (!deletableStatuses.includes(order.orderStatus)) {
      return next(
        new HandleError(
          `You can only delete orders that are Cancelled or Delivered. Current status: ${order.orderStatus}`,
          400
        )
      );
    }
  
    await order.deleteOne({ _id: req.params.id });
  
    res.status(200).json({
      success: true,
      message: "Order deleted successfully",
    });
  });
  
  

