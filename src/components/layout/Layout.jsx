import { Outlet } from "react-router-dom";
import { Footer } from "./footer/Footer";
import styled from "styled-components/macro";
import useScrollRestoration from "../hooks/useScrollRestoration";
import { SideCart } from "../pages/cart/SideCart";
import { useContext, useEffect } from "react";
import { GlobalToolsContext } from "../context/GlobalToolsContext";
import { LoadingTopBar } from "../common/loadingTopBars/LoadingTopBar";
import { HeroLanding } from "../pages/landingPage/hero/HeroLanding";
import { NewsLetter } from "./newsletter/NewsLetter";
import { useGlobalLoader } from "../hooks/useGlobalLoader";
import { HeroSmall } from "./heroSmall/HeroSmall";
import useGlobalLocation from "../hooks/useGlobalLocation";
import { NavDesktop } from "./navbar/navDesktop/NavDesktop";
import { NavMobile } from "./navbar/navMobile/NavMobile";

////////////////////////////////////////////////////

export const Layout = () => {
  //Restore scroll to top on navigation
  useScrollRestoration();

  ////////////////////////////////////////////////////
  //SideMenu Context
  const { isCartOpen, isMenuOpen, isFilterOpen, windowWidth } =
    useContext(GlobalToolsContext);

  ////////////////////////////////////////////////////
  const globalLoading = useGlobalLoader(); //Flash loading effect

  ////////////////////////////////////////////////////
  const { isHome, isDashboard, isCheckout, isContactUs, isCompletion, isUserOrder } =
    useGlobalLocation();

  ////////////////////////////////////////////////////
  // Prevent scrolling when the SideCart is open
  useEffect(() => {
    if (isCartOpen && isMenuOpen && isFilterOpen) {
      document.body.style.overflow = "visible";
    } else {
      document.body.style.overflow = "hidden";
    }
  }, [isCartOpen, isMenuOpen, isFilterOpen]);

  ////////////////////////////////////////////////////

  return (
    <>
      <Wrapper
        isCartOpen={isCartOpen}
        isMenuOpen={isMenuOpen}
        isFilterOpen={isFilterOpen}
        windowWidth={windowWidth}
      >
        {!isHome && <LoadingTopBar />}
        <>
          {globalLoading ? (
            <LoadingScreen />
          ) : (
            <>
              {isDashboard ? (
                windowWidth > 1100 ? (
                  <NavDesktop />
                ) : (
                  <NavMobile />
                )
              ) : windowWidth > 900 ? (
                <NavDesktop />
              ) : (
                <NavMobile />
              )}

              <SideCart />
              {!isHome &&
                !isDashboard &&
                !isCheckout &&
                !isContactUs &&
                !isCompletion &&
                !isUserOrder && <HeroSmall />}

              <HeroWrapper>{isHome && <HeroLanding />}</HeroWrapper>

              <OutletWrapper isHome={isHome} isCheckout={isCheckout}>
                <Outlet />
              </OutletWrapper>
              {!isDashboard && <NewsLetter />}
              <Footer />
            </>
          )}
        </>
      </Wrapper>
    </>
  );
};

const Wrapper = styled.div`
  // min-height: 100%;
  overflow-x: clip;
  padding: ${({ isCartOpen, windowWidth }) =>
    windowWidth > 830 ? (isCartOpen ? "0" : "0 17px 0 0") : "0"};
`;

const LoadingScreen = styled.div`
  max-height: 100vh;
`;

const OutletWrapper = styled.div`
  //min-height: ${({ isCheckout }) => (isCheckout ? "auto" : "100vh;")};
  min-height: ${({ isCheckout }) => (isCheckout ? "auto" : "85vh;")};
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: ${({ isCheckout }) => (isCheckout ? "0" : "0 20px")};
  @media (max-width: 1150px) {
    margin: ${({ isCheckout }) => (isCheckout ? "0" : "0 5px 0 5px")};
  }
  @media (max-width: 1088px) {
    padding-top: 0;
  }
  @media (max-width: 900px) {
    margin: ${({ isCheckout }) => (isCheckout ? "0" : "0 8px 0 8px")};
  }
`;

const HeroWrapper = styled.div`
  background-color: white;
  @media (max-width: 68rem) {
    margin-bottom: 25px;
  }
`;
