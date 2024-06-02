import {
  Box,
  Checkbox,
  FormControl,
  FormControlLabel,
  InputLabel,
  MenuItem,
  Modal,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import { useContext, useEffect, useState } from "react";
import styled from "styled-components/macro";
import { GlobalToolsContext } from "../../../context/GlobalToolsContext";
import CloseIcon from "@mui/icons-material/Close";
import { Payment } from "../stripeCheckout/Payment";
import { AuthContext } from "../../../context/AuthContext";
import { Ring } from "@uiball/loaders";
import { ShippingButtons } from "../shipping/ShippingButtons";
import { CartContainer } from "../checkoutCart/CartContainer";

export const CheckoutForm = ({
  handleSubmit,
  handleChange,
  handleCountryChange,
  country,
  handleStateChange,
  state,
  shipmentCost,
  shipCostLoader,
  shippingMethod,
  setShippingMethod,
  errors,
  confirm,
  setConfirm,
  checkoutLoading,
}) => {
  const { windowWidth } = useContext(GlobalToolsContext);
  const { user, handleLogout } = useContext(AuthContext);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [inputFilled, setInputFilled] = useState({});

  useEffect(() => {
    setIsLoading(true);
  }, []);

  // Use useEffect to open the modal when confirm becomes true
  useEffect(() => {
    if (confirm) {
      setTimeout(() => {
        setIsModalOpen(true);
      }, 2000);
    }
  }, [confirm]);

  // Function to close the modal
  const closeModal = () => {
    setIsModalOpen(false);
    setConfirm(false);
  };

  const handleLoginLinkClick = () => {
    window.location.assign("/login");
    localStorage.setItem("prevLocation", location.pathname);
  };

  useEffect(() => {
    const handleLogoutAfterReload = () => {
      const logoutInfoString = localStorage.getItem("logoutInfo");
      if (logoutInfoString) {
        const logoutInfo = JSON.parse(logoutInfoString);
        if (logoutInfo.logoutAfterReload) {
          // Perform the logout action
          handleLogout();
          localStorage.removeItem("logoutInfo");
        }
      }
    };
    // Check if there is a logoutInfo in localStorage
    handleLogoutAfterReload();
    // Set a flag in localStorage to indicate that a reload has occurred
    localStorage.setItem("reloadOccurred", "true");
    return () => {
      localStorage.removeItem("reloadOccurred");
    };
  }, [handleLogout]);

  const handleInputChange = (event) => {
    handleChange(event);
    const { name, value } = event.target;
    setInputFilled((prevState) => ({
      ...prevState,
      [name]: value !== "",
    }));
  };

  const handleCountryChangeInternal = (event) => {
    handleCountryChange(event);
    setInputFilled((prevState) => ({
      ...prevState,
      country: event.target.value !== "",
    }));
  };

  const handleStateChangeInternal = (event) => {
    handleStateChange(event);
    setInputFilled((prevState) => ({
      ...prevState,
      state: event.target.value !== "",
    }));
  };

  return (
    <>
      <Wrapper>
        <FormItemsContainer windowwidth={windowWidth}>
          <FormItemsWrapper>
            {isLoading === false ? (
              <div style={{ width: "52%", height: "100%" }}></div>
            ) : (
              <FormWrapper windowwidth={windowWidth}>
                <Form onSubmit={handleSubmit} windowwidth={windowWidth}>
                  {Object.keys(user).length > 0 ? (
                    <>
                      <ContactTitle windowwidth={windowWidth}>
                        Contact
                      </ContactTitle>
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          width: "100%",
                        }}
                      >
                        <LogoutContainer>
                          <div style={{ display: "block" }}>
                            <p style={{ paddingBottom: "8px" }}>Account</p>
                            <p style={{ fontSize: ".9rem", fontWeight: "500" }}>
                              {user.email}
                            </p>
                          </div>

                          <LogBtn
                            type="button"
                            onClick={() => {
                              localStorage.setItem(
                                "logoutInfo",
                                JSON.stringify({ logoutAfterReload: true })
                              );
                              window.location.reload();
                            }}
                          >
                            Log out
                          </LogBtn>
                        </LogoutContainer>
                      </div>
                    </>
                  ) : (
                    <>
                      <div
                        style={{
                          display: "flex",
                          width: "100%",
                          alignItems: "center",
                        }}
                      >
                        <ContactTitle windowwidth={windowWidth}>
                          Contact
                        </ContactTitle>
                        <LoginContainer>
                          <p style={{ textAlign: "end" }}>
                            Have an account?{" "}
                            <LogBtn
                              type="button"
                              onClick={handleLoginLinkClick}
                            >
                              Log in
                            </LogBtn>
                          </p>
                        </LoginContainer>
                      </div>
                      <Input
                        label="Email"
                        variant="outlined"
                        name="email"
                        onChange={handleInputChange}
                        helperText={errors.email}
                        error={errors.email ? true : false}
                        sx={{
                          marginTop: "20px",
                          width: "100%",
                          backgroundColor: inputFilled.email
                            ? "#e8f0fe"
                            : "transparent",
                          "&.Mui-focused": {
                            backgroundColor: "#e8f0fe",
                          },
                        }}
                        size="medium"
                      />
                    </>
                  )}
                  <FormControlLabel
                    sx={{
                      width: "100%",
                      marginTop: "20px",
                      marginLeft: "2px",
                    }}
                    control={<Checkbox />}
                    label={
                      <Typography
                        sx={{
                          fontSize: "0.88rem",
                          marginBottom: "-4px",
                        }}
                      >
                        Email me with news and offers
                      </Typography>
                    }
                  />
                  <p
                    style={{
                      fontSize: ".8rem",
                      width: "100%",
                      textAlign: "left",
                      paddingLeft: "33px",
                    }}
                  >
                    ( 5% discount code )
                  </p>
                  <DeliveryInfoTitle>Delivery</DeliveryInfoTitle>

                  {/* Shipping Buttons component */}

                  <ShippingButtons setShippingMethod={setShippingMethod} />

                  {/*  */}

                  <h3
                    style={{
                      width: "100%",
                      fontWeight: "600",
                      fontSize: "1.1rem",
                      margin: "28px 0 14px",
                    }}
                  >
                    Billing Address
                  </h3>
                  <div
                    style={{
                      display: "flex",
                      width: "100%",
                      gap: "1rem",
                      margin: "10px 0 0",
                    }}
                  >
                    <Input
                      label="Name"
                      variant="outlined"
                      name="name"
                      onChange={handleInputChange}
                      helperText={errors.name}
                      error={errors.name ? true : false}
                      sx={{
                        width: "100%",
                        backgroundColor: inputFilled.name
                          ? "#e8f0fe"
                          : "transparent",
                        "&.Mui-focused": {
                          backgroundColor: "#e8f0fe",
                        },
                      }}
                      size="medium"
                    />
                    <Input
                      label="Last Name"
                      variant="outlined"
                      name="last name"
                      onChange={handleInputChange}
                      helperText={errors.lastName}
                      error={errors.lastName ? true : false}
                      sx={{
                        width: "100%",
                        backgroundColor: inputFilled.lastName
                          ? "#e8f0fe"
                          : "transparent",
                        "&.Mui-focused": {
                          backgroundColor: "#e8f0fe",
                        },
                      }}
                      size="medium"
                    />
                  </div>
                  <FormControl
                    fullWidth
                    sx={{
                      margin: "20px 0",
                    }}
                  >
                    <InputLabel id="country">Country</InputLabel>
                    <Select
                      variant="outlined"
                      labelId="country"
                      id="country"
                      value={country}
                      label="Country"
                      name="country"
                      onChange={handleCountryChangeInternal}
                      sx={{
                        minHeight: "1.5375em!important",
                        backgroundColor: inputFilled.country
                          ? "#e8f0fe"
                          : "transparent",
                        "&.Mui-focused": {
                          backgroundColor: "#e8f0fe",
                        },
                      }}
                    >
                      <MenuItem value={`Argentina`}>Argentina</MenuItem>
                      <MenuItem value={`Canada`}>Canada</MenuItem>
                      <MenuItem value={`United States`}>United States</MenuItem>
                    </Select>
                  </FormControl>

                  <FormControl fullWidth>
                    {country === "United States" ? (
                      <>
                        <InputLabel id="state">State</InputLabel>
                        <Select
                          variant="outlined"
                          labelId="state"
                          id="state"
                          value={state}
                          label="State"
                          name="state"
                          onChange={handleStateChangeInternal}
                          sx={{
                            backgroundColor: inputFilled.state
                              ? "#e8f0fe"
                              : "transparent",
                            "&.Mui-focused": {
                              backgroundColor: "#e8f0fe",
                            },
                          }}
                        >
                          [<MenuItem value={`Arizona`}>Arizona</MenuItem>
                          <MenuItem value={`Delaware`}>Delaware</MenuItem>
                          <MenuItem value={`Ohio`}>Ohio</MenuItem>]
                        </Select>
                      </>
                    ) : (
                      <Input
                        label="State / Province"
                        variant="outlined"
                        name="state"
                        value={state}
                        onChange={handleStateChangeInternal}
                        helperText={errors.state}
                        error={errors.state ? true : false}
                        sx={{
                          width: "100%",
                          backgroundColor: inputFilled.state
                            ? "#e8f0fe"
                            : "transparent",
                          "&.Mui-focused": {
                            backgroundColor: "#e8f0fe",
                          },
                        }}
                        size="medium"
                      />
                    )}
                  </FormControl>
                  <div
                    style={{
                      display: "flex",
                      width: "100%",
                      gap: "1rem",
                      margin: "24px 0 24px",
                    }}
                  >
                    <Input
                      label="City"
                      variant="outlined"
                      name="ciudad"
                      onChange={handleInputChange}
                      helperText={errors.ciudad}
                      error={errors.ciudad ? true : false}
                      sx={{
                        width: "100%",
                        backgroundColor: inputFilled.ciudad
                          ? "#e8f0fe"
                          : "transparent",
                        "&.Mui-focused": {
                          backgroundColor: "#e8f0fe",
                        },
                      }}
                      size="medium"
                    />
                    <Input
                      label="Zip Code "
                      variant="outlined"
                      name="cp"
                      onChange={handleInputChange}
                      helperText={errors.cp}
                      error={errors.cp ? true : false}
                      sx={{
                        width: "100%",
                        backgroundColor: inputFilled.cp
                          ? "#e8f0fe"
                          : "transparent",
                        "&.Mui-focused": {
                          backgroundColor: "#e8f0fe",
                        },
                      }}
                      size="medium"
                    />
                  </div>
                  <Input
                    label="Address"
                    variant="outlined"
                    name="direccion"
                    onChange={handleInputChange}
                    helperText={errors.direccion}
                    error={errors.direccion ? true : false}
                    sx={{
                      width: "100%",
                      backgroundColor: inputFilled.direccion
                        ? "#e8f0fe"
                        : "transparent",
                      "&.Mui-focused": {
                        backgroundColor: "#e8f0fe",
                      },
                    }}
                    size="medium"
                  />

                  <Input
                    label="Phone (Optional)"
                    variant="outlined"
                    name="phone"
                    onChange={handleInputChange}
                    helperText={errors.phone}
                    error={errors.phone ? true : false}
                    sx={{
                      marginTop: "24px",
                      width: "100%",
                      backgroundColor: inputFilled.phone
                        ? "#e8f0fe"
                        : "transparent",
                      "&.Mui-focused": {
                        backgroundColor: "#e8f0fe",
                      },
                    }}
                    size="medium"
                  />
                </Form>

                <ConfirmStripe windowwidth={windowWidth}>
                  <ConfirmFormCartBtn
                    type="submit"
                    onClick={handleSubmit}
                    windowwidth={windowWidth}
                  >
                    <SpanConfirmBtn isLoading={checkoutLoading}>
                      {checkoutLoading ? (
                        <RingLoader>
                          <p style={{ paddingRight: "10px" }}>Processing...</p>
                          <Ring
                            size={25}
                            lineWeight={5}
                            speed={1}
                            color="black"
                          />
                        </RingLoader>
                      ) : (
                        "pay now"
                      )}
                    </SpanConfirmBtn>
                  </ConfirmFormCartBtn>

                  {isModalOpen && (
                    <Modal
                      open={isModalOpen}
                      onClose={closeModal}
                      sx={{ maxWidth: "1000px", margin: "0 auto" }}
                      aria-labelledby="modal-modal-title"
                      aria-describedby="modal-modal-description"
                    >
                      <Box
                        sx={{
                          ...style,
                          top: windowWidth < 750 ? "50%" : "46%",
                          width:
                            windowWidth < 550
                              ? "100%"
                              : windowWidth < 1100
                              ? "95%"
                              : "110%",
                          height: windowWidth < 750 ? "85%" : "620px",
                          padding: windowWidth < 551 ? "20px" : "62px 25px 0px",
                          overflowX: "hidden",
                        }}
                      >
                        <CloseIconBtn onClick={closeModal} />
                        <Payment shipmentCost={shipmentCost} />
                      </Box>
                    </Modal>
                  )}
                </ConfirmStripe>
              </FormWrapper>
            )}

            {/* CartContainer component */}
            <CartContainer
              shipmentCost={shipmentCost}
              shipCostLoader={shipCostLoader}
              shippingMethod={shippingMethod}
            />
            {/*  */}
          </FormItemsWrapper>
        </FormItemsContainer>
      </Wrapper>
    </>
  );
};
const Wrapper = styled.section`
  width: 100%;
  margin: 0 auto;
`;

const FormItemsContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(12, 1fr);
  height: ${(props) => (props.windowwidth < 851 ? "none" : "100%")};
  width: ${(props) => (props.windowwidth < 851 ? "100%" : "none")};
`;
const FormItemsWrapper = styled.div`
  display: flex;
  justify-content: center;
  grid-column: 1/13;
  height: 100%;
  margin-bottom: 180px;
  @media (max-width: 850px) {
    flex-direction: column-reverse;
    margin-bottom: 0;
  }
`;
const FormWrapper = styled.div`
  height: 100%;
  width: 52%;
  display: flex;
  flex-direction: column;
  margin: 0 auto;
  padding: 150px 40px 0;
  align-items: flex-end;
  @media (max-width: 1050px) {
    padding: 150px 18px 0;
    min-width: 400px;
  }
  @media (max-width: 850px) {
    padding: 0px 4px 80px 4px;
    width: 100%;
    min-width: auto;
    height: auto;
    background-color: rgb(236, 234, 234);
  }
`;
const Form = styled.form`
  display: flex;
  flex-direction: column;
  width: 100%;
  max-width: 500px;
  align-items: ${(props) =>
    props.windowwidth < 1050 ? "flex-start" : "center"};
  margin: ${(props) => (props.windowwidth < 851 ? "0" : "0")};
  padding-top: 70px;
  border-top: 1px solid lightgray;
  @media (max-width: 850px) {
    width: 100%;
    margin: 0px auto;
    padding: 54px 78px 66px;
    max-width: none;
    background-color: white;
  }
  @media (max-width: 650px) {
    padding: 54px 18px 66px;
  }
`;

const Input = styled(TextField)`
  width: 350px;
  padding-top: 12px;
`;

const ContactTitle = styled.h2`
  color: black;
  font-size: clamp(1.2rem, 2vw, 1.5rem);
  font-weight: 600;
  width: 100%;
  @media (max-width: 850px) {
    width: 65%;
  }
`;
const LoginContainer = styled.div`
  width: 100%;
  font-size: 0.8rem;
  padding-right: 5px;
`;
const LogBtn = styled.button`
  border: none;
  background-color: transparent;
  color: blue;
  text-decoration: underline;
  :hover {
    color: #4f4fe7;
  }
  :active {
    color: #bdbdf0;
  }
`;
const LogoutContainer = styled.div`
  width: 100%;
  display: flex;
  -webkit-box-pack: justify;
  justify-content: space-between;
  font-size: 0.8rem;
  padding-right: 5px;
  height: 60px;
  align-items: flex-end;
  border-bottom: 1px solid lightgray;
  padding: 8px 0 8px 4px;
`;

const DeliveryInfoTitle = styled.h2`
  text-align: ${(props) => props.windowwidth < 851 && "center"};
  color: black;
  font-size: clamp(1.2rem, 2vw, 1.5rem);
  margin: 60px 0 0;
  font-weight: 600;
  width: 100%;
`;

const ConfirmStripe = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  max-width: 500px;
  height: 60px;
  padding: 58px 1px 0 1px;
  margin: ${(props) => (props.windowwidth < 851 ? "20px auto" : "0")};
  align-items: ${(props) => (props.windowwidth < 851 ? "center" : "flex-end")};
  @media (max-width: 850px) {
    padding: 0 10px 0;
  }
`;

const ConfirmFormCartBtn = styled.button`
  width: 100%;
  margin: 0 auto;
  padding: 0;
  border: none;
  color: #020202;
  transform: rotate(0deg);
  transform-origin: center;
  font-weight: 500;
  text-decoration: none;
  font-size: 1.3rem;
  cursor: pointer;
  padding-bottom: 2px;
  border-radius: 5px;
  box-shadow: 0 2px 0 #494a4b;
  transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  background-color: rgb(11, 63, 98);
  :active {
    transform: translateY(5px);
    padding: 0;
    outline: 0;
  }
`;
const SpanConfirmBtn = styled.span`
  background: rgb(20, 113, 175);
  display: block;
  padding: 0.5rem 1rem;
  color: white;
  border-radius: 5px;
  font-size: 1rem;
  font-weight: 600;
  border: 2px solid rgb(73, 74, 75);
  text-transform: capitalize;
  :hover {
    transform: ${({ isLoading }) =>
      isLoading ? "none" : "translateY(-1.2px)"};
    box-shadow: ${({ isLoading }) =>
      isLoading ? "none" : "rgba(0, 0, 0, 0.2) 0px 15px 15px"};
  }
`;
const RingLoader = styled.div`
  display: flex;
  -webkit-box-pack: center;
  justify-content: center;
  align-items: center;
`;

const CloseIconBtn = styled(CloseIcon)`
  cursor: pointer;
  font-size: 28px;
  top: 3%;
  left: ${(props) => (props.windowwidth < 750 ? "85%" : "96%")};
  position: absolute;
  z-index: 2;
  @media (max-width: 750px) {
    top: 3%;
    left: 88%;
  }
`;

const style = {
  position: "absolute",
  left: "50%",
  transform: "translate(-50%, -50%)",
  bgcolor: "background.paper",
  border: "none!importat",
  borderRadius: "4px",
  outline: 0,
  boxShadow:
    "0px 11px 15px -7px rgba(0,0,0,0.6), 0px 24px 38px 3px rgba(0,0,0,0.14), 0px 9px 46px 8px rgba(0,0,0,-0.48)!important",
  overflow: "auto",
};
