import styled from "styled-components/macro";

export const InfoIcons = () => {
  return (
    <>
      <InfoWrapper>
        <Icon
          value={{ size: "200px" }}
          src="https://res.cloudinary.com/derdim3m6/image/upload/v1690083929/web%20access/samples%20for%20e-commerce/Icons/2023-07-23_00h33_31-removebg-preview_mds0it.png"
        />
        <Info>
          <Title>free shipping</Title>
          <Description>On orders $50+ </Description>
        </Info>
      </InfoWrapper>
      <InfoWrapper>
        {/* <SavingsOutlinedIcon fontSize="large" /> */}
        <Icon2 src="https://res.cloudinary.com/derdim3m6/image/upload/v1690083929/web%20access/samples%20for%20e-commerce/Icons/2023-07-23_00h33_38-removebg-preview_v2z9qf.png" />
        <Info>
          <Title>Up to 40% off</Title>
          <Description>On the Second Unit </Description>
        </Info>
      </InfoWrapper>
      <InfoWrapper>
        {/* <CachedOutlinedIcon fontSize="large" /> */}
        <Icon3 src="https://res.cloudinary.com/derdim3m6/image/upload/v1690083930/web%20access/samples%20for%20e-commerce/Icons/2023-07-23_00h33_42-removebg-preview_tjhayz.png" />
        <Info>
          <Title>¿Change Product?</Title>
          <Description>Free up to 30 days </Description>
        </Info>
      </InfoWrapper>
    </>
  );
};
const InfoWrapper = styled.div`
  display: flex;
  align-items: center;
`;
const Info = styled.div`
  margin-left: 12px;
`;
const Title = styled.h1`
  text-transform: uppercase;
  font-weight: 600;
  font-size: 1rem;
  letter-spacing: 2px;
  line-height: 12px;
  @media (max-width:900px){
    letter-spacing: 1;
    font-size: 0.7rem;
  }
`;
const Description = styled.h2`
  letter-spacing: 1.5px;
  font-size: 0.9rem;
  @media (max-width:900px){
    letter-spacing: 1;
    font-size: 0.7rem;
  }
`;
const Icon = styled.img`
  width: 55px;
  margin-top: -7px;
  margin-right: -3px;
`;
const Icon2 = styled.img`
  margin-top: -10px;
  width: 45px;
`;
const Icon3 = styled.img`
  margin-top: -10px;
  margin-right: -3px;
`;
