import Order from "../models/Order.js";
import Product from "../models/Product.js";

const currencyRatesToUGX = {
    USD: 3695.2,
    KES: 28.6,
    UGX: 1,
}

const convertToUGX = (amount, currency = "USD") => {
    const rate = currencyRatesToUGX[currency] || currencyRatesToUGX.USD;
    return Number(amount || 0) * rate;
}

// Place Order COD : /api/order/cod
export const placeOrderCOD = async (req, res)=>{
    try {
        const { userId, items, address } = req.body;
        if(!address || items.length === 0){
            return res.json({success: false, message: "Invalid data"})
        }
        // Calculate Amount Using Items
        let amount = await items.reduce(async (acc, item)=>{
            const product = await Product.findById(item.product);
            return (await acc) + convertToUGX(product.offerPrice, product.currency) * item.quantity;
        }, 0)

        // Add Tax Charge (2%)
        amount += Math.floor(amount * 0.02);

        await Order.create({
            userId,
            items,
            amount: Math.round(amount),
            currency: "UGX",
            address,
            paymentType: "Cash on Delivery",
        });

        return res.json({success: true, message: "Order Placed Successfully" })
    } catch (error) {
        return res.json({ success: false, message: error.message });
    }
}

// Get Orders by User ID : /api/order/user
export const getUserOrders = async (req, res)=>{
    try {
        const { userId } = req.body;
        const orders = await Order.find({
            userId,
            $or: [
                {paymentType: "COD"},
                {paymentType: "Cash on Delivery"},
                {isPaid: true}
            ]
        }).populate("items.product address").sort({createdAt: -1});
        res.json({ success: true, orders });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
}


// Get All Orders ( for seller / admin) : /api/order/seller
export const getAllOrders = async (req, res)=>{
    try {
        const orders = await Order.find({
            $or: [
                {paymentType: "COD"},
                {paymentType: "Cash on Delivery"},
                {isPaid: true}
            ]
        }).populate("items.product address").sort({createdAt: -1});
        res.json({ success: true, orders });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
}

// Update Order Status : /api/order/status
export const updateOrderStatus = async (req, res) => {
    try {
        const { orderId, status } = req.body;

        if (!orderId || !status) {
            return res.json({ success: false, message: "Order ID and status are required" });
        }

        await Order.findByIdAndUpdate(orderId, { status });

        return res.json({ success: true, message: "Order status updated" });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
}

// Confirm Order Payment : /api/order/payment
export const confirmOrderPayment = async (req, res) => {
    try {
        const { orderId } = req.body;

        if (!orderId) {
            return res.json({ success: false, message: "Order ID is required" });
        }

        await Order.findByIdAndUpdate(orderId, { isPaid: true });

        return res.json({ success: true, message: "Payment confirmed" });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
}
