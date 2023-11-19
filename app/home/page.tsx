"use client";
import Feed from "@/components/Feed";
import Main from "@/components/Main";
import { API_BASE_URL, POSTHOG_API_KEY } from "@/utils/globalVars";
import { clearStorage, getItem, setItem } from "@/utils/localStorage";
import jwt, { JwtPayload } from "jsonwebtoken";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import posthog from "posthog-js";
import { IsProUserContext } from "@/exports/IsProUserContext";

const Home = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [isProUser, setIsProUser] = useState(false);

  useEffect(() => {
    userIsAuthenticated();
    checkSubscriptionStatus();

    posthog.init(POSTHOG_API_KEY as string, {
      api_host: "https://app.posthog.com"
    });
    // Set up an interval to run checkSubscriptionStatus every minute (60000 milliseconds)
    const subscriptionStatusInterval = setInterval(() => {
      checkSubscriptionStatus();
    }, 60000);

    // Clean up the interval when the component unmounts
    return () => {
      clearInterval(subscriptionStatusInterval);
    };
  }, []);

  const checkSubscriptionStatus = async () => {
    const authToken = getItem("auth-token");

    if (authToken !== null) {
      try {
        const response = await fetch(`${API_BASE_URL}/api/users/status`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + authToken,
            "ngrok-skip-browser-warning": "69420",
          },
        });

        // await response.json();

        if (response.status === 200) {
          const authToken = response.headers
            .get("Authorization")!
            .split(" ")[1];

          setItem("auth-token", authToken);

          const decoded = jwt.decode(authToken) as JwtPayload;
          setIsProUser(decoded.isProUser);
        }
      } catch (error) {
        console.log("Something went wrong. Please try again later.");
      }
    }
  };

  const userIsAuthenticated = () => {
    const authToken = getItem("auth-token");
    if (authToken !== null) {
      const tokenPayload = jwt.decode(authToken) as JwtPayload;

      // Get the expiration time from the decoded token
      const tokenExpirationTime = tokenPayload.exp as number;
      // Get the current server time
      const currentTime = Math.floor(Date.now() / 1000); // Current time in seconds

      if (tokenExpirationTime < currentTime) {
        logOut();
      } else {
        setIsLoading(false);
        posthog.identify(tokenPayload.sub, {
          email: tokenPayload.email,
          userId: tokenPayload.sub,
          isProUser: tokenPayload.isProUser,
        });
      }
    } else {
      return router.push("/sign-in");
    }
  };

  const logOut = () => {
    clearStorage();
    router.push("/sign-in");
  };

  return (
    !isLoading && (
      <IsProUserContext.Provider value={{ isProUser, setIsProUser }}>
        <Main page={"home"}>
          <Feed showFavorites={false} />
        </Main>
      </IsProUserContext.Provider>
    )
  );
};

export default Home;
