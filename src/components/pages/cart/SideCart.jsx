import { useContext, useEffect } from "react";
import styled, { css } from "styled-components/macro";
import { CartContext } from "../../context/CartContext";
import DeleteIcon from "@mui/icons-material/Delete";
import CloseIcon from "@mui/icons-material/Close";
import { useNavigate } from "react-router-dom";
import { GlobalToolsContext } from "../../context/GlobalToolsContext";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../../firebaseConfig";
import { useState } from "react";
import { Ring } from "@uiball/loaders";
import Swal from "sweetalert2";
import useItemLoader from "../../hooks/useItemLoader";

export const SideCart = () => {
  const {
    cart,
    setCart,
    removeQuantity,
    removeById,
    getTotalPrice,
    getItemPrice,
    addQuantity,
    getTotalDiscount,
    getSubTotal,
  } = useContext(CartContext);
  const { isCartOpen, toggleSideCart } = useContext(GlobalToolsContext);
  const totalPrice = getTotalPrice();
  const subTotal = getSubTotal();
  const totalDiscount = getTotalDiscount();
  const [currentTotal, setCurrentTotal] = useState(totalPrice);
  const [currentSubTotal, setCurrentSubTotal] = useState(subTotal);
  const [currentTotalDiscount, setCurrentTotalDiscount] =
    useState(totalDiscount);
  const [itemLoaders, setLoader] = useItemLoader(); //Loader hook
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!Object.values(itemLoaders).some((loader) => loader)) {
      setCurrentSubTotal(subTotal);
      setCurrentTotalDiscount(totalDiscount);
      setCurrentTotal(totalPrice);
    }
  }, [itemLoaders, totalPrice]);

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

  const realizarCompraWithTimeout = () => {
    setCheckoutLoading(true);
    setTimeout(() => {
      realizarCompra();
    }, 1000);
  };

  const realizarCompra = async () => {
    let isValid = true;
    const missingItems = [];
    const updatedCart = [];

    for (const product of cart) {
      const productRef = doc(db, "products", product.id);
      const productSnapshot = await getDoc(productRef);

      if (!productSnapshot.exists()) {
        // Producto no existe en Firebase
        isValid = false;
        missingItems.push({ ...product, notFound: true });

        // Remove the non-existing item from localStorage
        const updatedCart = cart.filter((item) => item.id !== product.id);
        localStorage.setItem("cart", JSON.stringify(updatedCart));
      } else {
        const productData = productSnapshot.data();

        // Check if the size in the database matches the size in the cart
        if (product.size !== productData.size) {
          isValid = false;
          missingItems.push({ ...product, sizeMismatch: true });
          // Skip adding this item to the updatedCart
          continue;
        }

        if (product.quantity > productData.stock) {
          // Cantidad de producto en localStorage excede el stock en Firebase
          isValid = false;
          missingItems.push(product);
        }

        // Add the item to the updatedCart
        updatedCart.push(product);
      }
    }

    if (isValid) {
      /* window.location.assign("/checkout"); */
      navigate("/checkout");
      setCheckoutLoading(false);
    } else {
      // Ya no hay stock de productos o productos no encontrados
      Swal.fire({
        title:
          "<span style='font-size: 1rem; color: black; line-height:0.1'>Some items in your cart are no longer available:</span> <br>  <span style=' color: #c42828; line-height:4; font-size:1.2rem'>Product not found or change in Stock</span>",
        html: missingItemMessage(missingItems),
      });
      setCheckoutLoading(false);
    }
    // Set the updatedCart to the localStorage
    localStorage.setItem("cart", JSON.stringify(updatedCart));
    // Set the updatedCart to the CartContext or any state where you manage the cart
    setCart(updatedCart);
    toggleSideCart();
  };

  return (
    <>
      <TransparentDiv
        isCartOpen={isCartOpen}
        onClick={isCartOpen ? null : toggleSideCart}
      />
      <SideCartWrapper isCartOpen={isCartOpen}>
        <CloseIcon
          onClick={() => {
            toggleSideCart();
            setCheckoutLoading(false);
          }}
          sx={{
            fontSize: "28px",
            marginTop: "15px",
            marginLeft: "15px",
            cursor: "pointer",
          }}
        />
        <CartWrapper key="cart-wrapper">
          <ItemsContainer>
            {cart.map((product) => {
              const itemPrice = getItemPrice(product.id);
              const hasDiscount = product.discountPrice;
              const isLoading = itemLoaders[product.id] || false;

              return (
                <ItemWrapper key={product.id}>
                  <ImgWrapper>
                    <ItemImg src={product.img[0]} alt="" />
                  </ImgWrapper>
                  <InsideContentWrapper>
                    <ItemTitle>{product.title}</ItemTitle>

                    <Color>
                      Color:{" "}
                      {product.color.map((color, index) => (
                        <SpanColor key={color} secondary={index > 0}>
                          {color}
                          {index < product.color.length - 1 && " - "}
                        </SpanColor>
                      ))}
                    </Color>
                    <Size>
                      Size: <SpanSize>{product.size}</SpanSize>
                    </Size>

                    <QuantityWrapper>
                      <BtnQuantity
                        onClick={() => handleRemoveQuantity(product.id)}
                        disabled={product.quantity === 1}
                      >
                        {" "}
                        -{" "}
                      </BtnQuantity>

                      <ItemQuantity>{product.quantity}</ItemQuantity>

                      <BtnQuantity
                        onClick={() => handleAddQuantity(product.id)}
                        disabled={product.stock === product.quantity}
                      >
                        {" "}
                        +{" "}
                      </BtnQuantity>
                    </QuantityWrapper>
                  </InsideContentWrapper>
                  <PriceDeleteWrapper>
                    {isLoading ? (
                      <PriceLoader>
                        <Ring
                          size={20}
                          lineWeight={6}
                          speed={1}
                          color="black"
                        />
                      </PriceLoader>
                    ) : hasDiscount ? (
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
                    <DeleteIconBtn onClick={() => handleRemoveById(product.id)}>
                      <DeleteIcon />
                    </DeleteIconBtn>
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
                    <SubTotal>${currentSubTotal.toFixed(2)}</SubTotal>
                  </SubTotalWrapper>
                  <DiscountWrapper>
                    <TotalText colSpan="1">Discount:</TotalText>
                    <TotalDiscount>
                      -${currentTotalDiscount.toFixed(2)}
                    </TotalDiscount>
                  </DiscountWrapper>
                  <TotalWrapper>
                    <TotalText colSpan="1">Total:</TotalText>
                    <TotalPrice>${currentTotal.toFixed(2)}</TotalPrice>
                  </TotalWrapper>
                </TotalPriceInfo>
                <div
                  style={{
                    width: "100%",
                    height: "80px",
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <CheckoutButton onClick={realizarCompraWithTimeout}>
                    <SpanCheckout isLoading={checkoutLoading}>
                      {checkoutLoading ? (
                        <CheckoutLoader>
                          <Ring
                            size={25}
                            lineWeight={5}
                            speed={1}
                            color="black"
                          />
                        </CheckoutLoader>
                      ) : (
                        "Check out"
                      )}
                    </SpanCheckout>
                  </CheckoutButton>
                </div>
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
//Swal Sweet Alert Message - NO AVAILABLE STOCK
const missingItemMessage = (missingItems) => {
  let message = "<ul style='list-style-type: none; padding: 0;'>";

  missingItems.forEach((item) => {
    message += `<li style='display: flex; align-items: center; margin-bottom: 10px;'>
    
                  <img src="${item.img[0]}" alt="${
      item.title
    }" style='width: 100px; height: 100px; object-fit: contain; padding-right: 20px' />
                  <span style='font-weight: bold; color: black; padding-right: 20px'>${
                    item.title
                  }</span> ${" "} <span style='font-weight: bold; color: grey; padding-right: 20px'> Size: <span style='text-transform:uppercase'>${
      item.size
    }</span></span>
                </li>`;
  });

  message += "</ul>";
  return message;
};
const TransparentDiv = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: ${({ isCartOpen }) =>
    isCartOpen ? "none" : "rgba(0, 0, 0, 0.2)"};
  z-index: ${({ isCartOpen }) => (isCartOpen ? "-1" : "2")};
`;
const SideCartWrapper = styled.div`
  position: fixed;
  top: 0;
  right: ${({ isCartOpen }) => (isCartOpen ? "-420px" : "0")};
  transition: right 0.3s ease-in-out;
  z-index: 3;
  min-width: 412px;
  max-width: 412px;
  height: 100%;
  background-color: white;
  box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.2);
  @media (max-width: 500px) {
    min-width: 360px;
    width: 360px;
  }
  @media (max-width: 350px) {
    min-width: 275px;
    width: 275px;
  }
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
  overflow-x: hidden;
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
  height: 125px;
  width: 100%;
  -webkit-box-align: center;
  align-items: center;
  -webkit-box-pack: start;
  justify-content: flex-start;
  box-shadow: rgba(0, 0, 0, 0.25) 0px 0px 1px;
`;
const ImgWrapper = styled.div`
  margin: 20px;
  min-width: 72px;
  height: 72px;
  @media (max-width: 550px) {
    margin: 10px 20px 10px 20px;
    min-width: 64px;
    height: 64px;
  }
  @media (max-width: 500px) {
    margin: 10px;
    min-width: 64px;
    height: 64px;
  }
`;
const QuantityWrapper = styled.div`
  display: flex;
  margin: 4px 0px 10px 0px;
  border: 1px solid rgb(194, 191, 191);
  border-radius: 5%;
  width: 100px;
  -webkit-box-align: center;
  align-items: center;
  -webkit-box-pack: justify;
  justify-content: space-between;
  @media (max-width: 600px) {
    width: 85px;
    margin: 8px 0px 10px 0px;
  }
  @media (max-width: 350px) {
    width: 70px;
    margin: 4px 0px 6px 0px;
  }
`;
const ItemImg = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  border: 1px solid lightgrey;
`;
const ItemQuantity = styled.h4`
  font-weight: 600;
  font-size: 0.75rem;
`;
const ItemTitle = styled.h2`
  font-weight: 600;
  padding-bottom: 2px;
  font-size: clamp(0.65rem, 5px + 0.8vw, 0.85rem);
  text-transform: capitalize;
`;
const BtnQuantity = styled.button`
  width: 32px;
  border-radius: 5%;
  border: none;
  @media (max-width: 350px) {
    width: 20px;
  }
`;

const DeleteIconBtn = styled(DeleteIcon)`
  position: absolute;
  width: 0.8em !important;
  top: 33px;
  right: 39%;
  cursor: pointer;
`;
const CartInfo = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-evenly;
  gap: 1.5rem;
  flex-direction: column;
  background-color: #eeebeb;
  padding-bottom: 24px;
  border-top: 1px solid lightgray;
`;
const CheckoutButton = styled.button`
  width: 275px;
  margin: 0 auto;
  padding: 0;
  border: none;
  transform: rotate(0deg);
  transform-origin: center;
  font-weight: 500;
  text-decoration: none;
  font-size: 1.2rem;
  cursor: pointer;
  padding-bottom: 2px;
  border-radius: 5px;
  box-shadow: 0 2px 0 #494a4b;
  transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  background-color: #cf873e;
  :active {
    transform: translateY(5px);
    padding: 0;
    outline: 0;
  }
  @media (max-width: 350px) {
    width: 95%;
  }
`;
const SpanCheckout = styled.span`
  background: #f1f5f8;
  color: black;
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
const PriceDeleteWrapper = styled.div`
  display: flex;
  flex-direction: column-reverse;
  -webkit-box-align: center;
  align-items: center;
  margin: -29px 0px 11px;
  position: relative;
  height: 94%;
  min-width: 100px;
  @media (max-width: 350px) {
    min-width: 76px;
  }
`;
const DiscountPrice = styled.span`
  color: #a83737;
  font-weight: 600;
  font-size: clamp(0.8rem, 2.7vw + 1px, 1rem);
  font-style: italic;
  position: relative;
  display: inline-block;
  text-align: center;
`;
const Price = styled.span`
  font-weight: 600;
  font-size: ${(props) =>
    props.hasDiscount
      ? "clamp(0.7rem, 2.7vw + 1px, 0.8rem)"
      : "clamp(0.8rem, 2.7vw + 1px, 1rem)"};
  font-style: italic;
  position: relative;
  color: ${(props) => (props.hasDiscount ? "rgb(149 146 146)" : "#a83737")};
  margin-bottom: 4px;
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
  margin: 15px;
  @media (max-width: 350px) {
    margin: 15px 0px 0 8px;
    width: 100%;
  }
`;
const TotalWrapper = styled.div`
  font-weight: bold;
  font-size: clamp(1.05rem, 1.2vw + 0.5rem, 1.15rem);
  display: inherit;
`;
const SubTotalWrapper = styled.div`
  display: inherit;
  font-weight: 500;
  font-size: 1rem;
  font-size: clamp(0.75rem, 1.2vw + 0.5rem, 0.9rem);
`;
const DiscountWrapper = styled.div`
  display: inherit;
  font-size: clamp(0.75rem, 1.2vw + 0.5rem, 0.9rem);
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
  font-size: clamp(0.75rem, 1.2vw + 0.5rem, 0.9rem);
`;
const InsideContentWrapper = styled.div`
  width: auto;
  padding: 12px 0px 0 0;
  height: 100%;
  min-width: 190px;
  @media (max-width: 870px) {
    min-width: 165px;
    padding: 18px 0px 0 0;
  }
  @media (max-width: 350px) {
    min-width: 96px;
  }
`;
const Color = styled.p`
  width: 88%;
  font-size: clamp(0.55rem, 5px + 0.8vw, 0.73rem);
`;

const SpanColor = styled.span`
  font-weight: ${({ secondary }) => (secondary ? "normal" : "500")};
  ${({ secondary }) =>
    secondary &&
    css`
      color: #888;
      font-size: 0.65rem;
    `}
`;
const Size = styled.p`
  font-size: clamp(0.58rem, 5px + 0.8vw, 0.78rem);
`;

const SpanSize = styled.span`
  font-weight: 500;
  font-size: clamp(0.56rem, 5px + 0.8vw, 0.76rem);
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
  font-size: clamp(0.75rem, 1.2vw + 0.5rem, 0.9rem);
`;
const TotalPrice = styled.h3`
  font-weight: bold;
  font-size: clamp(1.05rem, 1.2vw + 0.5rem, 1.15rem);
  padding-left: 46px;
  text-align: end;
  width: 100%;
  margin-right: 20px;
`;
const EmptyCartMessage = styled.p`
  height: 400%;
  margin: 0 auto;
`;
const PriceLoader = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 30%;
`;
const CheckoutLoader = styled.div`
  display: flex;
  -webkit-box-pack: center;
  justify-content: center;
  height: 35px;
  align-items: center;
`;
