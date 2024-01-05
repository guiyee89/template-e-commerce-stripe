import { Button, TextField } from "@mui/material";
import { collection, doc, updateDoc } from "firebase/firestore";
import { useContext, useEffect } from "react";
import { useState } from "react";
import styled from "styled-components/macro";
import { db } from "../../../../../firebaseConfig";
import { GlobalToolsContext } from "../../../../context/GlobalToolsContext";

export const PriceDiscountForm = ({ setIsChanged, products }) => {
  const [getDiscount, setGetDiscount] = useState();
  const [getPrice, setGetPrice] = useState();
  const { windowWidth } = useContext(GlobalToolsContext);

  useEffect(() => {
    // Find the product with the given userId
    const productProperties = products.find(
      (product) => product.userId !== undefined
    );
    // If found, set the discount value
    if (productProperties) {
      setGetDiscount(productProperties.discount);
      setGetPrice(productProperties.unit_price);
    } else {
      setGetDiscount("");
      setGetPrice("");
    }
  }, [products]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "discount") {
      setGetDiscount(value);
    } else if (name === "unit_price") {
      setGetPrice(value);
    }
  };

  ////////////          SUBMIT          //////////////
  const handleSubmit = async (e) => {
    e.preventDefault();

    const itemsCollection = collection(db, "products");

    // Check if getDiscount and getPrice are not empty strings
    if (products && getDiscount !== "" && getPrice !== "") {
      // Parse the discount and price values to floats
      const newDiscount = parseFloat(getDiscount);
      const newPrice = parseFloat(getPrice);

      // Iterate through each product in the state and update the discount and price
      const updatedProducts = products.map((product) => {
        const price = newPrice; // Use the latest price value
        const discount = newDiscount; // Use the latest discount value
        const discountAmount = (price * discount) / 100;
        let totalPrice = price;
        totalPrice -= discountAmount;

        return {
          ...product,
          discount: discount || null,
          discountPrice: totalPrice || null,
          unit_price: price, // Update unit_price
        };
      });

      // Update each document in the database
      for (const updatedProduct of updatedProducts) {
        await updateDoc(
          doc(itemsCollection, updatedProduct.id),
          updatedProduct
        );
      }
      setIsChanged();
    } else {
      // Handle the case where the input is empty
      const updatedProducts = products.map((product) => ({
        ...product,
        discount: null,
        discountPrice: null,
      }));

      // Update each document in the database
      for (const updatedProduct of updatedProducts) {
        await updateDoc(
          doc(itemsCollection, updatedProduct.id),
          updatedProduct
        );
      }
      setIsChanged();
    }
  };

  return (
    <>
      <Div>
        <FormWrapper>
          <Form onSubmit={handleSubmit} windowWidth={windowWidth}>
            <div>
              {/* <h2 style={{ fontSize: ".9rem", textAlign: "center" }}>Precio</h2> */}
              <Input
                label="Precio"
                variant="outlined"
                name="unit_price"
                value={getPrice || ""}
                onChange={handleChange}
                // helperText={errors.unit_price}
                // error={errors.unit_price ? true : false}

                InputLabelProps={{
                  style: { fontSize: "14px", zIndex: "0" },
                }}
              />
            </div>
            <div>
              {/* <h2 style={{ fontSize: ".9rem", textAlign: "center" }}>
                Descuento en %
              </h2> */}
              <Input
                label=/* {getDiscount ? "" : "Ejemplo: 10%"} */ "Descuento en %"
                variant="outlined"
                name="discount"
                value={getDiscount || ""}
                onChange={handleChange}
                InputLabelProps={{
                  style: { fontSize: "14px", zIndex: "0" },
                }}
                // helperText={errors.discount}
                // error={errors.discount ? true : false}
              />
            </div>
            <SubmitBtn
              type="submit"
              variant="contained"
              sx={{
                minWidth: "100px",
                fontSize: "0.65rem",
                backgroundColor: "#1e4a75",
              }}
            >
              Confirmar
            </SubmitBtn>
          </Form>
        </FormWrapper>
      </Div>
    </>
  );
};
const FormWrapper = styled.div`
  width: 100%;
  max-height: 600px;
  overflow-y: auto;
  padding: 20px 6px;
`;
const Form = styled.form`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 1rem;
  justify-content: ${(props) => (props.windowWidth < 750 ? "flex-start" : "center")};
  margin: ${(props) => (props.windowWidth < 750 ? "0" : "0px 0px 0px -238px;")};
`;
const Div = styled.div`
  width: 100%;
`;
const Input = styled(TextField)`
  .css-1t8l2tu-MuiInputBase-input-MuiOutlinedInput-input {
    padding: 12.5px 5px;
    text-align: center;
  }
  width: 130px;
`;
const SubmitBtn = styled(Button)``;
