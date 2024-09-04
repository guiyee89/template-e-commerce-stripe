import { useNavigate } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import { db } from "../../../../firebaseConfig";
import { getDoc, doc } from "firebase/firestore";
import Swal from "sweetalert2";
import { GlobalToolsContext } from "../../../context/GlobalToolsContext";
import { CartDesktop } from "./CartDesktop";
import { CartMobile } from "./CartMobile";
import { CartContext } from "../../../context/CartContext";
import styled from "styled-components/macro";
import { Ring } from "@uiball/loaders";

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

export const CartContainer = () => {
  const { windowWidth, setProgress, setVisible } =
    useContext(GlobalToolsContext);
  const { cart, setCart } = useContext(CartContext);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  }, []);

  useEffect(() => {
    console.log(cart);
    setVisible(true);
    setLoading(true);
    setProgress(2);
    setTimeout(() => {
      setLoading(false);
      if (loading === false) {
        setProgress(100);
      }
    }, 750);
  }, []);

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
      navigate("/payment");
    } else {
      // Ya no hay stock de productos o productos no encontrados
      Swal.fire({
        title:
          "<span style='font-size: 1rem; color: black; line-height:0.1'>Some items in your cart are no longer available:</span> <br>  <span style=' color: #c42828; line-height:4; font-size:1.2rem'>Product not found or change in Stock</span>",
        html: missingItemMessage(missingItems),
      });
    }
    // Set the updatedCart to the localStorage
    localStorage.setItem("cart", JSON.stringify(updatedCart));
    // Set the updatedCart to the CartContext or any state where you manage the cart
    setCart(updatedCart);
  };

  return (
    <>
      {loading ? (
        <LoaderWrapper>
          {windowWidth > 600 ? (
            <Ring size={40} lineWeight={8} speed={2} color="black" />
          ) : (
            <Ring size={25} lineWeight={6} speed={2} color="black" />
          )}
        </LoaderWrapper>
      ) : windowWidth > 680 ? (
        <CartDesktop realizarCompra={realizarCompra} />
      ) : (
        <CartMobile realizarCompra={realizarCompra} />
      )}
    </>
  );
};
const LoaderWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 550px;
`;
