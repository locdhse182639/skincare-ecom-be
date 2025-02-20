import { Request, Response } from "express";
import { OrderModel } from "../models/order.model";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);

export const createOrder = async (req: Request, res: Response) => {
  try {
    const { items, totalAmount, paymentMethod, shippingAddress } = req.body;
    const userId = req.user?.id;

    if (!items || items.length === 0) {
      return res.status(400).json({ message: "No item in the order" });
    }

    const newOrder = new OrderModel({
      user: userId,
      items,
      totalAmount,
      paymentMethod,
      shippingAddress,
    });

    await newOrder.save();

    res
      .status(201)
      .json({ message: "Order created successfully", order: newOrder });
  } catch (err) {
    res.status(500).json({ message: "Error creating order", error: err });
  }
};

export const getOrderById = async (req: Request, res: Response) => {
  try {
    const order = await OrderModel.findById(req.params.id)
      .populate("user", "name email")
      .populate("items.product");

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    //condition chỉ cho coi order của user login hoặc admin
    if (req.user?.id !== order.user.toString() && req.user?.role !== "admin") {
      return res
        .status(403)
        .json({ message: "You are not authorized to view this order" });
    }

    res.status(200).json({ order });
  } catch (err) {
    res.status(500).json({ message: "Error retrieving orders", error: err });
  }
};

/**
 * @desc Get all orders for the authenticated user
 * @route GET /api/orders
 * @access Private (Authenticated Users)
 */
export const getUserOrders = async (req: Request, res: Response) => {
  try {
    const orders = await OrderModel.find({ user: req.user?.id }).sort({
      createdAt: -1,
    });

    if (!orders.length) {
      return res.status(404).json({ message: "No order found" });
    }

    res.status(200).json({ orders });
  } catch (err) {
    res.status(500).json({ message: "Error retrieving orders", error: err });
  }
};

/**
 * @desc Mark order as paid
 * @route PUT /api/orders/:id/pay
 * @access Private (Authenticated Users)
 */
export const updateOrderToPaid = async (req: Request, res: Response) => {
  try {
    const order = await OrderModel.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    order.isPaid = true;
    order.paidAt = new Date();
    order.paymentMethod = req.body.paymentMethod;
    order.paymentStatus = "Paid";
    order.paymentResult = {
      id: req.body.id,
      status: req.body.status,
      update_time: req.body.update_time,
      email_address: req.body.email_address,
    };

    const updatedOrder = await order.save();

    res.status(200).json(updatedOrder);
  } catch (error) {
    res.status(500).json({ message: "Error updating order payment", error });
  }
};

/**
 * @desc Mark order as delivered
 * @route PUT /api/orders/:id/deliver
 * @access Private (Admin only)
 */
export const updateOrderToDelivered = async (req: Request, res: Response) => {
  try {
    const order = await OrderModel.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    if (order.orderStatus !== "Shipped" && order.orderStatus !== "Delivered") {
      return res
        .status(400)
        .json({ message: "Order must be shipped before marking as delivered" });
    } else if (order.orderStatus === "Delivered") {
      return res.status(400).json({ message: "Order already delivered" });
    }

    order.orderStatus = "Delivered";
    order.deliveredAt = new Date();

    const updatedOrder = await order.save();
    res.status(200).json(updatedOrder);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error updating order delivery status", error });
  }
};

/**
 * @desc Get all orders with pagination and filter (Admin only)
 * @route GET /api/orders/admin
 * @access Private (Admin only)
 */
export const getAllOrders = async (req: Request, res: Response) => {
  try {
    const { page = 1, limit = 10, status, search } = req.query;

    const query: any = {};

    //filter = order status
    if (status) query.orderStatus = status;

    //search = email
    if (search) {
      query.$or = [
        { "user.email": { $regex: search, $options: "i" } }, //case-insensitive search
      ];
    }

    //pagination
    const skip = (Number(page) - 1) * Number(limit);
    const totalOrders = await OrderModel.countDocuments(query);

    const orders = await OrderModel.find(query)
      .populate("user", "name email")
      .sort({ createAt: -1 })
      .skip(skip)
      .limit(Number(limit));

    res.status(200).json({
      orders,
      totalPages: Math.ceil(totalOrders / Number(limit)),
      currentPage: Number(page),
    });
  } catch (err) {
    res.status(500).json({ message: "Error retrieving orders", error: err });
  }
};

/**
 * @desc Cancel an Order (User or Admin)
 * @route PUT /api/orders/:id/cancel
 * @access Private (User or Admin)
 */
export const cancelOrder = async (req: Request, res: Response) => {
    try {
      const order = await OrderModel.findById(req.params.id);
  
      if (!order) {
        return res.status(404).json({ message: "Order not found" });
      }
  
      if (order.orderStatus !== "Pending") {
        return res.status(400).json({
          message: "Cannot cancel an order that has already been processed",
        });
      }
  
      // 🔒 Only allow the owner or an admin to cancel
      if (req.user?.id !== order.user.toString() && req.user?.role !== "admin") {
        return res
          .status(403)
          .json({ message: "You are not authorized to cancel this order" });
      }
  
      order.orderStatus = "Cancelled";
  
      if (order.isPaid) {
        if (order.paymentMethod === "VNPay") {
          order.paymentStatus = "Failed";
        } else if (order.paymentMethod === "Stripe") {
          try {
            const refund = await stripe.refunds.create({
              payment_intent: order.paymentResult?.id as string, 
            });
            order.isRefunded = true;
            order.refundedAt = new Date();
            order.isPaid = false;
            order.paymentStatus = "Failed"; 
          } catch (error) {
            return res
              .status(500)
              .json({ message: "Error processing Stripe refund", error });
          }
        }
      }
  
      await order.save();
  
      res.status(200).json({
        message: "Order canceled successfully",
        order,
      });
    } catch (error) {
      res.status(500).json({ message: "Error canceling order", error });
    }
  };


