import axios from "axios";
import authService from "./authService";

const API_URL = "http://localhost:5000/api";

const productService = {
  getAllProducts: async () => {
    try {
      const token = authService.getToken();
      const headers = token ? { Authorization: `Bearer ${token}` } : {};
      const response = await axios.get(`${API_URL}/products`, { headers });
      return response.data.data || [];
    } catch (error) {
      console.error("Error fetching products:", error);
      return [];
    }
  },

  getProductById: async (id) => {
    try {
      const token = authService.getToken();
      const headers = token ? { Authorization: `Bearer ${token}` } : {};
      const response = await axios.get(`${API_URL}/products/${id}`, { headers });
      return response.data.data;
    } catch (error) {
      console.error("Error fetching product:", error);
      return null;
    }
  },

  createProduct: async (productData) => {
    try {
      const token = authService.getToken();
      const response = await axios.post(`${API_URL}/products`, productData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return response.data;
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || "Failed to create product"
      };
    }
  },

  updateProduct: async (id, productData) => {
    try {
      const token = authService.getToken();
      const response = await axios.put(`${API_URL}/products/${id}`, productData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return response.data;
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || "Failed to update product"
      };
    }
  },

  deleteProduct: async (id) => {
    try {
      const token = authService.getToken();
      const response = await axios.delete(`${API_URL}/products/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return response.data;
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || "Failed to delete product"
      };
    }
  }
};

export default productService;

