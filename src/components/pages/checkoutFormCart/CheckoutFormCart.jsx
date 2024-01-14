import {
  Box,
  Modal,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
} from "@mui/material";
import { useContext, useEffect, useState } from "react";
import styled from "styled-components/macro";
import { CartContext } from "../../context/CartContext";
import { Table } from "react-bootstrap";
import { Payment } from "../checkoutStripe/Payment";
import DeleteIcon from "@mui/icons-material/Delete";
import { GlobalToolsContext } from "../../context/GlobalToolsContext";

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
        <FormItems windowWidth={windowWidth}>
          <FormWrapper windowWidth={windowWidth}>
            <Form onSubmit={handleSubmit} windowWidth={windowWidth}>
              <Input
                label="Full Name"
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
            <ConfirmStripe>
              <SubmitBtn
                type="submit"
                onClick={handleSubmit}
                windowWidth={windowWidth}
              >
                Confirm
              </SubmitBtn>
              {isModalOpen && (
                <Modal
                  open={isModalOpen}
                  onClose={closeModal}
                  sx={{ maxWidth: "1000px", margin: "0 auto" }}
                  aria-labelledby="modal-modal-title"
                  aria-describedby="modal-modal-description"
                >
                  <Box sx={style}>
                    <Payment />
                  </Box>
                </Modal>
              )}
            </ConfirmStripe>
          </FormWrapper>

          <TableTotalPriceContainer>
            <TableContainer
              sx={{
                paddingLeft:
                  windowWidth < 1050
                    ? windowWidth < 750
                      ? "0px"
                      : "15px"
                    : "22px",
                display: "flex",
                flexDirection: "column",
                height: "70%",
                justifyContent: "space-between",
              }}
            >
              <Table aria-label="simple table">
                <TableHead>
                  <TableRow>
                    <TableCell
                      sx={{
                        width: windowWidth < 1050 ? "80px" : "100px",
                      }}
                      align="center"
                    ></TableCell>
                    <TableCell
                      sx={{
                        width: windowWidth < 1050 ? "80px" : "120px",
                        fontWeight: "600",
                      }}
                      align="center"
                    >
                      Titulo
                    </TableCell>
                    <TableCell
                      align="center"
                      sx={{
                        fontWeight: "600",
                        display: windowWidth < 550 && "none",
                      }}
                    >
                      Precio
                    </TableCell>
                    <TableCell
                      align="center"
                      sx={{
                        fontWeight: "600",
                      }}
                    >
                      Size
                    </TableCell>
                    <TableCell
                      align="center"
                      sx={{
                        fontWeight: "600",
                      }}
                    >
                      Color
                    </TableCell>
                    <TableCell
                      align="center"
                      sx={{
                        fontWeight: "600",
                      }}
                    >
                      Cantidad
                    </TableCell>
                    <TableCell
                      align="center"
                      sx={{
                        fontWeight: "600",
                        minWidth: windowWidth < 650 ? "86px" : "100px",
                      }}
                    >
                      Total
                    </TableCell>
                    <TableCell
                      align="center"
                      sx={{
                        display: windowWidth < 550 && "none",
                      }}
                    ></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {cart.map((item) => {
                    const itemTotalPrice = getItemPrice(item.id);
                    const hasDiscount = item.discountPrice;

                    return (
                      <TableRow
                        key={item.id}
                        sx={{
                          "&:last-child td, &:last-child th": { border: 0 },
                        }}
                      >
                        <ImgCell align="center" component="th" scope="row">
                          <Img src={item.img[0]} alt={`Item ${item.id}`} />
                        </ImgCell>
                        <TableCell
                          align="center"
                          component="th"
                          scope="row"
                          sx={{
                            fontSize: "clamp(0.70rem, 2vw, 0.94rem)",
                            padding:
                              windowWidth < 550
                                ? ".5rem 0.15rem!important"
                                : ".5rem .5rem",
                          }}
                        >
                          {item.title}
                        </TableCell>
                        {hasDiscount ? (
                          <DiscountPriceWrapper
                            hasDiscount={hasDiscount}
                            windowWidth={windowWidth}
                          >
                            {hasDiscount && (
                              <Price
                                hasDiscount={hasDiscount}
                                align="center"
                                component="th"
                                scope="row"
                              >
                                $ {item.unit_price.toFixed(2)}
                              </Price>
                            )}

                            <DiscountPrice windowWidth={windowWidth}>
                              $ {item.discountPrice.toFixed(2)}
                            </DiscountPrice>
                          </DiscountPriceWrapper>
                        ) : (
                          <>
                            <PriceWrapper>
                              <Price windowWidth={windowWidth}>
                                $ {item.unit_price.toFixed(2)}
                              </Price>
                            </PriceWrapper>
                          </>
                        )}
                        <TableCell
                          align="center"
                          component="th"
                          scope="row"
                          sx={{
                            textTransform: "uppercase",
                            fontSize: "clamp(0.70rem, 2vw, 0.94rem)",
                            padding:
                              windowWidth < 550
                                ? ".5rem 0.15rem!important"
                                : ".5rem .5rem",
                          }}
                        >
                          {item.size}
                        </TableCell>
                        <TableCell
                          align="center"
                          component="th"
                          scope="row"
                          sx={{
                            textTransform: "capitalize",
                            fontSize: "clamp(0.70rem, 2vw, 0.94rem)",
                            padding:
                              windowWidth < 550
                                ? ".5rem 0.15rem!important"
                                : ".5rem .5rem",
                          }}
                        >
                          {item.color}
                        </TableCell>
                        <TableCell align="center" component="th" scope="row">
                          <QuantityWrapper windowWidth={windowWidth}>
                            <BtnQuantity
                              onClick={() => removeQuantity(item.id)}
                            >
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
                        </TableCell>
                        {hasDiscount ? (
                          <TotalPriceWrapper windowWidth={windowWidth}>
                            <DiscountPrice
                              align="center"
                              component="th"
                              scope="row"
                            >
                              {" "}
                              ${" "}
                              {(item.discountPrice * item.quantity).toFixed(2)}
                            </DiscountPrice>
                          </TotalPriceWrapper>
                        ) : (
                          <PriceWrapper>
                            <Price align="center" component="th" scope="row">
                              $ {itemTotalPrice.toFixed(2)}
                            </Price>
                          </PriceWrapper>
                        )}
                        <DeleteBtnWrapper windowWidth={windowWidth}>
                          <DeleteIconBtn
                            onClick={() => removeById(product.id)}
                          />
                        </DeleteBtnWrapper>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </TableContainer>
            <TotalPriceInfo windowWidth={windowWidth}>
              <SubTotalWrapper>
                <TotalText colSpan="1">Subtotal:</TotalText>
                <SubTotal>$ {subTotal.toFixed(2)}</SubTotal>
              </SubTotalWrapper>
              <DiscountWrapper>
                <TotalText colSpan="1">Discount:</TotalText>
                <TotalDiscount>- $ {totalDiscount.toFixed(2)}</TotalDiscount>
              </DiscountWrapper>
              <TotalWrapper>
                <TotalText colSpan="1">Total:</TotalText>
                <TotalPrice>$ {total.toFixed(2)}</TotalPrice>
              </TotalWrapper>
            </TotalPriceInfo>
          </TableTotalPriceContainer>
        </FormItems>
      </Wrapper>
    </>
  );
};
const Wrapper = styled.section`
  display: flex;
  flex-direction: column;
  position: relative;
  max-width: 1300px;
  margin: 0 auto;
`;
const FormItems = styled.div`
  display: flex;
  flex-direction: ${(props) =>
    props.windowWidth < 950 ? "column-reverse" : "row"};
  height: ${(props) => (props.windowWidth < 950 ? "none" : "100%")};
`;
const FormWrapper = styled.div`
  position: relative;
  width: ${(props) => (props.windowWidth < 1050 ? "320px" : "375px")};
  display: flex;
  flex-direction: column;
  height: 100%;
  justify-content: space-between;
  align-items: ${(props) =>
    props.windowWidth < 1050 ? "flex-start" : "center"};
  margin-top: 20px;
  &::before {
    content: "";
    position: absolute;
    top: 25px;
    bottom: 0;
    left: 100%;
    width: 2px;
    background: linear-gradient(rgba(0, 0, 0, 0.1) 56%, rgba(0, 0, 0, 0) 100%);
  }
`;
const Form = styled.form`
  display: flex;
  flex-direction: column;
  padding-right: ${(props) => (props.windowWidth < 1050 ? "0" : "25px")};
  align-items: ${(props) =>
    props.windowWidth < 1050 ? "flex-start" : "center"};
`;
const Input = styled(TextField)`
  width: 350px;
  padding-top: 12px;
`;
const SubmitBtn = styled.button`
  width: 77%;
  height: 42px;
  font-size: 1rem;
  font-weight: bold;
  border-radius: 6px;
  border: none;
  background-color: black;
  color: white;
  margin: ${(props) =>
    props.windowWidth < 1050 ? "0px auto 6px 0px" : "0px auto 6px 24px"};
`;
const TableTotalPriceContainer = styled.div``;
const ImgCell = styled(TableCell)`
  width: 12%;
`;
const Img = styled.img`
  border: 1px solid lightgray;
`;
const PriceWrapper = styled.td`
  vertical-align: middle;
  text-align: center;
  border-top: 1px solid #e3dddd;
  border-bottom: 1px solid #e3dddd;
`;
const DiscountPriceWrapper = styled.td`
  vertical-align: middle;
  text-align: center;
  border-top: 1px solid #e3dddd;
  border-bottom: 1px solid #e3dddd;
  display: ${(props) => props.windowWidth < 550 && "none"};
  padding: ${(props) => props.windowWidth < 550 && ".5rem 0.2rem!important"};
`;
const TotalPriceWrapper = styled.td`
 vertical-align: middle;
  text-align: center;
  border-top: 1px solid #e3dddd;
  border-bottom: 1px solid #e3dddd;
  padding: ${(props) => props.windowWidth < 550 && ".5rem 0.2rem!important"};
`
const QuantityWrapper = styled.div`
  display: flex;
  border: 1px solid rgb(194, 191, 191);
  border-radius: 5%;
  width: ${(props) => (props.windowWidth < 550 ? "64px" : "80px")};
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
const DeleteBtnWrapper = styled.td`
  width: 50px;
  display: ${(props) => props.windowWidth < 500 && "none"};
`;
const DeleteIconBtn = styled(DeleteIcon)`
  cursor: pointer;
  margin-bottom: -24px;
`;
const DiscountPrice = styled.span`
  color: #a83737;
  font-weight: 600;
  font-size: clamp(0.84rem, 2vw, 0.94rem);
  font-style: italic;
  position: relative;
  text-align: center;
  display: block;
`;
const Price = styled.span`
  font-weight: 600;
  font-size: ${(props) => (props.hasDiscount ? "0.8rem" : "1rem")};
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
const TotalPriceInfo = styled.div`
  width: 97%;
  display: ${(props) => (props.windowWidth < 950 ? "none" : "flex")};
  flex-direction: column;
  gap: 0.5rem;
  padding: 60px 20px 1px 13px;
  margin: 0px 0px 0px 18px;
  border-top: 2px solid grey;
`;

const TotalWrapper = styled.div`
  font-weight: 600;
  font-size: 1.8rem;
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
  padding-left: 24px;
`;
const SubTotal = styled.h3`
  font-weight: 500;
  padding-left: 35px;
`;
const TotalPrice = styled.h3`
  font-weight: bold;
  font-size: 1.7rem;
  padding-left: 46px;
`;

const ConfirmStripe = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  margin-bottom: 20px;
`;
const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "100%",
  height: "90%",
  p: "50px 25px 40px",
  bgcolor: "background.paper",
  border: "none!importat",
  borderRadius: "14px",
  outline: 0,
  boxShadow:
    "0px 11px 15px -7px rgba(0,0,0,0.6), 0px 24px 38px 3px rgba(0,0,0,0.14), 0px 9px 46px 8px rgba(0,0,0,-0.48)!important",
  overflow: "auto",
};
