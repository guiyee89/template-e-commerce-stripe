import { useState, useEffect } from "react";
import Carousel from "react-bootstrap/Carousel";
import styled from "styled-components/macro";

export const HeroSmall = () => {
  const [index, setIndex] = useState(0);

  // Function to handle the carousel interval
  useEffect(() => {
    const interval = setInterval(() => {
      // Increment the index to move to the next banner
      setIndex((prevIndex) => (prevIndex + 1) % 3);
    }, 553000);

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
    font-size: clamp(0.64rem, 2vw + 1px, 0.68rem);
  }
`;

// const Wrapper = styled.div`
//   margin: 20px auto 50px;
//   /* background-color: rgba(231, 230, 230, 0.35); */
//   background-color: rgba(231, 230, 230, 0.05);
// `;
// const WrapperCarousel = styled.div`
//   margin: 0 auto;
//   max-width: 610px;
//   background-color: white;
//   position: relative;
//   display: flex;
//   -webkit-box-pack: center;
//   justify-content: center;
//   z-index: 0;

//   .carousel-indicators {
//     display: none;
//   }

//   .carousel.slide {
//     width: 100%;
//   }
//   .carousel-control-prev {
//     left: -30px;
//     opacity: 0.5;
//     width: 25px;
//     .carousel-control-prev-icon {
//       width: 13px;
//       height: 15px;
//       background-image: url(https://res.cloudinary.com/derdim3m6/image/upload/v1691421029/web%20access/samples%20for%20e-commerce/2023-08-07_12h08_34_tzeavn.png);
//     }
//   }
//   .carousel-control-next {
//     right: -30px;
//     opacity: 0.5;
//     width: 25px;
//     .carousel-control-next-icon {
//       width: 13px;
//       height: 15px;
//       background-image: url(https://res.cloudinary.com/derdim3m6/image/upload/v1691421027/web%20access/samples%20for%20e-commerce/2023-08-07_12h08_16_jmaxho.png);
//     }
//   }
// `;

// const Banner = styled.div`
//   width: 100%;
//   line-height: 1.5;
//   padding: 22px 0 16px;
//   overflow-x: hidden;
//   border-bottom: 1px solid #ededed;
//   @media (max-width: 500px) {
//     padding: 12px 0 14px;
//   }
// `;

// const BannerText = styled.p`
//   text-transform: uppercase;
//   font-size: clamp(0.6rem, 1px + 0.78vw, 0.7rem);
//   font-weight: 500;
//   letter-spacing: 3px;
//   word-spacing: 5px;
//   text-align: center;
//   padding: ${({ isOpen }) => (isOpen ? "0 32px 0 33px" : "0 32px")};
//   @media (max-width: 500px) {
//     font-size: clamp(0.75rem, 2vw + 1px, 0.8rem);
//   }
// `;

// const Span = styled.span`
//   color: red;
//   font-size: clamp(1rem, 2vw + 1px, 1rem);
//   font-weight: bold;
// `;
