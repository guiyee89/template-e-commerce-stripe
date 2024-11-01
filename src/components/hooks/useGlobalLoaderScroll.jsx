import { useContext, useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { GlobalToolsContext } from "../context/GlobalToolsContext";

////////////////////////////////////////////////////
export const useGlobalLoaderScroll = () => {
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
  }, []);
  ////////////////////////////////////////////////////
  useEffect(() => {
    // Global "Flash" loading state
    setGlobalLoadingScroll(true);
    const timer = setTimeout(() => {
      setGlobalLoadingScroll(false);
    }, 200);

    return () => clearTimeout(timer);
  }, [location]);

  return globalLoadingScroll;
};
