import { createContext } from "react";

interface IsProUserContextType {
    isProUser: boolean;
    setIsProUser: React.Dispatch<React.SetStateAction<boolean>>;
  }
  
  export const IsProUserContext = createContext<IsProUserContextType>({
    isProUser: false,
    setIsProUser: () => {},
  });