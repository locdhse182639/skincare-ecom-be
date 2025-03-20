import mongoose from "mongoose";

const DeliverySchema = new mongoose.Schema(
  {
    orderId: { type: mongoose.Schema.Types.ObjectId, ref: "Order", required: true },
    shippingFee: { type: Number, required: true },
    deliveryStatus: {
      type: String,
      enum: ["Pending", "Shipping", "Shipped", "Delivered", "Cancelled"],
      default: "Pending",
    },
    estimatedDeliveryTime: { type: Date, required: true },
  },
  { timestamps: true }
);

export const DeliveryModel = mongoose.model("Delivery", DeliverySchema);