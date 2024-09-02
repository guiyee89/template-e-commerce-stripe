import styled from "styled-components/macro";
import { AdminOrders } from "./adminOrders/AdminOrders";
import { AdminNewsletters } from "./adminNewsletters/AdminNewsletters";
import { AdminProducts } from "./adminProducts/AdminProducts";
import { AdminShipping } from "./adminShipping/AdminShipping";
import { useState } from "react";
import { AdminNavLinks } from "./AdminNavLinks";

export const AdminDashboard = () => {
  //////////        ////////////        ////////////        ///////////
  //                       States                      //
  const [selectedOption, setSelectedOption] = useState("clientOrders");

  //////////        ////////////        ////////////        ///////////
  //                       Functions                      //
  const handleOptionClick = (option) => {
    setSelectedOption(option);
  };

  return (
    <DashboardWrapper>
      <DashboardContainer>
        <AdminNavLinks
          handleOptionClick={handleOptionClick}
          selectedOption={selectedOption}
        />
        {selectedOption === "clientOrders" && <AdminOrders />}
        {selectedOption === "manageProducts" && <AdminProducts />}
        {selectedOption === "newsletters" && <AdminNewsletters />}
        {selectedOption === "shipping" && <AdminShipping />}
      </DashboardContainer>
    </DashboardWrapper>
  );
};
const DashboardWrapper = styled.div`
  width: 100%;
  height: 680px;
  margin: 20px 0 140px;
  @media (max-width: 1100px) {
    height: 100%;
    margin: 0 auto 40px;
  }
`;
const DashboardContainer = styled.div`
  width: 100%;
  max-width: 1400px;
  height: 100%;
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  justify-content: center;
  margin: 0 auto;
  @media (max-width: 1300px) {
    gap: 0.7rem;
  }
  @media (max-width: 1100px) {
    display: block;
  }
`;
