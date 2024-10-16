import { useState, useEffect } from "react";
import Carousel from "react-bootstrap/Carousel";
import styled from "styled-components/macro";
import { GlobalToolsContext } from "../../context/GlobalToolsContext";
import { useContext } from "react";

export const HeroSmall = () => {
  const [index, setIndex] = useState(0);
  const { isOpen } = useContext(GlobalToolsContext);

  // Function to handle the carousel interval
  useEffect(() => {
    const interval = setInterval(() => {
      // Increment the index to move to the next banner
      setIndex((prevIndex) => (prevIndex + 1) % 2);
    }, 55000);

    return () => clearInterval(interval);
  }, []);

  const handleSelect = (selectedIndex) => {
    setIndex(selectedIndex);
  };

  return (
    <Wrapper>
      <WrapperCarousel>
        <Carousel activeIndex={index} interval={null} onSelect={handleSelect}>
          <Carousel.Item>
            <Banner>
              <BannerText isOpen={isOpen}>
                pants, shorts, sweaters, shirts and more...
                <br />
                <Span>up to 25%off</Span>
              </BannerText>
            </Banner>
          </Carousel.Item>
          <Carousel.Item>
            <Banner>
              <BannerText isOpen={isOpen}>
                suscribe to our newsletter and
                <br />
                <Span>get 5%off</Span>
              </BannerText>
            </Banner>
          </Carousel.Item>
        </Carousel>
      </WrapperCarousel>
    </Wrapper>
  );
};
const Wrapper = styled.div`
  margin: 2px auto 50px;
  height: 93px;
  /* background-color: rgba(231, 230, 230, 0.35); */
  background-color: rgba(231, 230, 230, 0.05);
`;
const WrapperCarousel = styled.div`
  margin: 0 auto;
  max-width: 610px;
  background-color: white;
  position: relative;
  display: flex;
  -webkit-box-pack: center;
  justify-content: center;
  z-index: 0;

  .carousel-indicators {
    display: none;
  }

  .carousel.slide {
    width: 100%;
  }
  .carousel-control-prev {
    left: -30px;
    opacity: 0.5;
    width: 25px;
    .carousel-control-prev-icon {
      width: 13px;
      height: 15px;
      background-image: url(https://res.cloudinary.com/derdim3m6/image/upload/v1691421029/web%20access/samples%20for%20e-commerce/2023-08-07_12h08_34_tzeavn.png);
    }
  }
  .carousel-control-next {
    right: -30px;
    opacity: 0.5;
    width: 25px;
    .carousel-control-next-icon {
      width: 13px;
      height: 15px;
      background-image: url(https://res.cloudinary.com/derdim3m6/image/upload/v1691421027/web%20access/samples%20for%20e-commerce/2023-08-07_12h08_16_jmaxho.png);
    }
  }
`;

const Banner = styled.div`
  width: 100%;
  line-height: 1.5;
  padding: 22px 0 16px;
  overflow-x: hidden;
  border-bottom: 1px solid #ededed;
  @media (max-width: 500px) {
    padding: 12px 0 14px;
  }
`;

const BannerText = styled.p`
  text-transform: uppercase;
  font-size: clamp(0.75rem, 1px + 0.78vw, 0.8rem);
  font-weight: 500;
  letter-spacing: 3px;
  word-spacing: 5px;
  text-align: center;
  padding: ${({ isOpen }) => (isOpen ? "0 32px 0 33px" : "0 32px")};
  @media (max-width: 500px) {
    font-size: clamp(0.75rem, 2vw + 1px, 0.8rem);
  }
`;

const Span = styled.span`
  color: red;
  font-size: clamp(1.2rem, 2vw + 1px, 1.2rem);
  font-weight: bold;
`;
