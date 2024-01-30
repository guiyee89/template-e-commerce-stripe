import { useGlobalLoader } from "../hooks/useGlobalLoader";
import { Outlet, useLocation } from "react-router-dom";
import { menuRoutes } from "../routes/menuRoutes";
import { Footer } from "./footer/Footer";
import styled from "styled-components/macro";
import { HeroLanding } from "./hero/HeroLanding";
import { NewsLetter } from "./newsletter/NewsLetter";
import useScrollRestoration from "../hooks/useScrollRestoration";
import { HeroSmall } from "./hero/HeroSmall";
import { SideCart } from "../pages/cart/SideCart";
import { useContext, useEffect, useState } from "react";
import { GlobalToolsContext } from "../context/GlobalToolsContext";
import { NavMobile } from "./navbar/NavMobile";
import { NavDesktop } from "./navbar/NavDesktop";
import { LoadingTopBar } from "../common/loadingTopBars/LoadingTopBar";

////////////////////////////////////////////////////

export const Layout = () => {
  //Restore scroll to top on navigation
  useScrollRestoration();
  ////////////////////////////////////////////////////
  //SideMenu Context
  const { isOpen, isMenuOpen, isFilterOpen, windowWidth } =
    useContext(GlobalToolsContext);

  ////////////////////////////////////////////////////
  const globalLoading = useGlobalLoader(); //Flash loading effect

  ////////////////////////////////////////////////////
  // Prevent scrolling when the SideCart is open
  useEffect(() => {
    if (isOpen && isMenuOpen && isFilterOpen) {
      document.body.style.overflow = "visible";
    } else {
      document.body.style.overflow = "hidden";
    }
  }, [isOpen, isMenuOpen, isFilterOpen]);

  ////////////////////////////////////////////////////
  const location = useLocation();
  //Find "Home" and "ItemDetail" locations
  const currentRoute = menuRoutes.find(
    (route) => route.path === location.pathname
  );
  const isHome = currentRoute?.id === "home";
  const isDashboard = currentRoute?.id === "dashboard";
  const isCheckout = currentRoute?.id === "checkout";

  return (
    <>
      <Wrapper
        isOpen={isOpen}
        isMenuOpen={isMenuOpen}
        isFilterOpen={isFilterOpen}
        windowWidth={windowWidth}
      >
        {!isHome && <LoadingTopBar />}
        {globalLoading ? (
          <LoadingScreen />
        ) : (
          <>
            {windowWidth > 900 && <NavDesktop />}
            {windowWidth <= 900 && <NavMobile />}

            <SideCart />
            {!isHome && !isDashboard && !isCheckout && <HeroSmall />}

            <HeroWrapper>{isHome && <HeroLanding />}</HeroWrapper>

            <OutletWrapper isHome={isHome}>
              <Outlet />
            </OutletWrapper>

            <NewsLetter />
            <Footer />
          </>
        )}
      </Wrapper>
    </>
  );
};

const Wrapper = styled.div`
  /* min-height: 100%; */
  overflow-x: clip;
  padding: ${({ isOpen, windowWidth }) =>
    windowWidth > 800 ? (isOpen ? "0" : "0 16.8px 0 0") : "0"}; 
`;

const LoadingScreen = styled.div`
  max-height: 100vh;
`;

const OutletWrapper = styled.div`
  min-height: 90vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: rgb(253 253 253);
  margin: auto;

  @media (max-width: 68rem) {
    padding-top: 0;
  }
`;

const HeroWrapper = styled.div`
  background-color: white;
  @media (max-width: 68rem) {
    margin-bottom: 25px;
  }
`;
