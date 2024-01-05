import { useState, useEffect } from "react";
import Carousel from "react-bootstrap/Carousel";
import styled from "styled-components/macro";

export const HeroSmall = () => {
  const [index, setIndex] = useState(0);

  // Function to handle the carousel interval
  useEffect(() => {
    const interval = setInterval(() => {
      // Increment the index to move to the next banner
      setIndex((prevIndex) => (prevIndex + 1) % 2);
    }, 5000);

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
              <BannerText>
                pants, shorts, sweaters, shirts and more...
                <br />
                <Span>up to 25%off</Span>
              </BannerText>
            </Banner>
          </Carousel.Item>
          <Carousel.Item>
            <Banner>
              <BannerText>
                on the second unit for all our shoes...
                <br />
                <Span>30%off</Span>
              </BannerText>
            </Banner>
          </Carousel.Item>
        </Carousel>
      </WrapperCarousel>
    </Wrapper>
  );
};
const Wrapper = styled.div`
  margin: 0 auto;
  background-color: rgba(231, 230, 230, 0.35);
`;
const WrapperCarousel = styled.div`
  margin: 87px auto 40px;
  max-width: 850px;
  background-color: white;
  position: relative;
  height: 11%;
  display: flex;
  -webkit-box-pack: center;
  justify-content: center;
  z-index: 0;

  .carousel-indicators {
    display: none;
  }

  .carousel.slide {
    width: 100%;
    /* box-shadow: rgba(0, 0, 0, 0.25) 0px 0.9px 4.1px; */
  }
  .carousel-control-prev {
    left: -60px;
    opacity: 1;
    width: 25px;
    .carousel-control-prev-icon {
      width: 14px;
      height: 17px;
      background-image: url(https://res.cloudinary.com/derdim3m6/image/upload/v1691421029/web%20access/samples%20for%20e-commerce/2023-08-07_12h08_34_tzeavn.png);
    }
  }
  .carousel-control-next {
    right: -60px;
    opacity: 1;
    width: 25px;
    .carousel-control-next-icon {
      width: 15px;
      height: 17px;
      background-image: url(https://res.cloudinary.com/derdim3m6/image/upload/v1691421027/web%20access/samples%20for%20e-commerce/2023-08-07_12h08_16_jmaxho.png);
    }
  }
`;

const Banner = styled.div`
  width: 100%;
  line-height: 1.5;
  padding: 27px 0 11px;
  overflow-x: hidden;
  border-bottom: 1px solid #ededed;
`;

const BannerText = styled.p`
  text-transform: uppercase;
  font-size: clamp(0.75rem, 2vw + 1px, 1.2rem);
  font-weight: 500;
  letter-spacing: 3px;
  word-spacing: 5px;
  text-align: center;
  padding: 0 32px;
`;

const Span = styled.span`
  color: red;
  font-size: clamp(1.2rem, 2vw + 1px, 1.4rem);
  font-weight: bold;
`;
