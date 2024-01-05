import styled from "styled-components/macro";
import { TableCell } from "@mui/material";

export const BuyerDetails = ({ clientDetails }) => {
  const { buyer, shipment_cost, total } = clientDetails || {};
  console.log(clientDetails);
  console.log(buyer);

  return (
    <>
      <BuyerDetailsWrapper>
        <BuyerTitle>Client Details:</BuyerTitle>

        <BuyerInfo>
          <BuyerData>
            <Data>
              Name: <Span>{buyer?.name}</Span>
            </Data>
            <Data>
              Email:{" "}
              <Span style={{ textTransform: "lowercase" }}>{buyer?.email}</Span>
            </Data>
            <Data>
              Phone: <Span>{buyer?.phone}</Span>
            </Data>
          </BuyerData>
          <ShippingData>
            <Data>
              City: <Span>{buyer?.ciudad}</Span>
            </Data>
            <Data>
              Post Code: <Span>{buyer?.cp}</Span>
            </Data>
            <Data>
              Address: <Span>{buyer?.direccion}</Span>
            </Data>
          </ShippingData>
        </BuyerInfo>
        <OrderCost>
          <DataCost style={{ fontSize: ".9rem" }}>
            Shipment Cost:{" "}
            <SpanCost style={{ fontSize: ".9rem", paddingLeft: "21px" }}>
              {" "}
              $ {shipment_cost}
            </SpanCost>
          </DataCost>
          <DataCostTotal>
            Total: <SpanCost>$ {total}</SpanCost>
          </DataCostTotal>
        </OrderCost>
      </BuyerDetailsWrapper>
    </>
  );
};

const BuyerDetailsWrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
`;
const BuyerInfo = styled.div`
  display: flex;
  padding: 26px 0 0 20px;
  gap: 6rem;
  @media (max-width: 500px){
    padding: 26px 0px 0px 10px;
    gap: 2rem;
  }
`;
const BuyerTitle = styled.h2`
  width: 100%;
  font-weight: 900;
  padding: 18px 0 12px 20px;
  border-bottom: 1px solid lightgray;
  text-transform: uppercase;
  font-size: 1.1rem;
  text-decoration: underline;
`;
const BuyerData = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.7rem;
`;
const ShippingData = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.7rem;
`;
const Data = styled.p`
  display: flex;
  flex-direction: column;
  text-transform: uppercase;
  font-size: 0.8rem;
  font-weight: 900;
`;
const DataCost = styled.p`
  text-transform: uppercase;
  font-size: 1rem;
  font-weight: 900;
`;
const DataCostTotal = styled.p`
  text-transform: uppercase;
  font-size: 1rem;
  font-weight: 900;
  position: relative;
/*   &::after {
    content: "";
    position: absolute;
    bottom: 4%;
    left: -1px;
    width: 24%;
    height: 1px;
    background-color: black;
  } */
`;
const Span = styled.span`
  font-weight: 500;
  text-transform: capitalize;
  font-size: 0.9rem;
`;
const SpanCost = styled.span`
  font-weight: 600;
  text-transform: capitalize;
  font-size: 1.1rem;
  padding-left: 89px;
`;
const OrderCost = styled.div`
  display: flex;
  flex-direction: column;
  min-width: 230px;
  padding: 15px 0px 20px 20px;
  margin-top: 20px;
  border-top: 1px solid darkgrey;
  gap: 1rem;
  -webkit-box-pack: center;
  justify-content: center;
`;
