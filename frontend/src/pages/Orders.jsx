import { useState, useEffect } from "react";
import orderService from "../services/orderService";
import formatRupiah from "../utils/currency";

export default function Orders() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  // Simulated orders catalog
  const [orders, setOrders] = useState([]);

  // Helper function to get status styling
  const getStatusStyling = (status) => {
    const statusMap = {
      "Processing": {
        statusClass: "bg-[#fce8d5] text-[#714614] border-[#714614]/10",
        dotClass: "bg-[#714614]"
      },
      "Completed": {
        statusClass: "bg-[#e7f3e8] text-[#2e7d32] border-[#2e7d32]/10",
        dotClass: "bg-[#2e7d32]"
      },
      "Pending": {
        statusClass: "bg-[#fff4e5] text-[#ff9800] border-[#ff9800]/10",
        dotClass: "bg-[#ff9800]"
      },
      "Shipped": {
        statusClass: "bg-[#e3f2fd] text-[#1976d2] border-[#1976d2]/10",
        dotClass: "bg-[#1976d2]"
      }
    };
    return statusMap[status] || {
      statusClass: "bg-[#fff4e5] text-[#ff9800] border-[#ff9800]/10",
      dotClass: "bg-[#ff9800]"
    };
  };

  // Helper function to get background color class based on customer name
  const getBgClass = (index) => {
    const bgClasses = [
      "bg-secondary-fixed text-on-secondary-fixed",
      "bg-primary-fixed text-on-primary-fixed",
      "bg-surface-variant text-on-surface-variant",
      "bg-[#fdf2f2] text-[#9b1c1c]"
    ];
    return bgClasses[index % bgClasses.length];
  };

  // Get initials from customer name
  const getInitials = (name) => {
    return name.split(" ").map(n => n[0]).join("").toUpperCase();
  };

  // Fetch orders from API
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const data = await orderService.getAllOrders();
        if (data && Array.isArray(data)) {
          const transformedOrders = data.map((order, index) => {
            const statusStyling = getStatusStyling(order.status || "Pending");
            const customerName = order.customer_name || order.customerName || "Unknown Customer";
            return {
              id: order.id,
              orderNumber: order.order_number || "",
              customerName,
              customerEmail: order.customer_email || order.customerEmail || "",
              initials: getInitials(customerName),
              bgClass: getBgClass(index),
              date: order.created_at
                ? new Date(order.created_at).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })
                : (order.date || new Date().toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })),
              total: parseFloat(order.total_price ?? order.total) || 0,
              status: order.status || "Pending",
              statusClass: statusStyling.statusClass,
              dotClass: statusStyling.dotClass,
              items: order.items || []
            };
          });
          setOrders(transformedOrders);
        }
      } catch (error) {
        console.error("Failed to fetch orders:", error);
      }
    };

    fetchOrders();
  }, []);

  // Modal control states
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openOrderDetails = (order) => {
    setSelectedOrder(order);
    setIsModalOpen(true);
  };

  const updateOrderStatus = (orderId, newStatus) => {
    let statusClass = "";
    let dotClass = "";
    
    switch (newStatus) {
      case "Processing":
        statusClass = "bg-[#fce8d5] text-[#714614] border-[#714614]/10";
        dotClass = "bg-[#714614]";
        break;
      case "Completed":
        statusClass = "bg-[#e7f3e8] text-[#2e7d32] border-[#2e7d32]/10";
        dotClass = "bg-[#2e7d32]";
        break;
      case "Pending":
        statusClass = "bg-[#fff4e5] text-[#ff9800] border-[#ff9800]/10";
        dotClass = "bg-[#ff9800]";
        break;
      case "Shipped":
        statusClass = "bg-[#e3f2fd] text-[#1976d2] border-[#1976d2]/10";
        dotClass = "bg-[#1976d2]";
        break;
      default:
        statusClass = "bg-[#fff4e5] text-[#ff9800] border-[#ff9800]/10";
        dotClass = "bg-[#ff9800]";
    }

    const updatedOrders = orders.map(o => o.id === orderId ? {
      ...o,
      status: newStatus,
      statusClass,
      dotClass
    } : o);

    setOrders(updatedOrders);
    
    // Update selected order details inside modal
    if (selectedOrder && selectedOrder.id === orderId) {
      setSelectedOrder({
        ...selectedOrder,
        status: newStatus,
        statusClass,
        dotClass
      });
    }
  };

  const handleExportManifest = () => {
    alert("Exporting order manifest file...");
  };

  // Filter & Search logic
  const filteredOrders = orders.filter(o => {
    const matchesSearch = o.customerName.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          o.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          o.customerEmail.toLowerCase().includes(searchQuery.toLowerCase());
    
    let matchesStatus = true;
    if (statusFilter === "In Production") {
      matchesStatus = o.status === "Processing" || o.status === "Pending";
    } else if (statusFilter === "Delivered") {
      matchesStatus = o.status === "Completed" || o.status === "Shipped";
    }
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="p-6 md:p-12 space-y-10 animate-in fade-in duration-300">
      {/* Breadcrumbs & Action Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="font-headline-md text-[32px] text-primary">Order Management</h1>
          <p className="font-body-md text-on-surface-variant mt-1">Review and manage your daily gourmet cookie batches.</p>
        </div>
        <div className="flex items-center gap-4">
          {/* Quick search input */}
          <div className="relative w-48 md:w-64">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-sm">search</span>
            <input
              className="w-full bg-surface-container border-none rounded-xl py-2 pl-9 pr-4 text-xs font-body-md focus:ring-1 focus:ring-primary"
              placeholder="Search orders..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <button 
            onClick={handleExportManifest}
            className="px-6 py-2.5 bg-primary text-on-primary rounded-xl font-label-md text-label-md hover:shadow-lg transition-all flex items-center gap-2 active:scale-95 cursor-pointer"
          >
            <span className="material-symbols-outlined text-[20px]">download</span>
            Export Manifest
          </button>
        </div>
      </div>

      {/* Bento Stats Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
        <div className="bg-surface-container-lowest p-6 rounded-[24px] card-shadow flex items-center gap-6 border border-outline-variant/20">
          <div className="w-12 h-12 shrink-0 bg-secondary-container/30 text-secondary rounded-2xl flex items-center justify-center">
            <span className="material-symbols-outlined">receipt_long</span>
          </div>
          <div className="min-w-0">
            <p className="font-label-md text-label-md uppercase text-on-surface-variant/70 truncate">Total Orders</p>
            <p className="font-headline-sm text-headline-sm text-on-surface">1,284</p>
          </div>
        </div>

        <div className="bg-surface-container-lowest p-6 rounded-[24px] card-shadow flex items-center gap-6 border border-outline-variant/20">
          <div className="w-12 h-12 shrink-0 bg-tertiary-container/20 text-tertiary rounded-2xl flex items-center justify-center">
            <span className="material-symbols-outlined">skillet</span>
          </div>
          <div className="min-w-0">
            <p className="font-label-md text-label-md uppercase text-on-surface-variant/70 truncate">Active Batches</p>
            <p className="font-headline-sm text-headline-sm text-on-surface">24</p>
          </div>
        </div>

        <div className="bg-surface-container-lowest p-6 rounded-[24px] card-shadow flex items-center gap-6 border border-outline-variant/20">
          <div className="w-12 h-12 shrink-0 bg-primary-fixed text-on-primary-fixed-variant rounded-2xl flex items-center justify-center">
            <span className="material-symbols-outlined">local_shipping</span>
          </div>
          <div className="min-w-0">
            <p className="font-label-md text-label-md uppercase text-on-surface-variant/70 truncate">Ready to Ship</p>
            <p className="font-headline-sm text-headline-sm text-on-surface">112</p>
          </div>
        </div>

        <div className="bg-surface-container-lowest p-6 rounded-[24px] card-shadow flex items-center gap-6 border border-outline-variant/20">
          <div className="w-12 h-12 shrink-0 bg-error-container/40 text-error rounded-2xl flex items-center justify-center">
            <span className="material-symbols-outlined">pending</span>
          </div>
          <div className="min-w-0">
            <p className="font-label-md text-label-md uppercase text-on-surface-variant/70 truncate">Pending</p>
            <p className="font-headline-sm text-headline-sm text-on-surface">12</p>
          </div>
        </div>
      </div>

      {/* Main Order Table Card */}
      <div className="bg-surface-container-lowest rounded-[24px] card-shadow border border-outline-variant/20 overflow-hidden">
        <div className="px-6 py-6 border-b border-outline-variant/20 flex flex-col sm:flex-row justify-between items-center gap-4">
          <h2 className="font-title-lg text-title-lg text-primary font-bold">Recent Orders</h2>
          <div className="flex gap-2 bg-surface-container p-1 rounded-xl">
            <button
              onClick={() => setStatusFilter("All")}
              className={`px-4 py-1.5 font-label-md text-label-md rounded-lg transition-all cursor-pointer ${
                statusFilter === "All" ? "bg-white text-primary shadow-sm" : "text-on-surface-variant hover:text-primary"
              }`}
            >
              All Orders
            </button>
            <button
              onClick={() => setStatusFilter("In Production")}
              className={`px-4 py-1.5 font-label-md text-label-md rounded-lg transition-all cursor-pointer ${
                statusFilter === "In Production" ? "bg-white text-primary shadow-sm" : "text-on-surface-variant hover:text-primary"
              }`}
            >
              In Production
            </button>
            <button
              onClick={() => setStatusFilter("Delivered")}
              className={`px-4 py-1.5 font-label-md text-label-md rounded-lg transition-all cursor-pointer ${
                statusFilter === "Delivered" ? "bg-white text-primary shadow-sm" : "text-on-surface-variant hover:text-primary"
              }`}
            >
              Delivered
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-surface-container-low/50">
                <th className="px-6 py-4 font-label-md text-label-md uppercase text-on-surface-variant/70 tracking-wider">Order ID</th>
                <th className="px-6 py-4 font-label-md text-label-md uppercase text-on-surface-variant/70 tracking-wider">Customer</th>
                <th className="px-6 py-4 font-label-md text-label-md uppercase text-on-surface-variant/70 tracking-wider">Date</th>
                <th className="px-6 py-4 font-label-md text-label-md uppercase text-on-surface-variant/70 tracking-wider">Total</th>
                <th className="px-6 py-4 font-label-md text-label-md uppercase text-on-surface-variant/70 tracking-wider">Status</th>
                <th className="px-6 py-4 font-label-md text-label-md uppercase text-on-surface-variant/70 tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/20">
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-6 py-8 text-center text-on-surface-variant font-body-md">
                    No orders matching selected criteria.
                  </td>
                </tr>
              ) : (
                filteredOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-surface-container-low/30 transition-colors group">
                    <td className="px-6 py-5 font-label-md text-primary">{order.id}</td>
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-4">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${order.bgClass}`}>
                          {order.initials}
                        </div>
                        <div>
                          <p className="font-body-md text-on-surface font-semibold">{order.customerName}</p>
                          <p className="text-[12px] text-on-surface-variant/60 leading-none">{order.customerEmail}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5 font-body-md text-on-surface-variant">{order.date}</td>
                    <td className="px-6 py-5 font-body-md text-on-surface font-semibold">{formatRupiah(order.total)}</td>
                    <td className="px-6 py-5">
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[12px] font-semibold border ${order.statusClass}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${order.dotClass} ${order.status === "Processing" ? "animate-pulse" : ""}`}></span>
                        {order.status}
                      </span>
                    </td>
                    <td className="px-6 py-5 text-right">
                      <button 
                        onClick={() => openOrderDetails(order)}
                        className="p-2 text-on-surface-variant hover:text-primary hover:bg-primary-fixed/30 rounded-lg transition-all cursor-pointer"
                      >
                        <span className="material-symbols-outlined">visibility</span>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="px-6 py-4 bg-surface-container-low/30 flex items-center justify-between border-t border-outline-variant/20">
          <p className="font-body-md text-[12px] text-on-surface-variant">Showing {filteredOrders.length} of {orders.length} orders</p>
          <div className="flex items-center gap-2">
            <button className="p-2 text-on-surface-variant hover:text-primary disabled:opacity-50 cursor-pointer" disabled>
              <span className="material-symbols-outlined">chevron_left</span>
            </button>
            <div className="flex items-center gap-1">
              <button className="w-8 h-8 rounded-lg bg-primary text-on-primary font-label-md text-label-md cursor-pointer">1</button>
              <button className="w-8 h-8 rounded-lg hover:bg-surface-container text-on-surface font-label-md text-label-md cursor-pointer" disabled>2</button>
            </div>
            <button className="p-2 text-on-surface-variant hover:text-primary cursor-pointer" disabled>
              <span className="material-symbols-outlined">chevron_right</span>
            </button>
          </div>
        </div>
      </div>

      {/* Promotion / Atmosphere Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recipe/Batch Card */}
        <div className="lg:col-span-2 relative h-64 rounded-[24px] overflow-hidden group card-shadow">
          <div
            className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
            style={{
              backgroundImage: `url('https://lh3.googleusercontent.com/aida-public/AB6AXuDZZ9eJ4PAvldboqaciFehRQc6Rs2FcY0B7z0qLlVCdnEtpOOHVhgGPek0QC6wcbgo_xpswcJSaCbF5_Y5i_FPlRhrOyH8pAidb4AT8rwf5xzNViVpmg-HlhFBf1m5kQjtFC_j_w4bG3izFkQpYaJhnVTQFOr6jqE3ACKxUhKVs5JVADgSbWnc_8WCPesM3KLENWAYkUH9KEyGFN1rKKXrjqAR28QdbfCXGT29ul2rern7gLzUE1OEleg')`,
            }}
            alt="Artisanal chocolate chip cookies in progress"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-on-background/80 via-on-background/40 to-transparent flex flex-col justify-end p-6">
            <span className="px-3 py-1 bg-tertiary text-on-tertiary text-[10px] font-bold uppercase rounded-full w-fit mb-2">New Flavor Release</span>
            <h3 className="font-headline-sm text-headline-sm text-white font-bold">Caramel Sea Salt Batches</h3>
            <p className="font-body-md text-white/80 max-w-[28rem]">Upcoming peak season requires 20% higher production volume for the artisan collection.</p>
          </div>
        </div>

        {/* Support/Quick Action Card */}
        <div className="bg-primary-container text-on-primary-container p-6 rounded-[24px] flex flex-col justify-between card-shadow">
          <div>
            <span className="material-symbols-outlined text-[32px] mb-2 text-on-primary-container/80">bakery_dining</span>
            <h4 className="font-title-lg text-title-lg font-bold">Inventory Warning</h4>
            <p className="font-body-md mt-2 opacity-90">Madagascar Vanilla Bean stock is low. Consider ordering a restock before the weekend rush.</p>
          </div>
          <button 
            onClick={() => alert("Restock order placed with vanilla supplier!")}
            className="mt-6 w-full py-3 bg-on-primary-container text-primary-container font-label-md text-label-md rounded-xl hover:bg-white transition-all active:scale-95 cursor-pointer font-semibold"
          >
            Order Supplies
          </button>
        </div>
      </div>

      {/* Order Details & Actions Modal */}
      {isModalOpen && selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setIsModalOpen(false)}></div>
          
          <div className="relative bg-surface-container-lowest rounded-3xl shadow-2xl border border-outline-variant/20 p-6 md:p-10 w-full max-w-[500px] z-10 animate-in zoom-in-95 duration-200 flex flex-col gap-6 text-left">
            <div className="flex justify-between items-center border-b border-outline-variant/10 pb-3">
              <div>
                <h3 className="font-headline-sm text-[20px] text-primary font-bold">Order Details</h3>
                <p className="text-xs text-on-surface-variant font-mono">{selectedOrder.id}</p>
              </div>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="w-10 h-10 rounded-full hover:bg-surface-container-low flex items-center justify-center text-on-surface-variant cursor-pointer"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            {/* Customer info */}
            <div className="flex items-center gap-4">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm ${selectedOrder.bgClass}`}>
                {selectedOrder.initials}
              </div>
              <div>
                <p className="font-body-lg text-on-surface font-semibold">{selectedOrder.customerName}</p>
                <p className="text-xs text-on-surface-variant">{selectedOrder.customerEmail}</p>
              </div>
            </div>

            {/* Order Items */}
            <div className="space-y-2">
              <p className="font-label-md text-label-md text-primary uppercase">Items Manifest</p>
              <div className="border border-outline-variant/30 rounded-xl overflow-hidden divide-y divide-outline-variant/20 bg-surface-bright">
                {selectedOrder.items.map((item, idx) => (
                  <div key={idx} className="p-3 flex justify-between items-center text-xs">
                    <div>
                      <p className="font-semibold text-on-surface">{item.name}</p>
                      <p className="text-on-surface-variant">Qty: {item.quantity}</p>
                    </div>
                    <p className="font-semibold text-on-surface">{formatRupiah(item.quantity * item.price)}</p>
                  </div>
                ))}
                <div className="p-3 bg-surface-container-low/50 flex justify-between items-center text-xs font-bold border-t">
                  <p className="text-on-surface">Total Charge</p>
                  <p className="text-primary text-sm">{formatRupiah(selectedOrder.total)}</p>
                </div>
              </div>
            </div>

            {/* Modify Status */}
            <div className="flex flex-col gap-2">
              <p className="font-label-md text-label-md text-primary uppercase">Update Shipment Status</p>
              <div className="grid grid-cols-2 gap-2">
                {["Pending", "Processing", "Shipped", "Completed"].map((statusOption) => (
                  <button
                    key={statusOption}
                    type="button"
                    onClick={() => updateOrderStatus(selectedOrder.id, statusOption)}
                    className={`py-2 px-3 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                      selectedOrder.status === statusOption
                        ? "bg-primary text-on-primary border-primary shadow-sm"
                        : "bg-surface-bright text-on-surface-variant border-outline-variant/30 hover:bg-surface-container-low"
                    }`}
                  >
                    {statusOption}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-4 border-t border-outline-variant/10 pt-4">
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="px-5 py-2.5 bg-primary text-on-primary rounded-xl font-label-md text-label-md hover:brightness-110 transition-all w-full cursor-pointer text-center font-bold"
              >
                Close details
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}