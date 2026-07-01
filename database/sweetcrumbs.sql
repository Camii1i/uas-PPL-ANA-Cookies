-- Create database if not exists
CREATE DATABASE IF NOT EXISTS `sweetcrumbs_db` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE `sweetcrumbs_db`;

-- =========================================================================
-- DROP TABLES IF THEY EXIST (In reverse order of foreign key dependencies)
-- =========================================================================
DROP TABLE IF EXISTS `order_items`;
DROP TABLE IF EXISTS `orders`;
DROP TABLE IF EXISTS `products`;
DROP TABLE IF EXISTS `users`;

-- =========================================================================
-- 1. USERS TABLE
-- =========================================================================
CREATE TABLE `users` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(100) NOT NULL,
  `email` VARCHAR(150) NOT NULL UNIQUE,
  `password` VARCHAR(255) NOT NULL, -- To store hashed passwords (e.g., bcrypt hashes)
  `role` ENUM('ADMIN', 'BAKER', 'CUSTOMER') NOT NULL DEFAULT 'CUSTOMER',
  `avatar_url` TEXT DEFAULT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX `idx_users_email` (`email`),
  INDEX `idx_users_role` (`role`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =========================================================================
-- 2. PRODUCTS TABLE (Inventory)
-- =========================================================================
CREATE TABLE `products` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(100) NOT NULL,
  `description` TEXT DEFAULT NULL,
  `category` VARCHAR(50) NOT NULL DEFAULT 'Classic', -- e.g., Classic, Exotic, Signature, Nutty
  `price` DECIMAL(10,2) NOT NULL DEFAULT 0.00,
  `stock` INT NOT NULL DEFAULT 0,
  `max_stock` INT NOT NULL DEFAULT 100,
  `image_url` TEXT DEFAULT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX `idx_products_category` (`category`),
  INDEX `idx_products_price` (`price`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =========================================================================
-- 3. ORDERS TABLE
-- =========================================================================
CREATE TABLE `orders` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `user_id` INT NOT NULL, -- Relates to the customer placing the order
  `order_number` VARCHAR(50) NOT NULL UNIQUE, -- e.g., SC-9021, SC-9022
  `total_price` DECIMAL(10,2) NOT NULL DEFAULT 0.00,
  `status` ENUM('Pending', 'Processing', 'Shipped', 'Completed') NOT NULL DEFAULT 'Pending',
  `order_date` DATETIME NOT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  INDEX `idx_orders_number` (`order_number`),
  INDEX `idx_orders_status` (`status`),
  INDEX `idx_orders_date` (`order_date`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =========================================================================
-- 4. ORDER ITEMS TABLE (Junction Table)
-- =========================================================================
CREATE TABLE `order_items` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `order_id` INT NOT NULL,
  `product_id` INT NOT NULL,
  `quantity` INT NOT NULL CHECK (`quantity` > 0),
  `price` DECIMAL(10,2) NOT NULL, -- Stores historical price at purchase time
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  INDEX `idx_order_items_order` (`order_id`),
  INDEX `idx_order_items_product` (`product_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- =========================================================================
-- INSERT SAMPLE SEED DATA
-- =========================================================================

-- Seed Users (Bakers, Admins, and Customers)
-- Note: Dummy password hashes representing bcrypt values
INSERT INTO `users` (`name`, `email`, `password`, `role`, `avatar_url`) VALUES
('Chef Julia', 'chef@sweetcrumbs.com', '$2b$10$w3qI169kC.q78R8q0Z7K.O0uU1fQ1vXhXJq2h5k9eRj8gH2qFzWpG', 'ADMIN', 'https://lh3.googleusercontent.com/aida-public/AB6AXuDTDTw3T9gGZeBD3_Evt5SglerCDJb8OzX7nf5p4DpHpMId_OWFabRG3Tk-Y3mAuAivXvi_W2FcUo7GoxtFXDKJ-e-GltKputdmb5s4bIaJrK_vkheEE9MHeMqdhIsfX1R3a9NRxkErgEYXQUjIMM_6n8HJz5mx7lDXwf11PFj8rtSmEKViHM4NqXLn4V0dHsa9BmQeWrbwQUby1vCUruCSWjoGoL3DZZdy8jRyT3JqJFH8eBaZyD2o5w'),
('Chef Andre', 'andre@sweetcrumbs.com', '$2b$10$w3qI169kC.q78R8q0Z7K.O0uU1fQ1vXhXJq2h5k9eRj8gH2qFzWpG', 'BAKER', NULL),
('Jane Doe', 'jane.doe@example.com', '$2b$10$w3qI169kC.q78R8q0Z7K.O0uU1fQ1vXhXJq2h5k9eRj8gH2qFzWpG', 'CUSTOMER', NULL),
('Bill Smith', 'bill@smithbakery.com', '$2b$10$w3qI169kC.q78R8q0Z7K.O0uU1fQ1vXhXJq2h5k9eRj8gH2qFzWpG', 'CUSTOMER', NULL),
('Alice Miller', 'alice@wonderland.co', '$2b$10$w3qI169kC.q78R8q0Z7K.O0uU1fQ1vXhXJq2h5k9eRj8gH2qFzWpG', 'CUSTOMER', NULL),
('Robert Jones', 'rj@techhub.com', '$2b$10$w3qI169kC.q78R8q0Z7K.O0uU1fQ1vXhXJq2h5k9eRj8gH2qFzWpG', 'CUSTOMER', NULL);

-- Seed Products (Cookie Catalog)
INSERT INTO `products` (`id`, `name`, `description`, `category`, `price`, `stock`, `max_stock`, `image_url`) VALUES
(1, 'Choco Chip Cookies', 'Classic recipe with premium sea salt and dark chocolate.', 'Classic', 12.00, 50, 100, 'https://lh3.googleusercontent.com/aida-public/AB6AXuARNwEXgfR9_pDOqUPvhgr7GNrNU9LCVcPt6fpwluzX6qaJhoW54dCAqKP_B9ZX-_Ro8R-cM-sOOv-9bb8kVRwtbOIH25Eqw2A12gZui0vU0x2_MOSLWzgo5Twx4Kn5hCAeu_uu6BTzYis3hs__Njjiyr7UqcWShRQO9-TzXjoPrK6bkNeEcImisACGRYUaiJehySuHAlhcbc32f3FpgHb2bg1TXy2d4DeN8VKw0fh6hW3Ci_0DLWLrqQ'),
(2, 'Matcha Cookies', 'Ceremonial grade matcha with white chocolate swirls.', 'Exotic', 14.00, 30, 100, 'https://lh3.googleusercontent.com/aida-public/AB6AXuAs6AxUzVZKZMe6fGEDz0-Nfw4e4JmlTYTQWRKOYjHwylZTtZlKsyLn0-U3zGNPB9d1t7As3bwzjdeY_SpEIL7VLxpLH8R1Dv7diDGswmkMoqc-gWynIBsUNdFfyyudUO5BR89HNRfcg2UczyvJVHCcxQg9zLBSjexh-bUa06V-cUFxTjP1fGg4Is8EMBfXhEMAaUq36wPeXf-5lndTCMulywIlFmek0vwyKaEDrYAmqHXop0oEpK81A'),
(3, 'Red Velvet', 'Cocoa-infused red velvet with a cream cheese core.', 'Signature', 13.50, 45, 100, 'https://lh3.googleusercontent.com/aida-public/AB6AXuCuzoQbndA1jWgCuSXDu-F8qmz4H3XysydvcjVdkYUqpUDQDYX5GCbo-QHAnjLAgN_-Xg3OrzkTzlHeNwVH1YJ14Axqceq7c2yFnaJUmNkBUu2YyDwarv4N8muM1wq7YQuJWEX43RjGf7GhwLyWL3LslfJHdmXU9S1aqTCmCbt8RLiQYtYvvWgbYMXVt4GGZy0b-qtmeVG7ZypopN_WBwBTncxQJ3K4TUpMv_Vz0LhhJRZ7f7ZjUeDPZA'),
(4, 'Double Chocolate', 'Double the decadence with 70% dark cocoa and chunks.', 'Signature', 15.00, 20, 100, 'https://lh3.googleusercontent.com/aida-public/AB6AXuAFW0Clfj6v_ncAF_SNYQT1gccNihg0Nz7KRiOR98BRjmKKDXJtxA14nJFawAmGBfRGFMfyMPuI4i_p1k4Z34HoDVBbtl_0kWcPfiYOnGHUTjm86dqbJawZq14ZqUEuSzkiavMhKdf6GlwGquUhaBNqQrwayqZi2PgIBnLWhlRDYOl0jzCXg2Dl5EPClZkdISzNKCf5GPwxIn_PC6xSXr_l8zp8jyBqkCHbMzU-nEhpd6qeUZLfatg4OA'),
(5, 'Almond Crunch', 'Toasted California almonds with a honey glaze crunch.', 'Nutty', 14.50, 35, 100, 'https://lh3.googleusercontent.com/aida-public/AB6AXuDIDnIRp2W-yqNhrny7fHOgTGEmY54wqwjrJ9QHWWk10uqzq_-Kc3XyMIZm39NG4VDHBNKjITDGH992blhrd3O9jgFGM7eP9XPyW17Co5VbmZpgqFWU3juIRXAA_G60gL4H7_EI-tP0xORn1Oh51zcZY25siAAy95xYb3GeLIXysBXyZ5IySIVrfX-c0OUsNL8wx2u9XDh0zWFMGSVlVgE_nrZQnH1kQVH3RSdSMuFIz_x9klRcaoU9Hg');

-- Seed Orders
-- Jane Doe: order_id 1
INSERT INTO `orders` (`id`, `user_id`, `order_number`, `total_price`, `status`, `order_date`) VALUES
(1, 3, 'SC-9021', 54.20, 'Processing', '2026-06-24 10:30:00'),
(2, 4, 'SC-9022', 128.50, 'Completed', '2026-06-24 09:15:00'),
(3, 5, 'SC-9023', 32.00, 'Pending', '2026-06-23 17:40:00'),
(4, 6, 'SC-9024', 215.75, 'Shipped', '2026-06-23 15:20:00');

-- Seed Order Items
INSERT INTO `order_items` (`order_id`, `product_id`, `quantity`, `price`) VALUES
-- SC-9021: 6x Choco Chip (Original price 12.00, discounted/modified is 6.00 each), 2x Almond Crunch (9.10 each) -> 36.00 + 18.20 = 54.20
(1, 1, 6, 6.00),
(1, 5, 2, 9.10),

-- SC-9022: 8x Double Chocolate (15.00 each), 1x Matcha (8.50 each) -> 120.00 + 8.50 = 128.50
(2, 4, 8, 15.00),
(2, 2, 1, 8.50),

-- SC-9023: 4x Choco Chip (8.00 each) -> 32.00
(3, 1, 4, 8.00),

-- SC-9024: 1x Double Chocolate (price 15.00), 10x Almond Crunch (price 14.50), 4x Matcha (price 13.93) -> 15 + 145 + 55.75 = 215.75
(4, 4, 1, 15.00),
(4, 5, 10, 14.50),
(4, 2, 4, 13.9375);
