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
import { GlobalToolsContext } from "../../../../context/GlobalToolsContext";
import { useContext } from "react";

export const AdminShipping = () => {
  const { windowWidth } = useContext(GlobalToolsContext);
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
                    width: windowWidth < 600 ? "146px" : "288px",
                    position: "absolute",
                    left: windowWidth < 600 ? "51.7%" : "23.7%",
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

                <FormControlLabel
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
  padding-right: 209px;
  box-shadow: rgba(0, 0, 0, 0.45) 2px 0px 6px;
  grid-column: 2/7;
  display: flex;
  align-items: center;
  justify-content: center;
  @media (max-width: 1100px) {
    box-shadow: rgba(0, 0, 0, 0) 0px 0px 0px;
    display: flex;
    justify-content: center;
    padding: 150px 0;
  }
`;

const ShippingFormWrapper = styled.div`
  grid-column: 2/7;
  margin: 0 10px 0 0;
  overflow-x: auto;
  width: 100%;
  height: 100%;
  box-shadow: rgba(0, 0, 0, 0.45) 2px 0px 6px;
  border-top-right-radius: 10px;
  border-bottom-right-radius: 10px;
  @media (max-width: 1100px) {
    width: 98%;
    box-shadow: rgba(0, 0, 0, 0.2) 0px 0px 3px;
    border-top-right-radius: 0;
    border-bottom-right-radius: 0;
  }
  @media (max-width: 800px) {
    width: 100%;
  }
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
  @media (max-width: 1100px) {
    box-shadow: rgba(0, 0, 0, 0.2) 0px 0px 3px;
    border-top-right-radius: 0;
    border-bottom-right-radius: 0;
  }
`;

const OverseasContainer = styled.div`
  display: flex;
  align-items: center;
  position: relative;
  width: 100%;
  gap: 2rem;
  justify-content: space-between;
  box-shadow: rgba(0, 0, 0, 0.15) 2px 1px 3px;
  border-top-right-radius: 10px;
  padding: 0 22px;
  height: 90px;
  @media (max-width: 600) {
  }
`;

const UnitedStatesContainer = styled.div`
  gap: 2rem;
  display: flex;
  width: 100%;
  justify-content: center;
  box-shadow: rgba(0, 0, 0, 0.15) 1px 1px 1px;
  padding: 20px;
  max-height: 512px;
  @media (max-width: 600px) {
    flex-direction: column;
  }
`;

const UnitedStatesWrapper = styled.div`
  width: 100%;
  display: flex;
  flex-wrap: wrap;
  gap: 2rem;
  justify-content: flex-start;
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
  @media (max-width: 600px) {
    padding: 12.5px 0;
    justify-content: center;
  }
`;

const FlatRateContainer = styled.div`
  width: 100%;
  display: flex;
  flex-wrap: wrap;
  gap: 2rem;
  padding: 12px 0;
  @media (max-width: 600px) {
    padding: 12.5px 0;
  }
`;

const Input = styled(TextField)`
  .css-1t8l2tu-MuiInputBase-input-MuiOutlinedInput-input {
    padding: 12.5px 5px;
    text-align: center;
  }
  width: 130px;
  margin-bottom: 1rem;
  @media (max-width: 600px) {
    width: 105px;
    padding: 12.5px 0;
  }
  @media (max-width: 350px) {
    width: 90px;
  }
`;
const SubmitBtnContainer = styled.div`
  display: flex;
  width: 100%;
  height: 60px;
  box-shadow: rgba(0, 0, 0, 0.25) 2px 2px 3px;
  align-items: center;
  justify-content: center;
  border-bottom-right-radius: 10px;
  @media (max-width: 1100px) {
    box-shadow: rgba(0, 0, 0, 0.2) 0px 0px 3px;
    border-top-right-radius: 0;
    border-bottom-right-radius: 0;
    padding: 44px 0 50px;
  }
`;
const SubmitBtn = styled(Button)`
  margin-top: 1rem;
`;
