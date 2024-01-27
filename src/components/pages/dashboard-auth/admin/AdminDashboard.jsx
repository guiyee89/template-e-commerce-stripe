import { useContext, useState } from "react";
import styled, { css } from "styled-components/macro";
import LogoutSharpIcon from '@mui/icons-material/LogoutSharp';
import { AuthContext } from "../../../context/AuthContext";
import {  useNavigate } from "react-router-dom";
import { AdminOrders } from "./manageOrders/AdminOrders";
import { AdminNewsletters } from "./manageNewsletters/AdminNewsletters";
import { ProductSearch } from "./manageProducts/ProductSearch";

export const AdminDashboard = () => {
  const { handleLogout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [selectedOption, setSelectedOption] = useState("clientOrders");

  const handleOptionClick = (option) => {
    setSelectedOption(option);
  };

  return (
    <>
      <DashboardNavigation>
        <DashboardListContainer>
          <DashboardList
            style={{ borderLeft: "1px solid darkgrey" }}
            onClick={() => handleOptionClick("clientOrders")}
            active={selectedOption === "clientOrders"}
          >
            <DashboardBtn>client orders</DashboardBtn>
          </DashboardList>

          <DashboardList
            onClick={() => handleOptionClick("manageProducts")}
            active={selectedOption === "manageProducts"}
          >
            <DashboardBtn>manage products</DashboardBtn>
          </DashboardList>

          <DashboardList
            onClick={() => handleOptionClick("newsletters")}
            active={selectedOption === "newsletters"}
          >
            <DashboardBtn>newsletters</DashboardBtn>
          </DashboardList>
        </DashboardListContainer>
        <LogoutBtn>
          <h4>Logout</h4>
          <LogoutSharpIcon
            sx={{ fontSize: "25px" }}
            onClick={() => handleLogout(navigate("/"))}
          />
        </LogoutBtn>
      </DashboardNavigation>
      {selectedOption === "clientOrders" && <AdminOrders />}
      {selectedOption === "manageProducts" && <ProductSearch />}
      {selectedOption === "newsletters" && <AdminNewsletters />}
    </>
  );
};
const DashboardNavigation = styled.nav`
  margin-top: 97px;
  width: 100%;
  @media (max-width:1088px){
    margin-top: 69px;
  }
`;
const DashboardListContainer = styled.ul`
  display: flex;
  margin: 0 0 0 -2.1%;
  justify-content: center;
`;
const DashboardList = styled.li`
  height: 50px;
  width: 200px;
  text-align: center;
  display: flex;
  align-items: center;
  border-right: 1px solid darkgray;
  justify-content: center;
  position: relative;
  background-image: linear-gradient(to right, transparent -250%, #ecf0f8 100%);
  background-repeat: no-repeat;
  background-size: 0% 100%;
  background-position: left bottom;
  transition: background-size 0.1s ease-in-out, font-size 0.1s ease-in-out,
    color 0.2s ease-in-out;

  ${({ active }) =>
    active &&
    css`
      color: #68719d;
      background-size: 100% 100%;
      &::after {
        content: "";
        position: absolute;
        bottom: -2px;
        left: 5.2px;
        width: 95.3%;
        height: 1.1px;
        background-color: black;
        transform: scaleX(1);
        transform-origin: left center;
        transition: transform 0.21s ease-in-out;
      }
    `}
  &:hover {
    color: #68719d;
    background-size: 100% 100%;
  }
  &:active {
    color: #fafafa;
    transition: background-color 0.05s ease-in-out;
    &::after {
      content: "";
      position: absolute;
      bottom: -2px;
      left: 5.2px;
      width: 95.3%;
      height: 1.1px;
      background-color: black;
      transform: scaleX(0);
      transform-origin: left center;
      transition: transform 0.21s ease-in-out;
    }
  }
`;

const DashboardBtn = styled.button`
  color: black;
  width: 100%;
  height: 100%;
  background-color: transparent;
  border: none;
  text-decoration: none;
  font-weight: 600;
  text-transform: uppercase;
  font-size: clamp(0.6rem, 1vw + 2px, 0.8rem);
  &:active {
    color: #fafafa;
    transition: background-color 0.1s ease-in-out;
  }
`;
const LogoutBtn = styled.button`
  background-color: transparent;
  border: none;
  font-size: 0.65rem;
  cursor: pointer;
  position: absolute;
  margin-right: 10px;
  top: 28px;
  right: 14%;
  z-index: 2;
  @media (max-width: 950px) {
    right: 0;
  }
`;
