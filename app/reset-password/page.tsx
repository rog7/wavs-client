"use client";
import { Logo } from "@/components/Logo";
import { API_BASE_URL } from "@/utils/globalVars";
import { useRouter } from "next/navigation";
import { useState } from "react";
import MoonLoader from "react-spinners/MoonLoader";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [showMessage, setShowMessage] = useState(false);
  const [showLoadingSpinner, setShowLoadingSpinner] = useState(false)
  const router = useRouter()

  const sendResetEmail = async () => {
    setError("");
    if (email === "") {
      return;
    }

    setShowLoadingSpinner(true)

    const obj = {
      email,
    };

    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/reset-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(obj),
      });

      const data = await response.json();

      if (response.status === 200) {
        setShowMessage(true);
      } else {
        setShowLoadingSpinner(false)
        setError(data.message);
      }
    } catch (error) {
      setShowLoadingSpinner(false)
      setError("Something went wrong. Please try again later.");
    }
  };

  return (
    <>
      <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
        {!showMessage ? (
          <>
            {" "}
            <div className="sm:mx-auto sm:w-full sm:max-w-sm">
              <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
                Reset Your Password
              </h2>

              <p className="text-center tracking-tight text-gray-600">
                Type in your email and we'll send you a link to reset your
                password
              </p>
            </div>
            <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
              <div className="space-y-6">
                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium leading-6 text-gray-900"
                  >
                    Email address
                  </label>
                  <div className="mt-2">
                    <input
                      id="email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      required
                      className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-slate-600 sm:text-sm sm:leading-6"
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                </div>
                {error && (
                  <div>
                    <p className="block text-center text-sm font-medium text-red-500">
                      {error}
                    </p>
                  </div>
                )}
                <div>
                  <button
                    type="submit"
                    className="flex w-full justify-center rounded-md bg-[#0070F3] px-3 py-1.5 h-9 text-sm font-semibold leading-6 text-white shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
                    onClick={sendResetEmail}
                    disabled={showLoadingSpinner}
                  >
                    {showLoadingSpinner ? <MoonLoader size={20} color="white" /> : "Send Reset Email"}
                  </button>
                </div>
              </div>

              <p className="mt-10 text-center text-sm text-gray-500">
                Already have an account?{" "}
                <a
                  href="/sign-in"
                  className="font-semibold leading-6 text-slate-900 hover:text-slate-700 underline underline-offset-1"
                >
                  Sign In
                </a>
              </p>
            </div>
          </>
        ) : (
          <div className="mx-auto w-full max-w-sm flex flex-col justify-center items-center">
              <div className="cursor-pointer" onClick={() => router.push("/")}>
              <Logo />
            </div>
            <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
            If there's an account that matches the information you submitted, you will receive password reset instructions to the email address you just entered.
            </h2>
          </div>
          // <h2 className="mt-10 text-center text-2xl font-bold tracking-tight text-green-600">
          //   If there's an account that matches the information you submitted, you will receive password reset instructions to the email address you just entered.
          // </h2>
        )}
      </div>
    </>
  );
}
