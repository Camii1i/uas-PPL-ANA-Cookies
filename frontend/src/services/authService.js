import axios from "axios";

const API_URL = "http://localhost:5000/api";

const authService = {
  login: async (email, password) => {
    try {
      const response = await axios.post(`${API_URL}/auth/login`, {
        email,
        password
      });
      if (response.data.success) {
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("user", JSON.stringify(response.data.user));
      }
      return response.data;
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || "Login failed"
      };
    }
  },

  logout: () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  },

  getToken: () => localStorage.getItem("token"),
  getUser: () => JSON.parse(localStorage.getItem("user") || "null")
};

export default authService;
