import { Checkout } from "./Checkout";
import { useFormik } from "formik";
import * as Yup from "yup";
import { db } from "../../../firebaseConfig";
import {
  collection,
  addDoc,
  updateDoc,
  doc,
  serverTimestamp,
  getDoc,
} from "firebase/firestore";
import { useContext, useEffect, useState } from "react";
import { CartContext } from "../../context/CartContext";
import styled from "styled-components/macro";
import { initMercadoPago } from "@mercadopago/sdk-react";
import axios from "axios";
import { AuthContext } from "../../context/AuthContext";
import { Link, useLocation } from "react-router-dom";

export const CheckoutContainer = () => {
  const { cart, getTotalPrice, clearCart } = useContext(CartContext);
  const { user } = useContext(AuthContext);
  const [shipmentCost, setShipmentCost] = useState(0);
  let total = getTotalPrice();

  const { handleSubmit, handleChange, errors } = useFormik({
    initialValues: {
      name: "",
      email: "",
      phone: "",
      ciudad: "",
      direccion: "",
      cp: "",
    },
    onSubmit: (data) => {
      //Submit order data
      let order = {
        buyer: data,
        items: cart,
        email: user.email,
        item_price: cart.map((product) => ({
          unit_price: product.discountPrice || product.unit_price,
        })),
        total: total + shipmentCost,
        shipment_cost: shipmentCost,
      };
      localStorage.setItem("order", JSON.stringify(order));
      handleBuy();
      console.log(order);
    },
    
    validateOnChange: false, //que no se valide mientras escribo, sino al hacer submit
    validationSchema: Yup.object({
      //validar los datos
      name: Yup.string()
        .required("Este campo es obligatorio")
        .min(3, "Minimo 3 caracteres"),
      email: Yup.string()
        .email("Este campo no corresponde a un email valido")
        .required("Este campo es obligatorio"),
      phone: Yup.string()
        .required("Este campo es obligatorio")
        .min(10, "Debe contener 10 numeros")
        .max(15, "Debe contener 10 numeros"),
    }),
  });

  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const paramValue = queryParams.get("status"); // approved --- rejected
  const [orderId, setOrderId] = useState(null);

  useEffect(() => {
    //Guardamos la orden en Firebase
    let order = JSON.parse(localStorage.getItem("order"));

    if (paramValue === "approved") {
      //Si el paramValue esta aprovado, guardamos la orden de compra en FIREBASE
      let ordersCollection = collection(db, "orders");
      addDoc(ordersCollection, { ...order, date: serverTimestamp() }) // usamos el metodo addDoc para guardar la orden
        .then((res) => setOrderId(res.id)); //guardamos el ID de la orden en el setOrderID

      order.items.forEach((product) => {
        //actualizar informacion del producto despues de la compra
        updateDoc(doc(db, "products", product.id), {
          stock: product.stock - product.quantity,
        });
      });
      localStorage.removeItem("order");
      clearCart();
    }
  }, [paramValue]);

  useEffect(() => {
    let shipmentCollection = collection(db, "shipment");
    let shipmentDoc = doc(shipmentCollection, "sENFwZKmQYRTTmkuqqGX");
    getDoc(shipmentDoc).then((res) => {
      setShipmentCost(res.data().cost);
    });
  }, []);

  initMercadoPago(import.meta.env.VITE_PUBLIC_KEY, {
    locale: "es-AR",
  });

  const [preferenceId, setPreferenceId] = useState(null);

  const createPreference = async () => {
    const cartArray = cart.map((product) => {
      const itemPrice = product.discountPrice || product.unit_price;
      return {
        title: product.title,
        unit_price: itemPrice,
        quantity: product.quantity,
      };
    });
    try {
      let response = await axios.post(
        "https://backend-e-commerce-1-fjevfcudx-guiyee89.vercel.app/create_preference",
        // "http://localhost:8080/create_preference",
        {
          items: cartArray,
          shipment_cost: shipmentCost,
        }
      );

      const { id } = response.data;
      return id; // Return the ID on success
    } catch (error) {
      console.log(error);
      return null; // Return null or handle the error as needed
    }
  };

  const handleBuy = async () => {
    const id = await createPreference();
    if (id) {
      setPreferenceId(id);
    }
  };

  return (
    <>
      <Wrapper>
        {orderId ? (
          <>
            <h1>
              Su compra fue exitosa. <br />
              El numero de comprobante es: {orderId}{" "}
            </h1>
            <Link to="/all-products">Seguir Comprando</Link>
          </>
        ) : (
          <Checkout
            handleSubmit={handleSubmit}
            handleChange={handleChange}
            errors={errors}
            preferenceId={preferenceId}
            createPreference={createPreference}
            handleBuy={handleBuy}
            cart={cart}
          />
        )}
      </Wrapper>
    </>
  );
};
const Wrapper = styled.div`
  display: flex;
  justify-content: center;
`;
