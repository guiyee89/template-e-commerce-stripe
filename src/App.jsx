import GlobalStyles from "./GlobalStyles";
import { BrowserRouter} from "react-router-dom";
import CartContextProvider from "./components/context/CartContext";
import GlobalToolsProvider from "./components/context/GlobalToolsContext";
import AuthContextProvider from "./components/context/AuthContext";
import { AppRouter } from "./components/routes/AppRouter";

function App() {
  return (
    <>
      <BrowserRouter>
        <CartContextProvider>
          <AuthContextProvider>
            <GlobalToolsProvider>
              <AppRouter />
            </GlobalToolsProvider>
          </AuthContextProvider>
        </CartContextProvider>
      </BrowserRouter>
      <GlobalStyles />
    </>
  );
}

export default App;
