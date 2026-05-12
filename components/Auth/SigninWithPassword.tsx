"use client";

import Link from "next/link";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import InputGroup from "../FormElements/InputGroup";
import { Checkbox } from "../FormElements/checkbox";
import { useAuth } from "@/contexts/AuthContext";
import { API_ENDPOINTS } from '@/config/api';
import { AuthThemeToggle } from "../Layouts/header/theme-toggle";

export default function SigninWithPassword() {
  const [data, setData] = useState({
    email: "",
    password: "",
    remember: false,
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();
  const { login } = useAuth();

  // Load remembered credentials on component mount
  useEffect(() => {
    // Only access localStorage on the client side
    if (typeof window !== 'undefined') {
      const rememberedEmail = localStorage.getItem("rememberedEmail");
      const rememberedPassword = localStorage.getItem("rememberedPassword");
      const rememberMe = localStorage.getItem("rememberMe") === "true";
      
      setData({
        email: rememberedEmail || "",
        password: rememberedPassword || "",
        remember: rememberMe,
      });
    } else {
      // Server-side: set default values
      setData({
        email: "",
        password: "",
        remember: false,
      });
    }
    setLoading(false);
    setError("");
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setData({
      ...data,
      [e.target.name]: e.target.value,
    });
  };

  // Handle remember me checkbox change
  const handleRememberMeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const isChecked = e.target.checked;
    setData({ ...data, remember: isChecked });
    
    // If unchecking "Remember me", immediately clear stored credentials
    if (!isChecked && typeof window !== 'undefined') {
      localStorage.removeItem("rememberedEmail");
      localStorage.removeItem("rememberedPassword");
      localStorage.removeItem("rememberMe");
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      // Get device info
      const deviceInfo = `${navigator.userAgent.split(' ').slice(-2).join(' ')}`;
      
      const response = await fetch(API_ENDPOINTS.auth.admin.login, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: data.email,
          password: data.password,
          deviceInfo: deviceInfo,
        }),
      });

      const result = await response.json();

      if (response.ok) {
        // Handle "Remember me" functionality
        if (typeof window !== 'undefined') {
          if (data.remember) {
            // Save credentials to localStorage
            localStorage.setItem("rememberedEmail", data.email);
            localStorage.setItem("rememberedPassword", data.password);
            localStorage.setItem("rememberMe", "true");
          } else {
            // Clear remembered credentials
            localStorage.removeItem("rememberedEmail");
            localStorage.removeItem("rememberedPassword");
            localStorage.removeItem("rememberMe");
          }
        }
                // Use AuthContext to store user data and tokens
        login(result.user, result.accessToken, result.refreshToken);
        
        // Redirect to dashboard
        router.push("/dashboard");
      } else {
        setError(result.message || "Login failed");
      }
    } catch (err) {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="flex justify-end mb-4">
        <AuthThemeToggle />
      </div>
      
      <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <InputGroup
              type="email"
              name="email"
              label="Email"
              placeholder="Enter your email"
              value={data.email}
              handleChange={handleChange}
              required
              disabled={loading}
            />
          </div>

          <div className="mb-4">
            <InputGroup
              type="password"
              name="password"
              label="Password"
              placeholder="Enter your password"
              value={data.password}
              handleChange={handleChange}
              required
              disabled={loading}
              showPasswordToggle={true}
            />
          </div>

          <div className="mb-6 flex items-center justify-between">
            <Checkbox
              name="remember"
              checked={data.remember}
              onChange={handleRememberMeChange}
              label="Remember me"
            />
            <Link
              href="/auth/forgot-password"
              className="text-sm text-primary hover:underline"
            >
              Forgot password?
            </Link>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary text-white py-2 px-4 rounded-lg hover:bg-primary-dark disabled:opacity-50 disabled:cursor-not-allowed transition-colors !pointer-events-auto"
            style={{ pointerEvents: loading ? 'none' : 'auto' }}
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>

          {error && (
            <div className="mt-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
              {error}
            </div>
          )}
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            Don&apos;t have an account?{" "}
            <Link href="/auth/sign-up" className="text-primary hover:underline">
              Sign up
            </Link>
          </p>
        </div>
    </>
  );
}
