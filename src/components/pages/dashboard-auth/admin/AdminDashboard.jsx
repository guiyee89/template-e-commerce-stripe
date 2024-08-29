import { useContext, useState } from "react";
import styled, { css } from "styled-components/macro";
import LogoutSharpIcon from "@mui/icons-material/LogoutSharp";
import { AuthContext } from "../../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { AdminOrders } from "./adminOrders/AdminOrders";
import { AdminNewsletters } from "./adminNewsletters/AdminNewsletters";
import { AdminProducts } from "./adminProducts/AdminProducts";
import { AdminShipping } from "./adminShipping/AdminShipping";
import { GlobalToolsContext } from "../../../context/GlobalToolsContext";
import ListAltIcon from "@mui/icons-material/ListAlt";
import Inventory2OutlinedIcon from "@mui/icons-material/Inventory2Outlined";
import CampaignOutlinedIcon from "@mui/icons-material/CampaignOutlined";
import LocalShippingOutlinedIcon from "@mui/icons-material/LocalShippingOutlined";

export const AdminDashboard = () => {
  const { handleLogout } = useContext(AuthContext);
  const { scroll } = useContext(GlobalToolsContext);
  const navigate = useNavigate();
  const [selectedOption, setSelectedOption] = useState("clientOrders");

  const handleOptionClick = (option) => {
    setSelectedOption(option);
  };

  return (
    <div
      style={{
        width: "100%",
        height: "680px",

        margin: "20px 0 140px",
      }}
    >
      <DashboardContainer>
        <DashboardNavigation>
          <DashboardListContainer>
            <DashboardList
              onClick={() => handleOptionClick("clientOrders")}
              active={selectedOption === "clientOrders"}
            >
              <ListAltIcon />
              <DashboardBtn>
                <SpanBtn>orders</SpanBtn>
              </DashboardBtn>
            </DashboardList>
            <DashboardList
              onClick={() => handleOptionClick("manageProducts")}
              active={selectedOption === "manageProducts"}
            >
              <Inventory2OutlinedIcon />
              <DashboardBtn>
                <SpanBtn>inventory</SpanBtn>
              </DashboardBtn>
            </DashboardList>
            <DashboardList
              onClick={() => handleOptionClick("newsletters")}
              active={selectedOption === "newsletters"}
            >
              <CampaignOutlinedIcon />
              <DashboardBtn>
                <SpanBtn>subscribers</SpanBtn>
              </DashboardBtn>
            </DashboardList>
            <DashboardList
              onClick={() => handleOptionClick("shipping")}
              active={selectedOption === "shipping"}
            >
              <LocalShippingOutlinedIcon />
              <DashboardBtn>
                <SpanBtn>shipping</SpanBtn>
              </DashboardBtn>
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
        {selectedOption === "manageProducts" && <AdminProducts />}
        {selectedOption === "newsletters" && <AdminNewsletters />}
        {selectedOption === "shipping" && <AdminShipping />}
      </DashboardContainer>
    </div>
  );
};

const DashboardContainer = styled.div`
  width: 100%;
  max-width: 1400px;
  height: 100%;
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  justify-content: center;
  margin: 0 auto;
`;

const DashboardNavigation = styled.nav`
  width: 206px;
  height: 100%;
  box-shadow: rgba(0, 0, 0, 0.65) -3px 0px 9px;
  border-top-left-radius: 20px;
  border-bottom-left-radius: 20px;
  background-color: rgb(186 199 225 / 40%);
  @media (max-width: 1088px) {
    margin-top: 69px;
  }
`;

const DashboardListContainer = styled.ul`
  display: flex;
  flex-direction: column;
  height: 97%;
  width: 94%;
  gap: 1rem;
  padding-top: 32px;
  margin: 7px auto 0px 13px;
  border-bottom: 1px solid lightgray;
  border-top: 1px solid lightgray;
  border-top-left-radius: 16px;
  border-bottom-left-radius: 12px;
  border-bottom-right-radius: 6px;
  border-top-right-radius: 6px;
  -webkit-box-pack: start;
  justify-content: flex-start;
  background-color: rgb(245, 245, 245);
  box-shadow: rgba(0, 0, 0, 0.45) -1px 0px 4px;
  align-items: flex-start;
`;
const SpanBtn = styled.span`
  position: relative;
  display: inline-block;
`;

const DashboardList = styled.li`
  height: 50px;
  width: 87%;
  text-align: center;
  display: flex;
  margin: 0 auto;
  padding: 10px;
  -webkit-box-align: center;
  align-items: center;
  justify-content: center;
  position: relative;
  background-image: linear-gradient(to right, transparent -250%, #bac7e1 100%);
  background-repeat: no-repeat;
  background-size: 0% 100%;
  background-position: left bottom;
  transition: background-size 0.2s ease-in-out, font-size 0.2s ease-in-out,
    color 0.2s ease-in-out;

  ${({ active }) =>
    active &&
    css`
      color: #545f93;
      background-size: 100% 100%;
      border-radius: 6px;
    `}
  &:hover {
    color: rgb(87, 98, 158);
    background-size: 100% 100%;
    border-radius: 6px;
  }
  &:active {
    color: #b5b1dd;
    transition: background-color 0.1s ease-in-out;
  }
`;

const DashboardBtn = styled.button`
  color: black;
  width: 70%;
  height: 100%;
  margin-left: 14px;
  text-align: left;
  background-color: transparent;
  border: none;
  text-decoration: none;
  font-weight: 600;
  text-transform: uppercase;
  font-size: clamp(0.6rem, 2px + 1vw, 0.8rem);
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
  top: ${(props) => (props.scrolled === "scrolled" ? "16px" : "16px")};
  right: 4%;
  transition: top
    ${(props) => (props.scrolled === "scrolled" ? "0.18s" : "0.18s")}
    ease-in-out;
  z-index: 2;
  @media (max-width: 950px) {
    right: 0;
  }
`;
