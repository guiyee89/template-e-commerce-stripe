import {
  Box,
  Modal,
  TableBody,
  TableCell,
  TableRow,
  TextField,
} from "@mui/material";
import { useContext, useEffect, useState } from "react";
import styled from "styled-components/macro";
import { CartContext } from "../../../context/CartContext";
import { Table } from "react-bootstrap";
import DeleteIcon from "@mui/icons-material/Delete";
import { GlobalToolsContext } from "../../../context/GlobalToolsContext";
import CloseIcon from "@mui/icons-material/Close";
import { Payment } from "../checkoutStripe2.0/Payment";

export const CheckoutFormCart = ({
  handleSubmit,
  handleChange,
  errors,
  confirm,
  setConfirm,
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
  const total = getTotalPrice();
  const subTotal = getSubTotal();
  const totalDiscount = getTotalDiscount();
  const [isModalOpen, setIsModalOpen] = useState(false);

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

  return (
    <>
      <Wrapper>
        <FormItems windowwidth={windowWidth}>
          <FormWrapper windowwidth={windowWidth}>
            <ShippingTitle windowwidth={windowWidth}>
              Shipping Information
            </ShippingTitle>
            <Form onSubmit={handleSubmit} windowwidth={windowWidth}>
              <Input
                label="Name"
                variant="outlined"
                name="name"
                onChange={handleChange}
                helperText={errors.name}
                error={errors.name ? true : false}
                sx={{ marginTop: "20px", width: "300px", minWidth: "200px" }}
                size="small"
              />
              <Input
                label="Email"
                variant="outlined"
                name="email"
                onChange={handleChange}
                helperText={errors.email}
                error={errors.email ? true : false}
                sx={{ marginTop: "20px", width: "300px" }}
                size="small"
              />
              <Input
                label="Phone"
                variant="outlined"
                name="phone"
                onChange={handleChange}
                helperText={errors.phone}
                error={errors.phone ? true : false}
                sx={{ marginTop: "20px", width: "300px" }}
                size="small"
              />
              <Input
                label="City"
                variant="outlined"
                name="ciudad"
                onChange={handleChange}
                helperText={errors.ciudad}
                error={errors.ciudad ? true : false}
                sx={{ marginTop: "20px", width: "300px" }}
                size="small"
              />
              <Input
                label="Address"
                variant="outlined"
                name="direccion"
                onChange={handleChange}
                helperText={errors.direccion}
                error={errors.direccion ? true : false}
                sx={{ marginTop: "20px", width: "300px" }}
                size="small"
              />
              <Input
                label="Zip Code "
                variant="outlined"
                name="cp"
                onChange={handleChange}
                helperText={errors.cp}
                error={errors.cp ? true : false}
                sx={{ marginTop: "20px", width: "300px" }}
                size="small"
              />
            </Form>
            <TotalPriceInfoMobileContainer windowwidth={windowWidth}>
              <SubTotalWrapper>
                <TotalText>Subtotal:</TotalText>
                <SubTotal>$ {subTotal.toFixed(2)}</SubTotal>
              </SubTotalWrapper>
              <DiscountWrapper>
                <TotalText>Discount:</TotalText>
                <TotalDiscount>- $ {totalDiscount.toFixed(2)}</TotalDiscount>
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
                <SpanConfirmBtn>Confirm</SpanConfirmBtn>
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
                      width:
                        windowWidth < 550
                          ? "100%"
                          : windowWidth < 800
                          ? "90%"
                          : "85%",
                      height: windowWidth < 750 ? "100%" : "68%",
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
          <CartTotalPriceContainer>
            <CartItemsContainer>
              {cart.map((item) => {
                const itemTotalPrice = getItemPrice(item.id);
                const hasDiscount = item.discountPrice;

                return (
                  <ItemsDetailsContainer key={item.id}>
                    <ItemsDetails>
                      <ImgContainer>
                        <Img
                          src={item.img[0]}
                          alt={`Item ${item.id}`}
                          windowwidth={windowWidth}
                        />
                      </ImgContainer>
                      <ItemInfoContainer>
                        <ItemData
                          style={{
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
                      </ItemInfoContainer>
                    </ItemsDetails>
                    <ItemData>
                      <QuantityWrapper windowwidth={windowWidth}>
                        <BtnQuantity onClick={() => removeQuantity(item.id)}>
                          {" "}
                          -{" "}
                        </BtnQuantity>
                        <ItemQuantity>{item.quantity}</ItemQuantity>
                        <BtnQuantity
                          onClick={() => addQuantity(item.id)}
                          disabled={item.stock === item.quantity}
                        >
                          {" "}
                          +{" "}
                        </BtnQuantity>
                      </QuantityWrapper>
                    </ItemData>
                    {hasDiscount ? (
                      <TotalPriceWrapper windowwidth={windowWidth}>
                        <DiscountPrice>
                          {" "}
                          $ {(item.discountPrice * item.quantity).toFixed(2)}
                        </DiscountPrice>
                      </TotalPriceWrapper>
                    ) : (
                      <PriceWrapper>
                        <Price>$ {itemTotalPrice.toFixed(2)}</Price>
                      </PriceWrapper>
                    )}
                  </ItemsDetailsContainer>
                );
              })}
            </CartItemsContainer>
            <TotalPriceInfoDesktopContainer windowwidth={windowWidth}>
              <SubTotalWrapper>
                <TotalText>Subtotal:</TotalText>
                <SubTotal>$ {subTotal.toFixed(2)}</SubTotal>
              </SubTotalWrapper>
              <DiscountWrapper>
                <TotalText>Discount:</TotalText>
                <TotalDiscount>- $ {totalDiscount.toFixed(2)}</TotalDiscount>
              </DiscountWrapper>
              <TotalWrapper>
                <TotalText>Total:</TotalText>
                <TotalPrice>$ {total.toFixed(2)}</TotalPrice>
              </TotalWrapper>
            </TotalPriceInfoDesktopContainer>
          </CartTotalPriceContainer>
        </FormItems>
      </Wrapper>
    </>
  );
};
const Wrapper = styled.section`
  display: flex;
  flex-direction: column;
  position: relative;
  width: ${(props) => (props.windowwidth < 851 ? "100%" : "100%")};
  margin: 0 auto;
`;
const ShippingTitle = styled.h1`
  color: black;
  font-size: clamp(1.2rem, 2vw, 1.5rem);
  width: ${(props) => (props.windowwidth < 851 ? "100%" : "85%")};
  margin-top: 6px;
  text-align: ${(props) => props.windowwidth < 851 && "center"};
`;
const FormItems = styled.div`
  display: flex;
  flex-direction: ${(props) =>
    props.windowwidth < 851 ? "column-reverse" : "row"};
  height: ${(props) => (props.windowwidth < 851 ? "none" : "100%")};
  width: ${(props) => (props.windowwidth < 851 ? "100%" : "none")};
  align-items: ${(props) => props.windowwidth < 851 && "center"};
`;
const FormWrapper = styled.div`
  position: relative;
  width: ${(props) => (props.windowwidth < 1050 ? "320px" : "62%")};
  display: flex;
  flex-direction: column;
  height: 100%;
  justify-content: space-evenly;
  align-items: ${(props) =>
    props.windowwidth < 1050 ? "flex-start" : "center"};
  margin-top: ${(props) => (props.windowwidth < 851 ? "50px" : "0px")};
  @media (max-width: 851px) {
    align-items: center;
    width: 100%;
  }

  &::before {
    content: "";
    position: absolute;
    top: 0px;
    bottom: 0px;
    left: 100%;
    width: ${(props) => (props.windowwidth < 851 ? "0" : "2px")};
    background: linear-gradient(rgba(0, 0, 0, 0.15) 38%, rgba(0, 0, 0, 0) 100%);
  }
`;
const Form = styled.form`
  display: flex;
  flex-direction: column;
  padding-right: ${(props) => (props.windowwidth < 1050 ? "0" : "25px")};
  align-items: ${(props) =>
    props.windowwidth < 1050 ? "flex-start" : "center"};
  margin: ${(props) => (props.windowwidth < 851 ? "0" : "-60px 0 0 0")};
`;
const Input = styled(TextField)`
  width: 350px;
  padding-top: 12px;
`;
const CartTotalPriceContainer = styled.div`
  width: 45%;
  display: flex;
  flex-direction: column;
  padding-left: 50px;
  background-color: #eceaea;
`;
const ItemsDetailsContainer = styled.div`
  display: flex;
  max-width: 428px;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
`;
const ImgContainer = styled.div`
  width: 75px;
  height: 75px;
`;
const Img = styled.img`
  border: 1px solid lightgray;
  min-width: ${(props) => (props.windowwidth < 1050 ? "40px" : "100%")};
  height: ${(props) => (props.windowwidth < 1050 ? "40px" : "100%")};
  object-fit: cover;
`;
const ItemData = styled.div`
  padding: 0 0 5px 8px;
  font-size: clamp(0.72rem, 2vw, 0.96rem);
`;
const ItemSizeColor = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;
const SpanColor = styled.span`
  font-size: clamp(0.65rem, 2vw, 0.9rem);
  text-transform: capitalize;
  padding-right: 8px;
`;
const SpanSize = styled.span`
  font-size: clamp(0.65rem, 2vw, 0.9rem);
  text-transform: uppercase;
  padding-left: 8px;
`;
const ItemsDetails = styled.div`
  display: flex;
`;
const ItemInfoContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
`;
const PriceWrapper = styled.div`
  display: ${(props) => props.windowwidth < 550 && "none"};
  vertical-align: middle;
  text-align: center;
  border-top: 1px solid #e3dddd;
  border-bottom: 1px solid #e3dddd;
`;

const TotalPriceWrapper = styled.div`
  vertical-align: middle;
  text-align: center;
`;
const QuantityWrapper = styled.div`
  display: flex;
  border: 1px solid rgb(194, 191, 191);
  border-radius: 5%;
  width: ${(props) => (props.windowwidth < 550 ? "64px" : "80px")};
  margin: 0 auto;
  -webkit-box-align: center;
  align-items: center;
  -webkit-box-pack: justify;
  justify-content: space-between;
`;
const ItemQuantity = styled.h4`
  font-weight: 600;
  font-size: 0.75rem;
  padding: 0 7px;
`;
const BtnQuantity = styled.button`
  width: 32px;
  border-radius: 5%;
  border: none;
`;

const DiscountPrice = styled.span`
  color: #a83737;
  font-weight: 600;
  font-size: clamp(0.75rem, 1.2vw, 0.95rem);
  font-style: italic;
  position: relative;
  text-align: center;
  display: block;
`;
const Price = styled.span`
  display: ${(props) => props.windowwidth < 550 && "none"};
  font-weight: 600;
  font-size: ${(props) =>
    props.hasDiscount
      ? "clamp(0.55rem, 1.2vw, .80rem);"
      : "clamp(0.75rem, 1.2vw, .95rem);"};
  font-style: italic;
  position: relative;
  color: ${(props) => (props.hasDiscount ? "rgb(149 146 146)" : "#a83737")};
  /* Add the following styles to create the strike-through line if hasDiscount is true */
  &::after {
    content: ${(props) => (props.hasDiscount ? "''" : "none")};
    position: absolute;
    bottom: 52%;
    left: 0;
    width: 102%;
    height: 1px;
    background-color: black;
  }
`;
const TotalPriceInfoDesktopContainer = styled.div`
  max-width: 428px;
  display: ${(props) => (props.windowwidth < 851 ? "none" : "flex")};
  flex-direction: column;
  gap: 0.5rem;
  padding: 40px 0 0;
`;
const TotalPriceInfoMobileContainer = styled.div`
  display: ${(props) => (props.windowwidth > 850 ? "none" : "flex")};
  width: 100%;
  flex-direction: column;
  gap: 0.5rem;
  padding: 20px;
  margin: 24px 0px 0px 0px;
  border-top: 1px solid grey;
  background-color: #f5f5dcc2;
`;

const TotalWrapper = styled.div`
  font-weight: 600;
  font-size: 1.5rem;
  display: flex;
  justify-content: space-between;
`;
const SubTotalWrapper = styled.div`
  display: flex;
  justify-content: space-between;
`;
const DiscountWrapper = styled.div`
  display: flex;
  justify-content: space-between;
`;
const TotalText = styled.h3`
  text-align: end;
  font-weight: 600;
`;
const TotalDiscount = styled.h3`
  font-weight: 500;
`;
const SubTotal = styled.h3`
  font-weight: 500;
`;
const TotalPrice = styled.h3`
  font-weight: bold;
  font-size: 1.5rem;
`;

const ConfirmStripe = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  margin: ${(props) => (props.windowwidth < 851 ? "20px auto" : "0 0 15px 0")};
  align-items: ${(props) => (props.windowwidth < 851 ? "center" : "none")};
`;

const ConfirmFormCartBtn = styled.button`
  width: 80%;
  margin: 0px 0px 5px 24px;
  padding: 0px 0px 2px;
  border: none;
  transform: rotate(0deg);
  transform-origin: center center;
  height: 52px;
  color: white;
  font-weight: 500;
  text-decoration: none;
  font-size: 1.2rem;
  cursor: pointer;
  border-radius: 5px;
  box-shadow: rgb(73, 74, 75) 0px 2px 0px;
  transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275) 0s;
  background-color: rgb(209 205 200);
  :active {
    transform: translateY(5px);
    padding-bottom: 0px;
    outline: 0;
  }
`;
const SpanConfirmBtn = styled.span`
  background: rgb(23 27 31);
  display: block;
  padding: 0.5rem 1rem;
  height: 50px;
  border-radius: 5px;
  border: 2px solid #494a4b;
  font-family: "Gochi Hand", cursive;
`;
const CloseIconBtn = styled(CloseIcon)`
  cursor: pointer;
  font-size: 28px;
  top: 4%;
  left: ${(props) => (props.windowwidth < 750 ? "85%" : "93%")};
  position: absolute;
  @media (max-width: 750px) {
    top: 3%;
    left: 88%;
  }
`;
const style = {
  position: "absolute",
  top: "50%",
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
  margin: 150px 0 0;
`;
