const { pool } = require("../config/db");

const getDashboardStats = async (req, res) => {
  try {
    const connection = await pool.getConnection();

    try {
      const [totalProductsResult] = await connection.execute(
        "SELECT COUNT(*) as count FROM products"
      );
      const totalProducts = totalProductsResult[0]?.count || 0;

      const [totalOrdersResult] = await connection.execute(
        "SELECT COUNT(*) as count FROM orders"
      );
      const totalOrders = totalOrdersResult[0]?.count || 0;

      const [totalRevenueResult] = await connection.execute(
        "SELECT SUM(total_price) as total FROM orders"
      );
      const totalRevenue = totalRevenueResult[0]?.total || 0;

      const [bestSellerResult] = await connection.execute(
        `SELECT p.id, p.name, SUM(oi.quantity) as total_quantity
         FROM order_items oi
         JOIN products p ON oi.product_id = p.id
         GROUP BY p.id, p.name
         ORDER BY total_quantity DESC
         LIMIT 1`
      );

      const bestSeller = bestSellerResult.length > 0
        ? {
            id: bestSellerResult[0].id,
            name: bestSellerResult[0].name,
            totalQuantity: bestSellerResult[0].total_quantity
          }
        : null;

      res.status(200).json({
        success: true,
        data: {
          totalProducts,
          totalOrders,
          totalRevenue: parseFloat(totalRevenue) || 0,
          bestSeller
        }
      });
    } finally {
      connection.release();
    }
  } catch (err) {
    console.error("Dashboard stats error:", err);
    res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
};

module.exports = {
  getDashboardStats
};
