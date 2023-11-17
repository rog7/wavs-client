"use client";
import Feed from "@/components/Feed";
import Main from "@/components/Main";
import SettingsComponent from "@/components/Settings";
import { clearStorage, getItem } from "@/utils/localStorage";
import jwt, { JwtPayload } from "jsonwebtoken";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const Settings = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [showMenu, setShowMenu] = useState(false);

  useEffect(() => {
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
      }
    } else {
      router.push("/sign-in");
    }
  }, []);

  const logOut = () => {
    clearStorage();
    router.push("/sign-in");
  };

  return (
    !isLoading && (
      <Main page={"settings"}>
        <SettingsComponent />
      </Main>
    )
  );
};

export default Settings;
