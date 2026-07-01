import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("chef@sweetcrumbs.com");
  const [password, setPassword] = useState("password123");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError("Please fill in all fields.");
      return;
    }
    // Simulate successful login
    navigate("/dashboard");
  };

  return (
    <div className="bg-surface font-body-md text-on-surface min-h-screen relative overflow-hidden">
      {/* Background Image Layer */}
      <div className="fixed inset-0 z-0">
        <div
          className="w-full h-full bg-cover bg-center"
          style={{
            backgroundImage: `url('https://lh3.googleusercontent.com/aida-public/AB6AXuDiaf5wpcb1GvVZr3mVwqHGJhKHljGZ-5rEYNDVYIzDV2TWvJpgnQpRC84UugC_net97rvVgi_UJnNc99msyr6U60WpoVmYoEaJ5QN0tKZYcXPAVcwt-t8U5wszTgmrqdFR0ppohgAYmKYVVFuqHKZj1lCBQvgLV_lmcQ8oImgJg0xxJONsEl2rT4zmKnuxiKZwzH_XT8v1MMrht35iuSrm_E8fibtRD3Zw3T8Ri6c26B_F9whG-wJQOg')`,
          }}
          alt="Freshly baked artisan cookies background"
        />
        <div className="absolute inset-0 cookie-overlay"></div>
      </div>

      {/* Login Container */}
      <div className="relative z-10 min-h-screen flex items-center justify-center p-margin-mobile md:p-margin-desktop">
        {/* Central Card */}
        <div className="w-full max-w-[480px] bg-surface-container-lowest rounded-[24px] shadow-[0_4px_20px_rgba(62,39,35,0.06)] p-md md:p-xl flex flex-col gap-lg animate-in fade-in zoom-in-95 duration-300">
          {/* Brand Identity */}
          <div className="text-center flex flex-col gap-xs">
            <div className="flex justify-center mb-xs">
              <span className="material-symbols-outlined text-primary text-[48px] select-none" style={{ fontVariationSettings: "'FILL' 1" }}>
                bakery_dining
              </span>
            </div>
            <h1 className="font-headline-md text-[32px] font-bold text-primary tracking-tight">SweetCrumbs Admin</h1>
            <p className="font-body-md text-body-md text-on-surface-variant">Welcome back to the bakery pantry.</p>
          </div>

          {/* Login Form */}
          <form className="flex flex-col gap-md" onSubmit={handleSubmit}>
            {error && (
              <div className="p-3 bg-error-container/30 border border-error/20 rounded-xl text-error text-xs flex items-center gap-2">
                <span className="material-symbols-outlined text-sm">error</span>
                <span>{error}</span>
              </div>
            )}

            {/* Email Field */}
            <div className="flex flex-col gap-xs transition-all duration-200">
              <label className="font-label-md text-label-md text-primary uppercase">Email Address</label>
              <div className="relative flex items-center group">
                <span className="material-symbols-outlined absolute left-4 text-outline group-focus-within:text-primary transition-colors select-none">
                  mail
                </span>
                <input
                  className="w-full pl-12 pr-4 py-3.5 bg-surface-bright border border-outline-variant/30 rounded-xl font-body-md text-on-surface placeholder:text-outline-variant focus:border-primary transition-all duration-200"
                  placeholder="chef@sweetcrumbs.com"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="flex flex-col gap-xs transition-all duration-200">
              <div className="flex justify-between items-center">
                <label className="font-label-md text-label-md text-primary uppercase">Password</label>
                <a className="text-[11px] font-semibold text-secondary hover:underline transition-all" href="#forgot">
                  Forgot?
                </a>
              </div>
              <div className="relative flex items-center group">
                <span className="material-symbols-outlined absolute left-4 text-outline group-focus-within:text-primary transition-colors select-none">
                  lock
                </span>
                <input
                  className="w-full pl-12 pr-12 py-3.5 bg-surface-bright border border-outline-variant/30 rounded-xl font-body-md text-on-surface placeholder:text-outline-variant focus:border-primary transition-all duration-200"
                  placeholder="••••••••"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button
                  className="absolute right-4 text-outline hover:text-primary transition-colors cursor-pointer"
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  <span className="material-symbols-outlined select-none">
                    {showPassword ? "visibility_off" : "visibility"}
                  </span>
                </button>
              </div>
            </div>

            {/* Remember Me */}
            <div className="flex items-center gap-xs">
              <div className="relative flex items-center cursor-pointer">
                <input
                  className="w-5 h-5 rounded border-outline-variant/50 text-primary focus:ring-primary/20 cursor-pointer"
                  id="remember"
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                />
              </div>
              <label className="font-body-md text-body-md text-on-surface-variant cursor-pointer select-none" htmlFor="remember">
                Remember me for 30 days
              </label>
            </div>

            {/* CTA Button */}
            <button
              className="mt-xs w-full py-4 bg-primary text-on-primary font-title-lg rounded-xl shadow-lg hover:scale-[1.01] active:scale-95 transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer"
              type="submit"
            >
              Login to Dashboard
              <span className="material-symbols-outlined select-none">arrow_forward</span>
            </button>
          </form>

          {/* Footer Message */}
          <div className="text-center pt-xs">
            <p className="font-body-md text-body-md text-on-surface-variant">
              Need an account?{" "}
              <a className="text-secondary font-bold hover:text-primary transition-colors underline decoration-secondary/30 underline-offset-4" href="#contact">
                Contact Master Chef
              </a>
            </p>
          </div>
        </div>

        {/* Decorative Floating Accent */}
        <div className="fixed bottom-margin-desktop right-margin-desktop hidden lg:block opacity-40">
          <div className="flex items-center gap-sm bg-surface-container-low px-sm py-xs rounded-full border border-outline-variant/20 shadow-sm">
            <div className="w-2 h-2 rounded-full bg-tertiary animate-pulse"></div>
            <span className="font-label-md text-label-md text-on-surface-variant tracking-widest uppercase">System Status: Freshly Baked</span>
          </div>
        </div>
      </div>
    </div>
  );
}
