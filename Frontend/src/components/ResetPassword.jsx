import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Lock, AlertCircle, ArrowLeft, CheckCircle } from "lucide-react";

export default function ResetPassword() {
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [isValidToken, setIsValidToken] = useState(false);
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    const email = searchParams.get("email");
    const token = searchParams.get("token");

    useEffect(() => {
        // You might want to verify the token here before showing the form
        // For now, we'll just check if email and token exist
        if (!email || !token) {
            setError("Invalid or expired reset link.");
            setIsValidToken(false);
        } else {
            setIsValidToken(true);
        }
    }, [email, token]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setSuccess("");

        if (newPassword !== confirmPassword) {
            setError("Passwords do not match.");
            return;
        }

        setIsLoading(true);

        try {
            const response = await fetch("https://localhost:7274/api/v1/auth/reset-password", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    email,
                    token,
                    newPassword
                })
            });

            // First get the response text (works for both JSON and plain text)
            const responseText = await response.text();
            
            let responseData;
            try {
                // Try to parse as JSON
                responseData = JSON.parse(responseText);
            } catch {
                // If not JSON, use the text directly
                responseData = { message: responseText };
            }

            if (!response.ok) {
                throw new Error(responseData.message || "Failed to reset password");
            }

            setSuccess(responseData.message || "Password has been reset successfully. You can now login with your new password.");
            
            // Optionally redirect after successful reset
            setTimeout(() => navigate("/login"), 3000);
        } catch (err) {
            // Handle network errors and API errors
            const errorMessage = err.message.includes("Failed to fetch") 
                ? "Network error. Please check your connection."
                : err.message;
                
            setError(errorMessage || "Failed to reset password. Please try again.");
            console.error("Reset password error:", err);
        } finally {
            setIsLoading(false);
        }
    };
    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center p-4">
            <div className="w-full max-w-md">
                <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
                    <button
                        onClick={() => navigate("/login")}
                        className="flex items-center gap-1 text-blue-600 hover:text-blue-800 mb-4"
                    >
                        <ArrowLeft className="w-5 h-5" />
                        Back to login
                    </button>

                    <div className="text-center mb-6">
                        <h1 className="text-2xl font-bold text-gray-900">Reset Password</h1>
                        <p className="text-gray-600 mt-2">
                            {isValidToken 
                                ? "Enter your new password" 
                                : "Please check your email for a valid reset link"}
                        </p>
                    </div>

                    {isValidToken ? (
                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* Error Message */}
                            {error && (
                                <div className="flex items-center gap-3 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
                                    <AlertCircle className="w-5 h-5 flex-shrink-0" />
                                    <span className="text-sm">{error}</span>
                                </div>
                            )}

                            {/* Success Message */}
                            {success && (
                                <div className="flex items-center gap-3 p-4 bg-green-50 border border-green-200 rounded-lg text-green-700">
                                    <CheckCircle className="w-5 h-5 flex-shrink-0" />
                                    <span className="text-sm">{success}</span>
                                </div>
                            )}

                            {/* New Password Field */}
                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-gray-700">
                                    New Password
                                </label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                                    <input
                                        type="password"
                                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors placeholder-gray-400"
                                        placeholder="Enter new password"
                                        value={newPassword}
                                        onChange={(e) => setNewPassword(e.target.value)}
                                        required
                                        disabled={isLoading}
                                        minLength={6}
                                    />
                                </div>
                            </div>

                            {/* Confirm Password Field */}
                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-gray-700">
                                    Confirm Password
                                </label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                                    <input
                                        type="password"
                                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors placeholder-gray-400"
                                        placeholder="Confirm new password"
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        required
                                        disabled={isLoading}
                                        minLength={6}
                                    />
                                </div>
                            </div>

                            {/* Submit Button */}
                            <button
                                type="submit"
                                disabled={isLoading || success}
                                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 px-4 rounded-lg font-semibold hover:from-blue-700 hover:to-indigo-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                            >
                                {isLoading ? (
                                    <>
                                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                        Resetting...
                                    </>
                                ) : success ? (
                                    "Password Reset Successfully"
                                ) : (
                                    "Reset Password"
                                )}
                            </button>
                        </form>
                    ) : (
                        <div className="text-center py-8">
                            <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
                            <p className="text-gray-700 mb-4">{error}</p>
                            <button
                                onClick={() => navigate("/forgot-password")}
                                className="text-blue-600 hover:text-blue-800 font-medium"
                            >
                                Request a new reset link
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}