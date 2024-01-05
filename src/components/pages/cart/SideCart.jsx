import { useContext } from "react";
import styled from "styled-components/macro";
import { CartContext } from "../../context/CartContext";
import DeleteIcon from "@mui/icons-material/Delete";
import CloseIcon from "@mui/icons-material/Close";
import { Link, useNavigate } from "react-router-dom";
import { GlobalToolsContext } from "../../context/GlobalToolsContext";

export const SideCart = () => {
  const {
    cart,
    removeQuantity,
    removeById,
    getTotalPrice,
    getItemPrice,
    addQuantity,
    getTotalDiscount,
    getSubTotal,
  } = useContext(CartContext);

  const { isOpen, toggleSideCart } = useContext(GlobalToolsContext);

  const totalPrice = getTotalPrice();
  const subTotal = getSubTotal();
  const totalDiscount = getTotalDiscount();

  const navigate = useNavigate();
  const goCart = () => {
    navigate("/cart");
  };

  const handleGoToCart = () => {
    goCart(); // Navigate to cart
    toggleSideCart(); // Toggle the cart
  };

  return (
    <>
      <TransparentDiv
        isOpen={isOpen}
        onClick={isOpen ? null : toggleSideCart}
      />
      <SideCartWrapper isOpen={isOpen}>
        <CloseIcon
          onClick={toggleSideCart}
          sx={{
            fontSize: "35px",
            marginTop: "15px",
            marginLeft: "15px",
            cursor: "pointer",
          }}
        />
        <CartWrapper key="cart-wrapper">
          <ItemsContainer>
            {cart.map((product) => {
              const itemPrice = getItemPrice(product.id); //Buscar item x id en la funcion getItemPrice
              const hasDiscount = product.discountPrice; //Variable de Item con descuento
              return (
                <ItemWrapper key={product.id}>
                  <ImgWrapper>
                    <ItemImg src={product.img[0]} alt="" />
                  </ImgWrapper>
                  <InsideContentWrapper>
                    <ItemTitle>{product.title}</ItemTitle>

                    <Color>
                      Color: <Span>{product.color}</Span>
                    </Color>
                    <Size>
                      Size: <Span2>{product.size}</Span2>
                    </Size>

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
                  </InsideContentWrapper>
                  <PriceDeleteWrapper>
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
                        <Price hasDiscount={hasDiscount}>
                          $ {itemPrice.toFixed(2)}
                        </Price>
                      </ItemPriceWrapper>
                    ) : (
                      <Price>$ {itemPrice.toFixed(2)}</Price>
                    )}

                    <DeleteIconBtn onClick={() => removeById(product.id)} />
                  </PriceDeleteWrapper>
                </ItemWrapper>
              );
            })}
          </ItemsContainer>
          {cart.length > 0 ? (
            <>
              <CartInfo>
                <TotalPriceInfo>
                  <SubTotalWrapper>
                    <TotalText colSpan="1">Subtotal:</TotalText>
                    <SubTotal>$ {subTotal.toFixed(2)}</SubTotal>
                  </SubTotalWrapper>
                  <DiscountWrapper>
                    <TotalText colSpan="1">Discount:</TotalText>
                    <TotalDiscount>
                      - $ {totalDiscount.toFixed(2)}
                    </TotalDiscount>
                  </DiscountWrapper>
                  <TotalWrapper>
                    <TotalText colSpan="1">Total:</TotalText>
                    <TotalPrice>$ {totalPrice.toFixed(2)}</TotalPrice>
                  </TotalWrapper>
                </TotalPriceInfo>

                <CheckoutButton onClick={handleGoToCart}>
                  Go to Cart
                </CheckoutButton>
              </CartInfo>
            </>
          ) : (
            <EmptyCartMessage>The cart is empty</EmptyCartMessage>
          )}
        </CartWrapper>
      </SideCartWrapper>
    </>
  );
};
const TransparentDiv = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: ${({ isOpen }) => (isOpen ? "none" : "rgba(0, 0, 0, 0.2)")};
  z-index: ${({ isOpen }) => (isOpen ? "-1" : "2")};
`;
const SideCartWrapper = styled.div`
  position: fixed;
  top: 0;
  right: ${({ isOpen }) => (isOpen ? "-420px" : "0")};
  transition: right 0.3s ease-in-out;
  z-index: 3;
  min-width: 295px;
  max-width: 420px;
  height: 100%;
  background-color: white;
  box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.2);
`;
const CartWrapper = styled.div`
  display: flex;
  flex-direction: column;
  height: 94%;
  justify-content: space-between;
  margin: 10px 0 30px 0;
`;
const ItemsContainer = styled.div`
  display: flex;
  height: 80%;
  margin: 5px 5px 0;
  flex-direction: column;
  overflow-y: auto;
  border-top: 1px solid lightgray;
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
`;
const ItemWrapper = styled.div`
  display: flex;
  height: 130px;
  width: 100%;
  -webkit-box-align: center;
  align-items: center;
  justify-content: flex-start;
  box-shadow: rgba(0, 0, 0, 0.25) 0px 0px 2px;
`;
const ImgWrapper = styled.div`
  margin: 20px;
`;
const QuantityWrapper = styled.div`
  display: flex;
  margin: 10px 75px 10px 0px;
  border: 1px solid rgb(194, 191, 191);
  border-radius: 5%;
  width: 100px;
  -webkit-box-align: center;
  align-items: center;
  -webkit-box-pack: justify;
  justify-content: space-between;
`;
const ItemImg = styled.img`
  width: 100%;
  height: 100%;
  object-fit: contain;
  border: 1px solid lightgrey;
  @media (max-width: 500px) {
    width: 95px;
  }
`;
const ItemQuantity = styled.h4`
  font-weight: 600;
  font-size: 0.75rem;
`;
const ItemTitle = styled.h2`
  padding-bottom: 2px;
  font-size: clamp(0.6rem, 3.1vw + 1px, 1rem);
`;
const BtnQuantity = styled.button`
  width: 32px;
  border-radius: 5%;
  border: none;
`;
const DeleteIconBtn = styled(DeleteIcon)`
  position: absolute;
  top: 33px;
  right: 33%;
  cursor: pointer;
`;
const CartInfo = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-evenly;
  gap: 1.5rem;
  flex-direction: column;
  background-color: #eeebeb;
  margin-bottom: 24px;
  border-top: 1px solid lightgray;
`;
const CheckoutButton = styled.button`
  width: 260px;
  height: 46px;
  margin: 0px auto;
  border-radius: 22px;
  font-weight: bold;
  color: white;
  background-color: rgb(29 29 29);
`;

const PriceDeleteWrapper = styled.div`
  display: flex;
  flex-direction: column-reverse;
  -webkit-box-align: center;
  align-items: center;
  margin: 13px 0px 44px;
  position: relative;
  height: 94%;
  min-width: 100px;
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
  gap: 0.5rem;
  margin: 15px 15px;
`;
const TotalWrapper = styled.div`
  font-weight: bold;
  font-size: 1.4rem;
  display: inherit;
`;
const SubTotalWrapper = styled.div`
  display: inherit;
  font-weight: 500;
  font-size: 1.1rem;
`;
const DiscountWrapper = styled.div`
  display: inherit;
`;
const TotalText = styled.h3`
  text-align: end;
`;
const TotalDiscount = styled.h3`
  font-weight: 500;
  padding-left: 24px;
  text-align: end;
  width: 100%;
  margin-right: 20px;
  font-weight: 500;
  font-size: 1rem;
`;
const InsideContentWrapper = styled.div`
  width: auto;
  padding: 12px 0px 0 0;
  height: 100%;
  @media (max-width: 500px) {
    width: 120px;
  }
`;
const Color = styled.p`
  font-size: 0.8rem;
`;
const Size = styled.p`
  font-size: 0.8rem;
`;
const Span = styled.span`
  font-weight: 600;
  padding-left: 1px;
  font-size: 0.65rem;
  text-transform: capitalize;
`;
const Span2 = styled.span`
  font-weight: 600;
  font-size: 0.65rem;
  width: 100%;
  text-transform: uppercase;
  text-align: center;
  padding-left: 9px;
`;
const SubTotal = styled.h3`
  font-weight: 500;
  padding-left: 35px;
  text-align: end;
  width: 100%;
  margin-right: 20px;
`;
const TotalPrice = styled.h3`
  font-weight: bold;
  font-size: 1.4rem;
  padding-left: 46px;
  text-align: end;
  width: 100%;
  margin-right: 20px;
`;
const EmptyCartMessage = styled.p`
  height: 400%;
  margin: 0 auto;
`;
