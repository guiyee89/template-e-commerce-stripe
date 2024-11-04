import { Outlet } from "react-router-dom";
import { Footer } from "./footer/Footer";
import styled from "styled-components/macro";
import { SideCart } from "../pages/cart/SideCart";
import { useContext, useEffect } from "react";
import { GlobalToolsContext } from "../context/GlobalToolsContext";
import { LoadingTopBar } from "../common/loadingTopBars/LoadingTopBar";
import { HeroLanding } from "../pages/landingPage/hero/HeroLanding";
import { NewsLetter } from "./newsletter/NewsLetter";
import { useGlobalLoaderScreen } from "../hooks/useGlobalLoaderScreen";
import { HeroSmall } from "./heroSmall/HeroSmall";
import useGlobalLocation from "../hooks/useGlobalLocation";
import { NavDesktop } from "./navbar/navDesktop/NavDesktop";
import { NavMobile } from "./navbar/navMobile/NavMobile";
import { LoadingScreen } from "./loadingScreen/LoadingScreen";

////////////////////////////////////////////////////

export const Layout = () => {
  ////////////////////////////////////////////////////
  //SideMenu Context
  const { isCartOpen, isMenuOpen, isMobileFilterOpen, windowWidth } =
    useContext(GlobalToolsContext);

  ////////////////////////////////////////////////////
  const globalLoadingScreen = useGlobalLoaderScreen(); //Flash loading effect

  ////////////////////////////////////////////////////
  const {
    isHome,
    isDashboard,
    isCheckout,
    isContactUs,
    isCompletion,
    isUserOrder,
  } = useGlobalLocation();

  ////////////////////////////////////////////////////
  // Prevent scrolling when the SideCart is open
  useEffect(() => {
    if (isCartOpen && isMenuOpen && isMobileFilterOpen) {
      document.body.style.overflow = "visible";
    } else {
      document.body.style.overflow = "hidden";
    }
  }, [isCartOpen, isMenuOpen, isMobileFilterOpen]);

  ////////////////////////////////////////////////////

  return (
    <>
      {globalLoadingScreen ? (
        <LoadingScreen />
      ) : (
        <>
          <Wrapper
            isCartOpen={isCartOpen}
            isMenuOpen={isMenuOpen}
            isMobileFilterOpen={isMobileFilterOpen}
            windowWidth={windowWidth}
          >
            {!isHome && <LoadingTopBar />}
            <>
              {!isDashboard &&
                !isCheckout &&
                !isContactUs &&
                !isCompletion &&
                !isUserOrder && <HeroSmall />}
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

              <HeroWrapper>{isHome && <HeroLanding />}</HeroWrapper>

              <OutletWrapper isHome={isHome} isCheckout={isCheckout}>
                <Outlet />
              </OutletWrapper>
              {!isDashboard && <NewsLetter />}
              <Footer />
            </>
          </Wrapper>
        </>
      )}
    </>
  );
};

const Wrapper = styled.div`
  min-height: 100vh;
  overflow-x: clip;
  padding: ${({ isCartOpen, windowWidth }) =>
    windowWidth > 830 ? (isCartOpen ? "0" : "0 17px 0 0") : "0"};
`;

const OutletWrapper = styled.div`
  min-height: ${({ isCheckout }) => (isCheckout ? "auto" : "100vh;")};
  display: flex;
  flex-direction: column;
  justify-content: center;
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
