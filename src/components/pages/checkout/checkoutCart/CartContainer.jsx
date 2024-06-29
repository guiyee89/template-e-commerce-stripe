import styled, { css } from "styled-components/macro";
import { CartContext } from "../../../context/CartContext";
import { useContext } from "react";
import { GlobalToolsContext } from "../../../context/GlobalToolsContext";
import DeleteIcon from "@mui/icons-material/Delete";
import { TextField } from "@mui/material";
import { Ring } from "@uiball/loaders";
import { useState } from "react";
import { useEffect } from "react";
import useItemLoader from "../../../hooks/useItemLoader";

export const CartContainer = ({
  shipmentCost,
  shipCostLoader,
  shippingMethod,
}) => {
  const { windowWidth } = useContext(GlobalToolsContext);
  const {
    cart,
    getTotalPrice,
    getItemPrice,
    getTotalDiscount,
    getSubTotal,
    removeById,
    removeQuantity,
    addQuantity,
  } = useContext(CartContext);

  const total = getTotalPrice();
  const subTotal = getSubTotal();
  const totalDiscount = getTotalDiscount();
  const [currentTotal, setCurrentTotal] = useState(total);
  const [currentSubTotal, setCurrentSubTotal] = useState(subTotal);
  const [currentTotalDiscount, setCurrentTotalDiscount] =
    useState(totalDiscount);
  const [currentItemPrices, setCurrentItemPrices] = useState(
    cart.map((item) => getItemPrice(item.id))
  );
  const [currentDiscountPrices, setCurrentDiscountPrices] = useState(
    cart.map((item) => item.discountPrice * item.quantity)
  );
  const [prevQuantities, setPrevQuantities] = useState(0);
  const [itemLoaders, setLoader] = useItemLoader(); //Loader hook

  useEffect(() => {
    if (!shipCostLoader) {
      setCurrentTotal(total + shipmentCost);
    }
  }, [shipCostLoader]);

  useEffect(() => {
    if (!Object.values(itemLoaders).some((loader) => loader)) {
      setCurrentSubTotal(subTotal);
      setCurrentTotalDiscount(totalDiscount);
      setCurrentItemPrices(cart.map((item) => getItemPrice(item.id)));
      setCurrentDiscountPrices(
        cart.map((item) => item.discountPrice * item.quantity)
      );
      setCurrentTotal(total + shipmentCost);
      setPrevQuantities(cart.map((item) => item.quantity));
    }
  }, [itemLoaders]);

  const handleLoader = (itemId, action) => {
    setLoader(itemId, true);
    action();
    setTimeout(() => {
      setLoader(itemId, false);
    }, 480);
  };

  const handleAddQuantity = (itemId) =>
    handleLoader(itemId, () => addQuantity(itemId));
  const handleRemoveQuantity = (itemId) =>
    handleLoader(itemId, () => removeQuantity(itemId));
  const handleRemoveById = (itemId) => {
    setLoader(itemId, true);
    setTimeout(() => {
      removeById(itemId);
      setLoader(itemId, false);
    }, 480);
  };

  return (
    <>
      <CartTotalMainContainer>
        <CartTotalPriceContainer>
          <OrderSummaryTitle>Order Summary</OrderSummaryTitle>
          <CartItemsContainer>
            {cart.map((item, index) => {
              const currentItemPrice = currentItemPrices[index];
              const currentDiscountPrice = currentDiscountPrices[index];
              const hasDiscount = item.discountPrice;
              const isLoading = itemLoaders[item.id] || false;
              const counterLoading = prevQuantities[index];

              return (
                <ItemsDetailsContainer key={item.id}>
                  <ItemsDetails>
                    <ImgContainer>
                      <Img src={item.img[0]} alt={`Item ${item.id}`} />
                    </ImgContainer>
                    <ItemInfoContainer>
                      <ItemData
                        style={{
                          fontSize: "clamp(0.7rem, 0.35vw + 0.5rem, 0.88rem)",
                          fontWeight: "600",
                        }}
                      >
                        {item.title}
                      </ItemData>
                      <ItemData>
                        <ItemSizeColor>
                          <Color>
                            {item.color.map((color, index) => (
                              <SpanColor key={color} secondary={index > 0}>
                                {color}
                                {index < item.color.length - 1 && " - "}
                              </SpanColor>
                            ))}
                          </Color>
                          /<SpanSize>{item.size}</SpanSize>
                        </ItemSizeColor>
                      </ItemData>
                      {item.quantity > 1 ? (
                        isLoading && counterLoading === 1 ? (
                          <div></div>
                        ) : (
                          <ItemData style={{ marginTop: "-2px" }}>
                            {hasDiscount ? (
                              <SpanEachPrice>
                                $ {item.discountPrice.toFixed(2)} each
                              </SpanEachPrice>
                            ) : (
                              <SpanEachPrice>
                                $ {item.unit_price.toFixed(2)} each
                              </SpanEachPrice>
                            )}
                          </ItemData>
                        )
                      ) : (
                        item.quantity > 2 && (
                          <ItemData style={{ marginTop: "-2px" }}>
                            {hasDiscount ? (
                              <SpanEachPrice>
                                $ {item.discountPrice.toFixed(2)} each
                              </SpanEachPrice>
                            ) : (
                              <SpanEachPrice>
                                $ {item.unit_price.toFixed(2)} each
                              </SpanEachPrice>
                            )}
                          </ItemData>
                        )
                      )}
                    </ItemInfoContainer>
                  </ItemsDetails>
                  <ItemData>
                    <QuantityWrapper windowwidth={windowWidth}>
                      <BtnQuantity
                        onClick={() => handleRemoveQuantity(item.id)}
                        disabled={item.quantity === 1}
                        style={{ width: "33%" }}
                      >
                        {" "}
                        -{" "}
                      </BtnQuantity>
                      {isLoading ? (
                        <RingLoaderContainer>
                          <Ring
                            size={20}
                            lineWeight={6}
                            speed={1}
                            color="black"
                          />
                        </RingLoaderContainer>
                      ) : (
                        <ItemQuantity>{item.quantity}</ItemQuantity>
                      )}
                      <BtnQuantity
                        onClick={() => handleAddQuantity(item.id)}
                        disabled={item.stock === item.quantity}
                        style={{ width: "33%" }}
                      >
                        {" "}
                        +{" "}
                      </BtnQuantity>
                    </QuantityWrapper>
                  </ItemData>
                  {hasDiscount ? (
                    <ItemPriceWrapper hasDiscount={hasDiscount}>
                      {hasDiscount && (
                        <DiscountPrice>
                          $ {currentDiscountPrice.toFixed(2)}
                        </DiscountPrice>
                      )}
                      <Price hasDiscount={hasDiscount}>
                        $ {currentItemPrice.toFixed(2)}
                      </Price>
                    </ItemPriceWrapper>
                  ) : (
                    <Price>$ {currentItemPrice.toFixed(2)}</Price>
                  )}
                  <DeleteIconBtn onClick={() => handleRemoveById(item.id)} />
                </ItemsDetailsContainer>
              );
            })}
          </CartItemsContainer>
          <TotalPriceInfoDesktopContainer windowwidth={windowWidth}>
            <DiscountCouponWrapper>
              <Input
                label="Discount code"
                variant="outlined"
                name="discount"
                sx={{
                  width: "70%",
                  minWidth: "160px",
                  backgroundColor: "white",
                }}
                size="medium"
              />
              <DiscountCouponBtn>Apply</DiscountCouponBtn>
            </DiscountCouponWrapper>
            <SubTotalWrapper>
              <TotalText style={{ fontWeight: "500" }}>Subtotal</TotalText>
              <SubTotal>${currentSubTotal.toFixed(2)}</SubTotal>
            </SubTotalWrapper>
            <DiscountWrapper>
              <TotalText>Discount</TotalText>
              <SubTotal>- ${currentTotalDiscount.toFixed(2)}</SubTotal>
            </DiscountWrapper>
            <ShippingWrapper>
              {shippingMethod === "pick_up" ? (
                <p style={{ textAlign: "end" }}>Pick up</p>
              ) : (
                <p style={{ textAlign: "end" }}>Shipping</p>
              )}
              {shipCostLoader ? (
                <RingLoaderContainer>
                  <p style={{ paddingRight: "8px", fontSize: ".78rem" }}>
                    Calculating ...
                  </p>
                  <Ring size={20} lineWeight={6} speed={1} color="black" />
                </RingLoaderContainer>
              ) : (
                <>
                  {shippingMethod === "pick_up" ? (
                    <p style={{ fontWeight: "600", fontSize: ".8rem" }}>FREE</p>
                  ) : shipmentCost === 0 ? (
                    <p> - - </p>
                  ) : (
                    <ShipmentCost>$ {shipmentCost.toFixed(2)}</ShipmentCost>
                  )}
                </>
              )}
            </ShippingWrapper>
            <TotalWrapper>
              <TotalText>Total</TotalText>
              <TotalPrice>$ {currentTotal.toFixed(2)}</TotalPrice>
            </TotalWrapper>
          </TotalPriceInfoDesktopContainer>
        </CartTotalPriceContainer>
      </CartTotalMainContainer>
    </>
  );
};

const CartTotalMainContainer = styled.div`
  width: 46%;
  min-width: 450px;
  background-color: rgb(236, 234, 234);
  padding: 150px 0px 150px;
  @media (max-width: 970px) {
    min-width: 400px;
  }
  @media (max-width: 850px) {
    min-width: auto;
    width: 100%;
    padding: 116px 0px 20px;
  }
  &::before {
    content: "";
    position: absolute;
    top: 0px;
    bottom: -20%;
    width: 1px;
    background: linear-gradient(rgba(0, 0, 0, 0.35) 2%, rgba(0, 0, 0, 0) 100%);

    @media (max-width: 850px) {
      display: none;
    }
  }
`;
const CartTotalPriceContainer = styled.div`
  display: flex;
  flex-direction: column;
  padding: 0 50px 0 50px;
  background-color: #eceaea;
  position: sticky;
  top: 84px;
  &::before {
    content: "";
    position: absolute;
    top: 0px;
    bottom: -20%;
    margin-left: -50px;
    width: 1px;
    background: linear-gradient(rgba(0, 0, 0, 0.35) 2%, rgba(0, 0, 0, 0) 100%);
    @media (max-width: 1050px) {
      margin-left: -18px;
    }
    @media (max-width: 850px) {
      display: none;
    }
  }
  @media (max-width: 1050px) {
    padding: 0 5px 0 18px;
  }
  @media (max-width: 850px) {
    padding: 0 18px 0 18px;
    width: 85%;
    margin: 0 auto;
  }
  @media (max-width: 700px) {
    padding: 0 5px 0 5px;
    width: 100%;
  }
`;
const TotalPriceInfoDesktopContainer = styled.div`
  display: ${(props) => (props.windowwidth < 851 ? "none" : "flex")};
  max-width: 428px;
  flex-direction: column;
  gap: 0.6rem;
  padding: 32px 8px 0px;
  border-top: 1px solid lightgray;
`;

const TotalWrapper = styled.div`
  font-weight: 600;
  font-size: clamp(1rem, 1.5vw + 0.5rem, 1.2rem);
  display: flex;
  justify-content: space-between;
  @media (max-width: 850px) {
    width: 80%;
    margin: 0 auto;
  }
  @media (max-width: 700px) {
    width: 95%;
  }
`;
const SubTotalWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  font-size: clamp(0.75rem, 1.5vw + 0.5rem, 0.9rem);
  @media (max-width: 850px) {
    width: 80%;
    margin: 0 auto;
  }
  @media (max-width: 700px) {
    width: 95%;
  }
`;
const DiscountWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  font-size: clamp(0.75rem, 1.5vw + 0.5rem, 0.9rem);
  @media (max-width: 850px) {
    width: 80%;
    margin: 0 auto;
  }
  @media (max-width: 700px) {
    width: 95%;
  }
`;
const ShippingWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  font-size: clamp(0.75rem, 1.5vw + 0.5rem, 0.9rem);
  @media (max-width: 850px) {
    width: 80%;
    margin: 0 auto;
  }
  @media (max-width: 700px) {
    width: 95%;
  }
`;
const TotalText = styled.h3`
  text-align: end;
`;
const ShipmentCost = styled.h3`
  font-weight: 500;
`;
const SubTotal = styled.h3`
  font-weight: 500;
`;
const TotalPrice = styled.h3`
  font-weight: bold;
  font-size: clamp(1.1rem, 1.5vw + 0.5rem, 1.3rem);
`;
const OrderSummaryTitle = styled.h1`
  font-size: clamp(1rem, 2vw, 1.15rem);
  font-weight: 600;
  margin-bottom: 20px;
  padding-bottom: 16px;
  font-family: "Playfair Display", serif;
  @media (max-width: 850px) {
    padding-left: 3%;
    margin-bottom: 0;
    background-color: rgb(236, 234, 234);
  }
`;
const CartItemsContainer = styled.div`
  max-width: 430px;
  padding-bottom: 40px;
  max-height: 370px;
  overflow-y: auto;
  padding: 16px 8px 20px 0;
  ::-webkit-scrollbar {
    width: 5px;
  }
  ::-webkit-scrollbar-thumb {
    background-color: #888;
    border-radius: 5px;
  }
  ::-webkit-scrollbar-thumb:hover {
    background-color: #555;
  }
  ::-webkit-scrollbar-track {
    background-color: #f1f1f1;
  }
  @media (max-width: 850px) {
    max-width: none;
    width: 100%;
    margin: 0px auto;
    padding: 12px 8px 0 8px;
    height: auto;
    max-height: 280px;
    overflow-y: auto;
    background-color: rgb(244 244 244);
    border-bottom: 1px solid lightgrey;
  }
`;
const ItemsDetailsContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
  justify-content: space-around;
  @media (max-width: 850px) {
    justify-content: space-around;
  }
  @media (max-width: 550px) {
    justify-content: space-evenly;
  }
`;
const ItemsDetails = styled.div`
  display: flex;
  width: 54%;
  @media (max-width: 1100px) {
    width: 50%;
  }
`;
const ImgContainer = styled.div`
  min-width: 68px;
  height: 68px;
  @media (max-width: 550px) {
    min-width: 62px;
    height: 62px;
  }
`;
const Img = styled.img`
  border: 1px solid lightgray;
  width: 100%;
  height: 100%;
  object-fit: cover;
`;
const ItemData = styled.div`
  padding: 0 0 2px 8px;
  font-size: clamp(0.7rem, 0.35vw + 0.5rem, 0.88rem);
  text-transform: capitalize;
`;
const ItemSizeColor = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  @media (max-width: 1050px) {
    flex-wrap: wrap;
  }
`;
const Color = styled.p`
  width: 60%;
  font-size: clamp(0.55rem, 5px + 0.8vw, 0.73rem);
`;

const SpanColor = styled.span`
  font-weight: ${({ secondary }) => (secondary ? "normal" : "500")};
  ${({ secondary }) =>
    secondary &&
    css`
      color: #888;
      font-size: clamp(0.45rem, 1.1vw, 0.65rem);
    `}
  padding-right: 2px;
`;
const SpanSize = styled.span`
  font-weight: 500;
  font-size: clamp(0.57rem, 1.1vw, 0.73rem);
  text-transform: uppercase;
  padding-left: 8px;
`;
const SpanEachPrice = styled.span`
  font-size: clamp(0.6rem, 0.35vw + 0.45rem, 0.7rem);
  font-weight: 600;
  color: grey;
`;
const ItemInfoContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
`;

const QuantityWrapper = styled.div`
  display: flex;
  border: 1px solid rgb(194, 191, 191);
  border-radius: 5%;
  width: ${(props) => (props.windowwidth < 550 ? "64px" : "74px")};
  min-width: ${(props) =>
    props.windowwidth < 550 ? "64px" : "74px"}; // Add min-width
  margin: 0 auto;
  align-items: center;
  justify-content: space-between;
`;

const ItemQuantity = styled.h4`
  font-weight: 600;
  font-size: 0.75rem;
  text-align: center;
  width: 34%;
  min-width: 20px;
  background-color: #fbf8f8;
  padding: 4px 0;
`;

const BtnQuantity = styled.button`
  border-radius: 5%;
  border: none;
  font-size: 1rem;
`;
const ItemPriceWrapper = styled.h4`
  display: flex;
  align-items: center;
  gap: 0.1rem;
  flex-direction: column-reverse;
  min-width: 85px;
`;
const DeleteIconBtn = styled(DeleteIcon)`
  width: 0.8em !important;
  cursor: pointer;
`;

const DiscountPrice = styled.span`
  color: #a83737;
  font-weight: 600;
  font-size: clamp(0.75rem, 0.55vw + 0.45rem, 0.88rem);
  font-style: italic;
  position: relative;
  text-align: center;
  display: block;
`;
const Price = styled.span`
  display: ${(props) => (props.windowwidth < 550 ? "none" : "flex")};
  justify-content: center;
  min-width: 90px;
  font-weight: 600;
  font-size: ${(props) =>
    props.hasDiscount
      ? "clamp(0.68rem, 0.55vw + 0.45rem, .76rem)"
      : "clamp(0.75rem, 0.55vw + 0.45rem, 0.88rem)"};
  font-style: italic;
  position: relative;
  color: ${(props) => (props.hasDiscount ? "rgb(149 146 146)" : "#a83737")};
  /* Add the following styles to create the strike-through line if hasDiscount is true */
  &::after {
    content: ${(props) => (props.hasDiscount ? "''" : "none")};
    position: absolute;
    bottom: 52%;
    left: 20px;
    width: 58%;
    height: 1px;
    background-color: black;
    @media (max-width: 850px) {
      left: 24px;
      width: 49%;
    }
  }
`;
const DiscountCouponWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 18px;
  @media (max-width: 850px) {
    margin: 18px auto;
    width: 81%;
  }
  @media (max-width: 700px) {
    margin: 18px 14px;
    width: 96%;
  }
  @media (max-width: 450px) {
    margin: 18px 5px;
    width: 95%;
  }
`;
const DiscountCouponBtn = styled.button`
  border: 1px solid darkgray;
  height: 53px;
  width: 18%;
  font-weight: 600;
  color: grey;
  font-size: 0.8rem;
  border-radius: 10%;
`;
const Input = styled(TextField)`
  width: 350px;
  padding-top: 12px;
`;
const RingLoaderContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 84%;
`;
