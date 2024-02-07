import { useFormik } from "formik";
import * as Yup from "yup";
import { db } from "../../../../firebaseConfig";
import { collection, doc, getDoc } from "firebase/firestore";
import { useContext, useEffect, useState } from "react";
import { CartContext } from "../../../context/CartContext";
import styled from "styled-components/macro";
import { AuthContext } from "../../../context/AuthContext";
import { GlobalToolsContext } from "../../../context/GlobalToolsContext";
import { CheckoutFormCart } from "./CheckoutFormCart";

export const CheckoutFormCartContainer = () => {
  const { cart, getTotalPrice } = useContext(CartContext);
  const { windowWidth } = useContext(GlobalToolsContext);
  const [confirm, setConfirm] = useState(false);
  const { user } = useContext(AuthContext);
  const [shipmentCost, setShipmentCost] = useState(0);
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  let total = getTotalPrice();

  const { handleSubmit, handleChange, errors } = useFormik({
    initialValues: {
      email: "" || user.email,
      name: "",
      phone: "",
      ciudad: "",
      direccion: "",
      cp: "",
    },
    onSubmit: (data) => {
      setCheckoutLoading(true);
      //Submit order data
      let order = {
        buyer: data,
        items: cart,
        email: user.email || data.email,
        item_price: cart.map((product) => ({
          unit_price: product.discountPrice || product.unit_price,
        })),
        total: total + shipmentCost,
        shipment_cost: shipmentCost,
      };
      localStorage.setItem("order", JSON.stringify(order));
      setConfirm(true);
      setCheckoutLoading(false);
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

  useEffect(() => {
    let shipmentCollection = collection(db, "shipment");
    let shipmentDoc = doc(shipmentCollection, "5cZm9Cs7S92K9ipH9KBn");
    getDoc(shipmentDoc).then((res) => {
      setShipmentCost(res.data().cost);
    });
  }, []);

  return (
    <>
      <Wrapper windowWidth={windowWidth}>
        <CheckoutFormCart
          handleSubmit={handleSubmit}
          handleChange={handleChange}
          errors={errors}
          cart={cart}
          confirm={confirm}
          setConfirm={setConfirm}
          checkoutLoading={checkoutLoading}
        />
      </Wrapper>
    </>
  );
};
const Wrapper = styled.div`
  width: ${(props) => (props.windowWidth < 851 ? "100%" : "100%")};
`;
