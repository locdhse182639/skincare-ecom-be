import { DeliveryModel } from "../models/delivery.model";
import { OrderModel } from "../models/order.model";

const districtShippingFees = {
  "Quận 1": 50000,
  "Quận 2": 60000,
  "Quận 3": 70000,
  "Quận 4": 80000,
  "Quận 5": 90000,
  "Quận 6": 100000,
  "Quận 7": 110000,
  "Quận 8": 120000,
  "Quận 9": 130000,
  "Quận 10": 140000,
  "Quận 11": 150000,
  "Quận 12": 160000,
  "Quận Thủ Đức": 170000,
} as const;

type District = keyof typeof districtShippingFees;

const calculateShippingFee = (district: District | string): number => {
  if (!district) {
    throw new Error("District is required to calculate the shipping fee");
  }

  return districtShippingFees[district as District] || 70000; // Default fee if district not found
};

const estimateDeliveryTime = (): Date => {
  const now = new Date();
  const estimatedTime = new Date(now);
  estimatedTime.setDate(now.getDate() + 3); // Estimate 3 days for delivery
  return estimatedTime;
};

export const createDelivery = async (orderId: string) => {
  const order = await OrderModel.findById(orderId);
  if (!order) {
    throw new Error("Order not found");
  }

  if (!order.shippingAddress?.district) {
    throw new Error("Shipping address is missing the district field");
  }

  const shippingFee = calculateShippingFee(order.shippingAddress.district);
  const estimatedDeliveryTime = estimateDeliveryTime();

  const delivery = new DeliveryModel({
    orderId,
    shippingFee,
    estimatedDeliveryTime,
  });

  await delivery.save();
  return delivery;
};

export const updateDeliveryStatus = async (orderId: string, status: "Pending" | "Shipped" | "Delivered" | "Cancelled" | "Shipping") => {
  const delivery = await DeliveryModel.findOne({ orderId });
  if (!delivery) {
    throw new Error("Delivery not found");
  }

  delivery.deliveryStatus = status;
  await delivery.save(); 
  return delivery;
};
