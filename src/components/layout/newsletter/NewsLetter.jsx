import styled from "styled-components/macro";
import { TextField } from "@mui/material";

export const NewsLetter = () => {
  return (
    <>
      <Wrapper>
        <Title>get 5% off </Title>
        <Text>Suscribe to our newsletter to get our exclusive sales</Text>
        <Form >
          <Input
            label="Add your Email"
            variant="outlined"
            name="email"
            // sx={{ marginTop: "24px" }}
          />
          <Button type="submit">Subscribe</Button>
        </Form>
        <Text>Follow us in our social media</Text>
      </Wrapper>
    </>
  );
};
const Wrapper = styled.section`
  height: 350px;
  background-color: black;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: white;
  line-height: 2.5;
`;
const Title = styled.h1`
  font-size: 2rem;
  font-weight: bold;
  text-transform: uppercase;
  color: white;
  letter-spacing: 2px;
`;
const Form = styled.form`
  display: flex;
  gap: 1rem;
  height: 100px;
  align-items: baseline;
  @media (max-width:500px){
    flex-direction: column;
    align-items: center;
    margin: 20px 0;
  }
`;
const Input = styled(TextField)`
  border-radius: 30px;
  width: 280px;
  height: 50px;
  background-color: white;
  z-index: 0;
`;
const Button = styled.button`
  width: 140px;
  height: 45px;
  background-color: rgb(196 129 3);
  border-radius: 30px;
  color: white;
  text-transform: uppercase;
  font-weight: bold;
  border: transparent;
`;
const Text = styled.p`
  letter-spacing: 1px;
  @media (max-width:500px){
    text-align: center;
  }
`;
