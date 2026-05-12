"use client";

import Signin from "@/components/Auth/Signin";
import { ProtectedRoute } from "@/components/Auth/ProtectedRoute";
import type { Metadata } from "next";
import Image from "next/image";

// Note: metadata export removed because this is now a client component

export default function SignIn() {
  return (
    <ProtectedRoute requireAuth={false}>
      <div className="flex min-h-screen items-center justify-center bg-gray-50 dark:bg-gray-dark p-4">
        <div className="w-full max-w-6xl">
          <div className="bg-white dark:bg-dark-2 rounded-lg shadow-lg overflow-hidden border border-gray-200 dark:border-dark-3">
            <div className="flex">
              {/* Left Section - Illustration */}
              <div className="hidden lg:flex lg:w-1/2 p-15">
                <div className="w-full">
                  <div className="mb-8 text-center">
                    <div className="flex items-center justify-center gap-2 mb-5">
                      <Image
                        src={"/images/logo/logo-black.png"}
                        alt="GowithMRT Logo"
                        width={32}
                        height={32}
                      />
                      <span className="text-2xl font-bold text-gray-900 dark:text-white">
                        GowithMRT
                      </span>
                    </div>
                    <p className="text-gray-600 dark:text-gray-300 text-lg">
                      Monitor user activity, manage requests, and ensure smooth operations.
                    </p>
                  </div>
                  
                  <div className="flex justify-center">
                    <Image
                      src={"/images/illustration/illustration-03.svg"}
                      alt="Illustration"
                      width={400}
                      height={400}
                      className="max-w-full h-auto"
                    />
                  </div>
                </div>
              </div>

              {/* Vertical Divider */}
              <div className="hidden lg:block w-px bg-gray-200 dark:bg-gray-600"></div>

              {/* Right Section - Login Form */}
              <div className="flex w-full lg:w-1/2 items-center justify-center p-12">
                <div className="w-full max-w-md">
                  <Signin />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
