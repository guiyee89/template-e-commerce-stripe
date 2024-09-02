import styled, { css } from "styled-components/macro";
import ListAltIcon from "@mui/icons-material/ListAlt";
import Inventory2OutlinedIcon from "@mui/icons-material/Inventory2Outlined";
import CampaignOutlinedIcon from "@mui/icons-material/CampaignOutlined";
import LocalShippingOutlinedIcon from "@mui/icons-material/LocalShippingOutlined";
import { GlobalToolsContext } from "../../../context/GlobalToolsContext";
import { useContext } from "react";

export const AdminNavLinks = ({ handleOptionClick, selectedOption }) => {
  //////////        ////////////        ////////////        ///////////
  //                       Context                      //
  const { isMenuOpen } = useContext(GlobalToolsContext);

  return (
    <>
      <DashboardNavigation isMenuOpen={isMenuOpen}>
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
      </DashboardNavigation>
    </>
  );
};
const DashboardNavigation = styled.nav`

  @media (min-width: 1100px) {
    position: relative;
    left: 0;
    margin-top: 0;
    width: 206px;
    height: 100%;
    box-shadow: rgba(0, 0, 0, 0.35) -3px 0px 9px;
    border-top-left-radius: 20px;
    border-bottom-left-radius: 20px;
    background-color: rgb(186 199 225 / 40%);
  }

  @media (max-width: 1100px) {
    left: ${({ isMenuOpen }) => (isMenuOpen ? "-420px" : "0")};
    width: ${({ isMenuOpen }) => (isMenuOpen ? "0" : "70%")};
    transition: ${({ isMenuOpen }) =>
      isMenuOpen ? "0.2s ease-in-out" : "0.2s ease-in-out"};
    z-index: 2;
    height: auto;
    position: absolute;
    margin-top: 20px;
    @media (min-width: 500px) {
      width: ${({ isMenuOpen }) => (isMenuOpen ? "0" : "61%")};
    }
  }
`;

const DashboardListContainer = styled.ul`
  @media (min-width: 1100px) {
    display: flex;
    flex-direction: column;
    height: 97%;
    width: 94%;
    gap: 1rem;
    padding-top: 32px;
    margin: 7px auto 0px 9px;
    border-bottom: 1px solid lightgray;
    border-top: 1px solid lightgray;
    border-top-left-radius: 16px;
    border-bottom-left-radius: 12px;
    border-bottom-right-radius: 6px;
    border-top-right-radius: 6px;
    -webkit-box-pack: start;
    justify-content: flex-start;
    background-color: rgb(245, 245, 245);
    box-shadow: rgba(0, 0, 0, 0.25) -1px 0px 5px;
    align-items: flex-start;
  }
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
