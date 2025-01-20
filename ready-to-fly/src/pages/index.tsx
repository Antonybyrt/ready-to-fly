"use client";

import { useState } from "react";
import auth from "@/services/auth.service";
import { useRouter } from "next/navigation";
import { ErrorService } from "@/services/error.service";

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    const res = await auth.login(email, password);
    setLoading(false);

    if (res != null) {
      try {
        router.push("../dashboard");
      } catch (err) {
        ErrorService.errorMessage("Error while connecting", err as string);
      }
    } else {
      ErrorService.errorMessage("Error while connecting", "Email or password incorrect");
    }
  }

  return (
    <div className="min-h-screen flex flex-col justify-center px-4">
      <h2 className="text-3xl font-bold text-pink-300 text-center mb-8 font-sans">
        Lift off begins here
      </h2>
      <form onSubmit={onSubmit} className="max-w-lg w-full mx-auto space-y-6">
        <div>
          <label
            htmlFor="email"
            className="block text-lg font-medium text-gray-300 mb-2"
          >
            Mail address
          </label>
          <input
            id="email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-3 rounded-lg bg-gray-800 text-gray-200 border border-gray-700 focus:ring-2 focus:ring-pink-500 focus:outline-none"
            placeholder="Enter your email"
          />
        </div>
        <div>
          <label
            htmlFor="password"
            className="block text-lg font-medium text-gray-300 mb-2"
          >
            Password
          </label>
          <input
            id="password"
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-3 rounded-lg bg-gray-800 text-gray-200 border border-gray-700 focus:ring-2 focus:ring-pink-500 focus:outline-none"
            placeholder="Enter your password"
          />
        </div>
        <button
          type="submit"
          className="w-full bg-pink-400 hover:bg-pink-500 text-white font-medium py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
        >
          Login
        </button>
      </form>

      {loading && (
        <div className="text-center mt-6 text-pink-500 text-lg">
          <span className="animate-pulse">Loading...</span>
        </div>
      )}
      
      <p className="text-gray-400 text-center mt-8 text-lg">
        You don't have an account ?{" "}
        <a href="mailto:antony.loussararian@gmail.com?subject=Access Request" className="text-pink-400 hover:underline">
          Make an access request
        </a>
      </p>
    </div>
  );
}
