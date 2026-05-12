"use client";

import Link from "next/link";
import SigninWithPassword from "../SigninWithPassword";
import { useAuth } from "@/contexts/AuthContext";

export default function Signin() {
  const { isAuthenticated, user } = useAuth();
  
  // Use a stable key that changes only when user state changes
  const componentKey = `signin-${user ? 'has-user' : 'no-user'}-${isAuthenticated}`;
  
  return (
    <>
      <h1 className="mb-6 text-2xl font-bold text-gray-900 dark:text-white text-center">
        Login to the Back Office
      </h1>

      <div>
        <SigninWithPassword key={componentKey} />
      </div>
    </>
  );
}
