import { Request, Response } from "express";
import { createDelivery, updateDeliveryStatus } from "../utils/delivery";
import { OrderModel } from "../models/order.model";
import { sendNotification } from "../utils/email";
import { AuthenticatedRequest } from "../middleware/auth.middleware";

export const createDeliveryForOrder = async (req: Request, res: Response) => {
  try {
    const { orderId } = req.params;
    const delivery = await createDelivery(orderId);

    res.status(201).json({ message: "Delivery created successfully", delivery });
  } catch (err) {
    res.status(500).json({ message: "Error creating delivery", error: err });
  }
};

export const markOrderAsShipping = async (req: Request, res: Response) => {
  try {
    const { orderId } = req.params;
    const delivery = await updateDeliveryStatus(orderId, "Shipping");

    const order = await OrderModel.findById(orderId).populate('user');
    if (order) {
      order.orderStatus = "Shipped";
      await order.save();
    }

    res.json({ message: "Order marked as shipping", delivery });
  } catch (err) {
    res.status(500).json({ message: "Error updating delivery status", error: err });
  }
};

export const markDeliveryAsShipped = async (req: Request, res: Response) => {
  try {
    const { orderId } = req.params;

    // Update delivery status to "Shipped"
    const delivery = await updateDeliveryStatus(orderId, "Shipped");

    // Update order status to "Shipped"
    const order = await OrderModel.findById(orderId).populate<{ user: { email: string } }>('user');
    if (order && order.user) {
      order.orderStatus = "Shipped";
      await order.save();

      // Notify the customer
      await sendNotification(
        order.user.email,
        "Your Order is Shipped!",
        `Your order with ID ${orderId} has been shipped. Please visit your order history to confirm receipt once you receive the item.`
      );
    }

    res.json({ message: "Delivery marked as shipped", delivery });
  } catch (err) {
    res.status(500).json({ message: "Error marking delivery as shipped", error: err});
  }
};

export const confirmOrderReceived = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { orderId } = req.params;
    const userId = req.user?.id; // Assuming `authMiddleware` adds `user` to the request object

    // Find the order and check ownership
    const order = await OrderModel.findById(orderId);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    if (order.user.toString() !== userId) {
      return res.status(403).json({ message: "You are not authorized to confirm this order" });
    }

    const delivery = await updateDeliveryStatus(orderId, "Delivered");

    order.orderStatus = "Delivered";
    order.deliveredAt = new Date();
    await order.save();

    res.json({ message: "Order confirmed as received", delivery });
  } catch (err) {
    res.status(500).json({ message: "Error confirming order receipt", error: err });
  }
};