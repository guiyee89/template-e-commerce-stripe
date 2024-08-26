import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";


export const useGlobalLoader = () => {
  
  const [globalLoading, setGlobalLoading] = useState(true);
  const location = useLocation();

  //Global "Flash" Conditional
  useEffect(() => {
    setGlobalLoading(true);
    const timer = setTimeout(() => {
      setGlobalLoading(false);
    }, 0);

    return () => clearTimeout(timer);
  }, [location]);


  return globalLoading;
};

// LAYOUT CON GLOBAL LOADER
 {/* 
  {globalLoading ? (
          <LoadingScreen />
        ) : (
          <>
            {windowWidth > 900 && <NavDesktop />}
            {windowWidth <= 900 && <NavMobile />}

            <SideCart />
            {!isHome && !isDashboard && !isCheckout && !isContactUs && !isCompletion && (
              <HeroSmall />
            )}

            <HeroWrapper>{isHome && <HeroLanding />}</HeroWrapper>

            <OutletWrapper isHome={isHome} isCheckout={isCheckout}>
              <Outlet />
            </OutletWrapper>
            {!isDashboard && <NewsLetter />}
            <Footer />
          </>
      )} 
    */}