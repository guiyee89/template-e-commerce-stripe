import styled from "styled-components/macro";
import { useContext, useEffect, useState } from "react";
import { CarouselTablet } from "./carousels/CarouselTablet";
import { CarouselMobile } from "./carousels/CarouselMobile";
import { Link } from "react-router-dom";
import { CarouselDesktop } from "./carousels/CarouselDesktop";
import { Ring } from "@uiball/loaders";
import { GlobalToolsContext } from "../../context/GlobalToolsContext";
/* import { AgregarFullDocs } from "../dashboard-auth/AgregarFullDocs";   */


export const LandingPage = () => {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  }, []);

  const [loading, setLoading] = useState(true);

  const { windowWidth } = useContext(GlobalToolsContext);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 700); // Delay of 1 second (1000 milliseconds)

    return () => {
      clearTimeout(timer);
    };
  }, []);

  return (
    <>
      <Wrapper>
        {loading ? (
          <LoaderWrapper>
            <Ring size={20} lineWeight={7} speed={1} color="black" />
          </LoaderWrapper>
        ) : (
          <Title>¡on sale!</Title>
        )}
        {/* <AgregarFullDocs />  */}  
        <CarouselWrapper>
          {windowWidth >= 900 && <CarouselDesktop />}
          {windowWidth < 900 && windowWidth >= 550 && <CarouselTablet />}
          {windowWidth < 550 && <CarouselMobile />}
        </CarouselWrapper>
        <MiddleArticle>
          <ImgWrapper>
            <LinkImg to="/category/shirts">
              <MiddleItemsImg
                src="https://res.cloudinary.com/derdim3m6/image/upload/v1698184946/web%20access/samples%20for%20e-commerce/Landing%20Page/2023-10-24_18h59_41-min_tcj9fc.png"
                alt=""
              />
              <TextButtonContainer>
                <TextWrapper>
                  <MidImgText>
                    <Arrows>&#8594;</Arrows>
                    Shirts
                    <br />
                    <MidSpan>from</MidSpan>
                    <br />
                    <PriceSpan>$70</PriceSpan>
                  </MidImgText>
                </TextWrapper>
                <FakeButton>Buy</FakeButton>
              </TextButtonContainer>
            </LinkImg>
          </ImgWrapper>
          <ImgWrapper>
            <LinkImg to="/category/pants">
              <MiddleItemsImg
                src="https://res.cloudinary.com/derdim3m6/image/upload/v1698184947/web%20access/samples%20for%20e-commerce/Landing%20Page/2023-10-24_18h57_37-min_nvqbz7.png"
                alt=""
              />
              <TextButtonContainer>
                <TextWrapper>
                  <MidImgText>
                    <Arrows>&#8594;</Arrows>
                    Pants
                    <br />
                    <MidSpan>from</MidSpan>
                    <br />
                    <PriceSpan>$80</PriceSpan>
                  </MidImgText>
                </TextWrapper>
                <FakeButton>Buy</FakeButton>
              </TextButtonContainer>
            </LinkImg>
          </ImgWrapper>
        </MiddleArticle>
        <StrechedArticle>
          <LinkStreched to="/category/shoes">
            <ImgDiv>
              <ShoesImg
                src="https://res.cloudinary.com/derdim3m6/image/upload/v1689771909/web%20access/samples%20for%20e-commerce/Landing%20Page/2023-07-12_16h01_37-removebg-preview_g6ithw.png"
                alt=""
              />
              <ShoesImg
                src="https://res.cloudinary.com/derdim3m6/image/upload/v1689771909/web%20access/samples%20for%20e-commerce/Landing%20Page/2023-07-12_16h01_45-removebg-preview_s2bmvf.png"
                alt=""
              />
            </ImgDiv>
            <TextDiv>
              <TextDiv1>
                <TextTitle>All our Shoes</TextTitle>
                <TextPromo>30% off</TextPromo>
              </TextDiv1>
              <TextDiv2>
                <TextSub>On second unit </TextSub>
                <TextSub2 style={{ whiteSpace: "pre-line" }}>
                  The best for your feet
                  {"\n"}
                  And your pocket
                </TextSub2>
              </TextDiv2>
            </TextDiv>
            <FakeButtonStreched>Buy</FakeButtonStreched>
          </LinkStreched>
        </StrechedArticle>
      </Wrapper>
    </>
  );
};
const Wrapper = styled.section`
  max-width: 1320px;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 8px 20px 0;
  overflow: hidden;
  @media (max-width: 700px) {
    margin-top: 25px;
  }
`;
const LoaderWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 180px;
  margin-left: 35px;
`;
const Title = styled.h1`
  font-size: 2rem;
  text-align: center;
  text-transform: uppercase;
  font-weight: bold;
  color: rgb(99 86 86);
`;
const CarouselWrapper = styled.div`
  display: flex;
  margin: -16px auto 0;
  min-height: 470px;
  @media (max-width: 83.75rem) {
    max-width: 95%;
  }
  @media (max-width: 700px) {
    max-width: 100%;
  }
  @media (max-width: 500px) {
    min-height: 0;
  }
`;
const MiddleArticle = styled.article`
  display: flex;
  justify-content: center;
  justify-content: space-between;
  gap: 1rem;
  @media (max-width: 650px) {
    gap: 0.5rem;
  }
  @media (max-width: 550px) {
    flex-direction: column;
  }
`;
const MiddleItemsImg = styled.img`
  transition: transform 0.29s ease-in-out 0.1s;
  width: 645px;
  height: 100%;
  object-fit: cover;
`;
const ImgWrapper = styled.div`
  cursor: pointer;
  box-shadow: rgba(0, 0, 0, 0.35) 0px 0px 2px;
  overflow: hidden;
  background-color: #e7e3e3;
  transition: background-color 0.4s ease-in-out;
  max-width: 100%;
  height: 700px;
  position: relative;
  &:hover ${MiddleItemsImg} {
    transform: scale(1.11);
  }
  &:hover {
    background-color: #fbfbfb;
  }
  @media (max-width: 650px) {
    height: 470px;
  }
`;
const LinkImg = styled(Link)`
  text-decoration: none;
  color: black;
`;
const TextButtonContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;
const TextWrapper = styled.div`
  position: absolute;
  width: 80%;
  bottom: 200px;
  display: flex;
  right: 10%;
  background-color: rgb(126 4 22 / 62%);
  -webkit-box-pack: center;
  justify-content: center;
  -webkit-box-align: center;
  align-items: center;
  line-height: 1.15;
  letter-spacing: 3px;
  @media (max-width: 900px) {
    bottom: 180px;
  }
  @media (max-width: 650px) {
    bottom: 115px;
  }
`;
const Arrows = styled.span`
  font-size: 2.8rem;
  margin-left: -60px;
  margin-right: 10px;
`;
const MidImgText = styled.h2`
  color: white;
  text-align: center;
  font-size: clamp(1.9rem, 4.4vw + 1rem, 2.5rem);
  font-weight: 600;
  line-height: 0.9;
  text-transform: uppercase;
  margin: 9px 0px 14px;
  font-family: "Playfair Display", serif;
  @media (max-width: 900px) {
    margin: 2px 0px 11px;
  }
`;
const FakeButton = styled.span`
  width: 160px;
  height: 32px;
  top: 74%;
  position: absolute;
  border-radius: 1px;
  background-color: #acabab;
  display: flex;
  justify-content: center;
  -webkit-box-align: center;
  align-items: center;
  font-size: 0.8rem;
  font-weight: 600;
  text-transform: uppercase;
  @media (max-width: 900px) {
    top: 76%;
  }
  @media (max-width: 650px) {
    top: 77%;
  }
`;
const MidSpan = styled.span`
  text-transform: lowercase;
  font-size: 1.2rem;
  line-height: 2;
  font-family: "Playfair Display", serif;
`;
const PriceSpan = styled.span``;
const ShoesImg = styled.img`
  object-fit: contain;
  overflow: hidden;
  transition: transform 0.29s ease-in-out 0.1s;
`;
const ImgDiv = styled.div`
  display: flex;
  grid-column: 1/9;
  grid-row: 1/7;
  @media (max-width: 900px) {
    grid-area: 2 / 1 / 5 / 13;
  }
  @media (max-width: 650px) {
    grid-area: 1 / 1 / 5 / 13;
    margin-bottom: -60px;
  }
  @media (max-width: 500px) {
    grid-area: 2 / 1 / 4 / 13;
    margin-bottom: -50px;
  }
`;
const TextDiv = styled.div`
  display: flex;
  grid-column: 9/13;
  height: 100%;
  grid-row: 3;
  flex-direction: column;
  @media (max-width: 900px) {
    display: grid;
    grid-template-columns: repeat(12, 1fr);
    grid-template-rows: repeat(2, 1fr);
    background-color: rgb(255 255 255 / 45%);
    grid-area: 5 / 1 / auto / 13;
    padding: 21px 0;
  }
  @media (max-width: 470px) {
    padding: 17px 0;
  }
`;
const TextDiv1 = styled.div`
  padding-left: 16px;
  transition: transform 0.29s ease-in-out 0.1s;
  grid-column: 9/13;
  grid-row: 1/5;
  @media (max-width: 900px) {
    grid-area: 3 / 2 / auto / 8;
    letter-spacing: 5px;
    margin-bottom: -10px;
  }
  @media (max-width: 640px) {
    grid-area: 6 / 2 / 3 / 12;
  }
  @media (max-width: 470px) {
    grid-area: 6 / 2 / 3 / 12;
    padding: 0;
  }
`;
const TextDiv2 = styled.div`
  padding-left: 16px;
  grid-column: 9/13;
  grid-row: 3/7;
  @media (max-width: 900px) {
    grid-area: 3 / 8 / 7 / 13;
    letter-spacing: 2px;
    padding-top: 10px;
  }
  @media (max-width: 640px) {
    grid-area: 8 / 7 / auto / 13;
    padding-top: 15px;
  }
  @media (max-width: 470px) {
    grid-area: 8 / 6 / auto / 13;
  }
`;
const FakeButtonStreched = styled.span`
  width: 190px;
  height: 32px;
  bottom: 10.2%;
  right: 12.8%;
  position: absolute;
  border-radius: 1px;
  background-color: rgb(244 240 240);
  background-color: rgb(244, 240, 240); /* Initial background color */
  transition: transform 0.4s ease-in-out 0.1s, background-color 0.4s ease-in-out; /* Removed delay on background-color transition */
  display: flex;
  -webkit-box-pack: center;
  justify-content: center;
  -webkit-box-align: center;
  align-items: center;
  font-weight: 600;
  text-transform: uppercase;
  @media (max-width: 900px) {
    bottom: 4.2%;
    right: 36.8%;
  }
  @media (max-width: 640px) {
    bottom: 15.7%;
    right: 60%;
    font-size: 0.8rem;
    width: 134px;
    background-color: rgb(208, 205, 205);
  }
  @media (max-width: 410px) {
    bottom: 14.7%;
    right: 57.3%;
  }
`;

const StrechedArticle = styled.article`
  cursor: pointer;
  overflow: hidden;
  position: relative;
  width: 100%;
  height: 460px;
  max-width: 1330px;
  background-color: #ddd8d8;
  margin: 95px 0;
  box-shadow: rgba(0, 0, 0, 0.35) 0px 0px 2px;
  &:hover ${ShoesImg} {
    transform: scale(1.08);
  }
  &:hover ${TextDiv1} {
    transform: scale(1.08);
  }
  &:hover ${FakeButtonStreched} {
    transform: scale(1.08);
    background-color: rgb(208, 205, 205);
  }
  @media (max-width: 900px) {
    height: 450px;
    background-color: rgb(208 205 205);
  }
`;
const LinkStreched = styled(Link)`
  text-decoration: none;
  color: black;
  height: 100%;
  display: grid;
  grid-template-columns: repeat(12, 1fr);
  grid-template-rows: repeat(6, 1fr);
  align-items: center;
  justify-content: center;
  transition: background-color 0.4s ease-in-out;
  &:hover {
    background-color: #f7f7f7;
  }
  @media (max-width: 900px) {
    grid-template-columns: repeat(12, 1fr);
    grid-template-rows: repeat(6, 1fr);
  }
`;
const TextTitle = styled.h3`
  font-size: clamp(1.5rem, 1.1vw + 1.3rem, 3.8rem);
  font-family: "Playfair Display", serif;
`;
const TextPromo = styled.h3`
  font-size: clamp(2.9rem, 4vw + 1rem, 5.3rem);
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 5px;
  color: #b60404;
  margin-top: -8px;
`;
const TextSub = styled.h3`
  font-size: clamp(1rem, 1.3vw + 1rem, 1.7rem);
  font-family: "Playfair Display", serif;
  @media (max-width: 900px) {
    margin-top: -5px;
  }
`;
const TextSub2 = styled.p`
  font-size: clamp(0.8rem, 1vw + 0.4rem, 1.15rem);
  font-family: "Playfair Display", serif;
  @media (max-width: 600px) {
    margin-top: 4px;
  }
  @media (max-width: 900px) {
    margin-top: 13px;
  }
`;
