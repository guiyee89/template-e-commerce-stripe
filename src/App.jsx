import GlobalStyles from "./GlobalStyles";
import { BrowserRouter } from "react-router-dom";
import CartContextProvider from "./components/context/CartContext";
import GlobalToolsProvider from "./components/context/GlobalToolsContext";
import AuthContextProvider from "./components/context/AuthContext";
import { AppRouter } from "./components/routes/AppRouter";
import { loadStripe } from "@stripe/stripe-js";
/* import { Elements } from "@stripe/react-stripe-js"; */


const stripePromise = loadStripe(import.meta.env.VITE_PUBLIC_KEY);


function App() {
 
  return (
    <>
      <BrowserRouter>
        <CartContextProvider>
          <AuthContextProvider>
            <GlobalToolsProvider>
              {/* <Elements stripe={stripePromise}> */}
                <AppRouter />
              {/* </Elements> */}
            </GlobalToolsProvider>
          </AuthContextProvider>
        </CartContextProvider>
      </BrowserRouter>
      <GlobalStyles />
    </>
  );
}

export default App;
