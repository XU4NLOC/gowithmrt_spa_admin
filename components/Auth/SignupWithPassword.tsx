"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { API_ENDPOINTS } from '@/config/api';
import InputGroup from "../FormElements/InputGroup";
import { AuthThemeToggle } from "../Layouts/header/theme-toggle";


export default function SignupWithPassword() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    fname: "",
    lname: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [redirectCountdown, setRedirectCountdown] = useState(0);
  const router = useRouter();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Validation
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (formData.password.length < 8) {
      setError("Password must be at least 8 characters long");
      return;
    }

    setIsLoading(true);

    try {
      const requestBody = {
        email: formData.email,
        password: formData.password,
        fname: formData.fname,
        lname: formData.lname,
      };
      
      const response = await fetch(API_ENDPOINTS.auth.admin.signup, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });

      let data;
      try {
        data = await response.json();
      } catch (parseError) {
        setError("Invalid response from server");
        return;
      }

      if (response.ok) {
        // Success - redirect to signin page
        router.push("/auth/sign-in");
      } else {
        // Handle specific error for admin account already exists
        if (data.message && data.message.includes("already exists")) {
          setError("Admin account already exists. Only one admin account is allowed in the system. Please sign in with the existing account.");
          // Auto redirect to signin page after 3 seconds with countdown
          setRedirectCountdown(3);
          setTimeout(() => {
            const countdownInterval = setInterval(() => {
              setRedirectCountdown(prev => {
                if (prev <= 1) {
                  clearInterval(countdownInterval);
                  setTimeout(() => {
                    router.push("/auth/sign-in");
                  }, 100);
                  return 0;
                }
                return prev - 1;
              });
            }, 1000);
          }, 100);
        } else {
          setError(data.message || `Signup failed with status: ${response.status}`);
        }
      }
    } catch (err) {
      setError("Network error. Please try again.");
    } finally {
      setIsLoading(false);
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
          type="text"
          name="fname"
          label="First Name"
          placeholder="Enter your first name"
          value={formData.fname}
          handleChange={handleInputChange}
          required
          disabled={isLoading}
        />
      </div>

      <div className="mb-4">
        <InputGroup
          type="text"
          name="lname"
          label="Last Name"
          placeholder="Enter your last name"
          value={formData.lname}
          handleChange={handleInputChange}
          required
          disabled={isLoading}
        />
      </div>

      <div className="mb-4">
        <InputGroup
          type="email"
          name="email"
          label="Email"
          placeholder="Enter your email"
          value={formData.email}
          handleChange={handleInputChange}
          required
          disabled={isLoading}
        />
      </div>

      <div className="mb-4">
        <InputGroup
          type="password"
          name="password"
          label="Password"
          placeholder="Enter your password"
          value={formData.password}
          handleChange={handleInputChange}
          required
          disabled={isLoading}
          showPasswordToggle={true}
        />
      </div>

      <div className="mb-6">
        <InputGroup
          type="password"
          name="confirmPassword"
          label="Confirm Password"
          placeholder="Confirm your password"
          value={formData.confirmPassword}
          handleChange={handleInputChange}
          required
          disabled={isLoading}
          showPasswordToggle={true}
        />
      </div>

      {error && (
        <div className="mb-4 text-red-500 text-sm text-center">
          {error}
          {redirectCountdown > 0 && (
            <div className="mt-2 text-blue-600">
              Redirecting to sign in page in {redirectCountdown} seconds...
            </div>
          )}
        </div>
      )}

      <button
        type="submit"
        disabled={isLoading}
        className="w-full cursor-pointer rounded-lg border border-primary bg-primary p-4 text-white transition hover:bg-opacity-90 disabled:opacity-50"
      >
        {isLoading ? "Creating Account..." : "Sign Up"}
      </button>
    </form>
    </>
  );
} 