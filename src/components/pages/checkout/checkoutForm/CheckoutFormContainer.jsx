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
  const [shipCostLoader, setShipCostLoader] = useState(false);

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

  const handleCountryChange = async (event) => {
    const selectedCountry = event.target.value;
    setCountry(selectedCountry);

    if (selectedCountry !== country) {
      setState("");
    }
  };

  const handleStateChange = (event) => {
    const selectedState = event.target.value;
    setState(selectedState);
  };

  // useEffect(() => {
  //   let delay = 2200;
  //   const fetchShipmentCost = async () => {
  //     try {
  //       let shouldLoad = false; // Flag to determine if the loader should be activated

  //       if (country === "") {
  //         setShipmentCost(0);
  //       } else if (country.toLowerCase() !== "united states") {
  //         shouldLoad = true; // Activate loader if the country is not United States
  //         let shipmentCollection = collection(db, "shipment");
  //         let shipmentDoc = doc(shipmentCollection, "3Mwmj1byEy8pDQyqwVMa");
  //         let docSnapshot = await getDoc(shipmentDoc);
  //         const shipmentData = docSnapshot.data();
  //         setShipmentCost(shipmentData.overseas);
  //       } else if (country.toLowerCase() === "united states") {
  //         // If country is United States, find the shipping cost for the selected state
  //         setShipmentCost(0);

  //         if (state) {
  //           shouldLoad = true; // Activate loader on state change
  //           const shipmentCollection = collection(db, "shipment");
  //           const shipmentDoc = doc(shipmentCollection, "3Mwmj1byEy8pDQyqwVMa");
  //           const docSnapshot = await getDoc(shipmentDoc);
  //           const shipmentData = docSnapshot.data();
  //           const stateData = shipmentData.state;
  //           let selectedStateCost = 0;
  //           stateData.forEach((item) => {
  //             if (Object.keys(item)[0] === state.toLowerCase()) {
  //               selectedStateCost = item[state.toLowerCase()];
  //             }
  //           });
  //           if (selectedStateCost !== 0) {
  //             setShipmentCost(selectedStateCost);
  //           } else {
  //             console.error(`Shipping cost not found for state: ${state}`);
  //           }
  //         }
  //       }

  //       setShipCostLoader(shouldLoad); // Set loader state based on the flag
  //     } catch (error) {
  //       console.error("Error fetching shipment cost:", error);
  //     }
  //   };

  //   const timer = setTimeout(fetchShipmentCost, delay);

  //   return () => {
  //     clearTimeout(timer);
  //   };
  // }, [country, state]);

  useEffect(() => {
    let delay = 2200;
    const fetchShipmentCost = async () => {
      try {
        let shipmentCollection = collection(db, "shipment");
        let shipmentDoc = doc(shipmentCollection, "3Mwmj1byEy8pDQyqwVMa");
        let docSnapshot = await getDoc(shipmentDoc);
        const shipmentData = docSnapshot.data();

        if (country === "") {
          setShipmentCost(0);
        } else if (country.toLowerCase() !== "united states") {
          setShipCostLoader(true);
          setShipmentCost(shipmentData.overseas);
        } else {
          setShipmentCost(0);
        }

        if (state) {
          setShipCostLoader(true);
          // If country is United States, find the shipping cost for the selected state
          const stateData = shipmentData.state;
          let selectedStateCost = 0;
          stateData.forEach((item) => {
            if (Object.keys(item)[0] === state.toLowerCase()) {
              selectedStateCost = item[state.toLowerCase()];
            }
          });
          if (selectedStateCost !== 0) {
            setShipmentCost(selectedStateCost);
          } else {
            console.error(`Shipping cost not found for state: ${state}`);
          }

        }
      } catch (error) {
        console.error("Error fetching shipment cost:", error);
      } finally {
        setShipCostLoader(false); // Set shipCostLoader to false after the fetch operation completes
      }
    };

    const timer = setTimeout(fetchShipmentCost, delay);

    return () => {
      clearTimeout(timer);
    };
  }, [country, state]);

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
          shipCostLoader={shipCostLoader}
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
