import { Outlet, NavLink, useNavigate, useLocation } from "react-router-dom";
import { useState } from "react";
import authService from "../services/authService";

export default function Layout() {
  const navigate = useNavigate();
  const location = useLocation();
  const [showNotifications, setShowNotifications] = useState(false);

  const handleLogout = (e) => {
    e.preventDefault();
    authService.logout();
    navigate("/");
  };

  const navItems = [
    { name: "Dashboard", path: "/dashboard", icon: "dashboard" },
    { name: "Products", path: "/products", icon: "bakery_dining" },
    { name: "Orders", path: "/orders", icon: "shopping_cart" },
    { name: "Reports", path: "/reports", icon: "bar_chart" },
  ];

  // Map locations to titles
  const getPageTitle = () => {
    switch (location.pathname) {
      case "/dashboard":
        return "Dashboard";
      case "/products":
        return "Products";
      case "/orders":
        return "Orders";
      case "/reports":
        return "Reports";
      default:
        return "SweetCrumbs Admin";
    }
  };

  return (
    <div className="min-h-screen bg-surface">
      {/* SideNavBar (Shared Component) */}
      <aside className="h-screen w-64 fixed left-0 top-0 hidden md:flex flex-col bg-surface-container-low shadow-[0_4px_20px_rgba(62,39,35,0.06)] z-50">
        <div className="flex flex-col h-full py-md gap-xs">
          {/* Brand Header */}
          <div className="px-md mb-lg">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center text-on-primary">
                <span className="material-symbols-outlined">bakery_dining</span>
              </div>
              <div>
                <h1 className="font-headline-sm text-headline-sm font-bold text-primary">SweetCrumbs</h1>
                <p className="font-label-md text-label-md text-on-surface-variant opacity-70">Premium Admin</p>
              </div>
            </div>
          </div>
          {/* Main Nav Items */}
          <nav className="flex-1 space-y-1">
            {navItems.map((item) => (
              <NavLink
                key={item.name}
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-3 rounded-xl mx-2 transition-all duration-200 active:scale-95 ${
                    isActive
                      ? "bg-primary text-on-primary shadow-md font-bold"
                      : "text-on-surface-variant hover:bg-surface-container-highest"
                  }`
                }
              >
                <span className="material-symbols-outlined">{item.icon}</span>
                <span className="font-label-md text-label-md">{item.name}</span>
              </NavLink>
            ))}
          </nav>
          {/* CTA */}
          <div className="px-4 py-4">
            <button
              onClick={() => navigate("/products")}
              className="w-full bg-secondary text-on-secondary py-3 rounded-xl font-label-md text-label-md flex items-center justify-center gap-2 hover:brightness-110 active:scale-95 transition-all shadow-md cursor-pointer"
            >
              <span className="material-symbols-outlined text-[18px]">add</span>
              New Batch
            </button>
          </div>
          {/* Footer Nav */}
          <div className="mt-auto border-t border-outline-variant/20 pt-4">
            <a
              href="#settings"
              className="flex items-center gap-3 px-4 py-3 text-on-surface-variant hover:bg-surface-container-highest rounded-xl mx-2 transition-colors duration-200"
            >
              <span className="material-symbols-outlined">settings</span>
              <span className="font-label-md text-label-md">Settings</span>
            </a>
            <a
              href="/logout"
              onClick={handleLogout}
              className="flex items-center gap-3 px-4 py-3 text-error hover:bg-error-container/20 rounded-xl mx-2 transition-colors duration-200"
            >
              <span className="material-symbols-outlined">logout</span>
              <span className="font-label-md text-label-md font-semibold">Logout</span>
            </a>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="md:ml-64 min-h-screen flex flex-col">
        {/* TopNavBar */}
        <header className="w-full h-20 sticky top-0 z-40 bg-surface border-b border-outline-variant/30 shadow-sm flex justify-between items-center px-margin-desktop">
          <div className="flex items-center gap-md">
            <div className="relative focus-within:ring-2 focus-within:ring-primary/20 rounded-full transition-all">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant">search</span>
              <input
                className="bg-surface-container-low border-none rounded-full pl-10 pr-4 py-2 w-72 focus:ring-0 font-body-md text-body-md"
                placeholder="Search orders, batches..."
                type="text"
              />
            </div>
          </div>
          <div className="flex items-center gap-md relative">
            <button 
              onClick={() => setShowNotifications(!showNotifications)}
              className="text-on-surface-variant hover:text-primary transition-colors relative p-2 rounded-full hover:bg-surface-container-low"
            >
              <span className="material-symbols-outlined">notifications</span>
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-error rounded-full ring-2 ring-surface"></span>
            </button>
            
            {showNotifications && (
              <div className="absolute right-20 top-14 w-80 bg-surface-container-lowest rounded-2xl shadow-xl border border-outline-variant/20 p-4 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                <h4 className="font-headline-sm text-headline-sm text-sm text-primary mb-2">Notifications</h4>
                <div className="space-y-3">
                  <div className="flex gap-3 text-xs p-2 rounded-xl bg-error-container/10 border border-error/5">
                    <span className="material-symbols-outlined text-error text-sm">warning</span>
                    <div>
                      <p className="font-semibold text-on-surface">Low stock alert</p>
                      <p className="text-on-surface-variant">Butter Toffee has 12 units remaining.</p>
                    </div>
                  </div>
                  <div className="flex gap-3 text-xs p-2 rounded-xl bg-primary-container/10">
                    <span className="material-symbols-outlined text-primary text-sm">shopping_cart</span>
                    <div>
                      <p className="font-semibold text-on-surface">New Order received</p>
                      <p className="text-on-surface-variant">Order #SC-9021 by Jane Doe is baking.</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <button className="text-on-surface-variant hover:text-primary transition-colors p-2 rounded-full hover:bg-surface-container-low">
              <span className="material-symbols-outlined">help</span>
            </button>
            <div className="h-8 w-[1px] bg-outline-variant/30"></div>
            <div className="flex items-center gap-3">
              <div className="text-right hidden sm:block">
                <p className="font-label-md text-label-md text-on-surface">Chef Julia</p>
                <p className="text-[10px] uppercase font-bold text-on-surface-variant tracking-wider">Head Baker</p>
              </div>
              <img
                className="w-10 h-10 rounded-full border-2 border-primary-fixed object-cover"
                alt="Chef Julia"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuDTDTw3T9gGZeBD3_Evt5SglerCDJb8OzX7nf5p4DpHpMId_OWFabRG3Tk-Y3mAuAivXvi_W2FcUo7GoxtFXDKJ-e-GltKputdmb5s4bIaJrK_vkheEE9MHeMqdhIsfX1R3a9NRxkErgEYXQUjIMM_6n8HJz5mx7lDXwf11PFj8rtSmEKViHM4NqXLn4V0dHsa9BmQeWrbwQUby1vCUruCSWjoGoL3DZZdy8jRyT3JqJFH8eBaZyD2o5w"
              />
            </div>
          </div>
        </header>

        {/* Dynamic Nested Content */}
        <main className="flex-1">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
