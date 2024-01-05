import React, { createContext, useState } from "react";
import { useEffect } from "react";

export const GlobalToolsContext = createContext();


const GlobalToolsProvider = ({ children }) => {
   ///////////         TOGGLE ON CLICK           ///////////
  //Manage side cart
  const [isOpen, setIsOpen] = useState(true);
  const toggleSideCart = () => {
    setIsOpen((prevIsOpen) => !prevIsOpen);
  };
  //Manage side menu for Mobile
  const [isMenuOpen, setIsMenuOpen] = useState(true);
  const toggleSideMenu = () => {
    setIsMenuOpen((prevIsOpen) => !prevIsOpen);
  };
  //Manage side filters for Mobile
  const [isFilterOpen, setIsFilterOpen] = useState(true);
  const toggleFilterMenu = () => {
    setIsFilterOpen((prevIsOpen) => !prevIsOpen);
  };
  //Manage products dropdown on Mobile Navbar
  const [isDrowpDownOpen, setIsDropDownOpen] = useState(true)
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
  const [windowHeight, setWindowHeight] = useState(window.innerHeight)
  useEffect(() => {
    const handleResize = () => {
      setWindowHeight(window.innerHeight);
    };
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
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
  //funcion para darle efecto al navbar al scrollear 12% de la pantalla
  useEffect(() => {
    const handleScroll = () => {
      const scrollHeight = window.innerHeight * 0.05; // 10% of screen height
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
  }, []);

  const value = {
    isOpen,
    toggleSideCart,
    isMenuOpen,
    toggleSideMenu,
    isFilterOpen,
    toggleFilterMenu,
    toggleDropDown,
    isDrowpDownOpen,
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
    scroll
  };

  return (
    <GlobalToolsContext.Provider value={value}>
      {children}
    </GlobalToolsContext.Provider>
  );
};

export default GlobalToolsProvider;
