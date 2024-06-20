import { useContext, useState } from "react";
import styled, { css } from "styled-components/macro";
import LogoutSharpIcon from "@mui/icons-material/LogoutSharp";
import { AuthContext } from "../../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { AdminOrders } from "./adminOrders/AdminOrders";
import { AdminNewsletters } from "./adminNewsletters/AdminNewsletters";
import { ProductContainer } from "./adminProducts/ProductContainer";
import { AdminShipping } from "./adminShipping/AdminShipping";
import { GlobalToolsContext } from "../../../context/GlobalToolsContext";

export const AdminDashboard = () => {
  const { handleLogout } = useContext(AuthContext);
  const { scroll } = useContext(GlobalToolsContext);
  const navigate = useNavigate();
  const [selectedOption, setSelectedOption] = useState("clientOrders");

  const handleOptionClick = (option) => {
    setSelectedOption(option);
  };

  return (
    <div style={{ width: "80%" }}>
      <DashboardContainer>
        <DashboardNavigation>
          <DashboardListContainer>
            <DashboardList
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
            <DashboardList
              onClick={() => handleOptionClick("shipping")}
              active={selectedOption === "shipping"}
            >
              <DashboardBtn>shipping</DashboardBtn>
            </DashboardList>
          </DashboardListContainer>
          <LogoutBtn scrolled={scroll}>
            <h4>Logout</h4>
            <LogoutSharpIcon
              sx={{ fontSize: "25px" }}
              onClick={() => handleLogout(navigate("/"))}
            />
          </LogoutBtn>
        </DashboardNavigation>
        {selectedOption === "clientOrders" && <AdminOrders />}
        {selectedOption === "manageProducts" && <ProductContainer />}
        {selectedOption === "newsletters" && <AdminNewsletters />}
        {selectedOption === "shipping" && <AdminShipping />}
      </DashboardContainer>
    </div>
  );
};

const DashboardContainer = styled.div`
  width: 100%;
  max-width: 1110px;
  height: 100%;
  display: flex;
  justify-content: center;
  margin: 90px auto;
`;

const DashboardNavigation = styled.nav`
  width: 206px;
  height: 750px;
  margin-top: 50px;
  @media (max-width: 1088px) {
    margin-top: 69px;
  }
`;

const DashboardListContainer = styled.ul`
  display: flex;
  flex-direction: column;
  height: 72%;
  gap: 2rem;
  padding: 20px 4px;
  box-shadow: rgba(0, 0, 0, 0.65) -3px 0px 9px;
  border-top-left-radius: 10px;
  border-bottom-left-radius: 10px;
`;

const DashboardList = styled.li`
  height: 50px;
  width: 200px;
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  background-image: linear-gradient(to right, transparent -250%, #bac7e1 100%);
  background-repeat: no-repeat;
  background-size: 0% 100%;
  background-position: left bottom;
  transition: background-size 0.1s ease-in-out, font-size 0.1s ease-in-out,
    color 0.2s ease-in-out;

  ${({ active }) =>
    active &&
    css`
      color: #545f93;
      background-size: 100% 100%;
      border-radius: 6px;
      /* &::after {
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
      } */
    `}
  &:hover {
    color: rgb(87, 98, 158);
    background-size: 100% 100%;
    border-radius: 6px;
  }
  &:active {
    color: #b5b1dd;
    transition: background-color 0.05s ease-in-out;
    /* &::after {
      content: "";
      position: absolute;
      bottom: -2px;
      width: 98%;
      height: 1.1px;
      background-color: black;
      transform: scaleX(1);
      transform-origin: left center;
      transition: transform 0.21s ease-in-out 0s;
    } */
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
    color: #9593dd;
    transition: background-color 0.1s ease-in-out;
  }
`;

const LogoutBtn = styled.button`
  background-color: transparent;
  border: none;
  font-size: 0.65rem;
  cursor: pointer;
  position: fixed;
  margin-right: 10px;
  top: ${(props) => (props.scrolled === "scrolled" ? "16px" : "28px")};
  right: 4%;
  transition: top
    ${(props) => (props.scrolled === "scrolled" ? "0.18s" : "0.18s")}
    ease-in-out;
  z-index: 2;
  @media (max-width: 950px) {
    right: 0;
  }
`;

const BouncyLoader = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  padding-right: 230px;
`;
