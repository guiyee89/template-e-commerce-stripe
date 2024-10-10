import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const useScrollRestoration = () => {
  const location = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  }, [location]);

  // useEffect(() => {
  //   return () => {
  //     localStorage.setItem("scrollPosition", window.scrollY.toString());
  //   };
  // }, []);
};

export default useScrollRestoration;
