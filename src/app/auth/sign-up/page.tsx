"use client";

import Signup from "@/components/Auth/Signup";
import { ProtectedRoute } from "@/components/Auth/ProtectedRoute";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import type { Metadata } from "next";
import Image from "next/image";

// Note: metadata export removed because this is now a client component

export default function SignUp() {
  return (
    <ProtectedRoute requireAuth={false}>
      <>
        <Breadcrumb pageName="Sign Up" />

        <div className="rounded-[10px] bg-white shadow-1 dark:bg-dark-2 dark:shadow-card border border-gray-200 dark:border-dark-3">
          <div className="flex flex-wrap items-center">
            <div className="w-full xl:w-1/2">
              <div className="w-full p-4 sm:p-12.5 xl:p-15">
                <Signup />
              </div>
            </div>

            <div className="hidden w-full p-7.5 xl:block xl:w-1/2">
              <div className="bg-white overflow-hidden rounded-2xl px-12.5 pt-12.5 dark:bg-white">
                <div className="mb-10 w-full flex justify-center">
                  <div className="flex items-center gap-2">
                    <Image
                      src={"/images/logo/logo-icon.svg"}
                      alt="Logo Icon"
                      width={32}
                      height={32}
                    />
                    <span className="text-2xl font-bold text-gray-900 dark:text-white">
                      GowithMRT
                    </span>
                  </div>
                </div>
                <p className="mb-3 text-xl font-medium text-gray-900 dark:text-white">
                  Monitor user activity, manage requests, and ensure smooth operations.
                </p>

                <div className="mt-10 mb-10">
                  <Image
                    src={"/images/illustration/illustration-03.svg"}
                    alt="Illustration"
                    width={400}
                    height={400}
                    className="mx-auto dark:opacity-30"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </>
    </ProtectedRoute>
  );
} 