import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff, Mail, Lock, AlertCircle } from "lucide-react";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    if (!email.trim() && !password.trim()) {
      setError("Please enter your email and password.");
      return;
    }

    if (!email.trim()) {
      setError("Please enter your email.");
      return;
    }

    if (!password.trim()) {
      setError("Please enter your password.");
      return;
    }

    setIsLoading(true);

    try {
      const res = await fetch("https://cozyhavenapi-hccchdhha4c8hjg3.southindia-01.azurewebsites.net/api/v1/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ email, password })
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        const message = errorData.message || "Invalid email or password.";
        throw new Error(message);
      }

      const data = await res.json();
      login(data.token, data.role, data.userId, data.fullName);
    } catch (err) {
      setError(err.message || "Login failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black flex items-center justify-center p-6">
      <div className="w-full max-w-md bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl p-8">
        
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-full mx-auto mb-4 flex items-center justify-center shadow-lg">
            <Lock className="w-8 h-8 text-black" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Welcome Back</h1>
          <p className="text-white/70">Sign in to continue your journey</p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleLogin} className="space-y-6">
          {error && (
            <div className="flex items-center gap-3 p-4 bg-red-500/10 border border-red-500 text-red-400 rounded-lg">
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
              <span className="text-sm">{error}</span>
            </div>
          )}

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-white mb-1">
              Email
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-white/50 w-5 h-5" />
              <input
                type="email"
                className="w-full bg-transparent text-white border border-white/20 rounded-lg py-3 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-yellow-500 placeholder-white/40"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isLoading}
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-white mb-1">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-white/50 w-5 h-5" />
              <input
                type={showPassword ? "text" : "password"}
                className="w-full bg-transparent text-white border border-white/20 rounded-lg py-3 pl-10 pr-12 focus:outline-none focus:ring-2 focus:ring-yellow-500 placeholder-white/40"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLoading}
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-white/60 hover:text-yellow-500"
                onClick={() => setShowPassword(!showPassword)}
                disabled={isLoading}
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {/* Extras */}
          <div className="flex justify-between items-center text-sm text-white/70">
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                className="form-checkbox h-3 w-4 mr-9 text-yellow-500 bg-black border-white/20"
                disabled={isLoading}
              />
              <span className="ml-1">Remember me</span>
            </label>
            <button
              type="button"
              onClick={() => navigate("/forgot-password")}
              className="text-yellow-500 hover:underline"
              disabled={isLoading}
            >
              Forgot password?
            </button>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 bg-gradient-to-r from-yellow-400 to-yellow-600 text-black rounded-lg font-semibold hover:from-yellow-500 hover:to-yellow-700 transition-all duration-300 transform hover:scale-105 disabled:opacity-50"
          >
            {isLoading ? (
              <div className="flex items-center justify-center gap-2">
                <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
                Signing in...
              </div>
            ) : (
              "Sign In"
            )}
          </button>
        </form>

        {/* Sign Up */}
        <p className="mt-1 text-center text-sm text-white/60">
          Don’t have an account?{" "}
          <button
            onClick={() => navigate("/register")}
            className="mt-1 text-yellow-500 font-medium hover:underline"
          >
            Sign up for free
          </button>
        </p>
      </div>
    </div>
  );
}
