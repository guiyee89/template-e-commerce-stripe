import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

export const useGlobalLoader = () => {
  const [globalLoading, setGlobalLoading] = useState(true);
  const location = useLocation();

  //Global "Flash" Conditional
  useEffect(() => {
    setGlobalLoading(true);
    const timer = setTimeout(() => {
      setGlobalLoading(false);
    }, 50);

    return () => clearTimeout(timer);
  }, [location]);

  return globalLoading;
};
