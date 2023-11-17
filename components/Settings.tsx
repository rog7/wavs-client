import { API_BASE_URL, STRIPE_PAYMENT_LINK } from "@/utils/globalVars";
import { getItem, setItem } from "@/utils/localStorage";
import { useEffect, useState } from "react";
import { BarLoader } from "react-spinners";
import MoonLoader from "react-spinners/MoonLoader";

export default function Settings() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword1, setNewPassword1] = useState("");
  const [newPassword2, setNewPassword2] = useState("");
  const [currentPlan, setCurrentPlan] = useState("");
  const [subscriptionId, setSubscriptionId] = useState("");
  const [subscriptionRenewalDate, setSubscriptionRenewalDate] = useState("");
  const [subscriptionExpirationDate, setSubscriptionExpirationDate] =
    useState("");

  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  const [disableResumeButton, setDisableResumeButton] = useState(false);
  const [disableCancelButton, setDisableCancelButton] = useState(false);

  const [showLoadingSpinner, setShowLoadingSpinner] = useState(false)

  useEffect(() => {
    getSubscriptionDetails().then(() => setIsLoading(false));
    const subscriptionStatusInterval = setInterval(() => {
      getSubscriptionDetails();
    }, 60000);

    // Clean up the interval when the component unmounts
    return () => {
      clearInterval(subscriptionStatusInterval);
    };
  }, []);

  const updatePassword = async () => {
    if (
      newPassword1.length === 0 ||
      newPassword2.length === 0 ||
      currentPassword.length === 0
    ) {
      return;
    }

    if (newPassword1 !== newPassword2) {
      setError("Passwords do not match");

      return;
    }

    setShowLoadingSpinner(true)
    const authToken = getItem("auth-token");

    const obj = {
      oldPassword: currentPassword,
      newPassword: newPassword1,
    };

    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/change-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + authToken,
        },
        body: JSON.stringify(obj),
      });

      const data = await response.json();

      if (response.status === 200) {
        const currentPasswordInput = document.getElementById(
          "current-password"
        ) as HTMLInputElement;
        currentPasswordInput.value = "";

        const newPasswordInput = document.getElementById(
          "new-password"
        ) as HTMLInputElement;
        newPasswordInput.value = "";

        const confirmPasswordInput = document.getElementById(
          "confirm-password"
        ) as HTMLInputElement;
        confirmPasswordInput.value = "";

        setCurrentPassword("");
        setNewPassword1("");
        setNewPassword2("");
        setError("");
      } else {
        setError(data.message);
      }
    } catch (error) {
      setError("Something went wrong. Please try again later.");
    }

    setShowLoadingSpinner(false)
  };

  const getSubscriptionDetails = async () => {
    const authToken = getItem("auth-token");

    try {
      const response = await fetch(
        `${API_BASE_URL}/api/users/subscription_details`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + authToken,
            "ngrok-skip-browser-warning": "69420",
          },
        }
      );

      const data = await response.json();

      if (response.status === 200) {
        const authToken = response.headers.get("Authorization")!.split(" ")[1];
        setItem("auth-token", authToken);

        if (data.currentPlan === "Pro") {
          setCurrentPlan(data.currentPlan);
          setSubscriptionId(data.subscriptionId);
          setSubscriptionRenewalDate(data.renewalDate);
          setSubscriptionExpirationDate(data.expirationDate);
        } else {
          // User is on starter plan
          setCurrentPlan(data.currentPlan);
          setSubscriptionId("");
          setSubscriptionRenewalDate("");
          setSubscriptionExpirationDate("");
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  const continueSubscription = async () => {
    setDisableResumeButton(true);
    try {
      await fetch(`${API_BASE_URL}/api/users/continue_subscription`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + getItem("auth-token"),
          "ngrok-skip-browser-warning": "69420",
        },
        body: JSON.stringify({
          subscriptionId,
        }),
      });

      await getSubscriptionDetails();
      setDisableResumeButton(false);
    } catch (error) {
      console.log(error);
    }
  };

  const cancelSubscription = async () => {
    setDisableCancelButton(true);
    try {
      await fetch(`${API_BASE_URL}/api/users/cancel_subscription`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + getItem("auth-token"),
          "ngrok-skip-browser-warning": "69420",
        },
        body: JSON.stringify({
          subscriptionId,
        }),
      });

      await getSubscriptionDetails();
      setDisableCancelButton(false);
    } catch (error) {
      console.log(error);
    }
  };

  return isLoading ? (
    <div className="flex justify-center mt-60">
      <BarLoader color="#000000" />
    </div>
  ) : (
    <main>
      {currentPlan == "Starter" && (
        <div className="grid justify-center max-w-7xl grid-cols-1 gap-x-8 gap-y-10 px-4 py-8 sm:px-6 md:grid-cols-3">
          <div>
            <h2 className="text-xl font-semibold leading-7">Current plan</h2>
          </div>

          <div className="md:col-span-2">
            <p className="block font-medium leading-6">Starter Plan</p>

            <button
              type="submit"
              className="mt-4 rounded-md bg-[#0070F3] px-3.5 py-2.5 font-semibold text-white shadow-sm"
              onClick={() => {
                window.open(STRIPE_PAYMENT_LINK, "_blank");
              }}
            >
              Upgrade to Pro
            </button>
          </div>
        </div>
      )}

      {currentPlan == "Pro" && subscriptionRenewalDate.length > 0 && (
        <div className="grid justify-center max-w-7xl grid-cols-1 gap-x-8 gap-y-10 px-4 py-8 sm:px-6 md:grid-cols-3">
          <div>
            <h2 className="text-xl font-semibold leading-7">Current plan</h2>
          </div>

          <div className="md:col-span-2">
            <p className="block font-medium leading-6">Pro Plan</p>
            <p className="mt-1 leading-6 text-sm text-gray-400">
              {`Your subscription renews on ${subscriptionRenewalDate} for $5.`}
            </p>
            <button
              type="submit"
              className="mt-4 rounded-md bg-[#0070F3] px-3.5 py-2.5 font-semibold text-white shadow-sm"
              disabled={disableCancelButton}
              onClick={cancelSubscription}
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {currentPlan == "Pro" && subscriptionExpirationDate.length > 0 && (
        <div className="grid justify-center max-w-7xl grid-cols-1 gap-x-8 gap-y-10 px-4 py-8 sm:px-6 md:grid-cols-3">
          <div>
            <h2 className="text-xl font-semibold leading-7">Current plan</h2>
          </div>

          <div className="md:col-span-2">
            <p className="block font-medium leading-6">Pro Plan</p>
            <p className="mt-1 leading-6 text-sm text-gray-400 max-w-md">
              {`Your subscription has been cancelled. Access to Pro features ends
              ${subscriptionExpirationDate}. If you wish to continue, you will need to resume
              your subscription.`}
            </p>
            <button
              type="submit"
              className="mt-4 rounded-md bg-[#0070F3] px-3.5 py-2.5 font-semibold text-white shadow-sm"
              disabled={disableResumeButton}
              onClick={continueSubscription}
            >
              Resume
            </button>
          </div>
        </div>
      )}

      <div className="grid justify-center max-w-7xl grid-cols-1 gap-x-8 gap-y-10 px-4 py-8 sm:px-6 md:grid-cols-3">
        <div>
          <h2 className="text-xl font-semibold leading-7">Change password</h2>
          <p className="mt-1 leading-6 text-gray-400">
            Update your password associated with your account.
          </p>
        </div>

        <div className="md:col-span-2">
          <div className="grid grid-cols-1 gap-x-6 gap-y-8 sm:max-w-xl sm:grid-cols-6">
            <div className="col-span-full">
              <label
                htmlFor="current-password"
                className="block font-medium leading-6"
              >
                Current password
              </label>
              <div className="mt-2">
                <input
                  id="current-password"
                  name="current_password"
                  type="password"
                  autoComplete="current-password"
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-slate-600 sm:text-sm sm:leading-6"
                  onChange={(e) => setCurrentPassword(e.target.value)}
                />
              </div>
            </div>

            <div className="col-span-full">
              <label
                htmlFor="new-password"
                className="block font-medium leading-6"
              >
                New password
              </label>
              <div className="mt-2">
                <input
                  id="new-password"
                  name="new_password"
                  type="password"
                  autoComplete="new-password"
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-slate-600 sm:text-sm sm:leading-6"
                  onChange={(e) => setNewPassword1(e.target.value)}
                />
              </div>
            </div>

            <div className="col-span-full">
              <label
                htmlFor="confirm-password"
                className="block font-medium leading-6"
              >
                Confirm password
              </label>
              <div className="mt-2">
                <input
                  id="confirm-password"
                  name="confirm_password"
                  type="password"
                  autoComplete="new-password"
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-slate-600 sm:text-sm sm:leading-6"
                  onChange={(e) => setNewPassword2(e.target.value)}
                />
              </div>
            </div>
          </div>

          {error.length > 0 && (
            <p className="mt-4 leading-6 text-red-400">{error}</p>
          )}
          <div className="mt-8">
            <button
              type="submit"
              className="flex justify-center rounded-md bg-[#0070F3] px-3.5 py-2.5 h-10 font-semibold text-white shadow-sm"
                onClick={updatePassword}
                disabled={showLoadingSpinner}
            >
              {showLoadingSpinner ? <MoonLoader size={20} color="white" /> : "Save"}
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
