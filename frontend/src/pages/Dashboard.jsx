import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const navigate = useNavigate();

  // Simulated state for statistics
  const [stats] = useState({
    totalProducts: 5,
    totalOrders: 124,
    totalRevenue: "$1,240.50",
    bestSeller: "Choco Chip",
  });

  // Simulated state for recent orders
  const [recentOrders, setRecentOrders] = useState([
    {
      id: "#SC-9021",
      customer: "Eleanor James",
      initials: "EJ",
      bgClass: "bg-secondary-fixed text-on-secondary-fixed",
      date: "Oct 24, 10:30 AM",
      total: "$45.00",
      status: "Baking",
      statusClass: "bg-orange-100 text-orange-700",
    },
    {
      id: "#SC-9022",
      customer: "Marcus Reid",
      initials: "MR",
      bgClass: "bg-primary-fixed text-on-primary-fixed",
      date: "Oct 24, 09:15 AM",
      total: "$32.50",
      status: "Delivered",
      statusClass: "bg-green-100 text-green-700",
    },
    {
      id: "#SC-9023",
      customer: "Sarah Hughes",
      initials: "SH",
      bgClass: "bg-tertiary-fixed text-on-tertiary-fixed",
      date: "Oct 23, 05:40 PM",
      total: "$120.00",
      status: "Pending",
      statusClass: "bg-blue-100 text-blue-700",
    },
    {
      id: "#SC-9024",
      customer: "Ben Thompson",
      initials: "BT",
      bgClass: "bg-outline-variant text-on-surface-variant",
      date: "Oct 23, 03:20 PM",
      total: "$18.90",
      status: "Delivered",
      statusClass: "bg-green-100 text-green-700",
    },
  ]);

  // Stock alert state
  const [alerts, setAlerts] = useState([
    { id: 1, name: "Butter Toffee", remaining: 12, critical: true, iconClass: "bg-error-container text-error" },
    { id: 2, name: "Oatmeal Raisin", remaining: 18, critical: false, iconClass: "bg-secondary-fixed text-on-secondary-container" },
  ]);

  const handleRestock = (id, name) => {
    alert(`Restocked ingredient batch for: ${name}!`);
    setAlerts(alerts.filter(a => a.id !== id));
  };

  const handleExportData = () => {
    alert("Exporting analytics manifest data...");
  };

  return (
    <div className="p-margin-desktop space-y-lg animate-in fade-in duration-300">
      {/* Welcome Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-md">
        <div>
          <h2 className="font-headline-md text-[32px] text-primary mb-1">Morning, Julia</h2>
          <p className="font-body-md text-body-md text-on-surface-variant">Here's what's baking in the SweetCrumbs oven today.</p>
        </div>
        <div className="flex gap-3">
          <button className="bg-surface-container-lowest border border-outline-variant/50 px-4 py-2 rounded-xl font-label-md text-label-md flex items-center gap-2 hover:bg-surface-variant transition-all card-shadow cursor-pointer">
            <span className="material-symbols-outlined text-[18px]">calendar_today</span>
            Oct 24, 2026
          </button>
          <button 
            onClick={handleExportData}
            className="bg-primary text-on-primary px-4 py-2 rounded-xl font-label-md text-label-md flex items-center gap-2 hover:brightness-110 active:scale-95 transition-all shadow-md cursor-pointer"
          >
            <span className="material-symbols-outlined text-[18px]">download</span>
            Export Data
          </button>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-gutter">
        {/* Total Products */}
        <div 
          onClick={() => navigate("/products")}
          className="bg-white p-md rounded-[24px] card-shadow flex flex-col justify-between hover:-translate-y-1 transition-transform cursor-pointer"
        >
          <div className="flex justify-between items-start mb-4">
            <div className="w-12 h-12 rounded-2xl bg-secondary-container flex items-center justify-center text-on-secondary-container">
              <span className="material-symbols-outlined">bakery_dining</span>
            </div>
            <span className="text-xs font-bold text-secondary uppercase bg-secondary-fixed px-2 py-1 rounded-full">+2 new</span>
          </div>
          <div>
            <p className="font-label-md text-label-md text-on-surface-variant uppercase tracking-wider mb-1">Total Products</p>
            <h3 className="font-headline-sm text-headline-sm text-on-surface">{stats.totalProducts}</h3>
          </div>
        </div>

        {/* Total Orders */}
        <div 
          onClick={() => navigate("/orders")}
          className="bg-white p-md rounded-[24px] card-shadow flex flex-col justify-between hover:-translate-y-1 transition-transform cursor-pointer"
        >
          <div className="flex justify-between items-start mb-4">
            <div className="w-12 h-12 rounded-2xl bg-tertiary-fixed flex items-center justify-center text-tertiary">
              <span className="material-symbols-outlined">shopping_cart</span>
            </div>
            <span className="text-xs font-bold text-tertiary uppercase bg-tertiary-fixed-dim px-2 py-1 rounded-full">Active</span>
          </div>
          <div>
            <p className="font-label-md text-label-md text-on-surface-variant uppercase tracking-wider mb-1">Total Orders</p>
            <h3 className="font-headline-sm text-headline-sm text-on-surface">{stats.totalOrders}</h3>
          </div>
        </div>

        {/* Total Revenue */}
        <div 
          onClick={() => navigate("/reports")}
          className="bg-white p-md rounded-[24px] card-shadow flex flex-col justify-between hover:-translate-y-1 transition-transform cursor-pointer border-t-4 border-primary"
        >
          <div className="flex justify-between items-start mb-4">
            <div className="w-12 h-12 rounded-2xl bg-primary-fixed flex items-center justify-center text-primary">
              <span className="material-symbols-outlined">payments</span>
            </div>
            <div className="flex items-center gap-1 text-green-600">
              <span className="material-symbols-outlined text-[16px]">trending_up</span>
              <span className="text-xs font-bold">12%</span>
            </div>
          </div>
          <div>
            <p className="font-label-md text-label-md text-on-surface-variant uppercase tracking-wider mb-1">Total Revenue</p>
            <h3 className="font-headline-sm text-headline-sm text-on-surface">{stats.totalRevenue}</h3>
          </div>
        </div>

        {/* Best Seller */}
        <div className="bg-white p-md rounded-[24px] card-shadow flex flex-col justify-between hover:-translate-y-1 transition-transform cursor-default">
          <div className="flex justify-between items-start mb-4">
            <div className="w-12 h-12 rounded-2xl bg-surface-container flex items-center justify-center text-secondary">
              <span className="material-symbols-outlined">star</span>
            </div>
            <span className="text-xs font-bold text-on-surface-variant uppercase opacity-50">Monthly</span>
          </div>
          <div>
            <p className="font-label-md text-label-md text-on-surface-variant uppercase tracking-wider mb-1">Best Seller</p>
            <h3 className="font-headline-sm text-headline-sm text-on-surface">{stats.bestSeller}</h3>
          </div>
        </div>
      </div>

      {/* Middle Section: Recent Orders & Stock Alert */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-gutter">
        {/* Recent Orders Table */}
        <div className="lg:col-span-2 bg-white rounded-[24px] card-shadow overflow-hidden flex flex-col">
          <div className="p-md flex justify-between items-center border-b border-outline-variant/20">
            <h3 className="font-headline-sm text-headline-sm text-on-surface">Recent Orders</h3>
            <button 
              onClick={() => navigate("/orders")}
              className="text-primary font-label-md text-label-md hover:underline cursor-pointer font-bold"
            >
              View All
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-surface-container-low">
                <tr>
                  <th className="px-md py-4 font-label-md text-label-md text-on-surface-variant uppercase">Customer</th>
                  <th className="px-md py-4 font-label-md text-label-md text-on-surface-variant uppercase">Date</th>
                  <th className="px-md py-4 font-label-md text-label-md text-on-surface-variant uppercase text-right">Total</th>
                  <th className="px-md py-4 font-label-md text-label-md text-on-surface-variant uppercase">Status</th>
                  <th className="px-md py-4"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant/10">
                {recentOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-surface-container-low/30 transition-colors group">
                    <td className="px-md py-5">
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs ${order.bgClass}`}>
                          {order.initials}
                        </div>
                        <span className="font-body-md text-body-md font-semibold">{order.customer}</span>
                      </div>
                    </td>
                    <td className="px-md py-5 font-body-md text-body-md text-on-surface-variant">{order.date}</td>
                    <td className="px-md py-5 font-body-md text-body-md text-on-surface text-right font-semibold">{order.total}</td>
                    <td className="px-md py-5">
                      <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest ${order.statusClass}`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="px-md py-5 text-right">
                      <button 
                        onClick={() => navigate("/orders")}
                        className="material-symbols-outlined text-on-surface-variant hover:text-primary transition-colors opacity-0 group-hover:opacity-100 cursor-pointer"
                      >
                        more_vert
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Stock Alert Section */}
        <div className="bg-white rounded-[24px] card-shadow flex flex-col">
          <div className="p-md border-b border-outline-variant/20">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-error">warning</span>
              <h3 className="font-headline-sm text-headline-sm text-on-surface">Stock Alert</h3>
            </div>
            <p className="font-body-md text-body-md text-on-surface-variant mt-1">Refill ingredients soon.</p>
          </div>
          <div className="p-md space-y-4 flex-1">
            {alerts.length === 0 ? (
              <div className="p-4 bg-green-50 rounded-2xl text-center text-green-700 text-xs font-semibold">
                ✨ All ingredients are fully stocked!
              </div>
            ) : (
              alerts.map((alertItem) => (
                <div 
                  key={alertItem.id} 
                  className={`flex items-center justify-between p-3 rounded-2xl border ${
                    alertItem.critical 
                      ? "bg-error-container/20 border-error/10" 
                      : "bg-surface-container-low border-outline-variant/30"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${alertItem.iconClass}`}>
                      <span className="material-symbols-outlined">inventory_2</span>
                    </div>
                    <div>
                      <p className="font-body-md text-body-md font-semibold">{alertItem.name}</p>
                      <p className={`text-xs font-bold uppercase ${alertItem.critical ? "text-error" : "text-on-secondary-container"}`}>
                        {alertItem.remaining} units left
                      </p>
                    </div>
                  </div>
                  <button 
                    onClick={() => handleRestock(alertItem.id, alertItem.name)}
                    className="text-primary hover:bg-primary/10 p-2 rounded-full transition-colors cursor-pointer"
                  >
                    <span className="material-symbols-outlined">add_shopping_cart</span>
                  </button>
                </div>
              ))
            )}

            {/* Promotion Banner */}
            <div className="mt-md relative rounded-[20px] overflow-hidden group h-32 flex items-end">
              <div
                className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                style={{
                  backgroundImage: `url('https://lh3.googleusercontent.com/aida-public/AB6AXuASPA8j2HTgrlfOWCtn2U9oQ03NUFBDo1Qwf79VDK-QeHK3iokReg-eY0YjgM0deyBVDia9fyEs25n71eKQmHOVKGjo2DiiA1yU4iBYWiUaItOUa_UjK0GF5wNaJgYyIBm-X7G-XH2ecqWrbpaYenC9nP5ehKRK7r7CtWWBkZaeIglubQjsCEkLhEcu82YI_LCSr2TwPr86QesCkmt31DNGM_2KWaq3uFzjIzbKeohPr_pSzcqcp5kAmA')`,
                }}
                alt="Baking fresh cookies decoration"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
              <div className="relative p-4 w-full">
                <p className="text-white font-headline-sm text-headline-sm text-sm">New Recipe Idea?</p>
                <p className="text-white/70 text-xs font-body-md">Draft your seasonal batch now</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Section: Marketing & Tips */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-gutter">
        <div className="bg-primary p-xl rounded-[32px] text-on-primary relative overflow-hidden flex flex-col justify-center min-h-[160px]">
          {/* Subtle pattern background */}
          <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: "radial-gradient(circle at 2px 2px, white 1px, transparent 0)", backgroundSize: "24px 24px" }}></div>
          <div className="relative z-10">
            <h4 className="font-headline-md text-headline-md mb-2">Holiday Pre-orders</h4>
            <p className="font-body-lg text-body-lg mb-6 max-w-md opacity-90">Prepare your inventory for the Christmas rush. We're expecting a 40% increase in gift box orders this season.</p>
            <button 
              onClick={() => alert("Prep schedule draft loaded!")}
              className="bg-white text-primary px-6 py-3 rounded-full font-label-md text-label-md hover:bg-primary-fixed transition-colors cursor-pointer"
            >
              Manage Prep Schedule
            </button>
          </div>
        </div>
        <div className="bg-surface-container-high p-xl rounded-[32px] flex flex-col justify-center min-h-[160px]">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-14 h-14 rounded-full bg-white flex items-center justify-center text-primary shadow-sm">
              <span className="material-symbols-outlined text-[32px]">lightbulb</span>
            </div>
            <h4 className="font-headline-sm text-headline-sm text-on-surface">Pro Baker Tip</h4>
          </div>
          <p className="font-body-lg text-body-lg text-on-surface-variant italic">
            "Increasing the chilling time for your dough by just 12 hours can significantly improve the depth of flavor in your Signature Choco Chips."
          </p>
          <div className="mt-6 flex items-center gap-2">
            <span className="font-label-md text-label-md text-primary font-bold">Suggested by</span>
            <span className="font-label-md text-label-md text-on-surface-variant">Chef Andre</span>
          </div>
        </div>
      </div>

      {/* Floating Action Button (New batch) */}
      <button 
        onClick={() => navigate("/products")}
        className="fixed bottom-margin-desktop right-margin-desktop w-16 h-16 bg-primary text-on-primary rounded-full shadow-2xl flex items-center justify-center hover:scale-110 active:scale-95 transition-all z-50 cursor-pointer"
      >
        <span className="material-symbols-outlined text-[32px]">add</span>
      </button>
    </div>
  );
}
