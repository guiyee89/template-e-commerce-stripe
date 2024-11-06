import styled from "styled-components/macro";
import { Link } from "react-router-dom";
import { useContext } from "react";
import { GlobalToolsContext } from "../../../context/GlobalToolsContext";
import { useState } from "react";
import useGlobalLocation from "../../../hooks/useGlobalLocation";
import { AuthContext } from "../../../context/AuthContext";
import { NavDesktopButtons } from "./NavDesktopButtons";
import { NavDesktopLinks } from "./NavDesktopLinks";

export const NavDesktop = () => {
  //////////        ////////////        ////////////        ///////////
  //                       States                      //
  const [hoveredCategory, setHoveredCategory] = useState("all-products");

  //////////        ////////////        ////////////        ///////////
  //                       Context                     //
  const { user } = useContext(AuthContext);
  const { scroll, isCartOpen, scrollDirection } =
    useContext(GlobalToolsContext);

  //////////////////////////////////////////////////////////////////////
  //                 useHooks                        //
  const { isCart, isDashboard, isCheckout, isHome } = useGlobalLocation();

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
  };

  return (
    <>
      <HeaderWrapper
        isCartOpen={isCartOpen}
        scrollDirection={scrollDirection}
        scrolled={scroll}
        isDashboard={isDashboard}
        isCheckout={isCheckout}
      >
        <Nav>
          <InsideNav
            isCart={isCart}
            isCheckout={isCheckout}
            isDashboard={isDashboard}
            isHome={isHome}
          >
            <LogoDiv isDashboard={isDashboard}>
              <LogoLink
                to="/"
                rel="noopener noreferrer"
                onClick={(e) => {
                  e.preventDefault();
                  handleNavLinkClick();
                  window.location.href = "/";
                }}
              >
                <Logo src="https://res.cloudinary.com/derdim3m6/image/upload/v1689771276/web%20access/samples%20for%20e-commerce/Logos/2023-07-14_09h48_23-removebg-preview_yq3phy.png"></Logo>
              </LogoLink>
            </LogoDiv>

            {!isCart && !isCheckout && (
              <>
                {/************       Desktop Profile Links        ************/}

                <NavDesktopLinks
                  handleNavLinkClick={handleNavLinkClick}
                  setHoveredCategory={setHoveredCategory}
                  hoveredCategory={hoveredCategory}
                  user={user}
                  isDashboard={isDashboard}
                  scrollDirection={scrollDirection}
                />

                {/************                                      ************/}
                {/************       Desktop Profile Buttons        ************/}

                <NavDesktopButtons handleNavLinkClick={handleNavLinkClick} />

                {/************                                      ************/}
              </>
            )}
          </InsideNav>
        </Nav>
      </HeaderWrapper>
    </>
  );
};

const HeaderWrapper = styled.header`
  position: sticky;
  top: ${({ scrolled, isDashboard, isCheckout }) =>
    isDashboard || isCheckout ? "0" : scrolled === "scrolled" ? "10px" : "0"};
  z-index: 2;
  height: 80px;
  border-bottom: 1px solid #d3d3d35c;
  transform: translateY(
    ${({ scrollDirection, isDashboard }) =>
      isDashboard ? "0" : scrollDirection === "down" ? "-100%" : "0"}
  );
  transition: transform
    ${(props) =>
      props.scrollDirection === "down" ? "0.1s ease-in" : "0.21s ease-out"};
`;
const Nav = styled.nav`
  width: 100%;
  height: 100%;
  margin: 0 auto;
  display: flex;
  background-color: rgb(253 253 253);
`;

const InsideNav = styled.div`
  width: 100vw;
  max-width: 1390px;
  display: flex;
  flex-direction: ${(props) => props.isDashboard && "row-reverse"};
  margin: ${(props) => (props.isDashboard ? " 0 100px 0 0" : "0 auto ")};
  -webkit-box-align: center;
  align-items: center;
  -webkit-box-pack: justify;
  justify-content: ${(props) =>
    props.isCheckout ? "center" : "space-between"};
  @media (max-width: 1500px) {
    padding: 0 50px;
  }
  @media screen and (max-width: 50rem) {
    padding: 0;
    justify-content: flex-end;
  }
`;

const LogoDiv = styled.div`
  width: 90px;
  margin-top: 13px;
  position: ${(props) => (props.isDashboard ? "absolute" : "relative")};
  right: ${(props) => (props.isDashboard ? "46.4%" : "auto")};

  @media screen and (max-width: 50rem) {
    position: absolute;
    left: 42%;
  }
`;

const LogoLink = styled(Link)`
  text-decoration: none;
`;
const Logo = styled.img`
  width: 48%;
  margin-left: 15px;
  @media screen and (max-width: 50rem) {
    width: 50%;
  }
`;
