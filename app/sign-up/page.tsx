"use client";
import { Logo } from "@/components/Logo";
import { API_BASE_URL } from "@/utils/globalVars";
import { useRouter } from "next/navigation";
import { useState } from "react";
import MoonLoader from "react-spinners/MoonLoader";

export default function SignUp() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showMessage, setShowMessage] = useState(false);
  const [showLoadingSpinner, setShowLoadingSpinner] = useState(false)
  const router = useRouter()

  const signUpUser = async () => {
    setError("");
    if (email === "" || password === "") {
      return;
    }

    setShowLoadingSpinner(true)

    const obj = {
      email,
      password,
    };

    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/sign-up`, {
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
      <div className="sm:mx-auto sm:w-full sm:max-w-sm flex flex-col justify-center items-center">
      <div className="cursor-pointer" onClick={() => router.push("/")}>
              <Logo />
            </div>
            <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
              Create a new account
            </h2>
          </div>

        {!showMessage ? (
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
              <div>
                <div className="flex items-center justify-between">
                  <label
                    htmlFor="password"
                    className="block text-sm font-medium leading-6 text-gray-900"
                  >
                    Password
                  </label>
                </div>
                <div className="mt-2">
                  <input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="current-password"
                    required
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-slate-600 sm:text-sm sm:leading-6"
                    onChange={(e) => setPassword(e.target.value)}
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
                  onClick={signUpUser}
                  disabled={showLoadingSpinner}
                >
                 {showLoadingSpinner ? <MoonLoader size={20} color="white" /> : "Sign Up"}
                </button>
              </div>
            </div>

            <p className="mt-10 text-center text-sm text-gray-500">
              Have an account?{" "}
              <a
                href="/sign-in"
                className="font-semibold leading-6 text-slate-900 hover:text-slate-700 underline underline-offset-1"
              >
                Sign In Now
              </a>
            </p>
          </div>
        ) : (
          <h2 className="mt-10 text-center text-2xl font-bold tracking-tight text-green-600">
            You've successfully signed up. Please check your email to confirm
            your account before signing in.
          </h2>
        )}
      </div>
    </>
  );
}
