import { CheckoutFormCart } from "./CheckoutFormCart";
import { useFormik } from "formik";
import * as Yup from "yup";
import { db } from "../../../../firebaseConfig";
import { collection, doc, getDoc } from "firebase/firestore";
import { useContext, useEffect, useState } from "react";
import { CartContext } from "../../../context/CartContext";
import styled from "styled-components/macro";
import { AuthContext } from "../../../context/AuthContext";
import { GlobalToolsContext } from "../../../context/GlobalToolsContext";

export const CheckoutFormCartContainer = () => {
  const { cart, getTotalPrice, clearCart } = useContext(CartContext);
  const { windowWidth } = useContext(GlobalToolsContext);
  const [confirm, setConfirm] = useState(false);
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
      setConfirm(true);
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
  // const location = useLocation();
  // const queryParams = new URLSearchParams(location.search);
  // const paramValue = queryParams.get("status"); // approved --- rejected
  // const [orderId, setOrderId] = useState(null);

  // useEffect(() => {
  //   //Guardamos la orden en Firebase
  //   let order = JSON.parse(localStorage.getItem("order"));

  //   if (paramValue === "approved") {
  //     //Si el paramValue esta aprovado, guardamos la orden de compra en FIREBASE
  //     let ordersCollection = collection(db, "orders");
  //     addDoc(ordersCollection, { ...order, date: serverTimestamp() }) // usamos el metodo addDoc para guardar la orden
  //       .then((res) => setOrderId(res.id)); //guardamos el ID de la orden en el setOrderID

  //     order.items.forEach((product) => {
  //       //actualizar informacion del producto despues de la compra
  //       updateDoc(doc(db, "products", product.id), {
  //         stock: product.stock - product.quantity,
  //       });
  //     });
  //     localStorage.removeItem("order");
  //     clearCart();
  //   }
  // }, [paramValue]);

  // initMercadoPago(import.meta.env.VITE_PUBLIC_KEY, {
  //   locale: "es-AR",
  // });

  // const [preferenceId, setPreferenceId] = useState(null);

  // const createPreference = async () => {
  //   const cartArray = cart.map((product) => {
  //     const itemPrice = product.discountPrice || product.unit_price;
  //     return {
  //       title: product.title,
  //       unit_price: itemPrice,
  //       quantity: product.quantity,
  //     };
  //   });
  //   try {
  //     let response = await axios.post(
  //       "https://backend-e-commerce-1-fjevfcudx-guiyee89.vercel.app/create_preference",
  //       // "http://localhost:8080/create_preference",
  //       {
  //         items: cartArray,
  //         shipment_cost: shipmentCost,
  //       }
  //     );

  //     const { id } = response.data;
  //     return id; // Return the ID on success
  //   } catch (error) {
  //     console.log(error);
  //     return null; // Return null or handle the error as needed
  //   }
  // };

  // const handleBuy = async () => {
  //   const id = await createPreference();
  //   if (id) {
  //     setPreferenceId(id);
  //   }
  // };

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
        />
      </Wrapper>
    </>
  );
};
const Wrapper = styled.div`
  display: flex;
  justify-content: center;
  height: ${(props) => (props.windowWidth < 851 ? "none" : "550px")};
  width: ${(props) => (props.windowWidth < 851 ? "100%" : "none")};
  margin: ${(props) =>
    props.windowWidth < 1050
      ? props.windowWidth < 650
        ? "0 5px 0 0"
        : "0px 10px 0 22px"
      : "0"};
`;
