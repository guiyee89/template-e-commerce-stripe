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
import { Wallet } from "@mercadopago/sdk-react";
import { Table } from "react-bootstrap";
import { Payment } from "../checkoutStripe/Payment";

export const Checkout = ({ handleSubmit, handleChange, errors, confirm }) => {
  const { cart, getTotalPrice, getItemPrice, getTotalDiscount, getSubTotal } =
    useContext(CartContext);
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
  };

  return (
    <>
      <Wrapper>
        <FormItems>
          <FormWrapper>
            <Form onSubmit={handleSubmit}>
              <Input
                label="Name"
                variant="outlined"
                name="name"
                onChange={handleChange}
                helperText={errors.name}
                error={errors.name ? true : false}
                sx={{ marginTop: "14px" }}
              />
              <Input
                label="Email"
                variant="outlined"
                name="email"
                onChange={handleChange}
                helperText={errors.email}
                error={errors.email ? true : false}
                sx={{ marginTop: "14px" }}
              />
              <Input
                label="Phone"
                variant="outlined"
                name="phone"
                onChange={handleChange}
                helperText={errors.phone}
                error={errors.phone ? true : false}
                sx={{ marginTop: "14px" }}
              />
              <Input
                label="Ciudad / Localidad"
                variant="outlined"
                name="ciudad"
                onChange={handleChange}
                helperText={errors.ciudad}
                error={errors.ciudad ? true : false}
                sx={{ marginTop: "14px" }}
              />
              <Input
                label="Direccion - Casa / Departamento"
                variant="outlined"
                name="direccion"
                onChange={handleChange}
                helperText={errors.direccion}
                error={errors.direccion ? true : false}
                sx={{ marginTop: "14px" }}
              />
              <Input
                label="Codigo Postal"
                variant="outlined"
                name="cp"
                onChange={handleChange}
                helperText={errors.cp}
                error={errors.cp ? true : false}
                sx={{ marginTop: "14px" }}
              />
            </Form>
          </FormWrapper>

          <TableContainer sx={{ width: "56%", paddingLeft: "15px" }}>
            <Table sx={{ minWidth: 650 }} aria-label="simple table">
              <TableHead>
                <TableRow>
                  <TableCell sx={{ width: "140px" }} align="center"></TableCell>
                  <TableCell sx={{ width: "120px" }} align="center">
                    Titulo
                  </TableCell>
                  <TableCell align="center">Precio</TableCell>
                  <TableCell align="center">Size</TableCell>
                  <TableCell align="center">Color</TableCell>
                  <TableCell align="center">Cantidad</TableCell>
                  <TableCell align="center">Total</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {cart.map((item) => {
                  const itemTotalPrice = getItemPrice(item.id);
                  const hasDiscount = item.discountPrice;

                  return (
                    <TableRow
                      key={item.id}
                      sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                    >
                      <ImgCell align="center" component="th" scope="row">
                        <img src={item.img[0]} alt={`Item ${item.id}`} />
                      </ImgCell>
                      <TableCell align="center" component="th" scope="row">
                        {item.title}
                      </TableCell>
                      {hasDiscount ? (
                        <DiscountPriceWrapper hasDiscount={hasDiscount}>
                          {hasDiscount && (
                            <Price
                              style={{ fontSize: "12.5px" }}
                              hasDiscount={hasDiscount}
                              align="center"
                              component="th"
                              scope="row"
                            >
                              $ {item.unit_price.toFixed(2)}
                            </Price>
                          )}

                          <DiscountPrice style={{ fontSize: "14px" }}>
                            $ {item.discountPrice.toFixed(2)}
                          </DiscountPrice>
                        </DiscountPriceWrapper>
                      ) : (
                        <>
                          <PriceWrapper>
                            <Price style={{ fontSize: "14px" }}>
                              $ {item.unit_price.toFixed(2)}
                            </Price>
                          </PriceWrapper>
                        </>
                      )}
                      <TableCell align="center" component="th" scope="row">
                        {item.size}
                      </TableCell>
                      <TableCell align="center" component="th" scope="row">
                        {item.color}
                      </TableCell>
                      <TableCell align="center" component="th" scope="row">
                        {item.quantity}
                      </TableCell>
                      {hasDiscount ? (
                        <DiscountPriceWrapper>
                          <DiscountPrice
                            align="center"
                            component="th"
                            scope="row"
                          >
                            {" "}
                            $ {item.discountPrice * item.quantity}
                          </DiscountPrice>
                        </DiscountPriceWrapper>
                      ) : (
                        <PriceWrapper>
                          <Price align="center" component="th" scope="row">
                            $ {itemTotalPrice}
                          </Price>
                        </PriceWrapper>
                      )}
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
        </FormItems>
        <TotalButton>
          <TotalPriceInfo>
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
          <ConfirmMercadoPago>
            <SubmitBtn type="submit" onClick={handleSubmit}>
              Confirm Purchase
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
          </ConfirmMercadoPago>
        </TotalButton>
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
`;
const FormWrapper = styled.div`
  position: relative;
  width: 600px;
  border-right: 2px solid lightgray;
`;
const Form = styled.form`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  padding-right: 25px;
`;
const Input = styled(TextField)`
  width: 350px;
  padding-top: 12px;
`;
const SubmitBtn = styled.button`
  width: 190px;
  height: 42px;
  font-size: 1rem;
  font-weight: bold;
  border-radius: 8px;
  background-color: black;
  color: white;
  margin-top: 24px;
`;
const ImgCell = styled(TableCell)`
  width: 12%;
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
`;
const DiscountPrice = styled.span`
  color: #a83737;
  font-weight: 600;
  font-size: 1rem;
  font-style: italic;
  position: relative;
  padding-right: 2px;
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
  width: 24%;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
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
const TotalButton = styled.div`
  display: flex;
  flex-direction: row-reverse;
  justify-content: space-evenly;
  margin: 40px 0 0 42px;
`;
const ConfirmMercadoPago = styled.div`
  display: flex;
  flex-direction: column;
`;
const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "100%",
  bgcolor: "background.paper",
  border: "none!importat",
  boxShadow: 24,
  outline: 0,
};
