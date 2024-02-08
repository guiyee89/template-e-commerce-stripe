import { Box, Modal, TextField } from "@mui/material";
import { useContext, useEffect, useState } from "react";
import styled from "styled-components/macro";
import { CartContext } from "../../../context/CartContext";
import DeleteIcon from "@mui/icons-material/Delete";
import { GlobalToolsContext } from "../../../context/GlobalToolsContext";
import CloseIcon from "@mui/icons-material/Close";
import { Payment } from "../checkoutStripe2.0/Payment";
import { Link } from "react-router-dom";
import { AuthContext } from "../../../context/AuthContext";
import { Ring } from "@uiball/loaders";

export const CheckoutFormCart = ({
  handleSubmit,
  handleChange,
  errors,
  confirm,
  setConfirm,
  checkoutLoading,
}) => {
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
  const { windowWidth } = useContext(GlobalToolsContext);
  const { user, handleLogout } = useContext(AuthContext);
  const total = getTotalPrice();
  const subTotal = getSubTotal();
  const totalDiscount = getTotalDiscount();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      setIsLoading(true);
    }, 350);
  }, []);

  // Use useEffect to open the modal when confirm becomes true
  useEffect(() => {
    if (confirm) {
      setIsModalOpen(true);
    }
  }, [confirm]);

  // Function to close the modal
  const closeModal = () => {
    setIsModalOpen(false);
    setConfirm(false);
  };

  const handleLoginLinkClick = () => {
    window.location.assign("/login");
    localStorage.setItem("prevLocation", location.pathname);
  };

  useEffect(() => {
    const handleLogoutAfterReload = () => {
      const logoutInfoString = localStorage.getItem("logoutInfo");
      if (logoutInfoString) {
        const logoutInfo = JSON.parse(logoutInfoString);
        if (logoutInfo.logoutAfterReload) {
          // Perform the logout action
          handleLogout();
          localStorage.removeItem("logoutInfo");
        }
      }
    };
    // Check if there is a logoutInfo in localStorage
    handleLogoutAfterReload();
    // Set a flag in localStorage to indicate that a reload has occurred
    localStorage.setItem("reloadOccurred", "true");
    return () => {
      localStorage.removeItem("reloadOccurred");
    };
  }, [handleLogout]);

  return (
    <>
      <Wrapper>
        <FormItemsContainer windowwidth={windowWidth}>
          <FormItemsWrapper>
            {isLoading === false ? (
              <div style={{ width: "52%", height: "100%" }}></div>
            ) : (
              <FormWrapper windowwidth={windowWidth}>
                <Form onSubmit={handleSubmit} windowwidth={windowWidth}>
                  {Object.keys(user).length > 0 ? (
                    <>
                      <ContactTitle windowwidth={windowWidth}>
                        Contact
                      </ContactTitle>
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          width: "100%",
                        }}
                      >
                        <LogoutContainer>
                          <p style={{ fontSize: ".9rem", fontWeight: "500" }}>
                            {user.email}
                          </p>

                          <LogBtn
                            type="button"
                            onClick={() => {
                              localStorage.setItem(
                                "logoutInfo",
                                JSON.stringify({ logoutAfterReload: true })
                              );
                              window.location.reload();
                            }}
                          >
                            Log out
                          </LogBtn>
                        </LogoutContainer>
                      </div>
                    </>
                  ) : (
                    <>
                      <div
                        style={{
                          display: "flex",
                          width: "100%",
                          alignItems: "center",
                        }}
                      >
                        <ContactTitle windowwidth={windowWidth}>
                          Contact
                        </ContactTitle>
                        <LoginContainer>
                          <p style={{ textAlign: "end" }}>
                            Have an account?{" "}
                            <LogBtn
                              type="button"
                              onClick={handleLoginLinkClick}
                            >
                              Log in
                            </LogBtn>
                          </p>
                        </LoginContainer>
                      </div>
                      <Input
                        label="Email"
                        variant="outlined"
                        name="email"
                        onChange={handleChange}
                        helperText={errors.email}
                        error={errors.email ? true : false}
                        sx={{ marginTop: "20px", width: "100%" }}
                        size="medium"
                      />
                    </>
                  )}
                  <DeliveryInfoTitle>Delivery</DeliveryInfoTitle>
                  <Input
                    label="Name"
                    variant="outlined"
                    name="name"
                    onChange={handleChange}
                    helperText={errors.name}
                    error={errors.name ? true : false}
                    sx={{ marginTop: "20px", width: "100%" }}
                    size="medium"
                  />
                  <Input
                    label="Phone"
                    variant="outlined"
                    name="phone"
                    onChange={handleChange}
                    helperText={errors.phone}
                    error={errors.phone ? true : false}
                    sx={{ marginTop: "20px", width: "100%" }}
                    size="medium"
                  />
                  <Input
                    label="City"
                    variant="outlined"
                    name="ciudad"
                    onChange={handleChange}
                    helperText={errors.ciudad}
                    error={errors.ciudad ? true : false}
                    sx={{ marginTop: "20px", width: "100%" }}
                    size="medium"
                  />
                  <Input
                    label="Address"
                    variant="outlined"
                    name="direccion"
                    onChange={handleChange}
                    helperText={errors.direccion}
                    error={errors.direccion ? true : false}
                    sx={{ marginTop: "20px", width: "100%" }}
                    size="medium"
                  />
                  <Input
                    label="Zip Code "
                    variant="outlined"
                    name="cp"
                    onChange={handleChange}
                    helperText={errors.cp}
                    error={errors.cp ? true : false}
                    sx={{ marginTop: "20px", width: "100%" }}
                    size="medium"
                  />
                </Form>
                <TotalPriceInfoMobileContainer windowwidth={windowWidth}>
                  <DiscountCouponWrapper>
                    <Input
                      label="Discount code"
                      variant="outlined"
                      name="discount"
                      onChange={handleChange}
                      helperText={errors.ciudad}
                      error={errors.ciudad ? true : false}
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
                    <TotalText>Subtotal:</TotalText>
                    <SubTotal>$ {subTotal.toFixed(2)}</SubTotal>
                  </SubTotalWrapper>
                  <DiscountWrapper>
                    <TotalText>Discount:</TotalText>
                    <TotalDiscount>
                      - $ {totalDiscount.toFixed(2)}
                    </TotalDiscount>
                  </DiscountWrapper>
                  <TotalWrapper>
                    <TotalText>Total:</TotalText>
                    <TotalPrice>$ {total.toFixed(2)}</TotalPrice>
                  </TotalWrapper>
                </TotalPriceInfoMobileContainer>
                <ConfirmStripe windowwidth={windowWidth}>
                  <ConfirmFormCartBtn
                    type="submit"
                    onClick={handleSubmit}
                    windowwidth={windowWidth}
                  >
                    <SpanConfirmBtn isLoading={checkoutLoading}>
                      {checkoutLoading ? (
                        <RingLoader>
                          <Ring
                            size={25}
                            lineWeight={5}
                            speed={1}
                            color="black"
                          />
                        </RingLoader>
                      ) : (
                        "Confirm"
                      )}
                    </SpanConfirmBtn>
                  </ConfirmFormCartBtn>

                  {isModalOpen && (
                    <Modal
                      open={isModalOpen}
                      onClose={closeModal}
                      sx={{ maxWidth: "1000px", margin: "0 auto" }}
                      aria-labelledby="modal-modal-title"
                      aria-describedby="modal-modal-description"
                    >
                      <Box
                        sx={{
                          ...style,
                          top: windowWidth < 750 ? "50%" : "46%",
                          width:
                            windowWidth < 550
                              ? "100%"
                              : windowWidth < 1100
                              ? "95%"
                              : "110%",
                          height: windowWidth < 750 ? "85%" : "617px",
                          padding: windowWidth < 551 ? "20px" : "62px 25px 0px",
                        }}
                      >
                        <CloseIconBtn onClick={closeModal} />
                        <Payment />
                      </Box>
                    </Modal>
                  )}
                </ConfirmStripe>
              </FormWrapper>
            )}
            <CartTotalMainContainer>
              <CartTotalPriceContainer>
                <OrderSummaryTitle>Order Summary</OrderSummaryTitle>
                <CartItemsContainer>
                  {cart.map((item) => {
                    const itemTotalPrice = getItemPrice(item.id);
                    const hasDiscount = item.discountPrice;

                    return (
                      <ItemsDetailsContainer key={item.id}>
                        <ItemsDetails>
                          <ImgContainer>
                            <Img src={item.img[0]} alt={`Item ${item.id}`} />
                          </ImgContainer>
                          <ItemInfoContainer>
                            <ItemData
                              style={{
                                fontSize:
                                  "clamp(0.7rem, 0.35vw + 0.5rem, 0.88rem)",
                                fontWeight: "500",
                              }}
                            >
                              {item.title}
                            </ItemData>
                            <ItemData>
                              <ItemSizeColor>
                                <SpanColor>{item.color}</SpanColor>/
                                <SpanSize>{item.size}</SpanSize>
                              </ItemSizeColor>
                            </ItemData>
                            {item.quantity > 1 && (
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
                            )}
                          </ItemInfoContainer>
                        </ItemsDetails>
                        <ItemData>
                          <QuantityWrapper windowwidth={windowWidth}>
                            <BtnQuantity
                              onClick={() => removeQuantity(item.id)}
                              disabled={item.quantity === 1}
                              style={{ width: "33%" }}
                            >
                              {" "}
                              -{" "}
                            </BtnQuantity>

                            <ItemQuantity>{item.quantity}</ItemQuantity>

                            <BtnQuantity
                              onClick={() => addQuantity(item.id)}
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
                                ${" "}
                                {(item.discountPrice * item.quantity).toFixed(
                                  2
                                )}
                              </DiscountPrice>
                            )}
                            <Price hasDiscount={hasDiscount}>
                              $ {itemTotalPrice.toFixed(2)}
                            </Price>
                          </ItemPriceWrapper>
                        ) : (
                          <Price>$ {itemTotalPrice.toFixed(2)}</Price>
                        )}

                        <DeleteIconBtn onClick={() => removeById(item.id)} />
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
                      onChange={handleChange}
                      helperText={errors.ciudad}
                      error={errors.ciudad ? true : false}
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
                    <TotalText>Subtotal:</TotalText>
                    <SubTotal>$ {subTotal.toFixed(2)}</SubTotal>
                  </SubTotalWrapper>
                  <DiscountWrapper>
                    <TotalText>Discount:</TotalText>
                    <TotalDiscount>
                      - $ {totalDiscount.toFixed(2)}
                    </TotalDiscount>
                  </DiscountWrapper>
                  <TotalWrapper>
                    <TotalText>Total:</TotalText>
                    <TotalPrice>$ {total.toFixed(2)}</TotalPrice>
                  </TotalWrapper>
                </TotalPriceInfoDesktopContainer>
              </CartTotalPriceContainer>
            </CartTotalMainContainer>
          </FormItemsWrapper>
        </FormItemsContainer>
      </Wrapper>
    </>
  );
};
const Wrapper = styled.section`
  width: 100%;
  margin: 0 auto;
`;

const FormItemsContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(12, 1fr);
  height: ${(props) => (props.windowwidth < 851 ? "none" : "100%")};
  width: ${(props) => (props.windowwidth < 851 ? "100%" : "none")};
`;
const FormItemsWrapper = styled.div`
  display: flex;
  justify-content: center;
  grid-column: 1/13;
  height: 100%;
  margin-bottom: 140px;
  @media (max-width: 850px) {
    flex-direction: column-reverse;
    margin-bottom: 0;
  }
`;
const FormWrapper = styled.div`
  height: 100%;
  width: 52%;
  display: flex;
  flex-direction: column;
  margin: 0 auto;
  padding: 150px 40px 0;
  align-items: flex-end;
  @media (max-width: 1050px) {
    padding: 150px 18px 0;
    min-width: 400px;
  }
  @media (max-width: 850px) {
    padding: 0px 4px 80px 4px;
    width: 100%;
    min-width: auto;
    height: auto;
    background-color: rgb(236, 234, 234);
  }
`;
const Form = styled.form`
  display: flex;
  flex-direction: column;
  width: 100%;
  max-width: 500px;
  align-items: ${(props) =>
    props.windowwidth < 1050 ? "flex-start" : "center"};
  margin: ${(props) => (props.windowwidth < 851 ? "0" : "0")};
  @media (max-width: 850px) {
    width: 100%;
    margin: 0px auto;
    padding: 54px 78px 66px;
    max-width: none;
    background-color: white;
  }
  @media (max-width: 650px) {
    padding: 54px 18px 66px;
  }
`;
const Input = styled(TextField)`
  width: 350px;
  padding-top: 12px;
`;

const ContactTitle = styled.h2`
  color: black;
  font-size: clamp(1.2rem, 2vw, 1.5rem);
  font-weight: 600;
  width: 100%;
  @media (max-width: 850px) {
    width: 65%;
  }
`;
const LoginContainer = styled.div`
  width: 100%;
  font-size: 0.8rem;
  padding-right: 5px;
`;
const LogBtn = styled.button`
  border: none;
  background-color: transparent;
  color: blue;
  text-decoration: underline;
  :hover {
    color: #4f4fe7;
  }
  :active {
    color: #bdbdf0;
  }
`;
const LogoutContainer = styled.div`
  width: 100%;
  display: flex;
  -webkit-box-pack: justify;
  justify-content: space-between;
  font-size: 0.8rem;
  padding-right: 5px;
  height: 60px;
  align-items: center;
  border-bottom: 1px solid lightgray;
  padding-left: 4px;
`;

const DeliveryInfoTitle = styled.h2`
  text-align: ${(props) => props.windowwidth < 851 && "center"};
  color: black;
  font-size: clamp(1.2rem, 2vw, 1.5rem);
  margin-top: 44px;
  font-weight: 600;
  width: 100%;
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
const CartTotalMainContainer = styled.div`
  width: 46%;
  min-width: 450px;
  background-color: rgb(236, 234, 234);
  padding: 150px 0px 40px;
  @media (max-width: 970px) {
    min-width: 400px;
  }
  @media (max-width: 850px) {
    min-width: auto;
    width: 100%;
    padding: 116px 0px 20px;
  }
`;
const CartTotalPriceContainer = styled.div`
  display: flex;
  flex-direction: column;
  padding: 0 50px 0 50px;
  background-color: #eceaea;
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
const SpanColor = styled.span`
  font-size: clamp(0.6rem, 1.1vw, 0.78rem);
  text-transform: capitalize;
  padding-right: 8px;
`;
const SpanSize = styled.span`
  font-size: clamp(0.6rem, 1.1vw, 0.78rem);
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
const TotalPriceInfoDesktopContainer = styled.div`
  display: ${(props) => (props.windowwidth < 851 ? "none" : "flex")};
  max-width: 428px;
  flex-direction: column;
  gap: 0.6rem;
  padding: 32px 8px 0px;
  border-top: 1px solid lightgray;
`;
const TotalPriceInfoMobileContainer = styled.div`
  display: ${(props) => (props.windowwidth > 850 ? "none" : "flex")};
  width: 100%;
  flex-direction: column;
  gap: 0.5rem;
  padding: 32px 10px;
  margin: 32px 0px 0px;

  background-color: rgb(236, 234, 234);
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
const TotalText = styled.h3`
  text-align: end;
`;
const TotalDiscount = styled.h3``;
const SubTotal = styled.h3`
  font-weight: 500;
`;
const TotalPrice = styled.h3`
  font-weight: bold;
  font-size: clamp(1.1rem, 1.5vw + 0.5rem, 1.3rem);
`;

const ConfirmStripe = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  max-width: 500px;
  height: 60px;
  padding: 40px 10px 0;
  margin: ${(props) => (props.windowwidth < 851 ? "20px auto" : "0")};
  align-items: ${(props) => (props.windowwidth < 851 ? "center" : "flex-end")};
  @media (max-width: 850px) {
    padding: 0 10px 0;
  }
`;

const ConfirmFormCartBtn = styled.button`
  width: 100%;
  margin: 0 auto;
  padding: 0;
  border: none;
  color: #020202;
  transform: rotate(0deg);
  transform-origin: center;
  font-weight: 500;
  text-decoration: none;
  font-size: 1.3rem;
  cursor: pointer;
  padding-bottom: 2px;
  border-radius: 5px;
  box-shadow: 0 2px 0 #494a4b;
  transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  background-color: #c8935f;
  :active {
    transform: translateY(5px);
    padding: 0;
    outline: 0;
  }
`;
const SpanConfirmBtn = styled.span`
  background: #f1f5f8;
  display: block;
  padding: 0.5rem 1rem;
  border-radius: 5px;
  border: 2px solid #494a4b;
  font-family: "Gochi Hand", cursive;
  :hover {
    transform: ${({ isLoading }) =>
      isLoading ? "none" : "translateY(-1.2px)"};
    box-shadow: ${({ isLoading }) =>
      isLoading ? "none" : "rgba(0, 0, 0, 0.2) 0px 15px 15px"};
  }
`;
const RingLoader = styled.div`
  display: flex;
  -webkit-box-pack: center;
  justify-content: center;
  height: 35px;
  align-items: center;
`;

const CloseIconBtn = styled(CloseIcon)`
  cursor: pointer;
  font-size: 28px;
  top: 3%;
  left: ${(props) => (props.windowwidth < 750 ? "85%" : "96%")};
  position: absolute;
  z-index: 2;
  @media (max-width: 750px) {
    top: 3%;
    left: 88%;
  }
`;
const style = {
  position: "absolute",
  left: "50%",
  transform: "translate(-50%, -50%)",
  bgcolor: "background.paper",
  border: "none!importat",
  borderRadius: "4px",
  outline: 0,
  boxShadow:
    "0px 11px 15px -7px rgba(0,0,0,0.6), 0px 24px 38px 3px rgba(0,0,0,0.14), 0px 9px 46px 8px rgba(0,0,0,-0.48)!important",
  overflow: "auto",
};
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
