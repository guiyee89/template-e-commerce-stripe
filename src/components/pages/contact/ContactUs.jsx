import styled from "styled-components/macro";
import { TextField } from "@mui/material";
import { sendContactEmail } from "../../../firebaseEmailConfig";
import Swal from "sweetalert2";
import { useRef, useState } from "react";

export const ContactUs = () => {
  const nameRef = useRef();
  const phoneRef = useRef();
  const emailRef = useRef();
  const [message, setMessage] = useState("");
  const [isSending, setIsSending] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    setIsSending(true);

    const name = nameRef.current.value;
    const phone = phoneRef.current.value;
    const email = emailRef.current.value;

    try {
      await sendContactEmail(name, email, phone, message);
      console.log("Email sent successfully");

      // Clear the inputs after successful submission
      setTimeout(() => {
        nameRef.current.value = "";
        emailRef.current.value = "";
        phoneRef.current.value = "";
        setMessage("");
      }, 600);

      setTimeout(() => {
        Swal.fire({
          position: "center",
          icon: "success",
          title: "Thanks for your message",
          text: "We will respond right away",
          timer: 3000,
          scrollbarPadding: false,
          confirmButtonColor: "#000000",
          customClass: {
            icon: "custom-swal-icon",
          },
        });
        setIsSending(false);
      }, 500);
    } catch (error) {
      console.error("Error sending email:", error);
    }
  };

  return (
    <div
      style={{
        height: "100%",
        width: "600px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        gap: "2rem",
        margin: "200px 0",
      }}
    >
      <h1
        style={{
          fontSize: "2.5rem",
          fontWeight: "bold",
          paddingBottom: "50px",
        }}
      >
        Contact
      </h1>
      <form
        onSubmit={handleSubmit}
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "2rem",
          width: "100%",
        }}
      >
        <div style={{ display: "flex", gap: "1rem" }}>
          <Input
            style={{ width: "50%" }}
            type="text"
            name="name"
            label="Name"
            variant="outlined"
            inputRef={nameRef}
          />
          <Input
            style={{ width: "50%" }}
            type="text"
            name="phone"
            label="Phone"
            variant="outlined"
            inputRef={phoneRef}
          />
        </div>
        <Input
          style={{ height: "50px" }}
          type="email"
          name="email"
          label="Email"
          variant="outlined"
          inputRef={emailRef}
        />

        <Input
          name="message"
          id="outlined-multiline-static"
          label="Comment"
          multiline
          rows={6}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          sx={{ marginBottom: "18px" }}
          InputLabelProps={{
            style: { fontSize: "14px" },
          }}
        />
        <CheckoutButton type="submit">
          <SpanCheckout>
            {isSending === true ? "Sending..." : "Send"}
          </SpanCheckout>
        </CheckoutButton>
      </form>
    </div>
  );
};

const Input = styled(TextField)`
  .css-1t8l2tu-MuiInputBase-input-MuiOutlinedInput-input {
    padding: 14.5px 5px;
  }
`;
const CheckoutButton = styled.button`
  width: 275px;
  margin: 0 auto;
  padding: 0;
  border: none;
  transform: rotate(0deg);
  transform-origin: center;
  font-weight: 500;
  text-decoration: none;
  font-size: 1.2rem;
  cursor: pointer;
  padding-bottom: 2px;
  border-radius: 5px;
  box-shadow: 0 2px 0 #494a4b;
  transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  background-color: #cf873e;
  :active {
    transform: translateY(5px);
    padding: 0;
    outline: 0;
  }
  @media (max-width: 350px) {
    width: 95%;
  }
`;
const SpanCheckout = styled.span`
  background: #f1f5f8;
  color: black;
  display: block;
  padding: 0.5rem 1rem;
  border-radius: 5px;
  border: 2px solid #494a4b;
  font-family: "Gochi Hand", cursive;
  :hover {
    transform: ${({ isLoading }) =>
      isLoading ? "none" : "translateY(-1.2px)"};
    box-shadow: ${({ isLoading }) =>
      isLoading ? "none" : "rgba(0, 0, 0, 0.2) 0px 15px 15px"};
  }
`;
