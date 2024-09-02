import styled from "styled-components/macro";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import { Link } from "react-router-dom";

export const NavMobileLinks = ({
  handleNavLinkClick,
  toggleDropDown,
  isDropDownOpen,
}) => {
  return (
    <>
      <NavListWrapper>
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
        <ProductsDropDown>
          <OnClickDropDown
            isDropDownOpen={isDropDownOpen}
            onClick={() => toggleDropDown(!isDropDownOpen)}
          >
            products
            <ArrowDropDownIcon sx={{ marginTop: "-2px" }} />
          </OnClickDropDown>
          <DropDown isDropDownOpen={!isDropDownOpen}>
            <CategoryContainer>
              <CategoryList>
                <CategoryLink
                  style={{
                    fontWeight: "600",
                    fontSize: "clamp(0.69rem, 1.7vw, 0.89rem)",
                  }}
                  to="/all-products"
                  rel="noopener noreferrer"
                  onClick={handleNavLinkClick}
                >
                  All Categories
                </CategoryLink>
              </CategoryList>
              <CategoryList>
                <CategoryLink
                  to="/category/shoes"
                  rel="noopener noreferrer"
                  onClick={handleNavLinkClick}
                >
                  shoes
                </CategoryLink>
              </CategoryList>
              <CategoryList>
                <CategoryLink
                  to="/category/pants"
                  rel="noopener noreferrer"
                  onClick={handleNavLinkClick}
                >
                  pants
                </CategoryLink>
              </CategoryList>
              <CategoryList>
                <CategoryLink
                  to="/category/shirts"
                  rel="noopener noreferrer"
                  onClick={handleNavLinkClick}
                >
                  shirts
                </CategoryLink>
              </CategoryList>
              <CategoryList>
                <CategoryLink
                  to="/category/hoodies"
                  rel="noopener noreferrer"
                  onClick={handleNavLinkClick}
                >
                  hoodies
                </CategoryLink>
              </CategoryList>
              <CategoryList>
                <CategoryLink
                  to="/category/bags"
                  rel="noopener noreferrer"
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
  flex-direction: column;
  list-style: none;
  gap: 1.7rem;
  margin-top: 40px;
`;
const ProductsDropDown = styled.div`
  padding: 0px 20px 0px;
`;
const DropDown = styled.div`
  margin: ${(props) => (props.isDropDownOpen ? "18px 0px 8px 8px;" : "0")};
  opacity: ${(props) => (props.isDropDownOpen ? 1 : 0)};
  height: ${(props) => (props.isDropDownOpen ? "240px" : "0")};
  overflow-y: ${(props) => props.isDropDownOpen && "auto"};
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
  font-size: clamp(0.72rem, 1.7vw, 1rem);
  background-image: linear-gradient(to right, transparent 0%, #ecf0f8 100%);
  background-repeat: no-repeat;
  background-size: ${(props) => (props.isDropDownOpen ? "0%" : "0% 100%")};
  background-position: left bottom;
  transition: background-size 0.2s ease-in-out, font-size 0.2s ease-in-out,
    color 0.2s ease-in-out;
  &:hover {
    color: ${(props) => (props.isDropDownOpen ? "0" : "#68719d")};
    background-size: ${(props) => (props.isDropDownOpen ? "0" : "100%")};
    transition: background-color 0.05s ease-in-out;
  }
  &:active {
    color: ${(props) => (props.isDropDownOpen ? "0" : "#fafafa")};
    background-size: ${(props) => (props.isDropDownOpen ? "0" : "100%")};
    transition: background-color 0.001s ease-in;
  }

  &::after {
    transform: scaleX(${(props) => (props.isDropDownOpen ? "1" : "0")});
  }
  &::after {
    content: "";
    position: absolute;
    bottom: -4px;
    left: 0;
    width: 100%;
    height: 2px;
    background-color: black;
    transform: scaleX(${(props) => (props.isDropDownOpen ? "0" : "1")});
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
  font-size: clamp(0.72rem, 1.7vw, 1rem);
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
  font-size: clamp(0.67rem, 1.7vw, 0.87rem);
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
