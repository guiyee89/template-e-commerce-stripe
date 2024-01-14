import styled from "styled-components/macro";
import { CartWidget } from "../../common/cartWidget/CartWidget";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { CartContext } from "../../context/CartContext";
import { useContext } from "react";
import MenuIcon from "@mui/icons-material/Menu";
import { GlobalToolsContext } from "../../context/GlobalToolsContext";
import CloseIcon from "@mui/icons-material/Close";
import { menuRoutes } from "../../routes/menuRoutes";
import DashboardCustomizeIcon from "@mui/icons-material/DashboardCustomize";
import { AuthContext } from "../../context/AuthContext";
import AccountCircleSharpIcon from "@mui/icons-material/AccountCircleSharp";
import LoginOutlinedIcon from "@mui/icons-material/LoginOutlined";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";

export const NavMobile = () => {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const rolAdmin = import.meta.env.VITE_ROL_ADMIN;
  const rolAdmin2 = import.meta.env.VITE_ROL_ADMIN2;
  const rolAdmin3 = import.meta.env.VITE_ROL_ADMIN3;
  const rolAdmin4 = import.meta.env.VITE_ROL_ADMIN4;
  //////////        ////////////        ////////////        ///////////
  //                       CartContext                      //
  const { getTotalItems } = useContext(CartContext);
  const totalItems = getTotalItems();
  //////////        ////////////        ////////////        ///////////
  //                       SideMenuContext                      //
  const {
    scroll,
    isMenuOpen,
    toggleSideMenu,
    isFilterOpen,
    toggleDropDown,
    isDrowpDownOpen,
    setIsDropDownOpen,
  } = useContext(GlobalToolsContext);

  //////////        ////////////        ////////////        ///////////
  //                 Reset localStorage on nav links               //
  const handleNavLinkClick = () => {
    localStorage.removeItem("selectedFilters");
    localStorage.removeItem("selectedSizeOrder");
    localStorage.removeItem("selectedCategoryOrder");
    localStorage.removeItem("selectedColorOrder");
    localStorage.removeItem("currentPage");
    if (!isMenuOpen) {
      toggleSideMenu();
      setIsDropDownOpen(true);
    }
  };

  //Find "Home" and "ItemDetail" locations
  const location = useLocation();
  const currentRoute = menuRoutes.find(
    (route) => route.path === location.pathname
  );
  const isCart = currentRoute?.id === "cart";
  const isCheckout = currentRoute?.id === "checkout";
  const isDashboard = currentRoute?.id === "dashboard";

  return (
    <>
      <Nav scrolled={scroll} isFilterOpen={isFilterOpen}>
        <InsideNav
          isCart={isCart}
          isCheckout={isCheckout}
          isDashboard={isDashboard}
        >
          {!isCart && !isCheckout && !isDashboard && (
            <MenuIconBtn scrolled={scroll} onClick={toggleSideMenu} />
          )}
          <TransparentDiv
            isMenuOpen={isMenuOpen}
            onClick={isMenuOpen ? null : toggleSideMenu}
          />
          <SideMenuWrapper isMenuOpen={isMenuOpen}>
            <SideMenuHeader>
              <LogoSideMenu onClick={handleNavLinkClick}>
                <LogoLink to="/">
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
            <NavListWrapper>
              <NavList>
                <NavLink to="/" scrolled={scroll} onClick={handleNavLinkClick}>
                  home
                </NavLink>
              </NavList>
              <ProductsDropDown scrolled={scroll}>
                <OnClickDropDown
                  scrolled={scroll}
                  isDrowpDownOpen={isDrowpDownOpen}
                  onClick={() => toggleDropDown(!isDrowpDownOpen)}
                >
                  products
                  <ArrowDropDownIcon sx={{ marginTop: "-2px" }} />
                </OnClickDropDown>
                <DropDown isDrowpDownOpen={!isDrowpDownOpen} scrolled={scroll}>
                  <CategoryContainer>
                    <CategoryList>
                      <CategoryLink
                        style={{
                          fontWeight: "600",
                          fontSize: ".8rem",
                        }}
                        to="/all-products"
                        scrolled={scroll}
                        onClick={handleNavLinkClick}
                      >
                        All Categories
                      </CategoryLink>
                    </CategoryList>
                    <CategoryList>
                      <CategoryLink
                        to="/category/shoes"
                        scrolled={scroll}
                        onClick={handleNavLinkClick}
                      >
                        shoes
                      </CategoryLink>
                    </CategoryList>
                    <CategoryList>
                      <CategoryLink
                        to="/category/pants"
                        scrolled={scroll}
                        onClick={handleNavLinkClick}
                      >
                        pants
                      </CategoryLink>
                    </CategoryList>
                    <CategoryList>
                      <CategoryLink
                        to="/category/shirts"
                        scrolled={scroll}
                        onClick={handleNavLinkClick}
                      >
                        shirts
                      </CategoryLink>
                    </CategoryList>
                    <CategoryList>
                      <CategoryLink
                        to="/category/hoodies"
                        scrolled={scroll}
                        onClick={handleNavLinkClick}
                      >
                        hoodies
                      </CategoryLink>
                    </CategoryList>
                    <CategoryList>
                      <CategoryLink
                        to="/category/bags"
                        scrolled={scroll}
                        onClick={handleNavLinkClick}
                      >
                        bags
                      </CategoryLink>
                    </CategoryList>
                  </CategoryContainer>
                </DropDown>
              </ProductsDropDown>
              <NavList>
                <NavLink
                  to="/contact"
                  scrolled={scroll}
                  onClick={handleNavLinkClick}
                >
                  about us
                </NavLink>
              </NavList>
              <NavList>
                <NavLink
                  to="/contact"
                  scrolled={scroll}
                  onClick={handleNavLinkClick}
                >
                  contact us
                </NavLink>
              </NavList>
            </NavListWrapper>

            {!user || !user.rol ? (
              <LoginBtn>
                <h4>Login / Sign up</h4>
                <LoginOutlinedIcon
                  sx={{ fontSize: "26px" }}
                  onClick={() => navigate("/login")}
                />
              </LoginBtn>
            ) : user.rol === rolAdmin ||
              user.rol === rolAdmin2 ||
              user.rol === rolAdmin3 ||
              user.rol === rolAdmin4 ? (
              <>
                <DashboardBtn scrolled={scroll}>
                  <h4>Admin</h4>
                  <DashboardCustomizeIcon
                    sx={{ fontSize: "27px" }}
                    onClick={() => navigate("/dashboard")}
                  />
                </DashboardBtn>
              </>
            ) : (
              <>
                <ProfileBtn>
                  <h4>Profile</h4>
                  <AccountCircleSharpIcon
                    sx={{ fontSize: "30px", marginBottom: "-13px" }}
                    onClick={() => navigate("/user-orders")}
                  />
                </ProfileBtn>
              </>
            )}
          </SideMenuWrapper>
          <LogoDiv scrolled={scroll} onClick={handleNavLinkClick}>
            <LogoLink to="/">
              <Logo
                isDashboard={isDashboard}
                scrolled={scroll}
                src="https://res.cloudinary.com/derdim3m6/image/upload/v1689771276/web%20access/samples%20for%20e-commerce/Logos/2023-07-14_09h48_23-removebg-preview_yq3phy.png"
              ></Logo>
            </LogoLink>
          </LogoDiv>
          {!isCart && !isCheckout && !isDashboard && (
            <CartWidget
              scrolled={scroll}
              sx={{ padding: "10px" }}
              totalItems={totalItems}
            />
          )}
        </InsideNav>
      </Nav>
    </>
  );
};
const TransparentDiv = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: ${({ isMenuOpen }) => (isMenuOpen ? "0" : "100%")};
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
    isMenuOpen ? "0.3s ease-in-out" : "0.3s ease-in-out"};
  z-index: 2;
  height: 100%;
  background-color: white;
  box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.2);
  @media screen and (min-width: 500px) {
    width: ${({ isMenuOpen }) => (isMenuOpen ? "0" : "60%")};
  }
`;
const MenuIconBtn = styled(MenuIcon)`
  cursor: pointer;
  font-size: 1.6875rem !important;
  margin-left: 29px;
  margin-right: -6px;
  margin-top: ${(props) => (props.scrolled === "scrolled" ? "6px" : "27px")};
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

const Nav = styled.nav`
  height: ${(props) => (props.scrolled === "scrolled" ? "55px" : "90px")};
  transition: height
    ${(props) => (props.scrolled === "scrolled" ? "0.16s" : "0.16s")}
    ease-in-out;
  margin: 0 auto;
  display: flex;
  position: fixed;
  z-index: ${({ isFilterOpen }) => (isFilterOpen ? "2" : "1")};
  background-color: rgb(253 253 253);
  box-shadow: ${(props) =>
    props.scrolled === "scrolled" ? "none" : "rgba(0, 0, 0, 0.55) 0px 0px 3px"};
  border-bottom: ${(props) =>
    props.scrolled === "scrolled"
      ? "1px solid rgb(133 132 132 / 25%)"
      : "none"};
`;
const InsideNav = styled.div`
  width: 100vw;
  max-width: 1548px;
  display: flex;
  margin: 0px auto;
  padding: 0px 20px 0 20px;
  -webkit-box-align: center;
  align-items: center;
  -webkit-box-pack: justify;
  justify-content: ${({ isCart, isCheckout, isDashboard }) =>
    isCart || isCheckout || isDashboard ? "center" : "space-between"};
  @media screen and (max-width: 500px) {
    padding: 0;
  }
`;
const LogoDiv = styled.div`
  width: ${(props) => (props.scrolled === "scrolled" ? "90px" : "110px")};
  transition: width
    ${(props) => (props.scrolled === "scrolled" ? "0.20s" : "0.16s")}
    ease-in-out;
`;
const LogoLink = styled(Link)`
  text-decoration: none;
`;

const Logo = styled.img`
  width: 51%;
  margin-left: ${(props) =>
    props.scrolled === "scrolled" ? "24%" : "26%"};
  transition: margin-left 0.2s ease-in-out;
  @media (max-width: 900px) {
    margin-left: ${(props) =>
      props.isDashboard ? "15%" : props.scrolled === "scrolled" ? "24%" : "26%"};
  }
  @media (max-width: 550px) {
    margin-left: ${(props) =>
      props.scrolled === "scrolled" ? "18.8px" : "25.3px"};
  }
`;

const LogoSideMenu = styled.div`
  width: 100%;
`;
const LogoMenu = styled.img`
  width: 50px;
  margin: 5px auto;
`;
const NavListWrapper = styled.ul`
  display: flex;
  flex-direction: column;
  list-style: none;
  gap: 1.7rem;
  margin-top: 40px;
`;
const ProductsDropDown = styled.div`
  padding: 0px 20px 0px;
`;
const DropDown = styled.div`
  margin: ${(props) => (props.isDrowpDownOpen ? "18px 0px 8px 8px;" : "0")};
  opacity: ${(props) => (props.isDrowpDownOpen ? 1 : 0)};
  height: ${(props) => (props.isDrowpDownOpen ? "240px" : "0")};
  overflow-y: ${(props) => props.isDrowpDownOpen && "auto"};
  overflow-x: hidden;
  transition: opacity 0.3s ease-in-out, height 0.05s ease-in-out;
`;

const CategoryContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;
  gap: 0.85rem;
`;

const NavList = styled.li`
  padding: 0 20px;
`;
const CategoryList = styled.li`
  padding: 0 20px;
`;
const OnClickDropDown = styled.div`
  cursor: pointer;
  color: black;
  text-decoration: none;
  font-weight: 700;
  text-transform: uppercase;
  position: relative;
  font-size: ${(props) =>
    props.scrolled === "scrolled" ? ".75rem" : "0.82rem"};
  background-image: linear-gradient(to right, transparent 0%, #ecf0f8 100%);
  background-repeat: no-repeat;
  background-size: ${(props) => (props.isDrowpDownOpen ? "0%" : "0% 100%")};
  background-position: left bottom;
  transition: background-size 0.2s ease-in-out, font-size 0.2s ease-in-out,
    color 0.2s ease-in-out;
  &:hover {
    color: ${(props) => (props.isDrowpDownOpen ? "0" : "#68719d")};
    background-size: ${(props) => (props.isDrowpDownOpen ? "0" : "100%")};
    transition: background-color 0.05s ease-in-out;
  }
  &:active {
    color: ${(props) => (props.isDrowpDownOpen ? "0" : "#fafafa")};
    background-size: ${(props) => (props.isDrowpDownOpen ? "0" : "100%")};
    transition: background-color 0.001s ease-in;
  }

  &::after {
    transform: scaleX(${(props) => (props.isDrowpDownOpen ? "1" : "0")});
  }
  &::after {
    content: "";
    position: absolute;
    bottom: -4px;
    left: 0;
    width: 100%;
    height: 2px;
    background-color: black;
    transform: scaleX(${(props) => (props.isDrowpDownOpen ? "0" : "1")});
    transform-origin: left center;
    transition: transform 0.15s ease-in-out;
  }
`;

const NavLink = styled(Link)`
  color: black;
  text-decoration: none;
  font-weight: 700;
  text-transform: uppercase;
  position: relative;
  font-size: ${(props) =>
    props.scrolled === "scrolled" ? ".75rem" : "0.82rem"};
  background-image: linear-gradient(to right, transparent 0%, #ecf0f8 100%);
  background-repeat: no-repeat;
  background-size: 0% 100%;
  background-position: left bottom;
  transition: background-size 0.2s ease-in-out, font-size 0.2s ease-in-out,
    color 0.2s ease-in-out;
  &:hover {
    color: #68719d;
    background-size: 100% 100%;
  }
  &:active {
    color: #fafafa;
    transition: background-color 0.05s ease-in-out;
  }
  &:hover::after {
    transform: scaleX(1);
  }
  &::after {
    content: "";
    position: absolute;
    bottom: -4px;
    left: 0;
    width: 100%;
    height: 2px;
    background-color: black;
    transform: scaleX(0);
    transform-origin: left center;
    transition: transform 0.21s ease-in-out;
  }
`;
const CategoryLink = styled(Link)`
  color: black;
  text-decoration: none;
  font-weight: 500;
  text-transform: capitalize;
  position: relative;
  font-size: ${(props) =>
    props.scrolled === "scrolled"
      ? ".7rem"
      : "clamp(0.7rem, 1vw + 7.5px, 1rem)"};
  background-image: linear-gradient(to right, transparent 0%, #ecf0f8 100%);
  background-repeat: no-repeat;
  background-size: 0% 100%;
  background-position: left bottom;
  transition: background-size 0.1s ease-in-out, font-size 0.1s ease-in-out,
    color 0.2s ease-in-out;
  &:hover {
    color: #68719d;
    background-size: 100% 100%;
  }
  &:active {
    color: #fafafa;
    transition: background-color 0.05s ease-in-out;
  }
  &:hover::after {
    transform: scaleX(1);
  }
  &::after {
    content: "";
    position: absolute;
    bottom: -4px;
    left: 0px;
    width: 100%;
    height: 1.1px;
    background-color: black;
    transform: scaleX(0);
    transform-origin: left center;
    transition: transform 0.21s ease-in-out;
  }
`;
const DashboardBtn = styled.button`
  background-color: transparent;
  border: none;
  cursor: pointer;
  font-size: 0.6rem;
  position: absolute;
  bottom: 4%;
  margin: 200px auto 0;
  width: 100%;
`;
const ProfileBtn = styled.button`
  background-color: transparent;
  border: none;
  cursor: pointer;
  font-size: 0.6rem;
  position: absolute;
  bottom: 4%;
  margin: 200px auto 0;
  width: 100%;
`;
const LoginBtn = styled.button`
  background-color: transparent;
  position: absolute;
  bottom: 4%;
  border: none;
  font-size: 0.6rem;
  cursor: pointer;
  margin: 200px auto 0;
  width: 100%;
`;
