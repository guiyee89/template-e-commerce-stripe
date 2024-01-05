import styled from "styled-components/macro";
import { CartContext } from "../../context/CartContext";
import { useContext, useEffect } from "react";
import DeleteIcon from "@mui/icons-material/Delete";

export const CartDesktop = ({ realizarCompra }) => {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  }, []);

  const {
    cart,
    clearCart,
    removeQuantity,
    removeById,
    getTotalPrice,
    getItemPrice,
    addQuantity,
    getTotalDiscount,
    getSubTotal,
  } = useContext(CartContext);

  const totalPrice = getTotalPrice();
  const subTotal = getSubTotal();
  const totalDiscount = getTotalDiscount();

  return (
    <Wrapper key="cart-wrapper">
      <CartTable>
        <thead>
          <tr>
            <ProductHead>Product</ProductHead>
            <PricePerItemHead>Unit Price</PricePerItemHead>
            <DetailsHead>Details</DetailsHead>
            <QuantityHead>Quantity</QuantityHead>
            <TotalPricePerItemHead>Total</TotalPricePerItemHead>
            <DeleteHead></DeleteHead>
          </tr>
        </thead>
        <tbody>
          {cart.map((product) => {
            const itemPrice = getItemPrice(product.id); //Buscar item x id en la funcion getItemPrice
            const hasDiscount = product.discountPrice; //Variable de Item con descuento
            return (
              <tr key={product.id}>
                <Product>
                  <ImgWrapper>
                    <ItemImg src={product.img[0]} alt="" />
                  </ImgWrapper>
                  <ItemTitle>{product.title}</ItemTitle>
                </Product>
                <PricePerItem>
                  {hasDiscount ? (
                    <ItemPriceWrapper hasDiscount={hasDiscount}>
                      {hasDiscount && (
                        <DiscountPrice>
                          $ {product.discountPrice.toFixed(2)}
                        </DiscountPrice>
                      )}
                      <Price hasDiscount={hasDiscount}>
                        $ {product.unit_price.toFixed(2)}
                      </Price>
                    </ItemPriceWrapper>
                  ) : (
                    <Price>$ {product.unit_price.toFixed(2)}</Price>
                  )}
                </PricePerItem>
                <Details>
                  <DetailsWrapper>
                    <Color>
                      <Span>{product.color}</Span>
                    </Color>
                    <Size>
                      <Span2>{product.size}</Span2>
                    </Size>
                  </DetailsWrapper>
                </Details>
                <Quantity>
                  <QuantityWrapper>
                    <BtnQuantity onClick={() => removeQuantity(product.id)}>
                      {" "}
                      -{" "}
                    </BtnQuantity>
                    <ItemQuantity>{product.quantity}</ItemQuantity>
                    <BtnQuantity
                      onClick={() => addQuantity(product.id)}
                      disabled={product.stock === product.quantity}
                    >
                      {" "}
                      +{" "}
                    </BtnQuantity>
                  </QuantityWrapper>
                </Quantity>
                <TotalPricePerItem>
                  {hasDiscount ? (
                    <ItemPriceWrapper hasDiscount={hasDiscount}>
                      {hasDiscount && (
                        <DiscountPrice>
                          ${" "}
                          {(product.discountPrice * product.quantity).toFixed(
                            2
                          )}
                        </DiscountPrice>
                      )}
                    </ItemPriceWrapper>
                  ) : (
                    <Price>$ {itemPrice.toFixed(2)}</Price>
                  )}
                </TotalPricePerItem>
                <Delete>
                  <DeleteIconBtn onClick={() => removeById(product.id)} />
                </Delete>
              </tr>
            );
          })}
        </tbody>
      </CartTable>
      <CartInfo>
        {cart.length > 0 ? (
          <>
            <CartTitle>order summary</CartTitle>
            {/* <ClearButton onClick={clearCart}>Clear all</ClearButton> */}
            {/* Clear Cart Button */}
            <TotalPriceInfo>
              <SubTotalWrapper>
                <SubDisText colSpan="1">Subtotal:</SubDisText>
                <SubTotal>$ {subTotal.toFixed(2)}</SubTotal>
              </SubTotalWrapper>
              <DiscountWrapper>
                <SubDisText colSpan="1">Discount:</SubDisText>
                <TotalDiscount>- $ {totalDiscount.toFixed(2)}</TotalDiscount>
              </DiscountWrapper>
              <TotalWrapper>
                <TotalText colSpan="1">Total:</TotalText>
                <TotalPrice>$ {totalPrice.toFixed(2)}</TotalPrice>
              </TotalWrapper>
            </TotalPriceInfo>

            <CheckoutButton onClick={realizarCompra}>Checkout</CheckoutButton>
          </>
        ) : (
          <h1>The cart is empty</h1>
        )}
      </CartInfo>
    </Wrapper>
  );
};

const Wrapper = styled.div`
  display: flex;
  margin: 0 10px;
  @media (max-width: 1100px) {
    flex-direction: column;
    width: 85%;
  }
  @media (max-width: 800px) {
    width: 100%;
  }
`;

const CartTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  background-color: #f2f2f2;
  border: 1px solid #ddd;

  tr {
    border: 1px solid rgb(221, 221, 221);
    display: flex;
    -webkit-box-align: stretch;
    align-items: center;
    flex-wrap: wrap;
    -webkit-box-pack: justify;
    justify-content: space-between;
    @media (max-width: 768px) {
      align-items: center;
    }
  }
  td {
    padding: 8px;
    flex: 1 1 1 0%;
    font-weight: 500;
    display: flex;
    justify-content: center;
  }
  th {
    background-color: #f2f2f2;
    padding: 8px;
    text-align: center;
    font-weight: 600;
  }
`;
const ProductHead = styled.th`
  width: 190px;
`;
const Product = styled.td`
  width: 190px;
  display: flex;
  align-items: center;
`;
const DetailsHead = styled.th`
  width: 70px;
`;
const Details = styled.td`
  width: 70px;
`;
const PricePerItemHead = styled.th`
  width: 130px;
  min-width: 90px;
`;
const PricePerItem = styled.td`
  width: 130px;
  min-width: 90px;
`;
const QuantityHead = styled.th`
  width: 120px;
  min-width: 100px;
`;
const Quantity = styled.td`
  width: 120px;
  min-width: 100px;
`;
const TotalPricePerItemHead = styled.th`
  width: 90px;
`;
const TotalPricePerItem = styled.td`
  width: 90px;
`;
const DeleteHead = styled.th`
  width: 50px;
`;
const Delete = styled.td`
  width: 50px;
`;
const ImgWrapper = styled.div``;
const ItemTitle = styled.div`
  min-width: 100px;
`;
const QuantityWrapper = styled.div`
  display: flex;
  border: 1px solid rgb(194, 191, 191);
  border-radius: 5%;
  width: 90px;
  -webkit-box-align: center;
  align-items: center;
  -webkit-box-pack: justify;
  justify-content: space-between;
`;
const ItemImg = styled.img`
  width: 80%;
  display: initial;
  object-fit: contain;
  border: 1px solid lightgray;
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
const DeleteIconBtn = styled(DeleteIcon)`
  cursor: pointer;
`;
const CartInfo = styled.div`
  width: 520px;
  min-width: 200px;
  max-height: 320px;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  gap: 1.5rem;
  margin-left: 20px;
  padding: 24px 0;
  background-color: #efeded;
  @media (max-width: 1100px) {
    width: 100%;
    margin-left: 0;
  }
`;
const CartTitle = styled.h2`
  font-weight: 600;
  text-transform: capitalize;
  text-align: center;
`;

const CheckoutButton = styled.button`
  background-color: black;
  color: white;
  font-weight: bold;
  min-width: 140px;
  border-radius: 20px;
`;

const DiscountPrice = styled.span`
  color: #a83737;
  font-weight: 600;
  font-size: 1rem;
  font-style: italic;
  position: relative;
  display: inline-block;
  text-align: center;
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
const ItemPriceWrapper = styled.h4`
  display: flex;
  align-items: center;
  gap: 0.1rem;
  flex-direction: column-reverse;
`;
const TotalPriceInfo = styled.div`
  display: flex;
  flex-direction: column;
  width: 82%;
  gap: 0.9rem;
  padding: 20px 0 15px;
  border-top: 1px solid lightgray;
  border-bottom: 1px solid lightgray;
  @media (max-width: 1100px) {
    padding: 20px 100px 15px;
  }
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
  font-weight: bold;
`;
const SubDisText = styled.h3`
  text-align: end;
  font-weight: 500;
`;
const TotalDiscount = styled.h3`
  font-weight: 500;
  padding-left: 24px;
`;
const DetailsWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: min-content;
`;

const Color = styled.p`
  font-size: 0.8rem;
`;
const Size = styled.p`
  font-size: 0.8rem;
`;
const Span = styled.span`
  font-weight: 600;
  text-transform: capitalize;
`;
const Span2 = styled.span`
  font-weight: 600;
  text-transform: uppercase;
  text-align: center;
`;
const SubTotal = styled.h3`
  font-weight: 500;
`;
const TotalPrice = styled.h3`
  font-weight: bold;
  font-size: 1.4rem;
`;
