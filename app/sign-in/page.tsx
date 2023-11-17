"use client";
import { clearStorage, getItem, setItem } from "@/utils/localStorage";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import jwt, { JwtPayload } from "jsonwebtoken";
import { API_BASE_URL } from "@/utils/globalVars";
import MoonLoader from "react-spinners/MoonLoader";
import { Logo } from "@/components/Logo";

export default function SignIn() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [showLoadingSpinner, setShowLoadingSpinner] = useState(false)

  useEffect(() => {
    // Extract access_token from the URL
    const urlParams = new URLSearchParams(window.location.hash.substring(1));
    const access_token = urlParams.get("access_token");

    if (access_token) {
      const tokenPayload = jwt.decode(access_token) as JwtPayload;
      const tokenExpirationTime = tokenPayload.exp as number;
      const currentTime = Math.floor(Date.now() / 1000);

      if (tokenExpirationTime < currentTime) {
        // Token is expired, remove it
        clearStorage();
        setIsLoading(false);
      } else {
        setItem("auth-token", access_token);
        // Token is valid, redirect to home
        router.push("/home");
      }
    } else {
      const authToken = getItem("auth-token");
      if (authToken !== null) {
        const tokenPayload = jwt.decode(authToken) as JwtPayload;
        const tokenExpirationTime = tokenPayload.exp as number;
        const currentTime = Math.floor(Date.now() / 1000);

        if (tokenExpirationTime > currentTime) {
          // Token is valid, redirect to home

          router.push("/home");
        } else {
          // Token is expired, clear storage
          clearStorage();
          setIsLoading(false);
        }
      } else {
        setIsLoading(false);
      }
    }
  }, []);

  const signInUser = async () => {
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
      const response = await fetch(`${API_BASE_URL}/api/auth/sign-in`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(obj),
      });

      const data = await response.json();

      if (response.status === 200) {
        const authToken = response.headers.get("Authorization")!.split(" ")[1];
        setItem("auth-token", authToken);

        router.push("/home");
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
      {!isLoading && (
        <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
          <div className="sm:mx-auto sm:w-full sm:max-w-sm flex flex-col justify-center items-center">
          <div className="cursor-pointer" onClick={() => router.push("/")}>
              <Logo />
            </div>
            <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
              Sign in to your account
            </h2>
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

              <div>
                <div className="flex items-center justify-between">
                  <label
                    htmlFor="password"
                    className="block text-sm font-medium leading-6 text-gray-900"
                  >
                    Password
                  </label>
                  <div className="text-sm">
                    <a
                      href="/reset-password"
                      className="font-semibold text-slate-600 hover:text-slate-500"
                    >
                      Forgot password?
                    </a>
                  </div>
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
                  onClick={signInUser}
                  disabled={showLoadingSpinner}
                >
                  {showLoadingSpinner ? <MoonLoader size={20} color="white" /> : "Sign in"}
                </button>
              </div>
            </div>

            <p className="mt-10 text-center text-sm text-gray-500">
              Don't have an account?{" "}
              <a
                href="/sign-up"
                className="font-semibold leading-6 text-slate-900 hover:text-slate-700 underline underline-offset-1"
              >
                Sign Up Now
              </a>
            </p>
          </div>
        </div>
      )}
    </>
  );
}
