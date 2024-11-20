import { useState, useEffect, useContext } from "react";
import Carousel from "react-bootstrap/Carousel";
import styled from "styled-components/macro";
import { GlobalToolsContext } from "../../context/GlobalToolsContext";

export const HeroSmall = () => {
  const [index, setIndex] = useState(0);

  const { isMenuOpen } = useContext(GlobalToolsContext);

  // Function to handle the carousel interval
  useEffect(() => {
    const interval = setInterval(() => {
      // Increment the index to move to the next banner
      setIndex((prevIndex) => (prevIndex + 1) % 3);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const handleSelect = (selectedIndex) => {
    setIndex(selectedIndex);
  };

  return (
    <Wrapper isMenuOpen={isMenuOpen}>
      <WrapperCarousel>
        <Carousel activeIndex={index} interval={null} onSelect={handleSelect}>
          <Carousel.Item>
            <Banner>
              <BannerText>
                <Span>Subscribe</Span> to our newsletter.. get
                {/* <br /> */}
                <Span> 5% off</Span>
              </BannerText>
            </Banner>
          </Carousel.Item>
          <Carousel.Item>
            <Banner>
              <BannerText>
                All discounts... up to
                {/* <br /> */}
                <Span> 25% off</Span>
              </BannerText>
            </Banner>
          </Carousel.Item>
          <Carousel.Item>
            <Banner>
              <BannerText>
                Up to...
                {/* <br /> */}
                <Span> 4 payments with installments</Span>
              </BannerText>
            </Banner>
          </Carousel.Item>
        </Carousel>
      </WrapperCarousel>
    </Wrapper>
  );
};

const Wrapper = styled.div`
  margin: 0px auto;
  position: sticky;
  top: 0;
  background-color: black;
  z-index: 3;
  height: 24px;
`;
const WrapperCarousel = styled.div`
  margin: 0 auto;
  max-width: 700px;
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
    width: 35px;
    .carousel-control-prev-icon {
      width: 20px;
      height: 20px;
      background-image: url(https://res.cloudinary.com/derdim3m6/image/upload/v1730216169/web%20access/samples%20for%20e-commerce/Icons/down-arrow-svgrepo-com_cimwsk.png);
    }
  }
  .carousel-control-next {
    right: -30px;
    width: 35px;
    .carousel-control-next-icon {
      width: 20px;
      height: 20px;
      background-image: url(https://res.cloudinary.com/derdim3m6/image/upload/v1730216007/web%20access/samples%20for%20e-commerce/Icons/down-arrow-svgrepo-com_1_r7ookn.png);
    }
  }
`;
const Banner = styled.div`
  width: 100%;
  line-height: 1.5;
  padding: 6px 0px;
  height: 24px;
  overflow: hidden;
  background: black;
  @media (max-width: 500px) {
    padding: 4px 0 4px;
  }
`;
const BannerText = styled.p`
  color: white;
  text-transform: uppercase;
  font-size: clamp(0.45rem, 1px + 0.78vw, 0.55rem);
  font-weight: 500;
  letter-spacing: 3px;
  word-spacing: 5px;
  text-align: center;
  @media (max-width: 500px) {
    font-size: clamp(0.42rem, 1px + 0.78vw, 0.56rem);
    padding: 0;
  }
`;
const Span = styled.span`
  color: white;
  font-size: clamp(0.7rem, 2vw + 1px, 0.7rem);
  font-weight: bold;
  @media (max-width: 500px) {
    font-size: clamp(0.5rem, 2vw + 0.8px, 0.68rem);
  }
`;

