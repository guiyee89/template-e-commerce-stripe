import { useEffect, useState } from "react";
import Carousel from "react-bootstrap/Carousel";
import styled from "styled-components/macro";
import { Link, useNavigate } from "react-router-dom";
import { Ring } from "@uiball/loaders";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../../../firebaseConfig";
import { useContext } from "react";
import { GlobalToolsContext } from "../../../context/GlobalToolsContext";

export const CarouselMobile = () => {
  const [discountProducts, setDiscountedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingDetail, setLoadingDetail] = useState(false); 
  const { setVisible, setProgress, setPageLoading } =
    useContext(GlobalToolsContext);
  const navigate = useNavigate();

  useEffect(() => {
    setPageLoading(true);
    const fetchDiscountedProducts = async () => {
      try {
        const queryAllProducts = collection(db, "products");
        const querySnapshot = await getDocs(queryAllProducts);
        console.log("fetching discount");

        const filteredDiscountProducts = [];
        const filteredProductsMap = new Map();

        for (const doc of querySnapshot.docs) {
          const product = doc.data();
          if (product.discount) {
            const { productId, color } = product;
            const key = `${productId}-${color}`;

            // Check if the product's productId and color combination already exists in the filteredProductsMap
            if (!filteredProductsMap.has(key)) {
              // If not, add the product to the filteredProductsMap
              filteredProductsMap.set(key, product);
              filteredDiscountProducts.push({ ...product, id: doc.id });
            }
            // Stop adding items to the filteredDiscountProducts once you reach 12
            if (filteredDiscountProducts.length === 12) {
              break;
            }
          }
        }

        setDiscountedProducts(filteredDiscountProducts);
        setLoading(false);

      } catch (error) {
        console.error("Error fetching discounted products:", error);
      }
    };
    fetchDiscountedProducts();
  }, []);

  if (!discountProducts || !Array.isArray(discountProducts)) {
    // Handle the case where discountProducts is not defined or not an array
    return <div>No products available.</div>;
  }

  const handleLoadDetail = (itemId) => {
    setLoadingDetail(itemId);
    setTimeout(() => {
      setLoadingDetail(null); 
    }, 1500);
  };

  const handleLoadTop = () => {
    setVisible(true);
    setProgress(5); // Set Top Loading bar to 5% after clicking on Item
  };

  const [index, setIndex] = useState(0);

  const handleSelect = (selectedIndex) => {
    setIndex(selectedIndex);
  };

  return (
    <Wrapper>
      {loading ? (
        <LoaderWrapper>
          <Ring size={40} lineWeight={7} speed={1} color="black" />
        </LoaderWrapper>
      ) : (
        <StyledCarousel
          activeIndex={index}
          onSelect={handleSelect}
          interval={55200}
        >
          <CarouselItem>
            <CarouselInner>
              {discountProducts.slice(0, 2).map((product) => {
                const isLoadingDetail = loadingDetail === product.id;
                return (
                  <ItemWrapper key={product.id}>
                    {isLoadingDetail && (
                      <Loader>
                        <Ring size={20} lineWeight={5} speed={1} color="black" />
                      </Loader>
                    )}
                    <LinkWrapper
                      onClick={(event) => {
                        event.preventDefault(); 
                        handleLoadTop();
                        handleLoadDetail(product.id);
                        setTimeout(() => {
                          navigate(`/item-details/${product.id}`);
                        }, 900);
                      }}
                    >
                      <ItemCard>
                        <CarouselImg
                          className="d-block w-100"
                          src={product.img[0]}
                          alt={product.title}
                        />
                        <Discount>-{product.discount}%</Discount>
                        <InfoWrapper>
                          <ItemTitle>{product.title}</ItemTitle>
                          <ItemSubTitle>{product.subtitle}</ItemSubTitle>
                          <CarouselItemPrice
                            hasDiscount={"discount" in product}
                          >
                            <DiscountPrice>
                              $ {product.discountPrice.toFixed(2)}
                            </DiscountPrice>{" "}
                            $ {product.unit_price.toFixed(2)}
                          </CarouselItemPrice>
                        </InfoWrapper>
                      </ItemCard>
                    </LinkWrapper>
                  </ItemWrapper>
                );
              })}
            </CarouselInner>
          </CarouselItem>
          <CarouselItem>
            <CarouselInner>
              {discountProducts.slice(2, 4).map((product) => {
                const isLoadingDetail = loadingDetail === product.id;
                return (
                  <ItemWrapper key={product.id}>
                    {isLoadingDetail && (
                      <Loader>
                        <Ring size={20} lineWeight={5} speed={1} color="black" />
                      </Loader>
                    )}
                    <LinkWrapper
                      onClick={(event) => {
                        event.preventDefault();
                        handleLoadTop();
                        handleLoadDetail(product.id);
                        setTimeout(() => {
                          navigate(`/item-details/${product.id}`);
                        }, 900);
                      }}
                    >
                      <ItemCard>
                        <CarouselImg
                          className="d-block w-100"
                          src={product.img[0]}
                          alt={product.title}
                        />
                        <Discount>-{product.discount}%</Discount>
                        <InfoWrapper>
                          <ItemTitle>{product.title}</ItemTitle>
                          <ItemSubTitle>{product.subtitle}</ItemSubTitle>
                          <CarouselItemPrice
                            hasDiscount={"discount" in product}
                          >
                            <DiscountPrice>
                              $ {product.discountPrice.toFixed(2)}
                            </DiscountPrice>{" "}
                            $ {product.unit_price.toFixed(2)}
                          </CarouselItemPrice>
                        </InfoWrapper>
                      </ItemCard>
                    </LinkWrapper>
                  </ItemWrapper>
                );
              })}
            </CarouselInner>
          </CarouselItem>
          <CarouselItem>
            <CarouselInner>
              {discountProducts.slice(4, 6).map((product) => {
                const isLoadingDetail = loadingDetail === product.id;
                return (
                  <ItemWrapper key={product.id}>
                    {isLoadingDetail && (
                      <Loader>
                        <Ring size={20} lineWeight={5} speed={1} color="black" />
                      </Loader>
                    )}
                    <LinkWrapper
                      onClick={(event) => {
                        event.preventDefault(); 
                        handleLoadTop();
                        handleLoadDetail(product.id);
                        setTimeout(() => {
                          navigate(`/item-details/${product.id}`);
                        }, 900);
                      }}
                    >
                      <ItemCard>
                        <CarouselImg
                          className="d-block w-100"
                          src={product.img[0]}
                          alt={product.title}
                        />
                        <Discount>-{product.discount}%</Discount>
                        <InfoWrapper>
                          <ItemTitle>{product.title}</ItemTitle>
                          <ItemSubTitle>{product.subtitle}</ItemSubTitle>
                          <CarouselItemPrice
                            hasDiscount={"discount" in product}
                          >
                            <DiscountPrice>
                              $ {product.discountPrice.toFixed(2)}
                            </DiscountPrice>{" "}
                            $ {product.unit_price.toFixed(2)}
                          </CarouselItemPrice>
                        </InfoWrapper>
                      </ItemCard>
                    </LinkWrapper>
                  </ItemWrapper>
                );
              })}
            </CarouselInner>
          </CarouselItem>
          <CarouselItem>
            <CarouselInner>
              {discountProducts.slice(6, 8).map((product) => {
                const isLoadingDetail = loadingDetail === product.id;
                return (
                  <ItemWrapper key={product.id}>
                    {isLoadingDetail && (
                      <Loader>
                        <Ring size={20} lineWeight={5} speed={1} color="black" />
                      </Loader>
                    )}
                    <LinkWrapper
                      onClick={(event) => {
                        event.preventDefault();
                        handleLoadTop();
                        handleLoadDetail(product.id);
                        setTimeout(() => {
                          navigate(`/item-details/${product.id}`);
                        }, 900);
                      }}
                    >
                      <ItemCard>
                        <CarouselImg
                          className="d-block w-100"
                          src={product.img[0]}
                          alt={product.title}
                        />
                        <Discount>-{product.discount}%</Discount>
                        <InfoWrapper>
                          <ItemTitle>{product.title}</ItemTitle>
                          <ItemSubTitle>{product.subtitle}</ItemSubTitle>
                          <CarouselItemPrice
                            hasDiscount={"discount" in product}
                          >
                            <DiscountPrice>
                              $ {product.discountPrice.toFixed(2)}
                            </DiscountPrice>{" "}
                            $ {product.unit_price.toFixed(2)}
                          </CarouselItemPrice>
                        </InfoWrapper>
                      </ItemCard>
                    </LinkWrapper>
                  </ItemWrapper>
                );
              })}
            </CarouselInner>
          </CarouselItem>
        </StyledCarousel>
      )}
    </Wrapper>
  );
};

const Wrapper = styled.div`
  margin: 24px auto 110px;
  z-index: 0;
  max-height: 520px;
  /* width: 636.4px; */
  width: 100%;
  @media (max-width: 800px) {
    margin: 24px auto 80px;
  }
`;
const LoaderWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 435px;
  max-height: 450px;
`;
const StyledCarousel = styled(Carousel)`
  max-width: 1308px;
  /* height: 435px; */
  position: relative;
  .carousel-slide {
    min-height: 300px;
    max-height: 520px;
    @media (max-width: 48rem) {
      height: 320px;
      min-height: 200px;
    }
  }
  .carousel-control-next-icon,
  .carousel-control-prev-icon {
    width: 2.5rem;
    height: 2.5rem;
    border-radius: 50%;
    background-color: rgba(0, 0, 0, 0.85);
  }
  .carousel-control-next {
    width: 6.5%;
    left: 95.2%;
    bottom: 20%;
    @media screen and (max-width: 600px) {
      display: none;
    }
  }
  .carousel-control-prev {
    width: 6.5%;
    left: -0.7%;
    bottom: 20%;
    @media screen and (max-width: 600px) {
      display: none;
    }
  }
  .carousel-indicators [data-bs-target] {
    margin: 4px 6px 14px;
    border-radius: 50%;
    width: 6px;
    height: 6px;
    background-color: #000000;
  }
  .carousel-indicators {
    bottom: -58px;
  }
  .carousel-inner {
    overflow: hidden;
    transition: transform 0.8s cubic-bezier(0.55, 0.09, 0.68, 0.53);
  }
`;
const CarouselItem = styled(Carousel.Item)`
  .carousel-item {
    position: relative;
    display: none;
    float: left;
    width: 100%;
    margin-right: -100%;
    -webkit-backface-visibility: hidden;
    backface-visibility: hidden;
    transition: 0.6s ease-in-out;
  }
`;
const CarouselImg = styled.img`
  margin: 0 auto;
  overflow: hidden;
  object-fit: cover;
  cursor: pointer;
  mix-blend-mode: darken;

  @media (max-width: 68.75rem) {
    height: 85%;
  }
`;
const CarouselInner = styled.div`
  max-width: 100%;
  display: flex;
  gap: 0.4rem;
  @media (max-width: 540px) {
    min-height: 80%;
  }
  @media (max-width: 440px) {
    min-height: 310px;
  }
`;
const ItemWrapper = styled.div`
  //esto ajusta el responsivnes junto con 100% del itemCard
  max-height: 440px;
  max-width: 315px;
  width: 100%;
  min-width: 135px;
  padding-top: 1.5px;
  padding-bottom: 5px;
  position: relative;
  @media (max-width: 600px) {
    max-height: 380px;
  }
  @media (max-width: 500px) {
    max-height: 320px;
  }
`;
const LinkWrapper = styled(Link)`
  text-decoration: none;
`;
const ItemCard = styled.div`
  color: black;
  background-color: rgb(239 237 237);
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;
  align-items: center;
  margin-bottom: 8px;
  justify-content: center;
  position: relative;
  box-shadow: rgba(0, 0, 0, 0.55) 0px 0px 2px;
`;
const InfoWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-end;
  width: 100%;
  height: 140px;
  margin-top: -22px;
  background-color: rgb(239 237 237);
`;
const CarouselItemPrice = styled.h4`
  color: ${(props) => (props.hasDiscount ? "rgb(149 146 146)" : "#a83737")};
  font-weight: 600;
  font-size: 0.8rem;
  font-style: italic;
  padding: 6px 0 8px 0;
  position: relative;
  /* Add the following styles to create the strike-through line if hasDiscount is true */
  &::before {
    content: ${(props) => (props.hasDiscount ? "''" : "none")};
    position: absolute;
    bottom: 51%;
    width: 46%;
    left: 56%;
    border-top: 1px solid rgb(75, 73, 73);
  }
`;
const DiscountPrice = styled.span`
  color: #a83737;
  font-weight: 600;
  font-size: 0.85rem;
  font-style: italic;
  padding: 6px 0 8px 0;
  position: relative;
`;
const Discount = styled.h4`
  position: absolute;
  top: 3px;
  left: 3%;
  width: 38px;
  height: 38px;
  border-radius: 50%;
  background-color: rgb(179, 70, 70);
  text-align: center;
  color: white;
  font-weight: bold;
  font-size: 0.75rem;
  line-height: 3.1;
  cursor: pointer;
`;
const ItemTitle = styled.h2`
  font-size: 0.8rem;
  color: black;
  font-weight: 700;
  word-spacing: 3px;
  text-transform: uppercase;
`;
const ItemSubTitle = styled.h3`
  font-size: 0.7rem;
  text-transform: capitalize;
`;
const Loader = styled.div`
  position: absolute;
  top: 88%;
  right: 46.5%;
  z-index: 1;
`;
