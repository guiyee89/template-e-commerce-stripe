import { useContext, useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { GlobalToolsContext } from "../context/GlobalToolsContext";

export const useGlobalLoader = () => {
  const [globalLoading, setGlobalLoading] = useState(true);
  const location = useLocation();
  const { setScrollDirection } = useContext(GlobalToolsContext);

  //Global "Flash" Conditional
  useEffect(() => {
    setScrollDirection("up");
    setGlobalLoading(true);
    const timer = setTimeout(() => {
      setGlobalLoading(false);
    }, 50);

    return () => clearTimeout(timer);
  }, [location]);

  return globalLoading;
};
