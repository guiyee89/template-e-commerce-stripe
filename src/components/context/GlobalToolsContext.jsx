import React, { createContext, useState } from "react";
import { useEffect } from "react";

export const GlobalToolsContext = createContext();

const GlobalToolsProvider = ({ children }) => {
  ///////////         TOGGLE ON CLICK           ///////////
  //Manage side cart
  const [isCartOpen, setIsCartOpen] = useState(true);
  const toggleSideCart = () => {
    setIsCartOpen((prevIsOpen) => !prevIsOpen);
  };
  //Manage side menu for Mobile
  const [isMenuOpen, setIsMenuOpen] = useState(true);
  const toggleSideMenu = () => {
    setIsMenuOpen((prevIsOpen) => !prevIsOpen);
  };
  //Manage side filters for Mobile
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(true);
  const toggleMobileFilterMenu = () => {
    setIsMobileFilterOpen((prevIsOpen) => !prevIsOpen);
  };
  //Manage side filters for Desktop
  const [isDesktopFilterOpen, setIsDesktopFilterOpen] = useState(true);
  const toggleDesktopFilterMenu = () => {
    setIsDesktopFilterOpen((prevIsOpen) => !prevIsOpen);
  };

  //Manage products dropdown on Mobile Navbar
  const [isDropDownOpen, setIsDropDownOpen] = useState(true);
  const toggleDropDown = () => {
    setIsDropDownOpen((prevIsOpen) => !prevIsOpen);
  };

  ///////////         SCREEN WIDTH AND HEIGHT           ///////////
  //State for managing different screen Width
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  //State for managing different screen Height
  const [windowHeight, setWindowHeight] = useState(window.innerHeight);
  useEffect(() => {
    const handleResize = () => {
      setWindowHeight(window.innerHeight);
    };
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  //State for scrolling on screenheight
  useEffect(() => {
    const handleScroll = () => setWindowHeight(window.scrollY);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  ///////////         LOADERS           ///////////
  //Manage state for Loading spinner on page change (used in LoadingTopBar)
  const [pageLoading, setPageLoading] = useState(false);

  //Manage states for Loading Top Bar component (LoadingTopBar)
  const [progress, setProgress] = useState(0);
  const [buffer, setBuffer] = useState(10);
  const [visible, setVisible] = useState(false);
  const [progressComplete, setProgressComplete] = useState(false);

  //////////        ////////////        ////////////        ///////////
  //                       Scroll Effect                      //
  const [scroll, setScroll] = useState("not-scrolled");
  const [scrollDirection, setScrollDirection] = useState("up");

  useEffect(() => {
    let lastScrollY = window.scrollY;

    //Scroll "down" or "up"
    const handleScroll = () => {
      if (window.scrollY > lastScrollY) {
        setScrollDirection("down");
      } else {
        setScrollDirection("up");
      }
      lastScrollY = window.scrollY;

      // Scroll effect for navbar
      const scrollHeight = window.innerHeight * 0.02; // 2% of screen height

      if (window.scrollY > scrollHeight) {
        setScroll("scrolled");
      } else {
        setScroll("not-scrolled");
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [scrollDirection]);

  const value = {
    isCartOpen,
    setIsCartOpen,
    toggleSideCart,
    isMenuOpen,
    toggleSideMenu,
    isMobileFilterOpen,
    isDesktopFilterOpen,
    toggleMobileFilterMenu,
    toggleDesktopFilterMenu,
    toggleDropDown,
    isDropDownOpen,
    setIsDropDownOpen,
    windowWidth,
    windowHeight,
    pageLoading,
    setPageLoading,
    progress,
    setProgress,
    buffer,
    setBuffer,
    visible,
    setVisible,
    progressComplete,
    setProgressComplete,
    scroll,
    scrollDirection,
    setScrollDirection,
  };

  return (
    <GlobalToolsContext.Provider value={value}>
      {children}
    </GlobalToolsContext.Provider>
  );
};

export default GlobalToolsProvider;
