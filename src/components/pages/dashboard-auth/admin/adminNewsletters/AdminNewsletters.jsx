import { useState } from "react";
import { useEffect } from "react";
import styled from "styled-components/macro";
import { Ring } from "@uiball/loaders";

export const AdminNewsletters = () => {
  const [isNewsletter, setIsNewsletter] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setIsNewsletter(false);
    }, 700);
  }, []);

  if (isNewsletter) {
    return (
      <Loader>
        <Ring size={40} lineWeight={6} speed={1} color="black" />
      </Loader>
    );
  }

  return (
    <>
      <NewslettersWrapper>
        <p style={{ textAlign: "center", margin: " 125px 245px 0 0" }}>
          En construccion...
        </p>
      </NewslettersWrapper>
    </>
  );
};
const NewslettersWrapper = styled.div`
  grid-column: 2/7;
  margin: 0 10px 0 0;
  overflow-x: auto;
  width: 100%;
  height: 100%;
  box-shadow: rgba(0, 0, 0, 0.45) 2px 0px 6px;
  border-top-right-radius: 10px;
  border-bottom-right-radius: 10px;
  @media (max-width: 1000px) {
    width: 95%;
  }
  @media (max-width: 800px) {
    width: 100%;
  }
`;
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
