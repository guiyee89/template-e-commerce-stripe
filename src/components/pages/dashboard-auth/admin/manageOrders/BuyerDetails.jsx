import styled from "styled-components/macro";
import CloseIcon from "@mui/icons-material/Close";

export const BuyerDetails = ({ clientDetails, handleClose }) => {
  const { buyer, shipment_cost, total } = clientDetails || {};
  console.log(clientDetails);
  console.log(buyer);

  return (
    <>
      <BuyerDetailsWrapper>
        <CloseIconBtn onClick={handleClose} />
        <BuyerTitle>Client Information:</BuyerTitle>
        <BuyerInfo>
          <BuyerData>
            <Data style={{ gap: "2.97rem" }}>
              Name: <Span>{buyer?.name}</Span>
            </Data>
            <Data style={{ gap: "2.9rem" }}>
              Email:{" "}
              <Span style={{ textTransform: "lowercase" }}>{buyer?.email}</Span>
            </Data>
            <Data style={{ gap: "2.5rem" }}>
              Phone: <Span>{buyer?.phone}</Span>
            </Data>
          </BuyerData>
          <ShippingData>
            <Data style={{ gap: "1.5rem" }}>
              Country: <Span>{buyer?.country}</Span>
            </Data>
            <Data style={{ gap: "2.95rem" }}>
              State: <Span>{buyer?.state}</Span>
            </Data>
            <Data style={{ gap: "3.7rem" }}>
              City: <Span>{buyer?.ciudad}</Span>
            </Data>
            <Data style={{ gap: "1.5rem" }}>
              Zip Code: <Span>{buyer?.cp}</Span>
            </Data>
            <Data style={{ gap: "1.5rem" }}>
              Address: <Span>{buyer?.direccion}</Span>
            </Data>
          </ShippingData>
        </BuyerInfo>
        <OrderCost>
          <DataCost style={{ fontSize: ".9rem" }}>
            Shipment Cost:{" "}
            <SpanCost style={{ fontSize: ".9rem", paddingLeft: "21px" }}>
              {" "}
              $ {shipment_cost.toFixed(2)}
            </SpanCost>
          </DataCost>
          <DataCostTotal>
            Total: <SpanCost>$ {total.toFixed(2)}</SpanCost>
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
  padding: 26px 0px 0px 20px;
  gap: 1rem;
  flex-direction: column;
  @media (max-width: 500px) {
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
  text-transform: uppercase;
  font-size: 0.8rem;
  font-weight: 900;
`;
const DataCost = styled.p`
  display: flex;
  text-transform: uppercase;
  font-size: 1rem;
  font-weight: 900;
  justify-content: space-between;
`;
const DataCostTotal = styled.p`
  display: flex;
  text-transform: uppercase;
  font-size: 1rem;
  font-weight: 900;
  position: relative;
  justify-content: space-between;
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
  padding: 15px 40px 20px 20px;
  margin-top: 20px;
  border-top: 1px solid darkgrey;
  gap: 1rem;
  -webkit-box-pack: center;
  justify-content: center;
`;
const CloseIconBtn = styled(CloseIcon)`
  cursor: pointer;
  font-size: 28px;
  top: 4%;
  left: ${(props) => (props.windowWidth < 750 ? "85%" : "90%")};
  position: absolute;
  z-index: 2;
  @media (max-width: 750px) {
    top: 3%;
    left: 88%;
  }
`;
