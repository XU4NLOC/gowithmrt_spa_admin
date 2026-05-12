import Link from "next/link";
import SignupWithPassword from "../SignupWithPassword";

export default function Signup() {
  return (
    <>
      <h1 className="mb-6 text-2xl font-bold text-gray-900 dark:text-white text-center">
        Sign Up for the Back Office
      </h1>
      <p className="mb-6 text-sm text-gray-600 dark:text-gray-300 text-center">
        Create an admin account. Only one admin account is allowed in the system.
      </p>

      <div>
        <SignupWithPassword />
      </div>

      <div className="mt-6 text-center">
        <p>
          Already have an account?{" "}
          <Link href="/auth/sign-in" className="text-primary">
            Sign In
          </Link>
        </p>
      </div>
    </>
  );
} 