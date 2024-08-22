import { useFormik } from "formik";
import * as Yup from "yup";
import { db } from "../../../firebaseConfig";
import { collection, doc, getDoc } from "firebase/firestore";
import { useContext, useEffect, useState } from "react";
import { CartContext } from "../../context/CartContext";
import styled from "styled-components/macro";
import { AuthContext } from "../../context/AuthContext";
import { GlobalToolsContext } from "../../context/GlobalToolsContext";
import { CheckoutForm } from "./checkoutForm/CheckoutForm";
import { CarouselDesktop } from "../landingPage/carousels/CarouselDesktop";
import { CarouselTablet } from "../landingPage/carousels/CarouselTablet";
import { CarouselMobile } from "../landingPage/carousels/CarouselMobile";
import { updateEmailList } from "../../../firebaseEmailConfig";

export const CheckoutContainer = () => {
  const { cart, getTotalPrice } = useContext(CartContext);
  const { windowWidth } = useContext(GlobalToolsContext);
  const [confirm, setConfirm] = useState(false);
  const { user } = useContext(AuthContext);
  const [shipmentCost, setShipmentCost] = useState(0);
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [shippingMethod, setShippingMethod] = useState("ship");
  let total = getTotalPrice();
  const [country, setCountry] = useState("");
  const [state, setState] = useState("");
  const [shipCostLoader, setShipCostLoader] = useState(false);
  const [subscribeToNewsletter, setSubscribeToNewsletter] = useState(false);

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
    onSubmit: async (data) => {
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
      setTimeout(() => {
        setCheckoutLoading(false);
      }, 2600);
      console.log(order);
      // Update email list if checkbox is checked
      if (subscribeToNewsletter) {
        await updateEmailList(data.email);
      }
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

  useEffect(() => {
    const fetchShipmentCost = async () => {
      try {
        let shipmentCollection = collection(db, "shipment");
        let shipmentDoc = doc(shipmentCollection, "3Mwmj1byEy8pDQyqwVMa");
        let docSnapshot = await getDoc(shipmentDoc);
        const shipmentData = docSnapshot.data();
        const rateType = shipmentData.rateType;

        if (shippingMethod === "pick_up") {
          setShipmentCost(shipmentData.pick_up || 0);
        } else {
          if (country === "") {
            setShipmentCost(0);
          } else if (country.toLowerCase() !== "united states") {
            setShipmentCost(shipmentData.overseas);
          } else {
            setShipmentCost(0);

            if (state) {
              if (rateType === "flatRate") {
                setShipmentCost(shipmentData.flatRate);
              } else {
                const stateData = shipmentData.state;
                let selectedStateCost = 0;
                stateData.forEach((item) => {
                  if (Object.keys(item)[0] === state) {
                    selectedStateCost = item[state];
                  }
                });
                if (selectedStateCost !== 0) {
                  setShipmentCost(selectedStateCost);
                } else {
                  console.error(`Shipping cost not found for state: ${state}`);
                }
              }
            }
          }
        }
      } catch (error) {
        console.error("Error fetching shipment cost:", error);
      } finally {
        setTimeout(() => {
          setShipCostLoader(false);
        }, 1500);
      }
    };

    setShipCostLoader(true);
    if (shippingMethod === "ship") {
      fetchShipmentCost();
    } else {
      setShipmentCost(0);
      setTimeout(() => {
        setShipCostLoader(false);
      }, 1200);
    }
  }, [shippingMethod, country, state]);

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
          setShipmentCost={setShipmentCost}
          shipCostLoader={shipCostLoader}
          shippingMethod={shippingMethod}
          setShippingMethod={setShippingMethod}
          errors={errors}
          cart={cart}
          confirm={confirm}
          setConfirm={setConfirm}
          checkoutLoading={checkoutLoading}
          subscribeToNewsletter={subscribeToNewsletter}
          setSubscribeToNewsletter={setSubscribeToNewsletter}
        />
        <CarouselContainer>
          <h1
            style={{
              marginBottom: "50px",
              fontWeight: "bold",
              fontSize: "1.5rem",
            }}
          >
            Featured collection
          </h1>
          {windowWidth >= 1200 && <CarouselDesktop />}
          {windowWidth < 1200 && windowWidth >= 650 && <CarouselTablet />}
          {windowWidth < 650 && <CarouselMobile />}
        </CarouselContainer>
      </Wrapper>
    </>
  );
};

const Wrapper = styled.div`
  width: ${(props) => (props.windowWidth < 851 ? "100%" : "100%")};
`;
const CarouselContainer = styled.div`
  margin: 30px auto 200px;
  width: 92%;
  max-width: 1450px;
  @media (max-width: 1199px) {
    width: 95%;
  }
  @media (max-width: 800px) {
    width: 98%;
  }
`;
