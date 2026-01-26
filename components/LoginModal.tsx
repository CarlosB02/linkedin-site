"use client";

import { Loader2, X } from "lucide-react";
import { useState } from "react";
import { authClient } from "@/lib/auth-client";

interface LoginModalProps {
	isOpen: boolean;
	onClose: () => void;
}

export default function LoginModal({ isOpen, onClose }: LoginModalProps) {
	const [isLogin, setIsLogin] = useState(true);
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [name, setName] = useState("");
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	if (!isOpen) return null;

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setIsLoading(true);
		setError(null);

		try {
			if (isLogin) {
				await authClient.signIn.email(
					{
						email,
						password,
					},
					{
						onSuccess: () => {
							onClose();
							window.location.reload();
						},
						onError: (ctx) => {
							setError(ctx.error.message);
						},
					},
				);
			} else {
				await authClient.signUp.email(
					{
						email,
						password,
						name,
					},
					{
						onSuccess: () => {
							onClose();
							window.location.reload();
						},
						onError: (ctx) => {
							setError(ctx.error.message);
						},
					},
				);
			}
		} catch (e) {
			setError("An error occurred");
		} finally {
			setIsLoading(false);
		}
	};

	const handleGoogleLogin = async () => {
		await authClient.signIn.social({
			provider: "google",
		});
	};

	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
			<div className="bg-white rounded-2xl w-full max-w-md p-8 relative shadow-2xl">
				<button
					onClick={onClose}
					className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
				>
					<X className="w-6 h-6" />
				</button>

				<h2 className="text-2xl font-bold mb-6 text-center">
					{isLogin ? "Welcome Back" : "Create Account"}
				</h2>

				<button
					onClick={handleGoogleLogin}
					className="w-full py-3 border-2 border-gray-200 rounded-xl font-semibold flex items-center justify-center gap-2 hover:bg-gray-50 transition-colors mb-6"
				>
					<svg className="w-5 h-5" viewBox="0 0 24 24">
						<path
							fill="currentColor"
							d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
						/>
						<path
							fill="currentColor"
							d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
						/>
						<path
							fill="currentColor"
							d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
						/>
						<path
							fill="currentColor"
							d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
						/>
					</svg>
					Continue with Google
				</button>

				<div className="relative mb-6">
					<div className="absolute inset-0 flex items-center">
						<div className="w-full border-t border-gray-200"></div>
					</div>
					<div className="relative flex justify-center text-sm">
						<span className="px-2 bg-white text-gray-500">
							Or continue with email
						</span>
					</div>
				</div>

				<form onSubmit={handleSubmit} className="space-y-4">
					{!isLogin && (
						<div>
							<label className="block text-sm font-medium text-gray-700 mb-1">
								Name
							</label>
							<input
								type="text"
								value={name}
								onChange={(e) => setName(e.target.value)}
								className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
								required
							/>
						</div>
					)}

					<div>
						<label className="block text-sm font-medium text-gray-700 mb-1">
							Email
						</label>
						<input
							type="email"
							value={email}
							onChange={(e) => setEmail(e.target.value)}
							className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
							required
						/>
					</div>

					<div>
						<label className="block text-sm font-medium text-gray-700 mb-1">
							Password
						</label>
						<input
							type="password"
							value={password}
							onChange={(e) => setPassword(e.target.value)}
							className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
							required
						/>
					</div>

					{error && <p className="text-red-500 text-sm text-center">{error}</p>}

					<button
						type="submit"
						disabled={isLoading}
						className="w-full py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
					>
						{isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
						{isLogin ? "Sign In" : "Create Account"}
					</button>
				</form>

				<div className="mt-6 text-center text-sm text-gray-600">
					{isLogin ? "Don't have an account? " : "Already have an account? "}
					<button
						onClick={() => setIsLogin(!isLogin)}
						className="text-blue-600 font-semibold hover:underline"
					>
						{isLogin ? "Sign up" : "Sign in"}
					</button>
				</div>
			</div>
		</div>
	);
}
