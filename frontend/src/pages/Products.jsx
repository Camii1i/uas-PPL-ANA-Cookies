import { useState, useEffect } from "react";
import productService from "../services/productService";
import formatRupiah from "../utils/currency";

export default function Products() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  
  // Simulated initial products catalog
  const [products, setProducts] = useState([]);

  // Fetch products from API
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await productService.getAllProducts();
        if (data && Array.isArray(data)) {
          const transformedProducts = data.map(product => ({
            id: product.id,
            name: product.name,
            description: product.description || "Freshly baked handcrafted bakery selection.",
            category: product.category || "Classic",
            price: parseFloat(product.price) || 0,
            stock: parseInt(product.stock) || 0,
            maxStock: parseInt(product.maxStock) || 100,
            status: product.status || (parseInt(product.stock) <= 20 ? "Low Stock" : "In Stock"),
            colorClass: product.colorClass || (parseInt(product.stock) <= 20 ? "bg-error" : "bg-secondary"),
            tagClass: product.tagClass || "bg-secondary-fixed/30 text-on-secondary-fixed-variant",
            image: product.image || "https://lh3.googleusercontent.com/aida-public/AB6AXuARNwEXgfR9_pDOqUPvhgr7GNrNU9LCVcPt6fpwluzX6qaJhoW54dCAqKP_B9ZX-_Ro8R-cM-sOOv-9bb8kVRwtbOIH25Eqw2A12gZui0vU0x2_MOSLWzgo5Twx4Kn5hCAeu_uu6BTzYis3hs__Njjiyr7UqcWShRQO9-TzXjoPrK6bkNeEcImisACGRYUaiJehySuHAlhcbc32f3FpgHb2bg1TXy2d4DeN8VKw0fh6hW3Ci_0DLWLrqQ"
          }));
          setProducts(transformedProducts);
        }
      } catch (error) {
        console.error("Failed to fetch products:", error);
      }
    };

    fetchProducts();
  }, []);

  // Modal control states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState("add"); // "add" or "edit"
  const [editingId, setEditingId] = useState(null);

  // Form states
  const [formName, setFormName] = useState("");
  const [formDesc, setFormDesc] = useState("");
  const [formCategory, setFormCategory] = useState("Classic");
  const [formPrice, setFormPrice] = useState("");
  const [formStock, setFormStock] = useState("");
  const [formImage, setFormImage] = useState("");

  const openAddModal = () => {
    setModalMode("add");
    setFormName("");
    setFormDesc("");
    setFormCategory("Classic");
    setFormPrice("");
    setFormStock("");
    setFormImage("");
    setIsModalOpen(true);
  };

  const openEditModal = (product) => {
    setModalMode("edit");
    setEditingId(product.id);
    setFormName(product.name);
    setFormDesc(product.description);
    setFormCategory(product.category);
    setFormPrice(product.price.toString());
    setFormStock(product.stock.toString());
    setFormImage(product.image || "");
    setIsModalOpen(true);
  };

  const handleSaveProduct = (e) => {
    e.preventDefault();
    if (!formName || !formPrice || !formStock) {
      alert("Please fill in required fields.");
      return;
    }

    const priceNum = parseFloat(formPrice);
    const stockNum = parseInt(formStock, 10);
    const stockStatus = stockNum <= 20 ? "Low Stock" : "In Stock";
    const colorClass = stockNum <= 20 ? "bg-error" : (formCategory === "Exotic" ? "bg-tertiary" : "bg-secondary");
    const tagClass = formCategory === "Exotic" || formCategory === "Nutty" 
      ? "bg-tertiary-fixed/30 text-on-tertiary-fixed-variant"
      : "bg-secondary-fixed/30 text-on-secondary-fixed-variant";

    const defaultImage = "https://lh3.googleusercontent.com/aida-public/AB6AXuARNwEXgfR9_pDOqUPvhgr7GNrNU9LCVcPt6fpwluzX6qaJhoW54dCAqKP_B9ZX-_Ro8R-cM-sOOv-9bb8kVRwtbOIH25Eqw2A12gZui0vU0x2_MOSLWzgo5Twx4Kn5hCAeu_uu6BTzYis3hs__Njjiyr7UqcWShRQO9-TzXjoPrK6bkNeEcImisACGRYUaiJehySuHAlhcbc32f3FpgHb2bg1TXy2d4DeN8VKw0fh6hW3Ci_0DLWLrqQ";

    if (modalMode === "add") {
      const newProduct = {
        id: products.length + 1,
        name: formName,
        description: formDesc || "Freshly baked handcrafted bakery selection.",
        category: formCategory,
        price: priceNum,
        stock: stockNum,
        maxStock: 100,
        status: stockStatus,
        colorClass,
        tagClass,
        image: formImage || defaultImage
      };
      setProducts([...products, newProduct]);
    } else {
      setProducts(products.map(p => p.id === editingId ? {
        ...p,
        name: formName,
        description: formDesc,
        category: formCategory,
        price: priceNum,
        stock: stockNum,
        status: stockStatus,
        colorClass,
        tagClass,
        image: formImage || p.image
      } : p));
    }

    setIsModalOpen(false);
  };

  const handleDeleteProduct = (id) => {
    if (confirm("Are you sure you want to delete this product from stock catalog?")) {
      setProducts(products.filter(p => p.id !== id));
    }
  };

  // Filter & Search logic
  const filteredProducts = products.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          p.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "All" || p.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="p-md md:p-margin-desktop space-y-lg animate-in fade-in duration-300">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-md">
        <div>
          <h2 className="font-headline-md text-[32px] text-primary mb-1">Products</h2>
          <nav className="flex items-center gap-2 text-on-surface-variant font-label-md text-label-md">
            <span className="hover:text-primary cursor-pointer">Dashboard</span>
            <span className="material-symbols-outlined text-[14px]">chevron_right</span>
            <span className="text-primary font-bold">Inventory</span>
          </nav>
        </div>
        <button 
          onClick={openAddModal}
          className="bg-primary-container text-white px-6 py-3 rounded-xl flex items-center gap-2 font-label-md text-label-md shadow-md hover:bg-primary transition-all active:scale-95 group cursor-pointer"
        >
          <span className="material-symbols-outlined group-hover:rotate-90 transition-transform">add</span>
          New Batch
        </button>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-gutter">
        <div className="bg-white p-md rounded-[24px] premium-shadow border border-outline-variant/10">
          <div className="flex justify-between items-start mb-4">
            <div className="w-12 h-12 bg-primary-fixed rounded-2xl flex items-center justify-center text-primary">
              <span className="material-symbols-outlined">inventory_2</span>
            </div>
            <span className="text-on-secondary-container bg-secondary-fixed rounded-full px-3 py-1 font-label-md text-[10px]">+5%</span>
          </div>
          <p className="text-on-surface-variant font-label-md mb-1">Total SKU</p>
          <h3 className="font-headline-sm text-headline-sm text-on-surface">{products.length} Items</h3>
        </div>

        <div className="bg-white p-md rounded-[24px] premium-shadow border border-outline-variant/10">
          <div className="flex justify-between items-start mb-4">
            <div className="w-12 h-12 bg-tertiary-fixed rounded-2xl flex items-center justify-center text-tertiary">
              <span className="material-symbols-outlined">warning</span>
            </div>
            <span className="text-error bg-error-container rounded-full px-3 py-1 font-label-md text-[10px]">Critical</span>
          </div>
          <p className="text-on-surface-variant font-label-md mb-1">Low Stock Alerts</p>
          <h3 className="font-headline-sm text-headline-sm text-on-surface">
            {products.filter(p => p.stock <= 20).length} Batches
          </h3>
        </div>

        <div className="bg-primary p-md rounded-[24px] premium-shadow text-on-primary">
          <div className="flex justify-between items-start mb-4">
            <div className="w-12 h-12 bg-on-primary/10 rounded-2xl flex items-center justify-center">
              <span className="material-symbols-outlined text-white">trending_up</span>
            </div>
          </div>
          <p className="opacity-80 font-label-md mb-1">Weekly Production</p>
          <h3 className="font-headline-sm text-headline-sm">2,480 Units</h3>
        </div>
      </div>

      {/* Product Table Container */}
      <div className="bg-white rounded-[24px] premium-shadow border border-outline-variant/10 overflow-hidden">
        {/* Table Filters */}
        <div className="p-md border-b border-outline-variant/20 flex flex-col md:flex-row justify-between items-center gap-md">
          <div className="flex items-center gap-sm">
            <h4 className="font-title-lg text-title-lg text-primary">Master Catalog</h4>
            <span className="text-on-surface-variant font-label-md bg-surface-container px-2 py-0.5 rounded">v2.4</span>
          </div>

          <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
            {/* Search Input inside Catalog bar */}
            <div className="relative flex-1 md:w-64 min-w-[200px]">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-sm">search</span>
              <input
                className="w-full bg-surface-container-low border-none rounded-lg py-1.5 pl-8 pr-4 text-xs font-body-md focus:ring-1 focus:ring-primary"
                placeholder="Search catalog..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-3 py-1.5 bg-surface-container-low border-none rounded-lg text-on-surface-variant font-label-md text-xs cursor-pointer focus:ring-1 focus:ring-primary"
            >
              <option value="All">All Categories</option>
              <option value="Classic">Classic</option>
              <option value="Signature">Signature</option>
              <option value="Exotic">Exotic</option>
              <option value="Nutty">Nutty</option>
            </select>
          </div>
        </div>

        {/* Responsive Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr class="bg-surface-container-low/50">
                <th className="px-md py-4 font-label-md text-label-md text-on-surface-variant uppercase tracking-wider">Product</th>
                <th className="px-md py-4 font-label-md text-label-md text-on-surface-variant uppercase tracking-wider">Category</th>
                <th className="px-md py-4 font-label-md text-label-md text-on-surface-variant uppercase tracking-wider">Price</th>
                <th className="px-md py-4 font-label-md text-label-md text-on-surface-variant uppercase tracking-wider">Stock Status</th>
                <th className="px-md py-4 font-label-md text-label-md text-on-surface-variant uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/10">
              {filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-md py-8 text-center text-on-surface-variant font-body-md">
                    No products found matching the query.
                  </td>
                </tr>
              ) : (
                filteredProducts.map((p) => (
                  <tr key={p.id} className="hover:bg-surface-bright transition-colors group">
                    <td className="px-md py-md">
                      <div className="flex items-center gap-md">
                        <div className="w-14 h-14 rounded-xl overflow-hidden shadow-sm flex-shrink-0 bg-surface-container">
                          <img 
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" 
                            src={p.image} 
                            alt={p.name} 
                          />
                        </div>
                        <div>
                          <p className="font-body-lg text-on-surface font-semibold">{p.name}</p>
                          <p className="text-body-md text-on-surface-variant opacity-70 truncate max-w-[240px]">{p.description}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-md py-md">
                      <span className={`font-label-md text-label-md px-3 py-1 rounded-full ${p.tagClass}`}>
                        {p.category}
                      </span>
                    </td>
                    <td className="px-md py-md font-label-md text-label-md text-primary">{formatRupiah(p.price)}</td>
                    <td className="px-md py-md">
                      <div className="flex flex-col gap-1">
                        <span className={`font-label-md text-label-md ${p.stock <= 20 ? "text-error font-semibold" : "text-on-surface"}`}>
                          {p.stock} In Stock
                        </span>
                        <div className="w-24 h-1.5 bg-surface-container rounded-full overflow-hidden">
                          <div className={`h-full ${p.colorClass}`} style={{ width: `${Math.min((p.stock / p.maxStock) * 100, 100)}%` }}></div>
                        </div>
                      </div>
                    </td>
                    <td className="px-md py-md text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button 
                          onClick={() => openEditModal(p)}
                          className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-primary-fixed/50 text-on-surface-variant transition-colors cursor-pointer"
                        >
                          <span className="material-symbols-outlined">edit</span>
                        </button>
                        <button 
                          onClick={() => handleDeleteProduct(p.id)}
                          className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-error-container/50 text-error transition-colors cursor-pointer"
                        >
                          <span className="material-symbols-outlined">delete</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="px-md py-4 bg-surface-container-low/30 border-t border-outline-variant/10 flex items-center justify-between">
          <p className="font-label-md text-label-md text-on-surface-variant">
            Showing {filteredProducts.length} of {products.length} products
          </p>
          <div className="flex items-center gap-1">
            <button className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-surface-container text-on-surface-variant disabled:opacity-30 cursor-pointer" disabled>
              <span className="material-symbols-outlined">chevron_left</span>
            </button>
            <button className="w-8 h-8 flex items-center justify-center rounded-lg bg-primary text-on-primary font-label-md cursor-pointer">1</button>
            <button className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-surface-container text-on-surface-variant font-label-md cursor-pointer" disabled>2</button>
            <button className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-surface-container text-on-surface-variant cursor-pointer" disabled>
              <span className="material-symbols-outlined">chevron_right</span>
            </button>
          </div>
        </div>
      </div>

      {/* Promotion Recommendation Section */}
      <div className="mt-lg relative overflow-hidden rounded-[32px] p-xl glass-card premium-shadow flex flex-col md:flex-row items-center gap-lg">
        <div className="relative z-10 flex-1 text-center md:text-left">
          <span className="bg-secondary/10 text-secondary px-4 py-1 rounded-full font-label-md text-label-md uppercase tracking-widest mb-4 inline-block">Production Insight</span>
          <h3 className="font-headline-md text-[32px] text-primary mb-4 font-bold">Optimize Your Oven Schedule</h3>
          <p className="text-body-lg text-on-surface-variant mb-6 max-w-xl">Our smart analytics suggests increasing Red Velvet production by 15% this weekend to meet projected demand based on local events.</p>
          <div className="flex flex-wrap gap-4 justify-center md:justify-start">
            <button 
              onClick={() => alert("Insight applied successfully!")}
              className="bg-primary text-on-primary px-6 py-3 rounded-xl font-label-md shadow-md hover:brightness-110 transition-all cursor-pointer"
            >
              Apply Recommendation
            </button>
            <button 
              onClick={() => alert("Redirecting to full analytics logs...")}
              className="border border-primary text-primary px-6 py-3 rounded-xl font-label-md hover:bg-primary/5 transition-all cursor-pointer"
            >
              View Full Analytics
            </button>
          </div>
        </div>
        <div className="relative w-full md:w-1/3 aspect-square max-w-[280px]">
          <div className="absolute inset-0 bg-primary/5 rounded-full scale-110 blur-3xl"></div>
          <img 
            className="relative z-10 w-full h-full object-cover rounded-full shadow-xl" 
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuDXnnp-whbqmDSZ3TQj8PEtys3Ycm-Gxo2n6mjba9rne_ZKcGfl6w08pqtGxrt1iQRdHCuPYUjdApemYgH9zmOwx6j3drMM2JMIsODUea9rIrW1PS6QsnI5-nKAaFG945LcquMVDHfyShqz_Ii5rOgggcMrbAhJRq9v3vovqxchGmCZVTBt7MRB6KWUEu6xqevxh65ZwuP_S0K7yzt8_vaVWBIlU30Gcu19CZ7XhhnUAStHvUABdX-l5A" 
            alt="Artistic bakery dough" 
          />
        </div>
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl"></div>
      </div>

      {/* Add / Edit Product Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setIsModalOpen(false)}></div>
          
          {/* Modal Container */}
          <div className="relative bg-surface-container-lowest rounded-3xl shadow-2xl border border-outline-variant/20 p-md md:p-lg w-full max-w-[540px] z-10 animate-in zoom-in-95 duration-200 flex flex-col gap-md">
            <div className="flex justify-between items-center">
              <h3 className="font-headline-sm text-[24px] text-primary font-bold">
                {modalMode === "add" ? "Create New Product Batch" : "Edit Catalog Item"}
              </h3>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="w-10 h-10 rounded-full hover:bg-surface-container-low flex items-center justify-center text-on-surface-variant cursor-pointer"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <form onSubmit={handleSaveProduct} className="flex flex-col gap-4 text-left">
              {/* Product Name */}
              <div className="flex flex-col gap-1">
                <label className="font-label-md text-label-md text-primary uppercase">Product Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Oatmeal Cranberry"
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  className="w-full px-4 py-2.5 bg-surface-bright border border-outline-variant/30 rounded-xl text-sm"
                />
              </div>

              {/* Category */}
              <div className="flex flex-col gap-1">
                <label className="font-label-md text-label-md text-primary uppercase">Category</label>
                <select
                  value={formCategory}
                  onChange={(e) => setFormCategory(e.target.value)}
                  className="w-full px-4 py-2.5 bg-surface-bright border border-outline-variant/30 rounded-xl text-sm"
                >
                  <option value="Classic">Classic</option>
                  <option value="Signature">Signature</option>
                  <option value="Exotic">Exotic</option>
                  <option value="Nutty">Nutty</option>
                </select>
              </div>

              {/* Price & Stock */}
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1">
                  <label className="font-label-md text-label-md text-primary uppercase">Price (Rp) *</label>
                  <input
                    type="number"
                    step="100"
                    min="0"
                    required
                    placeholder="12500"
                    value={formPrice}
                    onChange={(e) => setFormPrice(e.target.value)}
                    className="w-full px-4 py-2.5 bg-surface-bright border border-outline-variant/30 rounded-xl text-sm"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="font-label-md text-label-md text-primary uppercase">Stock Quantity *</label>
                  <input
                    type="number"
                    min="0"
                    required
                    placeholder="50"
                    value={formStock}
                    onChange={(e) => setFormStock(e.target.value)}
                    className="w-full px-4 py-2.5 bg-surface-bright border border-outline-variant/30 rounded-xl text-sm"
                  />
                </div>
              </div>

              {/* Description */}
              <div className="flex flex-col gap-1">
                <label className="font-label-md text-label-md text-primary uppercase">Description</label>
                <textarea
                  placeholder="Provide deep descriptions about ingredients and taste profiles..."
                  value={formDesc}
                  onChange={(e) => setFormDesc(e.target.value)}
                  rows="3"
                  className="w-full px-4 py-2.5 bg-surface-bright border border-outline-variant/30 rounded-xl text-sm"
                />
              </div>

              {/* Image URL */}
              <div className="flex flex-col gap-1">
                <label className="font-label-md text-label-md text-primary uppercase">Image URL (Optional)</label>
                <input
                  type="url"
                  placeholder="https://example.com/cookie.jpg"
                  value={formImage}
                  onChange={(e) => setFormImage(e.target.value)}
                  className="w-full px-4 py-2.5 bg-surface-bright border border-outline-variant/30 rounded-xl text-sm"
                />
              </div>

              {/* CTA Buttons */}
              <div className="flex justify-end gap-3 mt-4">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-2.5 border border-outline-variant/50 rounded-xl font-label-md text-label-md hover:bg-surface-container transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-primary text-on-primary rounded-xl font-label-md text-label-md hover:brightness-110 transition-all cursor-pointer"
                >
                  {modalMode === "add" ? "Add to Catalog" : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="py-md border-t border-outline-variant/10 text-on-surface-variant text-center md:text-left mt-lg">
        <p className="font-label-md text-label-md">© 2026 SweetCrumbs Bakery Admin. Handcrafted for excellence.</p>
      </footer>
    </div>
  );
}
