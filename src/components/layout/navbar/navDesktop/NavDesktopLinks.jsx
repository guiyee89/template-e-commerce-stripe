import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import styled from "styled-components/macro";
import { Link } from "react-router-dom";
import { useState } from "react";

export const NavDesktopLinks = ({
  isDashboard,
  user,
  handleNavLinkClick,
  hoveredCategory,
  setHoveredCategory,
  scrollDirection,
}) => {
  return (
    <>
      <NavListWrapper isDashboard={isDashboard}>
        <NavList>
          <NavLink
            to="/"
            rel="noopener noreferrer"
            onClick={(e) => {
              e.preventDefault();
              handleNavLinkClick();
              window.location.href = "/";
            }}
          >
            home
          </NavLink>
        </NavList>
        <ProductsDropDown scrollDirection={scrollDirection}>
          <NavProductsDropDown
            onMouseEnter={() => setHoveredCategory("all-products")}
            onMouseLeave={() => setHoveredCategory("all-products")}
          >
            products
          </NavProductsDropDown>
          <ArrowDropDownIcon sx={{ marginTop: "-4px" }} />
          <DropDown scrollDirection={scrollDirection}>
            <DropDownContainer user={user}>
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
                    fontSize: ".8rem",
                    textDecoration: "underline",
                    position: "absolute",
                    right: "-75px",
                  }}
                  to="/all-products"
                  rel="noopener noreferrer"
                  onClick={handleNavLinkClick}
                  onMouseEnter={() => setHoveredCategory("all-products")}
                  onMouseLeave={() => setHoveredCategory("all-products")}
                >
                  All Categories
                </CategoryLink>
              </CategoryList>
              <CategoryDropDown>
                <CategoryContainer>
                  <CategoryList>
                    <CategoryLink
                      to="/category/shoes"
                      rel="noopener noreferrer"
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
                      rel="noopener noreferrer"
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
                      rel="noopener noreferrer"
                      onClick={handleNavLinkClick}
                      onMouseEnter={() => setHoveredCategory("shirts")}
                      onMouseLeave={() => setHoveredCategory("shirts")}
                    >
                      shirts
                    </CategoryLink>
                  </CategoryList>
                  <CategoryList>
                    <CategoryLink
                      to="/category/hoodies"
                      rel="noopener noreferrer"
                      onClick={handleNavLinkClick}
                      onMouseEnter={() => setHoveredCategory("hoodies")}
                      onMouseLeave={() => setHoveredCategory("hoodies")}
                    >
                      hoodies
                    </CategoryLink>
                  </CategoryList>
                  <CategoryList>
                    <CategoryLink
                      to="/category/bags"
                      rel="noopener noreferrer"
                      onClick={handleNavLinkClick}
                      onMouseEnter={() => setHoveredCategory("bags")}
                      onMouseLeave={() => setHoveredCategory("bags")}
                    >
                      bags
                    </CategoryLink>
                  </CategoryList>
                </CategoryContainer>
              </CategoryDropDown>
              <ImagesDropDown>
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
            rel="noopener noreferrer"
            onClick={(e) => {
              e.preventDefault();
              handleNavLinkClick();
              window.location.href = "/contact";
            }}
          >
            contact
          </NavLink>
        </NavList>
      </NavListWrapper>
    </>
  );
};

const NavListWrapper = styled.ul`
  display: flex;
  -webkit-box-align: center;
  list-style: none;
  height: 100%;
  width: 28%;
  padding-top: 10px;
  align-items: center;
  justify-content: space-evenly;
  display: ${(props) => props.isDashboard && "none"};
  @media screen and (max-width: 50rem) {
    display: none;
  }
`;
const NavList = styled.li`
  padding: 0px 20px;
`;
const CategoryList = styled.li`
  margin: 12px 0 0;
`;
const ProductsDropDown = styled.div`
  cursor: pointer;
  display: flex;
  height: 100%;
  width: 160px;
  padding: 3px 15px 0px 22px;
  -webkit-box-align: center;
  align-items: center;
  justify-content: center;
`;

const DropDown = styled.div`
  visibility: hidden;
  opacity: 0;
  position: absolute;
  top: 79px;
  background-color: rgb(253, 253, 253);
  width: 100%;
  border-top: 1px solid rgb(211 211 211 / 19%);
  border-bottom: 1px solid lightgray;
  justify-content: center;
  box-shadow: rgba(0, 0, 0, 0.15) 0px 20px 30px;
  display: ${(props) => (props.scrollDirection === "down" ? "none" : "flex")};

  ${ProductsDropDown}:hover & {
    visibility: visible;
    opacity: 1;
    transition: visible 0.15s ease-in-out, transform 0.1s ease-in-out;
    transition: opacity 0.25s ease-in-out, transform 0.25s ease-in-out;
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
  margin-left: ${(props) => (props.user.rol ? "-30px" : "36px")};
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
  margin: 0px 20px 0px -17px;
  border-left: 1px solid rgb(211 211 211 / 50%);
`;
const Img = styled.img`
  height: 90%;
  width: 100%;
  object-fit: contain;
  cursor: pointer;
  position: relative;
  left: 35px;
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
  position: relative;
  left: -27px;
`;
const NavProductsDropDown = styled.p`
  color: black;
  text-decoration: none;
  font-weight: 600;
  text-transform: uppercase;
  position: relative;
  font-size: 0.68rem;
  background-image: linear-gradient(to right, transparent 0%, #ecf0f8 100%);
  background-repeat: no-repeat;
  background-size: 0% 100%;
  background-position: left bottom;
  transition: background-size 0.2s ease-in-out, font-size 0.2s ease-in-out,
    color 0.2s ease-in-out;
  &:hover {
    color: #68719d;
    background-size: -100% 100%;
  }
  &:hover::after {
    transform: scaleX(1);
  }
  &::after {
    content: "";
    position: absolute;
    bottom: -2px;
    left: 0px;
    width: 126%;
    height: 1px;
    background-color: black;
    transform: scaleX(0);
    transform-origin: left center;
    transition: transform 0.21s ease-in-out;
  }
`;
const NavLink = styled(Link)`
  color: black;
  text-decoration: none;
  font-weight: 600;
  text-transform: uppercase;
  position: relative;
  font-size: 0.68rem;
  background-image: linear-gradient(to right, transparent 0%, #ecf0f8 100%);
  background-repeat: no-repeat;
  background-size: 0% 100%;
  background-position: left bottom;
  transition: background-size 0.2s ease-in-out, font-size 0.2s ease-in-out,
    color 0.2s ease-in-out;
  cursor: pointer;
  &:hover {
    color: #68719d;
    background-size: 100% 100%;
  }
  &:active {
    color: rgb(92 92 92);
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
    height: 1px;
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
  font-size: 0.75rem;
  background-image: linear-gradient(to right, transparent 0%, #ecf0f8 100%);
  background-repeat: no-repeat;
  background-size: 0% 100%;
  background-position: left bottom;
  transition: background-size 0.1s ease-in-out, font-size 0.1s ease-in-out,
    color 0.2s ease-in-out;
  cursor: pointer;
  &:hover {
    color: #68719d;
    background-size: 100% 100%;
  }
  &:active {
    color: rgb(92 92 92);
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
