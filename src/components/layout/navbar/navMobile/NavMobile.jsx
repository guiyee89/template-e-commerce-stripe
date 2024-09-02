import styled from "styled-components/macro";
import { CartWidget } from "../../../common/cartWidget/CartWidget";
import { Link } from "react-router-dom";
import { CartContext } from "../../../context/CartContext";
import { useContext } from "react";
import MenuIcon from "@mui/icons-material/Menu";
import { GlobalToolsContext } from "../../../context/GlobalToolsContext";
import CloseIcon from "@mui/icons-material/Close";
import useGlobalLocation from "../../../hooks/useGlobalLocation";
import { NavMobileButtons } from "./NavMobileButtons";
import { NavMobileLinks } from "./NavMobileLinks";

export const NavMobile = () => {
  //////////        ////////////        ////////////        ///////////
  //                       CartContext                      //
  const { getTotalItems } = useContext(CartContext);
  const totalItems = getTotalItems();
  //////////        ////////////        ////////////        ///////////
  //                       Context                      //
  const {
    scroll,
    scrollDirection,
    isMenuOpen,
    toggleSideMenu,
    isFilterOpen,
    setIsDropDownOpen,
    isDropDownOpen,
    toggleDropDown,
  } = useContext(GlobalToolsContext);

  ////////////////////////////////////////////////////////////////////
  //                       Hooks                      //
  const { isCart, isDashboard, isCheckout } = useGlobalLocation();

  //////////        ////////////        ////////////        ///////////
  //                 Reset localStorage on nav links               //
  const handleNavLinkClick = () => {
    localStorage.removeItem("selectedFilters");
    localStorage.removeItem("selectedSizeOrder");
    localStorage.removeItem("selectedCategoryOrder");
    localStorage.removeItem("selectedColorOrder");
    localStorage.removeItem("currentPage");
    localStorage.removeItem("prevLocation");
    localStorage.removeItem("reloadOccurred");
    if (!isMenuOpen) {
      toggleSideMenu();
      setIsDropDownOpen(true);
    }
  };

  return (
    <>
      <HeaderWrapper
        scrolled={scroll}
        scrollDirection={scrollDirection}
        isDashboard={isDashboard}
      >
        <Nav isFilterOpen={isFilterOpen}>
          <InsideNav
            isCart={isCart}
            isCheckout={isCheckout}
            isDashboard={isDashboard}
          >
            {!isCart && !isCheckout && <MenuIconBtn onClick={toggleSideMenu} />}
            <TransparentDiv
              isMenuOpen={isMenuOpen}
              onClick={isMenuOpen ? null : toggleSideMenu}
            />
            <SideMenuWrapper
              isMenuOpen={isMenuOpen}
              scrollDirection={scrollDirection}
            >
              <SideMenuHeader>
                <LogoSideMenu>
                  <LogoLink
                    to="/"
                    rel="noopener noreferrer"
                    onClick={(e) => {
                      e.preventDefault();
                      handleNavLinkClick();
                      window.location.href = "/";
                    }}
                  >
                    <LogoMenu src="https://res.cloudinary.com/derdim3m6/image/upload/v1689771276/web%20access/samples%20for%20e-commerce/Logos/2023-07-14_09h48_23-removebg-preview_yq3phy.png"></LogoMenu>
                  </LogoLink>
                </LogoSideMenu>
                <CloseIconBtn
                  onClick={() => {
                    toggleSideMenu();
                    setIsDropDownOpen(true);
                  }}
                />
              </SideMenuHeader>

              {/************        NAV MOBILE LINKS         ************/}
              {!isDashboard && (
                <NavMobileLinks
                  toggleDropDown={toggleDropDown}
                  isDropDownOpen={isDropDownOpen}
                  handleNavLinkClick={handleNavLinkClick}
                />
              )}
              {/************                                   ************/}
              {/************        NAV MOBILE BUTTONS         ************/}

              <MobileBtnWrapper>
                <NavMobileButtons handleNavLinkClick={handleNavLinkClick} />
              </MobileBtnWrapper>

              {/************                                   ************/}
            </SideMenuWrapper>
            <LogoDiv onClick={handleNavLinkClick}>
              <LogoLink
                to="/"
                rel="noopener noreferrer"
                onClick={(e) => {
                  e.preventDefault();
                  handleNavLinkClick();
                  window.location.href = "/";
                }}
              >
                <Logo
                  isDashboard={isDashboard}
                  src="https://res.cloudinary.com/derdim3m6/image/upload/v1689771276/web%20access/samples%20for%20e-commerce/Logos/2023-07-14_09h48_23-removebg-preview_yq3phy.png"
                ></Logo>
              </LogoLink>
            </LogoDiv>
            {!isCart && !isCheckout && !isDashboard && (
              <CartWidget sx={{ padding: "10px" }} totalItems={totalItems} />
            )}
          </InsideNav>
        </Nav>
      </HeaderWrapper>
    </>
  );
};
const HeaderWrapper = styled.header`
  position: sticky;
  top: 0px;
  height: 65px;
  z-index: 2;
  background-color: rgb(253 253 253);
  box-shadow: ${(props) =>
    props.scrolled === "scrolled"
      ? "rgba(0, 0, 0, 0.35) 0px 0px 2px"
      : "rgba(0, 0, 0, 0.45) 0px 0px 2px"};
  transform: translateY(
    ${({ scrollDirection, isDashboard }) =>
      isDashboard ? "0" : scrollDirection === "down" ? "-100%" : "0"}
  );

  transition: transform
    ${(props) =>
      props.scrollDirection === "down" ? "0.1s ease-in" : "0.21s ease-out"};
`;
const Nav = styled.nav`
  margin: 0 auto;
  width: 100%;
  height: 100%;
  display: flex;
`;
const InsideNav = styled.div`
  width: 100%;
  max-width: 1548px;
  display: flex;
  margin: 0px auto;
  padding: 0 30px;
  -webkit-box-align: center;
  align-items: center;
  -webkit-box-pack: justify;
  justify-content: ${({ isCart, isCheckout, isDashboard }) =>
    isDashboard
      ? "flex-start"
      : isCart && isCheckout
      ? "center"
      : "space-between"};

  ${({ isDashboard }) =>
    isDashboard &&
    `
    gap: 7.5rem;
  `}
  @media screen and (max-width: 500px) {
    padding: 0 20px;
  }
`;
const TransparentDiv = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: ${({ isMenuOpen }) => (isMenuOpen ? "0" : "100vh")};
  background-color: ${({ isMenuOpen }) =>
    isMenuOpen ? "none" : "rgba(0, 0, 0, 0.2)"};
  z-index: ${({ isMenuOpen }) => (isMenuOpen ? "-1" : "1")};
`;
const SideMenuWrapper = styled.div`
  position: fixed;
  top: 0;
  left: ${({ isMenuOpen }) => (isMenuOpen ? "-420px" : "0")};
  width: ${({ isMenuOpen }) => (isMenuOpen ? "0" : "70%")};
  transition: ${({ isMenuOpen }) =>
    isMenuOpen ? "0.2s ease-in-out" : "0.2s ease-in-out"};
  z-index: 2;
  height: 100vh;
  background-color: white;
  box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.2);
  @media screen and (min-width: 500px) {
    width: ${({ isMenuOpen }) => (isMenuOpen ? "0" : "60%")};
  }
`;

const MenuIconBtn = styled(MenuIcon)`
  cursor: pointer;
  font-size: 1.6875rem !important;
  margin-top: 16px;
`;
const CloseIconBtn = styled(CloseIcon)`
  font-size: 28px;
  margin-top: 4px;
  margin-left: 36px;
  cursor: "pointer";
`;
const SideMenuHeader = styled.div`
  display: flex;
  width: 100%;
  position: relative;
  padding: 0px 15px 15px 65px;
  margin-top: 15px;
  justify-content: flex-end;
  border-bottom: 1px solid lightgrey;
`;

const LogoDiv = styled.div`
  width: 45px;
  margin-top: 8px;
  position: ${(props) => (props.isDashboard ? "relative" : "absolute")};
  right: ${(props) => (props.isDashboard ? "auto" : "47.4%;")};
  @media (min-width: 900px) {
    width: 50px;
  }
  @media (max-width: 600px) {
    right: ${(props) => (props.isDashboard ? "auto" : "43.4%;")};
  }
`;
const LogoLink = styled(Link)`
  text-decoration: none;
`;

const Logo = styled.img`
  margin-left: -2px;
  transition: margin-left 0.2s ease-in-out;
`;

const LogoSideMenu = styled.div`
  width: 100%;
`;
const LogoMenu = styled.img`
  width: 50px;
  margin: 5px auto;
`;

const MobileBtnWrapper = styled.div`
  display: flex;
  width: 100%;
  height: 13%;
  position: absolute;
  padding: 0px 20px 26px;
  background-color: lightgrey;
  bottom: 0px;
  justify-content: space-between;
  border: 1px solid grey;
  align-items: center;
`;
