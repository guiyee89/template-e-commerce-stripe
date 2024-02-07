import styled from "styled-components/macro";
import { CartWidget } from "../../common/cartWidget/CartWidget";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { CartContext } from "../../context/CartContext";
import { useContext } from "react";
import { menuRoutes } from "../../routes/menuRoutes";
import { AuthContext } from "../../context/AuthContext";
import AccountCircleSharpIcon from "@mui/icons-material/AccountCircleSharp";
import { GlobalToolsContext } from "../../context/GlobalToolsContext";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import { useState } from "react";
import LoginSharpIcon from "@mui/icons-material/LoginSharp";
import DashboardCustomizeRoundedIcon from "@mui/icons-material/DashboardCustomizeRounded";
import LocalFireDepartmentIcon from "@mui/icons-material/LocalFireDepartment";

export const NavDesktop = () => {
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
  const { scroll, isOpen } = useContext(GlobalToolsContext);

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

  //Find "Home" and "ItemDetail" locations
  const location = useLocation();
  const currentRoute = menuRoutes.find(
    (route) => route.path === location.pathname
  );

  const isCart = currentRoute?.id === "cart";
  const isCheckout = currentRoute?.id === "checkout";
  const isDashboard = currentRoute?.id === "dashboard";

  //Hovering Category Links for Images
  const [hoveredCategory, setHoveredCategory] = useState("all-products");

  return (
    <>
      <HeaderWrapper scrolled={scroll}>
        <Nav scrolled={scroll}>
          <InsideNav
            isCart={isCart}
            isCheckout={isCheckout}
            isDashboard={isDashboard}
          >
            <LogoDiv scrolled={scroll} onClick={handleNavLinkClick}>
              <LogoLink to="/">
                <Logo src="https://res.cloudinary.com/derdim3m6/image/upload/v1689771276/web%20access/samples%20for%20e-commerce/Logos/2023-07-14_09h48_23-removebg-preview_yq3phy.png"></Logo>
              </LogoLink>
            </LogoDiv>

            {!isCart && !isCheckout && !isDashboard && (
              <>
                <NavListWrapper scrolled={scroll}>
                  <NavList>
                    <NavLink
                      to="/"
                      scrolled={scroll}
                      onClick={handleNavLinkClick}
                    >
                      home
                    </NavLink>
                  </NavList>
                  <ProductsDropDown scrolled={scroll}>
                    <NavLink
                      to="/all-products"
                      scrolled={scroll}
                      onClick={handleNavLinkClick}
                      onMouseEnter={() => setHoveredCategory("all-products")}
                      onMouseLeave={() => setHoveredCategory("all-products")}
                    >
                      products
                    </NavLink>
                    <ArrowDropDownIcon sx={{ marginTop: "-2px" }} />
                    <DropDown scrolled={scroll}>
                      <DropDownContainer>
                        <CategoryList
                          style={{
                            marginTop: "22px",
                            width: "114px",
                            position: "relative",
                          }}
                        >
                          <CategoryLink
                            style={{
                              fontWeight: "600",
                              fontSize: ".74rem",
                              textDecoration: "underline",
                              position: "absolute",
                              right: "-42px",
                            }}
                            to="/all-products"
                            scrolled={scroll}
                            onClick={handleNavLinkClick}
                            onMouseEnter={() =>
                              setHoveredCategory("all-products")
                            }
                            onMouseLeave={() =>
                              setHoveredCategory("all-products")
                            }
                          >
                            All Categories
                          </CategoryLink>
                        </CategoryList>
                        <CategoryDropDown>
                          <CategoryContainer>
                            <CategoryList>
                              <CategoryLink
                                to="/category/shoes"
                                scrolled={scroll}
                                onClick={handleNavLinkClick}
                                onMouseEnter={() => setHoveredCategory("shoes")}
                                onMouseLeave={() => setHoveredCategory("shoes")}
                              >
                                shoes
                              </CategoryLink>
                            </CategoryList>
                            <CategoryList>
                              <CategoryLink
                                to="/category/pants"
                                scrolled={scroll}
                                onClick={handleNavLinkClick}
                                onMouseEnter={() => setHoveredCategory("pants")}
                                onMouseLeave={() => setHoveredCategory("pants")}
                              >
                                pants
                              </CategoryLink>
                            </CategoryList>
                            <CategoryList>
                              <CategoryLink
                                to="/category/shirts"
                                scrolled={scroll}
                                onClick={handleNavLinkClick}
                                onMouseEnter={() =>
                                  setHoveredCategory("shirts")
                                }
                                onMouseLeave={() =>
                                  setHoveredCategory("shirts")
                                }
                              >
                                shirts
                              </CategoryLink>
                            </CategoryList>
                            <CategoryList>
                              <CategoryLink
                                to="/category/hoodies"
                                scrolled={scroll}
                                onClick={handleNavLinkClick}
                                onMouseEnter={() =>
                                  setHoveredCategory("hoodies")
                                }
                                onMouseLeave={() =>
                                  setHoveredCategory("hoodies")
                                }
                              >
                                hoodies
                              </CategoryLink>
                            </CategoryList>
                            <CategoryList>
                              <CategoryLink
                                to="/category/bags"
                                scrolled={scroll}
                                onClick={handleNavLinkClick}
                                onMouseEnter={() => setHoveredCategory("bags")}
                                onMouseLeave={() => setHoveredCategory("bags")}
                              >
                                bags
                              </CategoryLink>
                            </CategoryList>
                          </CategoryContainer>
                        </CategoryDropDown>
                        <ImagesDropDown scrolled={scroll}>
                          {hoveredCategory === "all-products" && (
                            <Img src="https://res.cloudinary.com/derdim3m6/image/upload/v1703952195/web%20access/samples%20for%20e-commerce/Nav%20Images/lncaoen82w7hf8epzswd.png" />
                          )}
                          {hoveredCategory === "shoes" && (
                            <Img src="https://res.cloudinary.com/derdim3m6/image/upload/e_improve:outdoor/web%20access/samples%20for%20e-commerce/Nav%20Images/lmhmmbxtfibmfspboui6.jpg" />
                          )}
                          {hoveredCategory === "pants" && (
                            <Img src="https://res.cloudinary.com/derdim3m6/image/upload/v1703949455/web%20access/samples%20for%20e-commerce/Nav%20Images/n2rb42unjp3zv1ima2f7.png" />
                          )}
                          {hoveredCategory === "shirts" && (
                            <Img src="https://res.cloudinary.com/derdim3m6/image/upload/v1703949489/web%20access/samples%20for%20e-commerce/Nav%20Images/vsbqrreuudovv7rilmho.png" />
                          )}
                          {hoveredCategory === "hoodies" && (
                            <Img src="https://res.cloudinary.com/derdim3m6/image/upload/v1703949430/web%20access/samples%20for%20e-commerce/Nav%20Images/wvzsmcp1t6i7mog3v2gp.png" />
                          )}
                          {hoveredCategory === "bags" && (
                            <Img src="https://res.cloudinary.com/derdim3m6/image/upload/v1703949418/web%20access/samples%20for%20e-commerce/Nav%20Images/pgurqzuws8ur1fvoxwmj.png" />
                          )}
                        </ImagesDropDown>
                        <BuyNowBtn>Buy Now</BuyNowBtn>
                      </DropDownContainer>
                    </DropDown>
                  </ProductsDropDown>
                  <NavList>
                    <NavLink
                      to="/contact"
                      scrolled={scroll}
                      onClick={handleNavLinkClick}
                    >
                      sale
                      <LocalFireDepartmentIcon
                        color="warning"
                        fontSize="small"
                        sx={{ padding: "0 0 3px 3px" }}
                      />
                    </NavLink>
                  </NavList>
                  <NavList>
                    <NavLink
                      to="/contact"
                      scrolled={scroll}
                      onClick={handleNavLinkClick}
                    >
                      contact
                    </NavLink>
                  </NavList>
                </NavListWrapper>

                <DashCartContainer isOpen={isOpen}>
                  <CartWidget
                    scrolled={scroll}
                    sx={{ padding: "10px" }}
                    totalItems={totalItems}
                  />
                  {!user || !user.rol ? (
                    <LoginBtn>
                      <h4>Login / Sign up</h4>
                      <LoginSharpIcon
                        sx={{ fontSize: "25px" }}
                        onClick={() =>
                          /* navigate("/login") */ window.location.assign(
                            "/login"
                          )
                        }
                      />
                    </LoginBtn>
                  ) : user.rol === rolAdmin ||
                    user.rol === rolAdmin2 ||
                    user.rol === rolAdmin3 ||
                    user.rol === rolAdmin4 ? (
                    <>
                      <DashboardBtn scrolled={scroll}>
                        <h4>Admin</h4>
                        <DashboardCustomizeRoundedIcon
                          sx={{ fontSize: "25px" }}
                          onClick={() =>
                            /* navigate("/dashboard")  */ window.location.assign(
                              "/dashboard"
                            )
                          }
                        />
                      </DashboardBtn>
                    </>
                  ) : (
                    <>
                      <ProfileBtn>
                        <h4>Profile</h4>
                        <AccountCircleSharpIcon
                          sx={{ fontSize: "28px", marginBottom: "-6px" }}
                          onClick={() =>
                            /* navigate("/user-orders") */ window.location.assign(
                              "/user-orders"
                            )
                          }
                        />
                      </ProfileBtn>
                    </>
                  )}
                </DashCartContainer>
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
  margin-bottom: -90px;
  top: 0;
  z-index: 2;
  height: ${(props) => (props.scrolled === "scrolled" ? "65px" : "90px")};
  box-shadow: ${(props) =>
    props.scrolled === "scrolled" ? "none" : "rgba(0, 0, 0, 0.55) 0px 0px 3px"};
  transition: height
    ${(props) => (props.scrolled === "scrolled" ? "0.18s" : "0.18s")}
    ease-in-out;
  border-bottom: ${(props) =>
    props.scrolled === "scrolled"
      ? "1px solid rgb(133 132 132 / 25%)"
      : "none"};
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
  max-width: 1548px;
  display: flex;
  margin: 0px auto;
  padding: 0px 20px 0 20px;
  -webkit-box-align: center;
  align-items: center;
  -webkit-box-pack: justify;
  justify-content: ${({ isCart, isCheckout, isDashboard }) =>
    isCart || isCheckout || isDashboard ? "center" : "space-between"};
  @media screen and (max-width: 50rem) {
    padding: 0;
    justify-content: flex-end;
  }
`;
const LogoDiv = styled.div`
  width: ${(props) => (props.scrolled === "scrolled" ? "90px" : "110px")};
  transition: width
    ${(props) => (props.scrolled === "scrolled" ? "0.18s" : "0.18s")}
    ease-in-out;
  margin-top: 13px;
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
const NavListWrapper = styled.ul`
  display: flex;
  list-style: none;
  margin-bottom: ${(props) =>
    props.scrolled === "scrolled" ? "-10px" : "-21px"};
  transition: margin-bottom
    ${(props) => (props.scrolled === "scrolled" ? "0.18s" : "0.18s")}
    ease-in-out;
  padding-right: 24px;
  @media screen and (max-width: 50rem) {
    display: none;
  }
`;
const NavList = styled.li`
  padding: 0px 20px;
  height: 20px;
`;
const CategoryList = styled.li`
  margin: 12px 0 0;
`;
const ProductsDropDown = styled.div`
  margin: 0px 0px -25px 10px;
  padding: 0px 24px;
  height: ${(props) => (props.scrolled === "scrolled" ? "38px" : "50px")};
`;
const DropDown = styled.div`
  top: -109px;
  visibility: hidden;
  opacity: 0;
  position: absolute;
  background-color: white;
  width: 100%;
  border-bottom: 1px solid lightgray;
  justify-content: center;
  margin-top: ${(props) => (props.scrolled === "scrolled" ? "-26px" : "0px")};
  box-shadow: rgba(0, 0, 0, 0.35) 0px 4px 8px;
  ${ProductsDropDown}:hover & {
    display: flex;
    visibility: visible;
    transition: visible 0.15s ease-in-out, transform 0.1s ease-in-out;
    opacity: 1;
    transition: opacity 0.15s ease-in-out, transform 0.1s ease-in-out;
    top: 91px;
    left: 0%;
    height: max-content;
  }
`;
const DropDownContainer = styled.div`
  display: flex;
  justify-content: space-evenly;
  gap: 5rem;
  margin-bottom: 1%;
  margin-top: 0.6%;
`;
const CategoryContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;
`;
const CategoryDropDown = styled.div`
  display: flex;
  height: 90%;
  width: 14%;
  -webkit-box-pack: end;
  justify-content: flex-end;
  -webkit-box-align: center;
  align-items: flex-start;
  margin: 8px -21px 12px 15px;
`;
const ImagesDropDown = styled.div`
  display: flex;
  -webkit-box-align: center;
  align-items: center;
  justify-content: center;
  position: relative;
  width: 190px;
  height: 210px;
  margin: ${(props) =>
    props.scrolled === "scrolled"
      ? "0px 20px 0px -17px"
      : "0px 10px 0px -6px;"};
  border-left: 1px solid lightgrey;
`;
const Img = styled.img`
  height: 90%;
  width: 100%;
  object-fit: contain;
  margin-right: -50%;
  cursor: pointer;
`;
const BuyNowBtn = styled.div`
  width: 80px;
  border: transparent;
  background-color: transparent;
  cursor: pointer;
  text-transform: uppercase;
  font-size: 0.65rem;
  text-decoration: underline;
  margin: 18px 0px 0px;
`;
const NavLink = styled(Link)`
  color: black;
  text-decoration: none;
  font-weight: 600;
  text-transform: uppercase;
  position: relative;
  font-size: ${(props) =>
    props.scrolled === "scrolled"
      ? ".68rem"
      : "clamp(0.62rem, 2vw + 1px, 0.72rem);"};
  transition: font-size
    ${(props) => (props.scrolled === "scrolled" ? "0.18s" : "0.18s")}
    ease-in-out;
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
    left: 0px;
    width: 100%;
    height: 1.1px;
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
      ? ".68rem"
      : "clamp(0.6rem, 1vw + 2px, 0.7rem)"};
  transition: font-size
    ${(props) => (props.scrolled === "scrolled" ? "0.18s" : "0.18s")}
    ease-in-out;
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
const DashCartContainer = styled.div`
  display: flex;
  align-items: center;
  padding-right: 10px;
`;
const DashboardBtn = styled.button`
  background-color: transparent;
  border: none;
  cursor: pointer;
  font-size: 0.6rem;
  margin-bottom: ${(props) =>
    props.scrolled === "scrolled" ? "-7px" : "-6px"};
  transition: margin-bottom
    ${(props) => (props.scrolled === "scrolled" ? "0.18s" : "0.18s")}
    ease-in-out;
`;
const ProfileBtn = styled.button`
  background-color: transparent;
  border: none;
  cursor: pointer;
  font-size: 0.6rem;
`;
const LoginBtn = styled.button`
  background-color: transparent;
  border: none;
  font-size: 0.6rem;
  cursor: pointer;
  margin-bottom: -6px;
`;
