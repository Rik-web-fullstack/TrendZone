// Orders.jsx

"use client";

import React, { useEffect, useState } from "react";
import api from "../api/api"; // ✅ centralized api
import { useNavigate } from "react-router-dom";
import { Loader, XCircle, RotateCcw } from "lucide-react";

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  /* ✅ Fetch orders */
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await api.get("/api/orders/my-orders");
        setOrders(res.data.orders || []);
      } catch (err) {
        if (err.response?.status === 401 || err.response?.status === 403) {
          navigate("/login");
        } else {
          console.error("Failed to fetch orders:", err);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [navigate]);

  /* ❌ Cancel order */
  const cancelOrder = async (orderId) => {
    if (!window.confirm("Are you sure you want to cancel this order?")) return;

    try {
      await api.post(`/api/orders/${orderId}/cancel`);
      setOrders((prev) =>
        prev.map((o) =>
          o._id === orderId ? { ...o, status: "Cancelled" } : o
        )
      );
    } catch (err) {
      alert("Unable to cancel order. Please try again.");
    }
  };

  /* 🔁 Return order */
  const returnOrder = async (orderId) => {
    if (!window.confirm("Do you want to return this product?")) return;

    try {
      await api.post(`/api/orders/${orderId}/return`);
      setOrders((prev) =>
        prev.map((o) =>
          o._id === orderId ? { ...o, status: "Returned" } : o
        )
      );
    } catch (err) {
      alert("Unable to return order. Please try again.");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[70vh]">
        <Loader className="animate-spin text-beige" size={32} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black pt-28 px-6 md:px-20">
      <h1 className="text-3xl font-bold text-beige mb-8">My Orders</h1>

      {orders.length === 0 ? (
        <p className="text-beige-muted">You haven’t placed any orders yet.</p>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => (
            <div
              key={order._id}
              className="border border-beige-muted/20 rounded-lg p-5 bg-black/60 backdrop-blur-md"
            >
              {/* Header */}
              <div className="flex justify-between items-center mb-4">
                <div>
                  <p className="text-sm text-beige-muted">
                    Order ID: {order._id}
                  </p>
                  <p className="text-xs text-beige-muted">
                    Placed on{" "}
                    {new Date(order.createdAt).toLocaleDateString()}
                  </p>
                </div>

                <span
                  className={`text-sm px-3 py-1 rounded-full ${
                    order.status === "Delivered"
                      ? "bg-green-500/20 text-green-400"
                      : order.status === "Cancelled"
                      ? "bg-red-500/20 text-red-400"
                      : order.status === "Returned"
                      ? "bg-yellow-500/20 text-yellow-400"
                      : "bg-blue-500/20 text-blue-400"
                  }`}
                >
                  {order.status}
                </span>
              </div>

              {/* Products */}
              {order.items.map((item) => (
                <div
                  key={item._id}
                  className="flex gap-4 border-t border-beige-muted/10 pt-4"
                >
                  <img
                    src={
                      item.product?.image?.startsWith("http")
                        ? item.product.image
                        : `${import.meta.env.VITE_API_BASE_URL}${item.product.image}`
                    }
                    alt={item.product.name}
                    className="w-20 h-20 object-cover rounded-md"
                  />

                  <div className="flex-1">
                    <p className="text-beige font-medium">
                      {item.product.name}
                    </p>
                    <p className="text-sm text-beige-muted">
                      Qty: {item.quantity}
                    </p>
                    <p className="text-sm text-beige-muted">
                      ₹{item.price}
                    </p>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-3">
                    {order.status === "Placed" && (
                      <button
                        onClick={() => cancelOrder(order._id)}
                        className="flex items-center gap-1 text-red-400 hover:text-red-300 text-sm"
                      >
                        <XCircle size={16} /> Cancel
                      </button>
                    )}

                    {order.status === "Delivered" && (
                      <button
                        onClick={() => returnOrder(order._id)}
                        className="flex items-center gap-1 text-yellow-400 hover:text-yellow-300 text-sm"
                      >
                        <RotateCcw size={16} /> Return
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Orders;
