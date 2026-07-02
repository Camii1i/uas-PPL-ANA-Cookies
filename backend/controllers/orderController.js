const { pool } = require("../config/db");

const getAllOrders = async (req, res) => {
  try {
    const connection = await pool.getConnection();

    try {
      const [orders] = await connection.execute(
        `SELECT o.id, o.order_number, u.name as customer_name, u.email as customer_email, 
                o.total_price, o.status, o.created_at 
         FROM orders o 
         JOIN users u ON o.user_id = u.id 
         ORDER BY o.created_at DESC`
      );

      res.status(200).json({
        success: true,
        data: orders,
        count: orders.length
      });
    } finally {
      connection.release();
    }
  } catch (err) {
    console.error("Get all orders error:", err);
    res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
};

const getOrderById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id || isNaN(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid order ID"
      });
    }

    const connection = await pool.getConnection();

    try {
      const [orders] = await connection.execute(
        `SELECT o.id, o.order_number, u.name as customer_name, u.email as customer_email, 
                o.total_price, o.status, o.created_at 
         FROM orders o 
         JOIN users u ON o.user_id = u.id 
         WHERE o.id = ?`,
        [id]
      );

      if (orders.length === 0) {
        return res.status(404).json({
          success: false,
          message: "Order not found"
        });
      }

      const order = orders[0];

      const [items] = await connection.execute(
        `SELECT oi.id, oi.product_id, p.name as product_name, 
                oi.quantity, oi.price 
         FROM order_items oi 
         JOIN products p ON oi.product_id = p.id 
         WHERE oi.order_id = ?`,
        [id]
      );

      res.status(200).json({
        success: true,
        data: {
          ...order,
          items
        }
      });
    } finally {
      connection.release();
    }
  } catch (err) {
    console.error("Get order by ID error:", err);
    res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
};

const createOrder = async (req, res) => {
  try {
    const { user_id, order_number, total_price, status, items } = req.body;

    if (!user_id || !order_number || total_price === undefined) {
      return res.status(400).json({
        success: false,
        message: "user_id, order_number, and total_price are required"
      });
    }

    if (isNaN(total_price) || total_price < 0) {
      return res.status(400).json({
        success: false,
        message: "total_price must be a positive number"
      });
    }

    const connection = await pool.getConnection();

    try {
      await connection.beginTransaction();

      const [result] = await connection.execute(
        `INSERT INTO orders (user_id, order_number, total_price, status, order_date) 
         VALUES (?, ?, ?, ?, NOW())`,
        [user_id, order_number, total_price, status || "Pending"]
      );

      const orderId = result.insertId;

      if (Array.isArray(items) && items.length > 0) {
        for (const item of items) {
          if (!item.product_id || !item.quantity || !item.price) {
            throw new Error("Each item requires product_id, quantity, and price");
          }

          await connection.execute(
            `INSERT INTO order_items (order_id, product_id, quantity, price) 
             VALUES (?, ?, ?, ?)`,
            [orderId, item.product_id, item.quantity, item.price]
          );
        }
      }

      await connection.commit();

      const [newOrder] = await connection.execute(
        `SELECT o.id, o.order_number, u.name as customer_name, u.email as customer_email, 
                o.total_price, o.status, o.created_at 
         FROM orders o 
         JOIN users u ON o.user_id = u.id 
         WHERE o.id = ?`,
        [orderId]
      );

      res.status(201).json({
        success: true,
        message: "Order created successfully",
        data: newOrder[0]
      });
    } catch (err) {
      await connection.rollback();
      throw err;
    } finally {
      connection.release();
    }
  } catch (err) {
    console.error("Create order error:", err);
    res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
};

const updateOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const { order_number, total_price, status } = req.body;

    if (!id || isNaN(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid order ID"
      });
    }

    if (total_price !== undefined && (isNaN(total_price) || total_price < 0)) {
      return res.status(400).json({
        success: false,
        message: "total_price must be a positive number"
      });
    }

    const connection = await pool.getConnection();

    try {
      const [existingOrder] = await connection.execute(
        "SELECT id FROM orders WHERE id = ?",
        [id]
      );

      if (existingOrder.length === 0) {
        return res.status(404).json({
          success: false,
          message: "Order not found"
        });
      }

      const updates = [];
      const values = [];

      if (order_number !== undefined) {
        updates.push("order_number = ?");
        values.push(order_number);
      }
      if (total_price !== undefined) {
        updates.push("total_price = ?");
        values.push(total_price);
      }
      if (status !== undefined) {
        updates.push("status = ?");
        values.push(status);
      }

      if (updates.length === 0) {
        return res.status(400).json({
          success: false,
          message: "No fields to update"
        });
      }

      values.push(id);

      await connection.execute(
        `UPDATE orders SET ${updates.join(", ")} WHERE id = ?`,
        values
      );

      const [updatedOrder] = await connection.execute(
        `SELECT o.id, o.order_number, u.name as customer_name, u.email as customer_email, 
                o.total_price, o.status, o.created_at 
         FROM orders o 
         JOIN users u ON o.user_id = u.id 
         WHERE o.id = ?`,
        [id]
      );

      res.status(200).json({
        success: true,
        message: "Order updated successfully",
        data: updatedOrder[0]
      });
    } finally {
      connection.release();
    }
  } catch (err) {
    console.error("Update order error:", err);
    res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
};

const deleteOrder = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id || isNaN(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid order ID"
      });
    }

    const connection = await pool.getConnection();

    try {
      const [existingOrder] = await connection.execute(
        "SELECT id FROM orders WHERE id = ?",
        [id]
      );

      if (existingOrder.length === 0) {
        return res.status(404).json({
          success: false,
          message: "Order not found"
        });
      }

      await connection.execute("DELETE FROM order_items WHERE order_id = ?", [id]);
      await connection.execute("DELETE FROM orders WHERE id = ?", [id]);

      res.status(200).json({
        success: true,
        message: "Order deleted successfully"
      });
    } finally {
      connection.release();
    }
  } catch (err) {
    console.error("Delete order error:", err);
    res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
};

module.exports = {
  getAllOrders,
  getOrderById,
  createOrder,
  updateOrder,
  deleteOrder
};