"use client";
import { API_BASE_URL } from "@/utils/globalVars";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import MoonLoader from "react-spinners/MoonLoader";

export default function UpdatePassword() {
  const route = useRouter();
  const [error, setError] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [showLoadingSpinner, setShowLoadingSpinner] = useState(false)

  useEffect(() => {
    // Extract access_token from the URL
    const urlParams = new URLSearchParams(window.location.hash.substring(1));
    const refreshToken = urlParams.get("refresh_token");

    if (refreshToken) {
      setIsLoading(false);
    } else {
      route.push("/reset-password");
    }
  }, []);

  const updatePassword = async () => {
    if (password === "") {
      return;
    }

    setShowLoadingSpinner(true)

    // Extract access_token from the URL
    const urlParams = new URLSearchParams(window.location.hash.substring(1));
    const refreshToken = urlParams.get("refresh_token");

    if (refreshToken) {
      const obj = {
        password,
        refreshToken,
      };

      try {
        const response = await fetch(
          `${API_BASE_URL}/api/auth/update-password`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(obj),
          }
        );

        const data = await response.json();

        if (response.status === 200) {
          route.push("/sign-in");
        } else {
          setShowLoadingSpinner(false)
          setError(data.message);
        }
      } catch (error) {
        setShowLoadingSpinner(false)
        setError("Something went wrong. Please try again later.");
      }
    } else {
      route.push("/forgot-password");
    }
  };

  return (
    <>
      {!isLoading && (
        <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
          <div className="sm:mx-auto sm:w-full sm:max-w-sm">
            <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
              Update Your Password
            </h2>
          </div>

          <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
            <div className="space-y-6">
              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  New Password
                </label>
                <div className="mt-2">
                  <input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="password"
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
                  className="flex w-full justify-center rounded-md bg-[#0070F3] px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
                  onClick={updatePassword}
                  disabled={showLoadingSpinner}
                >
                  {showLoadingSpinner ? <MoonLoader size={20} color="white" /> : "Update Password"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
