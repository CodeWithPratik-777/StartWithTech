import { createContext, useContext, useState } from "react";

const LoadingContext = createContext();

export const useLoading = () => useContext(LoadingContext);

export const LoadingProvider = ({ children }) => {
  const [isAppLoading, setIsAppLoading] = useState(false);

  return (
    <LoadingContext.Provider value={{ isAppLoading, setIsAppLoading }}>
      {children}
    </LoadingContext.Provider>
  );
};
