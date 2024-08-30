import {
  Button,
  Checkbox,
  FormControlLabel,
  TextField,
  Typography,
} from "@mui/material";
import { collection, doc, getDocs, query, updateDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import styled from "styled-components/macro";
import { db } from "../../../../../firebaseConfig";
import { Ring } from "@uiball/loaders";

export const AdminShipping = () => {
  const [shippingData, setShippingData] = useState([]);
  const [shippingCost, setShippingCost] = useState([]);
  const [shippingLoading, setShippingLoading] = useState(true);
  const [useFlatRate, setUseFlatRate] = useState({});
  const [useStateRate, setUseStateRate] = useState({});

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

        const initialFlatRateState = {};
        const initialStateRateState = {};

        shipping.forEach((item) => {
          initialFlatRateState[item.id] =
            item.flatRate !== undefined && item.flatRate !== null;
          initialStateRateState[item.id] = !(
            item.flatRate !== undefined && item.flatRate !== null
          );
        });

        setShippingData(shipping);
        setUseFlatRate(initialFlatRateState);
        setUseStateRate(initialStateRateState);

        setTimeout(() => {
          setShippingLoading(false);
        }, 800);
      } catch (error) {
        console.log(error);
      }
    };
    fetchShipping();
  }, []);

  // Create a flag to update database with correct shipping rate
  const handleRateChange = async (e, id, rateType) => {
    // existing handleChange logic
    const newRateType = rateType === "flatRate" ? "flatRate" : "stateRate";

    // Update the database with the new rate type
    const shipmentDoc = doc(db, "shipment", id);
    await updateDoc(shipmentDoc, {
      rateType: newRateType,
    });
  };

  const handleChange = (e, id, stateName) => {
    const { value, checked, type } = e.target;
    if (type === "checkbox") {
      if (stateName === "flatRate") {
        setUseFlatRate((prevState) => ({ ...prevState, [id]: checked }));
        if (checked) {
          setUseStateRate((prevState) => ({ ...prevState, [id]: false }));
          handleRateChange(e, id, "flatRate");
        }
      } else if (stateName === "stateRate") {
        setUseStateRate((prevState) => ({ ...prevState, [id]: checked }));
        if (checked) {
          setUseFlatRate((prevState) => ({ ...prevState, [id]: false }));
          handleRateChange(e, id, "stateRate");
        }
      }
      return;
    }

    setShippingCost((prevState) =>
      prevState.map((item) => {
        if (item.id === id) {
          if (stateName === "overseas" || stateName === "pick_up") {
            return { ...item, [stateName]: parseFloat(value) || 0 };
          } else if (stateName === "flatRate") {
            return { ...item, flatRate: parseFloat(value) || 0 };
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

      const updatedItem = {
        ...item,
        overseas: item.overseas || 0,
        pick_up: item.pick_up || 0,
        state: sanitizedState,
      };

      if (useFlatRate[item.id]) {
        updatedItem.flatRate = item.flatRate || 0;
      } else {
        updatedItem.flatRate = null;
      }

      return updatedItem;
    });

    for (const shipping of sanitizedShippingCost) {
      const shippingDocRef = doc(shippingCollection, shipping.id);
      const updateData = {
        overseas: shipping.overseas,
        pick_up: shipping.pick_up,
        state: shipping.state,
      };

      if (shipping.flatRate !== undefined) {
        updateData.flatRate = shipping.flatRate;
      }

      await updateDoc(shippingDocRef, updateData);
    }

    console.log("Data updated successfully");
  };

  if (shippingLoading) {
    return (
      <Loader>
        <Ring size={40} lineWeight={6} speed={1} color="black" />
      </Loader>
    );
  }

  return (
    <ShippingFormWrapper>
      <Form onSubmit={handleSubmit}>
        {shippingCost.map((shipping) => (
          <ShippingContainer key={shipping.id}>
            <OverseasContainer>
              <div style={{ display: "flex", justifyContent: "flex-start" }}>
                <p
                  style={{
                    fontSize: ".9rem",
                    fontWeight: "bold",
                    textTransform: "uppercase",
                  }}
                >
                  Overseas:
                </p>
                <Input
                  style={{
                    width: "288px",
                    position: "absolute",
                    left: "23.7%",
                    top: "24px",
                  }}
                  type="number"
                  label="Other Countries"
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
                  padding: "24px 0",
                }}
              >
                United States:
              </p>
              <UnitedStatesWrapper>
                <FlatRateContainer>
                  <FormControlLabel
                    style={{ marginRight: "12px" }}
                    control={
                      <Checkbox
                        checked={useFlatRate[shipping.id] || false}
                        onChange={(e) =>
                          handleChange(e, shipping.id, "flatRate")
                        }
                      />
                    }
                    label={
                      <Typography style={{ fontSize: "0.88rem" }}>
                        Use Flat Rate
                      </Typography>
                    }
                  />

                  <Input
                    type="number"
                    label="Flat Rate"
                    name="flatRate"
                    defaultValue={shipping.flatRate || 0}
                    onChange={(e) => handleChange(e, shipping.id, "flatRate")}
                    placeholder="Flat Rate"
                    disabled={useStateRate[shipping.id]}
                  />
                </FlatRateContainer>

                <StateContainer>
                  <FormControlLabel
                    style={{ marginRight: "2px" }}
                    control={
                      <Checkbox
                        checked={useStateRate[shipping.id] || false}
                        onChange={(e) =>
                          handleChange(e, shipping.id, "stateRate")
                        }
                      />
                    }
                    label={
                      <Typography style={{ fontSize: "0.88rem" }}>
                        Use State Rate
                      </Typography>
                    }
                  />
                  {shipping.state.map((stateItem, index) => {
                    const stateName = Object.keys(stateItem)[0];
                    return (
                      <Input
                        key={index}
                        type="number"
                        label={stateName}
                        name={stateName}
                        defaultValue={stateItem[stateName] || 0}
                        onChange={(e) =>
                          handleChange(e, shipping.id, stateName)
                        }
                        placeholder={stateName}
                        disabled={useFlatRate[shipping.id]}
                      />
                    );
                  })}
                </StateContainer>
              </UnitedStatesWrapper>
            </UnitedStatesContainer>
          </ShippingContainer>
        ))}
        <SubmitBtnContainer>
          <SubmitBtn type="submit" variant="contained">
            Confirm Changes
          </SubmitBtn>
        </SubmitBtnContainer>
      </Form>
    </ShippingFormWrapper>
  );
};

const Loader = styled.div`
  width: 100%;
  border-bottom-right-radius: 5px;
  border-top-right-radius: 7px;
  box-shadow: rgba(0, 0, 0, 0.45) 2px 0px 6px;
  grid-column: 2/7;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const ShippingFormWrapper = styled.div`
  width: 100%;
  margin: 0px 10px;
  grid-column: 2 / 7;
  box-shadow: rgba(0, 0, 0, 0.45) 2px 0px 6px;
  border-bottom-right-radius: 5px;
  border-top-right-radius: 7px;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  height: 100%;
  margin: 0 auto;
  justify-content: space-between;
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
  box-shadow: rgba(0, 0, 0, 0.35) 1px 0px 3px;
  border-top-right-radius: 10px;
`;

const OverseasContainer = styled.div`
  display: flex;
  align-items: center;
  position: relative;
  width: 100%;
  gap: 2rem;
  justify-content: space-between;
  box-shadow: rgba(0, 0, 0, 0.35) 2px 1px 3px;
  border-top-right-radius: 10px;
  padding: 0 22px;
  height: 90px;
`;

const UnitedStatesContainer = styled.div`
  gap: 2rem;
  display: flex;
  width: 100%;
  justify-content: center;
  box-shadow: rgba(0, 0, 0, 0.45) 1px 1px 2px;
  padding: 20px;
  max-height: 512px;
`;

const UnitedStatesWrapper = styled.div`
  width: 100%;
  display: flex;
  flex-wrap: wrap;
  gap: 2rem;
  justify-content: center;
  overflow: auto;
  padding: 0 12px;
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

const StateContainer = styled.div`
  width: 100%;
  display: flex;
  flex-wrap: wrap;
  gap: 2rem;
  padding: 12px;
`;

const FlatRateContainer = styled.div`
  width: 100%;
  display: flex;
  flex-wrap: wrap;
  gap: 2rem;
  padding: 12px;
`;

const Input = styled(TextField)`
  .css-1t8l2tu-MuiInputBase-input-MuiOutlinedInput-input {
    padding: 12.5px 5px;
    text-align: center;
  }
  width: 130px;
  margin-bottom: 1rem;
`;
const SubmitBtnContainer = styled.div`
  display: flex;
  width: 100%;
  height: 60px;
  box-shadow: rgba(0, 0, 0, 0.35) 2px 2px 4px;
  align-items: center;
  justify-content: center;
  border-bottom-right-radius: 10px;
`;
const SubmitBtn = styled(Button)`
  margin-top: 1rem;
`;
