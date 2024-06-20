import { Button, TextField } from "@mui/material";
import { collection, doc, getDocs, query, updateDoc } from "firebase/firestore";
import { useContext, useEffect } from "react";
import { useState } from "react";
import styled from "styled-components/macro";
import { db } from "../../../../../firebaseConfig";
import { GlobalToolsContext } from "../../../../context/GlobalToolsContext";
import "ldrs/helix";

export const AdminShipping = () => {
  const [shippingData, setShippingData] = useState([]);
  const [shippingCost, setShippingCost] = useState(shippingData);
  const [shippingLoading, setShippingLoading] = useState(true);
  const { windowWidth } = useContext(GlobalToolsContext);

  useEffect(() => {
    setShippingCost(shippingData);
  }, [shippingData]);

  useEffect(() => {
    const fetchShipping = async () => {
      const shippingCollection = collection(db, "shipment");
      const q = query(shippingCollection);
      try {
        const snapshot = await getDocs(q);
        const shipping = snapshot.docs.map((doc) => ({
          ...doc.data(),
          id: doc.id,
        }));
        setShippingData(shipping);
        setTimeout(() => {
          setShippingLoading(false);
        }, 1200);
      } catch (error) {
        console.log(error);
      }
    };
    fetchShipping();
  }, [shippingData]);

  const handleChange = (e, id, stateName) => {
    const { value } = e.target;
    setShippingCost((prevState) =>
      prevState.map((item) => {
        if (item.id === id) {
          if (stateName === "overseas" || stateName === "pick_up") {
            return { ...item, [stateName]: parseFloat(value) || 0 };
          } else {
            const updatedState = item.state.map((stateItem) => {
              if (stateItem.hasOwnProperty(stateName)) {
                return { [stateName]: parseFloat(value) || 0 };
              }
              return stateItem;
            });
            return { ...item, state: updatedState };
          }
        }
        return item;
      })
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const shippingCollection = collection(db, "shipment");

    const sanitizedShippingCost = shippingCost.map((item) => {
      const sanitizedState = item.state.map((stateItem) => {
        const stateName = Object.keys(stateItem)[0];
        return { [stateName]: stateItem[stateName] || 0 };
      });
      return {
        ...item,
        overseas: item.overseas || 0,
        pick_up: item.pick_up || 0,
        state: sanitizedState,
      };
    });

    for (const shipping of sanitizedShippingCost) {
      const shippingDocRef = doc(shippingCollection, shipping.id);
      await updateDoc(shippingDocRef, {
        overseas: shipping.overseas,
        pick_up: shipping.pick_up,
        state: shipping.state,
      });
    }

    console.log("Data updated successfully");
  };

  if (shippingLoading) {
    return (
      <BouncyLoader>
        <l-helix size="55" speed="1.25" color="black"></l-helix>
      </BouncyLoader>
    );
  }

  return (
    <FormWrapper>
      <Form onSubmit={handleSubmit}>
        {shippingCost.map((shipping) => (
          <ShippingContainer key={shipping.id}>
            <OverseasContainer>
              <div
                style={{
                  display: "flex",
                  justifyContent: "flex-start",
                }}
              >
                <p
                  style={{
                    fontSize: ".9rem",
                    fontWeight: "bold",
                    textTransform: "uppercase",
                    minWidth: "246px",
                  }}
                >
                  Foreign Countries :
                </p>
                <Input
                  style={{ width: "283px" }}
                  type="number"
                  label={"Other Countries"}
                  name="overseas"
                  defaultValue={shipping.overseas || 0}
                  onChange={(e) => handleChange(e, shipping.id, "overseas")}
                  placeholder="Overseas"
                />
              </div>
            </OverseasContainer>

            <UnitedStatesContainer>
              <p
                style={{
                  fontSize: ".9rem",
                  fontWeight: "bold",
                  minWidth: "135px",
                  textTransform: "uppercase",
                }}
              >
                United States :
              </p>
              <StateContainer>
                {shipping.state.map((stateItem, index) => {
                  const stateName = Object.keys(stateItem)[0];
                  return (
                    <Input
                      key={index}
                      type="number"
                      label={stateName}
                      name={stateName}
                      defaultValue={stateItem[stateName] || 0}
                      onChange={(e) => handleChange(e, shipping.id, stateName)}
                      placeholder={stateName}
                    />
                  );
                })}
              </StateContainer>
            </UnitedStatesContainer>
          </ShippingContainer>
        ))}
        <SubmitBtn type="submit" variant="contained">
          Confirm Changes
        </SubmitBtn>
      </Form>
    </FormWrapper>
  );
};
const BouncyLoader = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  padding-right: 175px;
  padding-bottom: 250px;
`;

const FormWrapper = styled.div`
  width: 80%;
  margin: 50px 10px;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 2rem;
  margin: 0 auto;
  justify-content: center;
  align-content: center;
  align-items: flex-start;
`;
const ShippingContainer = styled.div`
  width: 100%;
  max-width: 1200px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  box-shadow: rgba(0, 0, 0, 0.45) 3px -1px 13px;
  border-top-right-radius: 10px;
  border-bottom-right-radius: 10px;
`;
const OverseasContainer = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
  gap: 2rem;
  justify-content: space-between;
  box-shadow: rgba(0, 0, 0, 0.45) 2px 2px 4px;
  border-top-right-radius: 10px;
  padding: 20px 45px 20px 20px;
`;
const UnitedStatesContainer = styled.div`
  gap: 2rem;
  display: flex;
  width: 100%;
  justify-content: center;
  box-shadow: rgba(0, 0, 0, 0.45) 2px 4px 10px;
  padding: 20px;
  max-height: 470px;
  border-bottom-right-radius: 10px;
`;
const StateContainer = styled.div`
  width: 100%;
  display: flex;
  flex-wrap: wrap;
  gap: 2rem;
  justify-content: center;
  overflow: auto;
  padding: 12px;
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
const Input = styled(TextField)`
  .css-1t8l2tu-MuiInputBase-input-MuiOutlinedInput-input {
    padding: 12.5px 5px;
    text-align: center;
  }
  width: 130px;
  margin-bottom: 1rem;
`;

const SubmitBtn = styled(Button)`
  margin-top: 1rem;
`;
