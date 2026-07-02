import axios from "axios";
import authService from "./authService";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const orderService = {
  getAllOrders: async () => {
    try {
      const token = authService.getToken();
      const response = await axios.get(`${API_URL}/orders`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return response.data.data || [];
    } catch (error) {
      console.error("Error fetching orders:", error);
      return [];
    }
  },

  getOrderById: async (id) => {
    try {
      const token = authService.getToken();
      const response = await axios.get(`${API_URL}/orders/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return response.data.data;
    } catch (error) {
      console.error("Error fetching order:", error);
      return null;
    }
  },

  createOrder: async (orderData) => {
    try {
      const token = authService.getToken();
      const response = await axios.post(`${API_URL}/orders`, orderData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return response.data;
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || "Failed to create order"
      };
    }
  },

  updateOrder: async (id, orderData) => {
    try {
      const token = authService.getToken();
      const response = await axios.put(`${API_URL}/orders/${id}`, orderData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return response.data;
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || "Failed to update order"
      };
    }
  },

  deleteOrder: async (id) => {
    try {
      const token = authService.getToken();
      const response = await axios.delete(`${API_URL}/orders/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return response.data;
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || "Failed to delete order"
      };
    }
  },

  getDashboardStats: async () => {
    try {
      const token = authService.getToken();
      const response = await axios.get(`${API_URL}/dashboard`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return response.data.data;
    } catch (error) {
      console.error("Error fetching dashboard stats:", error);
      return {
        totalProducts: 0,
        totalOrders: 0,
        totalRevenue: 0,
        bestSeller: null
      };
    }
  }
};

export default orderService;