/* import { BsEyeFill } from "react-icons/bs"; */
import styled from "styled-components/macro";
import { useEffect, useState } from "react";
import { ClipLoader } from "react-spinners";
import { Pagination, PaginationItem } from "@mui/material";
import { Link, useParams } from "react-router-dom";
import useScrollRestoration from "../../hooks/useScrollRestoration";
import TuneIcon from "@mui/icons-material/Tune";
import { useContext } from "react";
import { GlobalToolsContext } from "../../context/GlobalToolsContext";
import { Ring } from "@uiball/loaders";
import { useRef } from "react";

export const ItemList = ({
  filteredItems,
  navigate,
  currentPage,
  setCurrentPage,
  itemLoader,
}) => {
  useScrollRestoration();

  //////////////////////////                    ////////////////////////////
  //-------------------        currentPage         ---------------------//

  const { categoryName } = useParams(); //useParams de react-router-dom para filtrar productos por categoryName
  const categoryTitle = categoryName ? categoryName : "All  Categories"; // Rendering conditional title
  const {
    isMenuOpen,
    isFilterOpen,
    toggleFilterMenu,
    windowWidth,
    setProgress,
    setVisible,
    scroll,
  } = useContext(GlobalToolsContext);

  //////////////////////////                    ////////////////////////////
  //-------------------         LOADERS          ---------------------//

  const [loadingDetail, setLoadingDetail] = useState(false);
  const [isLoadingPagination, setIsLoadingPagination] = useState(false);

  // Circle Loader
  const handleLoadDetail = (itemId) => {
    localStorage.setItem("currentPage", currentPage); //save currentPage in localStorage
    setLoadingDetail(itemId);
    setTimeout(() => {
      setLoadingDetail(true);
      // navigate(`/item-details/${itemId}`);
    }, 1500);
  };

  const handleLoadTop = () => {
    setVisible(true);
    setProgress(5); //set Top Loading bar to 5% after clicking on Item
  };

  //Pagination loaders
  const handlePageChange = (value) => {
    setIsLoadingPagination(true);
    setTimeout(() => {
      setIsLoadingPagination(false);
      setCurrentPage(value);
    }, 500);
  };

  //////////////////////////                    ////////////////////////////
  //-------------------         PAGINATION          ---------------------//
  const itemsPerPage = Math.max(
    1,
    windowWidth < 600 ? 12 : windowWidth < 991 ? 16 : 18
  );
  //Render 12 items per page on 991px screen width
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const itemsToDisplay = filteredItems.slice(startIndex, endIndex);
  const totalPages = Math.ceil(filteredItems.length / itemsPerPage);

  //set currentPage to previous page when navigating to ItemDetail
  useEffect(() => {
    const storedPage = localStorage.getItem("currentPage");
    if (storedPage) {
      setCurrentPage(parseInt(storedPage));
    }
    // localStorage.removeItem("currentPage");
  }, []);

  const initialMountRef = useRef(true);

  useEffect(() => {
    if (!initialMountRef.current) {
      window.scrollTo({ top: 150, behavior: "instant" });
    } else {
      initialMountRef.current = false;
    }
  }, [currentPage]);

 //////////////////////////                    ////////////////////////////
 
  const [productsQuantity, setProductsQuantity] = useState();
  const showProductsQuantity = () => {
    setProductsQuantity(filteredItems.length); // Update the state with the number of items
  };

  useEffect(() => {
    // Call the showProductsQuantity function to update the productsQuantity state
    showProductsQuantity();
  }, [filteredItems]);

  //Img Skeleton
  const [imgskeleton, setImgskeleton] = useState(false);

  useEffect(() => {
    setImgskeleton(true);
    setTimeout(() => {
      setImgskeleton(false);
    }, 550);
  }, []);

  ///////////////////////////                  /////////////////////////////
  return (
    <>
      <FilterContainer isMenuOpen={isMenuOpen} isFilterOpen={isFilterOpen}>
        <FilterBtn>
          Filters: <TuneIcon onClick={toggleFilterMenu} />
        </FilterBtn>
        <ItemListTitle style={{ display: windowWidth > "900" && "none" }}>
          {categoryTitle}
        </ItemListTitle>
      </FilterContainer>

      <HeaderContainer>
        <ItemListTitle style={{ display: windowWidth < "901" && "none" }}>
          {categoryTitle}
        </ItemListTitle>
        <PaginationWrapperTop>
          <Pagination
            size={windowWidth < 600 ? "small" : "medium"}
            shape="rounded"
            variant=""
            count={totalPages}
            page={currentPage}
            onChange={(event, value) => {
              handlePageChange(value);
            }}
            renderItem={(item) => <PaginationItem component="div" {...item} />}
          />
          {isLoadingPagination && <ClipLoaderTop color="#194f44" size={25} />}
        </PaginationWrapperTop>
        <ItemsQuantity>{productsQuantity} Products</ItemsQuantity>
      </HeaderContainer>

      {itemLoader && ( //Loader for filters
        <LoaderOverlay
          isFilterOpen={isFilterOpen}
          window={windowWidth}
          scrolled={scroll}
          style={{ top: windowWidth < 900 && "0px" }}
        >
          <Ring size={35} lineWeight={7} speed={1} color="black" />
        </LoaderOverlay>
      )}
      <Wrapper key="cart-wrapper">
        {/* Map products list */}
        {itemsToDisplay.map((product) => {
          const isLoadingDetail = loadingDetail === product.id;
          const hasDiscount = "discount" in product;

          return (
            <ItemWrapper
              key={product.id}
              onClick={(event) => {
                event.preventDefault();
                handleLoadTop();
                handleLoadDetail(product.id);
                setTimeout(() => {
                  navigate(`/item-details/${product.id}`);
                }, 900);
              }}
              imgskeleton="false"
            >
              <Loader>
                {isLoadingDetail && (
                  <Ring size={20} lineWeight={5} speed={1} color="black" />
                )}
              </Loader>
              <ItemCard>
                <ImgWrapperLink>
                  {imgskeleton === true ? (
                    <ClipLoader color="#8f501a" size={30} />
                  ) : (
                    <ItemImg
                      src={product.img[0]}
                      alt={product.title}
                      role="presentation"
                      // srcSet={`${product.img[0]} 300w`}
                      // sizes="(max-width: 600px) 300px, (max-width: 900px) 600px, 900px"
                      // decoding="async"
                      // fetchpriority="high"
                      /* loading="lazy" */
                    />
                  )}
                </ImgWrapperLink>
                {hasDiscount && product.discount !== null && (
                  <Discount>-{product.discount}%</Discount>
                )}

                {/* <ButtonsWrapper>
                  <BtnSeeDetails>
                    <SeeDetails />
                  </BtnSeeDetails>
                </ButtonsWrapper> */}
              </ItemCard>
              <InfoWrapper>
                <ItemTitle>{product.title}</ItemTitle>
                <ItemSubTitle>{product.subtitle}</ItemSubTitle>
                {hasDiscount && product.discount !== null ? (
                  <ItemPriceWrapper hasDiscount={hasDiscount}>
                    {hasDiscount && (
                      <DiscountPrice>
                        ${" "}
                        {typeof product.discountPrice === "number"
                          ? product.discountPrice.toFixed(2)
                          : "N/A"}
                      </DiscountPrice>
                    )}
                    <Price hasDiscount={hasDiscount}>
                      $ {product.unit_price.toFixed(2)}
                    </Price>
                  </ItemPriceWrapper>
                ) : (
                  <Price>$ {product.unit_price.toFixed(2)}</Price>
                )}
              </InfoWrapper>
            </ItemWrapper>
          );
        })}
      </Wrapper>

      {/* Pagination */}
      <PaginationWrapperBottom>
        <PaginationBtn
          size={windowWidth < 600 ? "medium" : "large"}
          shape="rounded"
          variant=""
          count={totalPages} // Set the count to the total number of pages
          page={currentPage}
          onChange={(event, value) => {
            handlePageChange(value);
          }}
          renderItem={(item) => <PaginationItem component="div" {...item} />}
        />
        {isLoadingPagination && <ClipLoaderBottom color="#194f44" size={35} />}
      </PaginationWrapperBottom>
    </>
  );
};

const Wrapper = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  max-width: 1400px;
  padding: 2px 0px 78px;
  margin: 0px 0px 50px 0;
  gap: 1.1rem;
  -webkit-box-pack: center;
  justify-items: center;
  align-items: center;
  background-color: rgb(253 253 253);
  @media (max-width: 1150px) {
    gap: 0.7rem;
  }
  @media (max-width: 990px) {
    grid-template-columns: repeat(2, 1fr);
  }
  @media (max-width: 900px) {
    margin: 0 10px 36px 11px;
  }
  @media (max-width: 500px) {
    grid-template-columns: repeat(1, 1fr);
    gap: 0.4rem;
    row-gap: 1.2rem;
    margin: 0 0 32px;
  }
`;
const LoaderOverlay = styled.div`
  position: fixed;
  top: ${(props) => (props.scrolled === "scrolled" ? "64px" : "90.2px")};
  transition: top
    ${(props) => (props.scrolled === "scrolled" ? "0.16s" : "0.16s")}
    ease-in-out;
  left: 0px;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.2); /* Semi-transparent background */
  display: flex;
  justify-content: ${(props) =>
    props.windowWidth > 500
      ? "center"
      : props.isFilterOpen
      ? "center"
      : "flex-start"};
  align-items: center;
  padding-left: ${(props) =>
    props.windowWidth > 500 ? "0" : props.isFilterOpen ? "0" : "80px"};
  z-index: 2;
`;

const ItemImg = styled.img`
  margin: 0 auto;
  overflow: hidden;
  transition: transform 0.19s ease-in-out 0.08s;
  cursor: pointer;
  mix-blend-mode: darken;
  /* mask-image: linear-gradient(rgb(6, 6, 6), 98.5%, transparent); */
`;

const ImgWrapperLink = styled.div`
  position: relative;
  background-color: rgb(239, 237, 237);
  height: 100%;
  display: flex;
  align-items: center;
  overflow: hidden;
  cursor: pointer;
  /* align-items: flex-start; */
  &:hover ${ItemImg} {
    transform: scale(1.11);
  }
`;

const InfoWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  width: 100%;
  padding: 1px 0px 13px 33px;
  /* background-color: rgb(239 237 237); */
  @media (max-width: 600px) {
    padding: 0px 0px 0px 18px;
  }
`;
const ItemWrapper = styled(Link)`
  text-decoration: none;
  margin-bottom: 10px;
  box-shadow: rgba(0, 0, 0, 0.45) 0px 0px 1px;
  position: relative;
  cursor: pointer;
  min-width: ${(props) => props.imgskeleton && "100%"};
  max-width: 430px;
  height: 100%;
  /* background-color: rgb(239, 237, 237); */
  &:hover {
    ${ItemImg} {
      transform: scale(1.11);
      mix-blend-mode: darken;
    }
    /* ${ButtonsWrapper} {
      opacity: 1;
      transform: translateX(-20px);
      transition: opacity 0.5s ease-in-out, transform 0.3s ease-in-out;
    } */
    /* ${InfoWrapper}, ${ImgWrapperLink} {
      background-color: white;
      transition: background-color ease-in-out 0.4s;
    } */
  }
  @media (max-width: 899px) {
    min-width: ${(props) => props.imgskeleton && "100%"};
  }
  @media (max-width: 550px) {
    min-width: ${(props) => props.imgskeleton && "100%"};
  }
`;
const ItemCard = styled.div`
  color: black;
  background-color: rgb(239 237 237);
  display: flex;
  flex-direction: column;
  aspect-ratio: 1/1;
  align-items: center;
  margin-bottom: 8px;
  justify-content: center;
  /* box-shadow: rgba(0, 0, 0, 0.75) 0px 0px 3px; */
`;

const Loader = styled.div`
  position: absolute;
  top: 90%;
  right: 46.5%;
`;
const ItemTitle = styled.h2`
  font-size: clamp(0.7rem, 2vw + 1px, 0.9rem);
  color: black;
  font-weight: 700;
  word-spacing: 3px;
  text-transform: uppercase;
`;
const ItemSubTitle = styled.h3`
  font-size: clamp(0.7rem, 2vw + 1px, 0.8rem);
  color: black;
  text-transform: capitalize;
`;
const DiscountPrice = styled.span`
  color: #a83737;
  font-weight: 600;
  font-size: clamp(0.8rem, 2vw + 1px, 0.92rem);
  font-style: italic;
  padding: 6px 0;
  position: relative;
  display: inline-block;
  text-align: center;
`;
const Price = styled.span`
  font-weight: 600;
  font-size: clamp(0.8rem, 2vw + 1px, 0.92rem);
  font-style: italic;
  padding: 6px 0 8px 0;
  position: relative;
  color: ${(props) => (props.hasDiscount ? "rgb(149 146 146)" : "#a83737")};
  /* Add the following styles to create the strike-through line if hasDiscount is true */
  &::after {
    content: ${(props) => (props.hasDiscount ? "''" : "none")};
    position: absolute;
    bottom: 52%;
    left: 0;
    width: 102%;
    height: 1px;
    background-color: black;
  }
`;
const ItemPriceWrapper = styled.h4`
  display: flex;
  gap: 0.3rem;
`;
const Discount = styled.h4`
  position: absolute;
  top: 20px;
  left: 8%;
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background-color: #b34646;
  text-align: center;
  color: white;
  font-weight: bold;
  font-size: 1.1rem;
  line-height: 2.8;
  cursor: pointer;
  @media (max-width: 1300px) {
    width: 41px;
    height: 41px;
    font-size: 0.95rem;
  }
  @media (max-width: 600px) {
    top: 4px;
    left: 3%;
    width: 38px;
    height: 38px;
    font-size: 0.8rem;
    line-height: 3.1;
  }
  @media (max-width: 500px) {
    top: 14px;
    left: 5%;
    width: 47px;
    height: 45px;
    font-size: 0.95rem;
    line-height: 3;
  }
`;
const HeaderContainer = styled.div`
  display: flex;
  width: 100%;
  justify-content: center;
  margin-top: 44px;
  margin-bottom: 5px;
  @media (max-width: 900px) {
    width: 100%;
    flex-direction: column-reverse;
    align-items: center;
  }
`;
const FilterContainer = styled.div`
  width: 28%;
  background-color: white;
  margin-top: -45px;
  margin-bottom: 19px;
  @media (max-width: 900px) {
    display: flex;
    width: 100%;
    position: sticky;
    margin: 0px auto 6px 0px;
    top: 56px;
    align-items: center;
    justify-content: space-between;
    z-index: 1;
    transition: z-index 0.3s ease-out;

    &::after {
      content: "";
      position: absolute;
      bottom: 0%;
      left: -18px;
      width: 111%;
      height: 1px;
      background-color: lightgray;
    }
  }
`;

const FilterBtn = styled.div`
  font-weight: 600;
  margin: 10px 0px 10px 0px;
  word-spacing: 7px;
  width: 100%;
  border-right: 1px solid #aeacac;
  font-size: clamp(0.88rem, 2vw + 1px, 1.2rem);
  text-align: center;
  @media (min-width: 901px) {
    display: none;
  }
`;

const ClipLoaderTop = styled(ClipLoader)`
  position: absolute;
  top: -28px;
  @media (max-width: 900px) {
    top: -68px;
  }
`;
const ClipLoaderBottom = styled(ClipLoader)`
  position: absolute;
  top: 106%;
`;
const PaginationWrapperTop = styled.div`
  display: flex;
  width: 33%;
  margin: 1px 10px 21px -8px;
  justify-content: center;
  position: relative;
  @media (max-width: 900px) {
    width: 100%;
    margin: 10px 0 15px -2px;
  }
`;
const PaginationWrapperBottom = styled.div`
  display: flex;
  width: 100%;
  margin: 20px 0 40px;
  bottom: 0;
  position: absolute;
  justify-content: center;
  @media (max-width: 900px) {
    width: 100%;
  }
`;
const PaginationBtn = styled(Pagination)`
  background-color: #d3d3d385;
  .css-1idgk4h-MuiButtonBase-root-MuiPaginationItem-root.Mui-selected {
    background-color: rgba(0, 0, 0, 0.2);
    :hover {
      background-color: rgba(0, 0, 0, 0.3);
    }
  }
  .css-1idgk4h-MuiButtonBase-root-MuiPaginationItem-root:hover {
    background-color: rgba(0, 0, 0, 0.1);
  }
`;
const ItemListTitle = styled.h1`
  width: 34%;
  color: #2b2929;
  text-align: center;
  font-size: clamp(0.8rem, 2vw + 1px, 1.6rem);
  font-weight: bold;
  text-transform: capitalize;
  @media (max-width: 900px) {
    width: 100%;
    margin: auto;
  }
  @media (max-width: 600px) {
    margin: 8px 0px 9px;
  }
`;
const ItemsQuantity = styled.p`
  width: 33%;
  text-align: center;
  font-weight: 600;
  font-size: clamp(0.7rem, 1.7vw + 1px, 0.9rem);
  margin: 6px 0 0 0;
  word-spacing: 5px;
  @media (max-width: 900px) {
    margin: 8px 0px 8px 0px;
  }
`;
// const ButtonsWrapper = styled.div`
//   position: absolute;
//   top: 15px;
//   right: 0;
//   background-color: #873c3c;
//   width: 40px;
//   height: 40px;
//   opacity: 0;
//   transform: translateX(20px);
//   display: ${({ disabled }) => (disabled ? "none" : "block")};
// `;
// const SeeDetails = styled(BsEyeFill)`
//   color: black;
//   width: 60%;
//   height: 50%;
//   cursor: pointer;
//   transition: transform 0.19s ease-in-out 0.03s;
// `;
// const BtnSeeDetails = styled.span`
//   &:active {
//     background-color: #e3e0e0;
//     transition: background-color 0.1s ease-in-out;
//   }
//   background-color: white;
//   width: 100%;
//   height: 100%;
//   display: block;
//   display: flex;
//   align-items: center;
//   justify-content: center;
//   cursor: pointer;
//   &:hover {
//     background-color: #e1e1e1;
//     transition: background-color ease-in-out 0.3s;
//   }
//   &:hover ${SeeDetails} {
//     transform: scale(1.3);
//   }
// `;
