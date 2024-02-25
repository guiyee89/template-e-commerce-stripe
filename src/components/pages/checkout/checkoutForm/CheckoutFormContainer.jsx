import { useFormik } from "formik";
import * as Yup from "yup";
import { db } from "../../../../firebaseConfig";
import { collection, doc, getDoc, getDocs } from "firebase/firestore";
import { useContext, useEffect, useState } from "react";
import { CartContext } from "../../../context/CartContext";
import styled from "styled-components/macro";
import { AuthContext } from "../../../context/AuthContext";
import { GlobalToolsContext } from "../../../context/GlobalToolsContext";
import { CheckoutForm } from "./CheckoutForm";

export const CheckoutFormContainer = () => {
  const { cart, getTotalPrice } = useContext(CartContext);
  const { windowWidth } = useContext(GlobalToolsContext);
  const [confirm, setConfirm] = useState(false);
  const { user } = useContext(AuthContext);
  const [shipmentCost, setShipmentCost] = useState(0);
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  let total = getTotalPrice();
  const [country, setCountry] = useState("");
  const [state, setState] = useState("");

  const { handleSubmit, handleChange, errors } = useFormik({
    initialValues: {
      email: "" || user.email,
      country: country,
      state: state,
      name: "",
      lastName: "",
      phone: "",
      ciudad: "",
      direccion: "",
      cp: "",
    },
    onSubmit: (data) => {
      setCheckoutLoading(true);
      //Submit order data
      let order = {
        buyer: { ...data, country, state },
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

  const handleCountryChange = (event) => {
    const selectedCountry = event.target.value;
    setCountry(selectedCountry);
  };

  const handleStateChange = (event) => {
    const selectedState = event.target.value;
    setState(selectedState);
  };

  useEffect(() => {
    const fetchShipmentCost = async () => {
      if (state) {
        console.log(state);
        try {
          let shipmentCollection = collection(db, "shipment");
          let shipmentDoc = doc(shipmentCollection, "3Mwmj1byEy8pDQyqwVMa");
          let docSnapshot = await getDoc(shipmentDoc);
          const stateData = docSnapshot.data().state;
          console.log("State data from Firestore:", stateData);

          // Iterate over the stateData array to find the matching state
          let selectedStateCost = 0;
          stateData.forEach((item) => {
            if (Object.keys(item)[0] === state.toLowerCase()) {
              selectedStateCost = item[state.toLowerCase()];
            }
          });

          // Check if the shipping cost for the selected state was found
          if (selectedStateCost !== 0) {
            setShipmentCost(selectedStateCost);
            console.log(selectedStateCost);
          } else {
            console.error(`Shipping cost not found for state: ${state}`);
          }
        } catch (error) {
          console.error("Error fetching shipment cost:", error);
        }
      }
    };

    fetchShipmentCost();
  }, [state]);

  return (
    <>
      <Wrapper windowWidth={windowWidth}>
        <CheckoutForm
          handleSubmit={handleSubmit}
          handleChange={handleChange}
          handleCountryChange={handleCountryChange}
          country={country}
          handleStateChange={handleStateChange}
          state={state}
          shipmentCost={shipmentCost}
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
