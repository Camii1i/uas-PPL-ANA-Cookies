const { pool } = require("../config/db");

const getAllProducts = async (req, res) => {
  try {
    const connection = await pool.getConnection();

    try {
      const [products] = await connection.execute(
        "SELECT id, name, description, category, price, stock, max_stock, image_url FROM products ORDER BY id"
      );

      res.status(200).json({
        success: true,
        data: products,
        count: products.length
      });
    } finally {
      connection.release();
    }
  } catch (err) {
    console.error("Get all products error:", err);
    res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
};

const getProductById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id || isNaN(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid product ID"
      });
    }

    const connection = await pool.getConnection();

    try {
      const [products] = await connection.execute(
        "SELECT id, name, description, category, price, stock, max_stock, image_url FROM products WHERE id = ?",
        [id]
      );

      if (products.length === 0) {
        return res.status(404).json({
          success: false,
          message: "Product not found"
        });
      }

      res.status(200).json({
        success: true,
        data: products[0]
      });
    } finally {
      connection.release();
    }
  } catch (err) {
    console.error("Get product by ID error:", err);
    res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
};

const createProduct = async (req, res) => {
  try {
    const { name, description, price, stock, image_url } = req.body;

    if (!name || !price) {
      return res.status(400).json({
        success: false,
        message: "Name and price are required"
      });
    }

    if (isNaN(price) || price < 0) {
      return res.status(400).json({
        success: false,
        message: "Price must be a positive number"
      });
    }

    const connection = await pool.getConnection();

    try {
      const [result] = await connection.execute(
        "INSERT INTO products (name, description, price, stock, image_url) VALUES (?, ?, ?, ?, ?)",
        [name, description || null, price, stock || 0, image_url || null]
      );

      res.status(201).json({
        success: true,
        message: "Product created successfully",
        data: {
          id: result.insertId,
          name,
          description: description || null,
          price,
          stock: stock || 0,
          image_url: image_url || null
        }
      });
    } finally {
      connection.release();
    }
  } catch (err) {
    console.error("Create product error:", err);
    res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
};

const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, price, stock, image_url } = req.body;

    if (!id || isNaN(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid product ID"
      });
    }

    if (price !== undefined && (isNaN(price) || price < 0)) {
      return res.status(400).json({
        success: false,
        message: "Price must be a positive number"
      });
    }

    const connection = await pool.getConnection();

    try {
      const [existingProduct] = await connection.execute(
        "SELECT id FROM products WHERE id = ?",
        [id]
      );

      if (existingProduct.length === 0) {
        return res.status(404).json({
          success: false,
          message: "Product not found"
        });
      }

      const updates = [];
      const values = [];

      if (name !== undefined) {
        updates.push("name = ?");
        values.push(name);
      }
      if (description !== undefined) {
        updates.push("description = ?");
        values.push(description);
      }
      if (price !== undefined) {
        updates.push("price = ?");
        values.push(price);
      }
      if (stock !== undefined) {
        updates.push("stock = ?");
        values.push(stock);
      }
      if (image_url !== undefined) {
        updates.push("image_url = ?");
        values.push(image_url);
      }

      if (updates.length === 0) {
        return res.status(400).json({
          success: false,
          message: "No fields to update"
        });
      }

      values.push(id);

      await connection.execute(
        `UPDATE products SET ${updates.join(", ")} WHERE id = ?`,
        values
      );

      const [updatedProduct] = await connection.execute(
        "SELECT id, name, description, price, stock, image_url FROM products WHERE id = ?",
        [id]
      );

      res.status(200).json({
        success: true,
        message: "Product updated successfully",
        data: updatedProduct[0]
      });
    } finally {
      connection.release();
    }
  } catch (err) {
    console.error("Update product error:", err);
    res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
};

const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id || isNaN(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid product ID"
      });
    }

    const connection = await pool.getConnection();

    try {
      const [existingProduct] = await connection.execute(
        "SELECT id FROM products WHERE id = ?",
        [id]
      );

      if (existingProduct.length === 0) {
        return res.status(404).json({
          success: false,
          message: "Product not found"
        });
      }

      await connection.execute("DELETE FROM products WHERE id = ?", [id]);

      res.status(200).json({
        success: true,
        message: "Product deleted successfully"
      });
    } finally {
      connection.release();
    }
  } catch (err) {
    console.error("Delete product error:", err);
    res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
};

module.exports = {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct
};
