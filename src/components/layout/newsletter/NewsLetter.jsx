import styled, { createGlobalStyle } from "styled-components/macro";
import { TextField } from "@mui/material";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import {
  sendSubscribeEmail,
  updateEmailList,
} from "../../../firebaseEmailConfig";
import { useContext } from "react";
import { GlobalToolsContext } from "../../context/GlobalToolsContext";

const SwalAlert = createGlobalStyle`
  .custom-swal-icon {
    margin: 20px auto 0; /* Center the icon */
  }
`;

export const NewsLetter = () => {
  const { windowWidth } = useContext(GlobalToolsContext);
  const [email, setEmail] = useState("");

  useEffect(() => {
    console.log(email);
  }, [email]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (email) {
      setTimeout(() => {
        updateEmailList(email)
          .then(() => {
            setEmail("");
            sendSubscribeEmail(
              email,
              "Thanks for subscribing",
              "Thank you for subscribing to our newsletter! We hope you enjoy our updates."
            )
              .then(() => {
                Swal.fire({
                  position: "center",
                  icon: "success",
                  title: "Thanks for subscribing",
                  text: "Check your email",
                  timer: 2000,
                  scrollbarPadding: false,
                  confirmButtonColor: "#000000",
                  customClass: {
                    icon: "custom-swal-icon",
                  },
                });
              })
              .catch((err) => console.error("Error sending email: ", err));
          })
          .catch((err) => console.error("Error updating email list: ", err));
      }, 300);
    }
  };

  return (
    <>
      <Wrapper>
        <Title>get 5% off </Title>
        <Text style={{ fontSize: windowWidth < 500 && "0.8rem" }}>
          suscribe to our newsletter to get our exclusive sales
        </Text>
        <Form onSubmit={handleSubmit}>
          <Input
            label="Add your Email"
            type="email"
            variant="outlined"
            name="email"
            size="medium"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <Button type="submit" variant="contained" color="primary">
            <SpanButton>subscribe</SpanButton>
          </Button>
          <SwalAlert />
        </Form>
        {/* <Text>Follow us in our social media</Text> */}
      </Wrapper>
    </>
  );
};

const Wrapper = styled.section`
  height: 270px;
  background-color: black;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: white;
  line-height: 2.5;
  @media (max-width: 900px) {
    height: 312px;
  }
`;
const Title = styled.h1`
  font-size: 2rem;
  font-weight: bold;
  text-transform: uppercase;
  color: white;
  letter-spacing: 2px;
`;
const Text = styled.p`
  letter-spacing: 1px;
  line-height: 1.5;
  text-transform: uppercase;
  @media (max-width: 500px) {
    text-align: center;
  }
`;
const Form = styled.form`
  display: flex;
  gap: 1rem;
  height: 100px;
  align-items: center;
  @media (max-width: 500px) {
    flex-direction: column;
    align-items: center;
    margin: 20px 0;
  }
`;
const Input = styled(TextField)`
  border-radius: 4px;
  width: 280px;
  background-color: white;
  z-index: 0;
  :focus-visible {
    height: 17px;
    border-radius: 30px;
  }
`;
const Button = styled.button`
  width: 150px;
  margin: 0 auto;
  padding: 0;
  border: none;
  transform: rotate(0deg);
  transform-origin: center;
  text-decoration: none;
  cursor: pointer;
  padding-bottom: 2px;
  border-radius: 5px;
  box-shadow: 0 2px 0 #494a4b;
  transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  background: #f1f5f8;
  :active {
    transform: translateY(5px);
    padding: 0;
    outline: 0;
  }
  @media (max-width: 350px) {
    width: 95%;
  }
`;
const SpanButton = styled.span`
  background-color: #cf873e;
  color: white;
  height: 52px;
  font-weight: 600;
  font-size: 1.1rem;
  display: block;
  /* padding: 0.5rem 1rem; */
  border-radius: 5px;
  border: 2px solid #494a4b;
  /* font-family: "Gochi Hand", cursive; */
  :hover {
    transform: ${({ isLoading }) =>
      isLoading ? "none" : "translateY(-1.2px)"};
    box-shadow: ${({ isLoading }) =>
      isLoading ? "none" : "rgba(0, 0, 0, 0.2) 0px 15px 15px"};
  }
`;
