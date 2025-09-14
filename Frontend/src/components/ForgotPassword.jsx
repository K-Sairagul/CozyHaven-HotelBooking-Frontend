import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Mail, AlertCircle, ArrowLeft } from "lucide-react";

export default function ForgotPassword() {
    const [email, setEmail] = useState("");
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setSuccess("");
        setIsLoading(true);

        try {
            const response = await fetch("https://cozyhavenapi-hccchdhha4c8hjg3.southindia-01.azurewebsites.net/api/v1/auth/forgot-password", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ email })
            });

            if (!response.ok) {
                const errorText = await response.text();
                try {
                    const errorJson = JSON.parse(errorText);
                    throw new Error(errorJson.message || "Failed to send reset link");
                } catch {
                    throw new Error(errorText || "Failed to send reset link");
                }
            }

            try {
                const data = await response.json();
                setSuccess("Password reset link has been sent to your email. Please check your inbox.");
            } catch {
                setSuccess("Password reset link has been sent to your email. Please check your inbox.");
            }
        } catch (err) {
            setError(err.message || "Failed to send reset link. Please try again.");
            console.error("Forgot password error:", err);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black flex items-center justify-center p-6">
            <div className="w-full max-w-md bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl p-8">
                {/* Back Button */}
                <button
                    onClick={() => navigate(-1)}
                    className="flex items-center gap-2 text-yellow-500 hover:text-yellow-400 mb-6 transition-colors"
                >
                    <ArrowLeft className="w-5 h-5" />
                    Back to login
                </button>

                {/* Header */}
                <div className="text-center mb-8">
                    <div className="w-16 h-16 bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-full mx-auto mb-4 flex items-center justify-center shadow-lg">
                        <Mail className="w-8 h-8 text-black" />
                    </div>
                    <h1 className="text-3xl font-bold text-white mb-2">Forgot Password</h1>
                    <p className="text-white/70">
                        Enter your email to receive a password reset link
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Error Message */}
                    {error && (
                        <div className="flex items-center gap-3 p-4 bg-red-500/10 border border-red-500 text-red-400 rounded-lg">
                            <AlertCircle className="w-5 h-5 flex-shrink-0" />
                            <span className="text-sm">{error}</span>
                        </div>
                    )}

                    {/* Success Message */}
                    {success && (
                        <div className="flex items-center gap-3 p-4 bg-green-500/10 border border-green-500 text-green-400 rounded-lg">
                            <AlertCircle className="w-5 h-5 flex-shrink-0" />
                            <span className="text-sm">{success}</span>
                        </div>
                    )}

                    {/* Email Field */}
                    <div>
                        <label className="block text-sm font-medium text-white mb-1">
                            Email Address
                        </label>
                        <div className="relative">
                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-white/50 w-5 h-5" />
                            <input
                                type="email"
                                className="w-full bg-transparent text-white border border-white/20 rounded-lg py-3 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-yellow-500 placeholder-white/40"
                                placeholder="you@example.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                disabled={isLoading}
                            />
                        </div>
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
                                Sending...
                            </div>
                        ) : (
                            "Send Reset Link"
                        )}
                    </button>
                </form>
            </div>
        </div>
    );
}