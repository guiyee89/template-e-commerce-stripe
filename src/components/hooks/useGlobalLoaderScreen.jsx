import { useContext, useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { GlobalToolsContext } from "../context/GlobalToolsContext";

////////////////////////////////////////////////////
//! Used on Layout
export const useGlobalLoaderScreen = () => {
  const [globalLoadingScroll, setGlobalLoadingScroll] = useState(true);
  const location = useLocation();
  const { setScrollDirection, scrollDirection } =
    useContext(GlobalToolsContext);

  ////////////////////////////////////////////////////
  useEffect(() => {
    // Scroll restoration logic
    window.scrollTo({ top: 0, behavior: "instant" });
    if (scrollDirection === "down") {
      setScrollDirection("up");
    }
  }, [location]);

  ////////////////////////////////////////////////////
  useEffect(() => {
    // Global "Flash" loading state
    setGlobalLoadingScroll(true);
    const timer = setTimeout(() => {
      window.scrollTo({ top: 0, behavior: "instant" });
      setGlobalLoadingScroll(false);
    }, 400);

    return () => clearTimeout(timer);
  }, [location]);

  return globalLoadingScroll;
};
