import { useLocation } from "react-router-dom";
import { menuRoutes } from "../routes/menuRoutes";

const useGlobalLocation = () => {
  const location = useLocation();
  //Find "Home" and "ItemDetail" locations
  const currentRoute = menuRoutes.find(
    (route) => route.path === location.pathname
  );
  const isHome = currentRoute?.id === "home";
  const isCart = currentRoute?.id === "cart";
  const isDashboard = currentRoute?.id === "dashboard";
  const isCheckout = currentRoute?.id === "checkout";
  const isContactUs = currentRoute?.id === "contact";
  const isCompletion = currentRoute?.id === "completion";
  const isUserOrder = currentRoute?.id === "user-orders";


  return {
    isHome,
    isCart,
    isDashboard,
    isCheckout,
    isContactUs,
    isCompletion,
    isUserOrder,
  };
};
export default useGlobalLocation;
