import { useState, useEffect } from "react";

export default function Reports() {
  const [selectedRange, setSelectedRange] = useState("Last 30 Days");
  const [animateBars, setAnimateBars] = useState(false);

  // Trigger animations on mount
  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimateBars(true);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  const handleExportPDF = () => {
    alert("Generating Sales Report PDF download manifest...");
  };

  // Simulated data for trend
  const monthlySales = [
    { month: "Jan", height: "30%", val: "$380" },
    { month: "Feb", height: "45%", val: "$520" },
    { month: "Mar", height: "40%", val: "$490" },
    { month: "Apr", height: "55%", val: "$680" },
    { month: "May", height: "70%", val: "$890" },
    { month: "Jun", height: "65%", val: "$810" },
    { month: "Jul", height: "90%", val: "$1,240" },
  ];

  return (
    <section className="p-margin-desktop space-y-gutter animate-in fade-in duration-300 relative">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-md">
        <div>
          <h2 className="font-headline-md text-[32px] text-primary">Sales Reports</h2>
          <p className="font-body-md text-body-md text-on-surface-variant">Reviewing your bakery's performance for Q3 2026</p>
        </div>
        <div className="flex gap-sm">
          <select
            value={selectedRange}
            onChange={(e) => setSelectedRange(e.target.value)}
            className="flex items-center gap-2 px-4 py-2 border border-outline rounded-xl font-label-md text-label-md text-on-surface bg-surface-bright cursor-pointer focus:ring-1 focus:ring-primary text-xs"
          >
            <option>Last 7 Days</option>
            <option>Last 30 Days</option>
            <option>This Quarter</option>
            <option>This Year</option>
          </select>
          <button 
            onClick={handleExportPDF}
            className="flex items-center gap-2 px-4 py-2 bg-primary text-on-primary rounded-xl font-label-md text-label-md hover:shadow-lg transition-all active:scale-95 cursor-pointer"
          >
            <span className="material-symbols-outlined text-[18px]">download</span>
            Export PDF
          </button>
        </div>
      </div>

      {/* Stats Bento Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-gutter">
        {/* Avg Order Value */}
        <div className="bg-surface-container-lowest p-md rounded-[24px] shadow-[0_4px_20px_rgba(62,39,35,0.06)] border border-white/50">
          <div className="flex justify-between items-start mb-sm">
            <div className="p-2 bg-primary-fixed rounded-lg text-primary flex items-center justify-center">
              <span className="material-symbols-outlined">payments</span>
            </div>
            <span className="font-label-md text-label-md text-tertiary flex items-center gap-1">
              +12.4% <span className="material-symbols-outlined text-[14px]">trending_up</span>
            </span>
          </div>
          <p className="font-label-md text-label-md text-on-surface-variant uppercase tracking-widest">Avg Order Value</p>
          <h3 className="font-headline-sm text-headline-sm text-on-surface mt-1">$42.80</h3>
        </div>

        {/* Monthly Growth */}
        <div className="bg-surface-container-lowest p-md rounded-[24px] shadow-[0_4px_20px_rgba(62,39,35,0.06)] border border-white/50">
          <div className="flex justify-between items-start mb-sm">
            <div className="p-2 bg-secondary-fixed rounded-lg text-secondary flex items-center justify-center">
              <span className="material-symbols-outlined">show_chart</span>
            </div>
            <span className="font-label-md text-label-md text-tertiary flex items-center gap-1">
              +8.1% <span className="material-symbols-outlined text-[14px]">trending_up</span>
            </span>
          </div>
          <p className="font-label-md text-label-md text-on-surface-variant uppercase tracking-widest">Monthly Growth</p>
          <h3 className="font-headline-sm text-headline-sm text-on-surface mt-1">24.5%</h3>
        </div>

        {/* Peak Sales Time */}
        <div className="bg-surface-container-lowest p-md rounded-[24px] shadow-[0_4px_20px_rgba(62,39,35,0.06)] border border-white/50">
          <div className="flex justify-between items-start mb-sm">
            <div className="p-2 bg-tertiary-fixed rounded-lg text-tertiary flex items-center justify-center">
              <span className="material-symbols-outlined">schedule</span>
            </div>
          </div>
          <p className="font-label-md text-label-md text-on-surface-variant uppercase tracking-widest">Peak Sales Time</p>
          <h3 className="font-headline-sm text-headline-sm text-on-surface mt-1">11:30 AM</h3>
        </div>

        {/* Highlight Card */}
        <div className="bg-primary p-md rounded-[24px] shadow-[0_4px_20px_rgba(111,70,39,0.2)] text-on-primary md:col-span-1 lg:col-span-1 flex flex-col justify-center">
          <p className="font-label-md text-label-md opacity-80 uppercase tracking-widest">Top Performance</p>
          <h3 className="font-headline-sm text-headline-sm mt-2">Perfect Week</h3>
          <p className="text-body-md mt-1 opacity-90 leading-relaxed">Sales increased by 15% during morning hours this week.</p>
        </div>
      </div>

      {/* Visual Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-gutter">
        {/* Monthly Revenue Chart */}
        <div className="lg:col-span-2 bg-surface-container-lowest p-md rounded-[24px] shadow-[0_4px_20px_rgba(62,39,35,0.06)] border border-white/50 flex flex-col">
          <div className="flex justify-between items-center mb-lg">
            <h4 className="font-title-lg text-title-lg text-on-surface font-bold">Monthly Revenue Trend</h4>
            <div className="flex gap-xs items-center">
              <span className="w-3 h-3 bg-primary rounded-full"></span>
              <span className="font-label-md text-label-md text-on-surface-variant">2026 Sales</span>
            </div>
          </div>
          
          <div className="h-64 flex items-end justify-between gap-2 px-2 relative border-b border-outline-variant/30 pb-2">
            {/* Custom Trend Line SVG */}
            <div className="absolute inset-x-0 bottom-0 top-0 pointer-events-none opacity-20">
              <svg className="w-full h-full" preserveAspectRatio="none" viewBox="0 0 800 200">
                <path d="M0,180 Q100,160 200,140 T400,110 T600,60 T800,20" fill="none" stroke="#6f4627" strokeLinecap="round" strokeWidth="4"></path>
              </svg>
            </div>
            
            {/* Monthly Bars */}
            {monthlySales.map((salesItem, index) => (
              <div key={index} className="flex-1 flex flex-col items-center group relative cursor-pointer">
                {/* Tooltip on hover */}
                <div className="absolute bottom-full mb-2 bg-primary text-on-primary text-[10px] font-bold px-2 py-1 rounded shadow-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-10">
                  {salesItem.val}
                </div>
                
                <div 
                  className={`w-full max-w-[40px] rounded-t-lg bg-primary-fixed transition-all duration-1000 ease-out group-hover:bg-primary`}
                  style={{ height: animateBars ? salesItem.height : "0%" }}
                ></div>
                
                <span className="mt-4 font-label-md text-label-md text-on-surface-variant group-hover:text-primary transition-colors">
                  {salesItem.month}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Best Selling Products */}
        <div className="bg-surface-container-lowest p-md rounded-[24px] shadow-[0_4px_20px_rgba(62,39,35,0.06)] border border-white/50">
          <h4 className="font-title-lg text-title-lg text-on-surface mb-lg font-bold">Best Selling Products</h4>
          <div className="space-y-6 text-left">
            {/* Choco Chip */}
            <div className="space-y-2">
              <div className="flex justify-between items-center font-label-md text-label-md">
                <span className="text-on-surface">Choco Chip Delight</span>
                <span className="text-primary font-bold">1,248 units</span>
              </div>
              <div className="w-full h-3 bg-surface-container rounded-full overflow-hidden">
                <div 
                  className="bg-primary h-full rounded-full transition-all duration-1000 ease-out" 
                  style={{ width: animateBars ? "95%" : "0%" }}
                ></div>
              </div>
            </div>

            {/* Double Espresso Fudge */}
            <div className="space-y-2">
              <div className="flex justify-between items-center font-label-md text-label-md">
                <span className="text-on-surface">Double Espresso Fudge</span>
                <span className="text-on-surface-variant">842 units</span>
              </div>
              <div className="w-full h-3 bg-surface-container rounded-full overflow-hidden">
                <div 
                  className="bg-secondary h-full rounded-full transition-all duration-1000 ease-out" 
                  style={{ width: animateBars ? "65%" : "0%" }}
                ></div>
              </div>
            </div>

            {/* Honey Lavender */}
            <div className="space-y-2">
              <div className="flex justify-between items-center font-label-md text-label-md">
                <span className="text-on-surface">Honey Lavender Shortbread</span>
                <span className="text-on-surface-variant">612 units</span>
              </div>
              <div className="w-full h-3 bg-surface-container rounded-full overflow-hidden">
                <div 
                  className="bg-tertiary h-full rounded-full transition-all duration-1000 ease-out" 
                  style={{ width: animateBars ? "45%" : "0%" }}
                ></div>
              </div>
            </div>

            {/* Classic Sugar Dust */}
            <div className="space-y-2">
              <div className="flex justify-between items-center font-label-md text-label-md">
                <span className="text-on-surface">Classic Sugar Dust</span>
                <span className="text-on-surface-variant">420 units</span>
              </div>
              <div className="w-full h-3 bg-surface-container rounded-full overflow-hidden">
                <div 
                  className="bg-outline-variant h-full rounded-full transition-all duration-1000 ease-out" 
                  style={{ width: animateBars ? "30%" : "0%" }}
                ></div>
              </div>
            </div>
          </div>
          <div className="mt-lg pt-md border-t border-outline-variant/30 text-center">
            <button 
              onClick={() => alert("Loading granular item logs...")}
              className="text-primary font-label-md text-label-md hover:underline cursor-pointer font-bold"
            >
              View Full Inventory Stats
            </button>
          </div>
        </div>
      </div>

      {/* Recent High-Value Transactions */}
      <div className="bg-surface-container-lowest rounded-[24px] shadow-[0_4px_20px_rgba(62,39,35,0.06)] border border-white/50 overflow-hidden">
        <div className="p-md border-b border-outline-variant/30 flex justify-between items-center">
          <h4 className="font-title-lg text-title-lg text-on-surface font-bold">High-Value Batch Orders</h4>
          <button 
            onClick={() => alert("Actions list shown.")}
            className="text-on-surface-variant hover:text-primary transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined">more_horiz</span>
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr class="bg-surface-container-low">
                <th className="px-md py-4 font-label-md text-label-md text-on-surface-variant uppercase">Customer</th>
                <th className="px-md py-4 font-label-md text-label-md text-on-surface-variant uppercase">Order Date</th>
                <th className="px-md py-4 font-label-md text-label-md text-on-surface-variant uppercase">Products</th>
                <th className="px-md py-4 font-label-md text-label-md text-on-surface-variant uppercase text-right">Revenue</th>
                <th className="px-md py-4 font-label-md text-label-md text-on-surface-variant uppercase">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/20">
              <tr className="hover:bg-surface-container-lowest transition-colors">
                <td className="px-md py-5">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-secondary-fixed flex items-center justify-center font-bold text-secondary text-xs">EC</div>
                    <div>
                      <p className="font-label-md text-label-md text-on-surface font-semibold">Ethereal Cafè</p>
                      <p className="text-[10px] text-on-surface-variant">Corporate Account</p>
                    </div>
                  </div>
                </td>
                <td className="px-md py-5 font-body-md text-body-md text-on-surface-variant">Jul 18, 2026</td>
                <td className="px-md py-5 font-body-md text-body-md text-on-surface">250x Assorted Cookies</td>
                <td className="px-md py-5 font-title-lg text-title-lg text-primary text-right font-bold">$750.00</td>
                <td className="px-md py-5">
                  <span className="px-3 py-1 rounded-full bg-[#f4ece1] text-[#7d5c3f] text-[10px] font-bold uppercase tracking-wider">Delivered</span>
                </td>
              </tr>
              <tr className="hover:bg-surface-container-lowest transition-colors">
                <td className="px-md py-5">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-tertiary-fixed flex items-center justify-center font-bold text-tertiary text-xs">GH</div>
                    <div>
                      <p className="font-label-md text-label-md text-on-surface font-semibold">Grand Hotel Plaza</p>
                      <p className="text-[10px] text-on-surface-variant">Event Order</p>
                    </div>
                  </div>
                </td>
                <td className="px-md py-5 font-body-md text-body-md text-on-surface-variant">Jul 17, 2026</td>
                <td className="px-md py-5 font-body-md text-body-md text-on-surface">120x Lavender Shortbread</td>
                <td className="px-md py-5 font-title-lg text-title-lg text-primary text-right font-bold">$480.00</td>
                <td className="px-md py-5">
                  <span className="px-3 py-1 rounded-full bg-[#fdf5e1] text-[#8d6e1d] text-[10px] font-bold uppercase tracking-wider">Baking</span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Floating Decorative Live Insight Card */}
      <div className="fixed bottom-margin-desktop right-margin-desktop hidden lg:block z-40">
        <div className="glass-card p-4 rounded-2xl shadow-xl border border-white/40 flex items-center gap-4 animate-bounce">
          <div className="relative w-12 h-12 flex items-center justify-center bg-primary rounded-full text-on-primary">
            <span className="material-symbols-outlined">trending_up</span>
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-error rounded-full animate-pulse"></div>
          </div>
          <div className="text-left">
            <p className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">Live Insight</p>
            <p className="text-body-md text-on-surface leading-tight">
              Choco Chip is <strong>24%</strong>
              <br />
              above average today.
            </p>
          </div>
        </div>
      </div>

      {/* Background Decoration */}
      <div className="fixed inset-0 pointer-events-none -z-10 opacity-30">
        <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-primary-fixed blur-[120px]"></div>
        <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-secondary-fixed blur-[120px]"></div>
      </div>
    </section>
  );
}
