import styled from "styled-components/macro";
import { useEffect, useState } from "react";
import { ClipLoader } from "react-spinners";
import { Pagination, PaginationItem } from "@mui/material";
import { Link, useParams } from "react-router-dom";
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
  const { categoryName } = useParams(); //useParams de react-router-dom para filtrar productos por categoryName
  const categoryTitle = categoryName ? categoryName : "All  Categories"; // Rendering conditional title
  const [fadeIn, setFadeIn] = useState(false);
  const {
    isMenuOpen,
    isMobileFilterOpen,
    isDesktopFilterOpen,
    toggleMobileFilterMenu,
    toggleDesktopFilterMenu,
    windowWidth,
    windowHeight,
    setProgress,
    setVisible,
    scrollDirection,
  } = useContext(GlobalToolsContext);

  //////////////////////////                    ////////////////////////////
  //-------------------         LOADERS          ---------------------//

  const [loadingDetail, setLoadingDetail] = useState(false);
  const [isLoadingPagination, setIsLoadingPagination] = useState(false);

  // Circle Loader
  const handleLoadItemDetail = (itemId) => {
    localStorage.setItem("currentPage", currentPage); //save currentPage in localStorage
    setLoadingDetail(itemId);
    setTimeout(() => {
      setLoadingDetail(true);
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
      window.scrollTo({ top: 0, behavior: "instant" });
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

  useEffect(() => {
    setFadeIn(true); // Trigger opacity change on mount
  }, []);

  ///////////////////////////                  /////////////////////////////
  return (
    <>
      <FilterContainer
        isMenuOpen={isMenuOpen}
        isMobileFilterOpen={isMobileFilterOpen}
        scrollDirection={scrollDirection}
      >
        <FilterBtn>
          Filters:{" "}
          <TuneIcon
            sx={{ fontSize: windowWidth > 900 ? "1.4rem" : "1.3rem" }}
            onClick={toggleMobileFilterMenu}
          />
        </FilterBtn>
        <ItemListTitle style={{ display: windowWidth > "900" && "none" }}>
          {categoryTitle}
        </ItemListTitle>
      </FilterContainer>

      <HeaderContainer fadeIn={fadeIn}>
        <ItemListTitle style={{ display: windowWidth < "901" && "none" }}>
          {categoryTitle}
        </ItemListTitle>
        <PaginationWrapperTop>
          <PaginationBtnTop
            size={windowWidth < 600 ? "small" : "medium"}
            shape="rounded"
            variant=""
            count={totalPages} // Set the count to the total number of pages
            page={currentPage}
            onChange={(event, value) => {
              handlePageChange(value);
            }}
            renderItem={(item) => <PaginationItem component="div" {...item} />}
          />
          {isLoadingPagination && <ClipLoaderTop color="#194f44" size={20} />}
        </PaginationWrapperTop>
        <div
          style={{
            display: "flex",
            alignItems: "flex-end",
            gap: "5rem",
            width: "400px",
            justifyContent: windowWidth > 900 ? "flex-end" : "center",
          }}
        >
          <FilterBy onClick={toggleDesktopFilterMenu}>
            {isDesktopFilterOpen ? "Hide Filters" : "Show Filters"} <TuneIcon />
          </FilterBy>
          <ItemsQuantity>{productsQuantity} Products</ItemsQuantity>
        </div>
      </HeaderContainer>

      {itemLoader && ( //Loader for filters
        <FilterLoaderOverlay
          scrollDirection={scrollDirection}
          isMobileFilterOpen={isMobileFilterOpen}
          windowWidth={windowWidth}
          windowHeight={windowHeight}
          style={{ top: windowWidth < 900 && "0px" }}
        >
          <Ring size={35} lineWeight={7} speed={1} color="black" />
        </FilterLoaderOverlay>
      )}
      <ItemListWrapper
        key="item-list-wrapper"
        isDesktopFilterOpen={isDesktopFilterOpen}
        fadeIn={fadeIn}
      >
        {/* Map products list */}
        {itemsToDisplay.map((product) => {
          const isLoadingDetail = loadingDetail === product.id;
          const hasDiscount = "discount" in product;

          return (
            <ItemWrapperLink
              key={product.id}
              rel="noopener noreferrer"
              to={`/item-details/${product.id}`}
              onClick={(event) => {
                event.preventDefault();
                handleLoadTop();
                handleLoadItemDetail(product.id);
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

              <ImgWrapper>
                {imgskeleton === true ? (
                  <ClipLoader color="#8f501a" size={30} />
                ) : (
                  <>
                    <ItemImg
                      src={product.img[0]}
                      alt={product.title}
                      role="presentation"
                    />
                    <ItemImgOverlay
                      src={product.img[1]}
                      alt={product.title}
                      role="presentation"
                    />
                  </>
                )}
              </ImgWrapper>
              {hasDiscount && product.discount !== null && (
                <Discount>-{product.discount}%</Discount>
              )}

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
            </ItemWrapperLink>
          );
        })}
      </ItemListWrapper>

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
        {isLoadingPagination && <ClipLoaderBottom color="#194f44" size={25} />}
      </PaginationWrapperBottom>
    </>
  );
};

const ItemListWrapper = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  width: 100%;
  max-width: ${(props) => (props.isDesktopFilterOpen ? "100%" : "1600px")};
  padding: 0 0 78px;
  margin: 0px 0px 50px 0;
  gap: 1.1rem;
  -webkit-box-pack: center;
  justify-items: center;
  align-items: center;
  background-color: rgb(253 253 253);
  opacity: ${(props) => (props.fadeIn ? 1 : 0)};
  transition: opacity 0.6s ease-in;
  @media (max-width: 1150px) {
    gap: 0.7rem;
    row-gap: 1.3rem;
    padding-left: 6px;
  }
  @media (max-width: 990px) {
    grid-template-columns: repeat(2, 1fr);
  }
  @media (max-width: 900px) {
    padding-left: 0;
  }

  @media (max-width: 500px) {
    grid-template-columns: repeat(1, 1fr);
    gap: 0.4rem;
    row-gap: 1.2rem;
    margin: 0 0 32px;
  }
`;
const FilterLoaderOverlay = styled.div`
  position: fixed;
  top: ${(props) =>
    props.scrollDirection === ""
      ? "111px"
      : props.scrollDirection === "down"
      ? "0px"
      : props.windowHeight === 0
      ? "111px"
      : "81.4px"};
  transition: top
    ${(props) =>
      props.scrollDirection === "down"
        ? "0.08s ease-in"
        : props.scrollDirection === ""
        ? "0.18s ease-out"
        : props.windowHeight === 0
        ? "0"
        : "0.18s ease-out"};
  left: 0px;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.2);
  display: flex;
  justify-content: ${(props) =>
    props.windowWidth > 500
      ? "center"
      : props.isMobileFilterOpen
      ? "center"
      : "flex-start"};
  align-items: center;
  padding-left: ${(props) =>
    props.windowWidth > 500 ? "0" : props.isMobileFilterOpen ? "0" : "80px"};
  z-index: 2;
`;

////////////////////////////////////////////////////////////////////////////
// IMAGENES CUADRADAS

// const ImgWrapper = styled.div`
//   position: relative;
//   background-color: rgb(118 10 10 / 0%);
//   height: 100%;
//   width: 100%;
//   display: flex;
//   align-items: center;
//   justify-content: center;
//   overflow: hidden;
//   cursor: pointer;
// `;
// const ItemImg = styled.img`
//   position: absolute;
//   //top: 0;
//   margin: 0 auto;
//   overflow: hidden;
//   width: 100%;
//   transition: opacity 0.3s ease-in-out;
//   cursor: pointer;
//   mix-blend-mode: darken;
//   opacity: 1;
//   object-fit: cover;

//   ${ImgWrapper}:hover & {
//     opacity: 0;
//   }
// `;

// const ItemImgOverlay = styled.img`
//   position: absolute;
//   //top: 0;
//   width: 100%;
//   height: 100%;
//   opacity: 0;
//   transition: opacity 0.4s ease-in-out;
//   cursor: pointer;
//   mix-blend-mode: darken;
//   object-fit: cover;

//   ${ImgWrapper}:hover & {
//     opacity: 1;
//   }
// `;

// const ItemWrapperLink = styled(Link)`
//   text-decoration: none;
//   margin-bottom: 10px;
//   box-shadow: rgba(0, 0, 0, 0.45) 0px 0px 1px;
//   position: relative;
//   cursor: pointer;
//   min-width: ${(props) => props.imgskeleton && "100%"};
//   max-width: 430px;
//   height: 100%;

//   @media (max-width: 899px) {
//     min-width: ${(props) => props.imgskeleton && "100%"};
//   }
//   @media (max-width: 550px) {
//     min-width: ${(props) => props.imgskeleton && "100%"};
//   }
// `;

////////////////////////////////////////////////////////////////////////////
// IMAGENES RECTANGULARES
const ImgWrapper = styled.div`
  position: relative;
  background-color: rgb(239, 237, 237);
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  cursor: pointer;
  width: 100%;
  aspect-ratio: 4 / 5;
  //max-height: 600px;

  @media (max-width: 899px) {
    aspect-ratio: 3/4; // ¿¿1/1 for smaller height images ??
  }
`;

const ItemImg = styled.img`
  position: absolute;
  width: 100%;
  height: 100%; // Cancelar para Mobile?
  object-fit: cover; //Change to "contain" for CategoryName "shoes" - "bags" o imagenes cuadradas
  transition: opacity 0.3s ease-in-out;
  cursor: pointer;
  opacity: 1;
  mix-blend-mode: darken;

  ${ImgWrapper}:hover & {
    opacity: 0;
  }
`;

const ItemImgOverlay = styled.img`
  position: absolute;
  width: 100%;
  height: 100%;
  object-fit: cover; //Change to "contain" for CategoryName "shoes" - "bags"  o imagenes cuadradas
  opacity: 0;
  transition: opacity 0.4s ease-in-out;
  cursor: pointer;
  mix-blend-mode: darken;

  ${ImgWrapper}:hover & {
    opacity: 1;
  }
`;

const ItemWrapperLink = styled(Link)`
  text-decoration: none;
  margin-bottom: 10px;
  position: relative;
  cursor: pointer;
  min-width: ${(props) => props.imgskeleton && "100%"};
  max-width: 430px;

  @media (max-width: 899px) {
    min-width: ${(props) => props.imgskeleton && "100%"};
  }
  @media (max-width: 550px) {
    min-width: ${(props) => props.imgskeleton && "100%"};
  }
`;
////////////////////////////////////////////////////////////////////////////

const InfoWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  width: 100%;
  padding: 14px 0px 12px 32px;
  @media (max-width: 600px) {
    padding: 12px 0px 0px 18px;
  }
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
  justify-content: space-between;
  margin-top: 40px;
  margin-bottom: 20px;
  opacity: ${(props) => (props.fadeIn ? 1 : 0)};
  transition: opacity 0.3s ease-in;
  gap: 1rem;
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
    top: ${(props) => (props.scrollDirection === "down" ? "24px" : "84px")};
    transition: top
      ${(props) =>
        props.scrollDirection === "up" ? "0.15s ease-in" : "0.21s ease-out"};
    
    z-index: 1;
    align-items: center;
    justify-content: space-between;

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
  font-size: clamp(0.82rem, 2vw + 1px, 1.2rem);
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
  @media (min-width: 900px) {
    display: none;
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
const PaginationBtnTop = styled(Pagination)`
  .css-1idgk4h-MuiButtonBase-root-MuiPaginationItem-root.Mui-selected {
    background-color: rgba(0, 0, 0, 0.4);
    :hover {
      background-color: rgba(0, 0, 0, 0.3);
    }
  }
  .css-1idgk4h-MuiButtonBase-root-MuiPaginationItem-root:hover {
    background-color: rgba(0, 0, 0, 0.1);
  }
`;
const PaginationBtn = styled(Pagination)`
  background-color: #d3d3d385;
  .css-1idgk4h-MuiButtonBase-root-MuiPaginationItem-root.Mui-selected {
    background-color: rgba(0, 0, 0, 0.4);
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
  padding-left: 8px;
  font-size: clamp(0.78rem, 2vw + 1px, 1.2rem);
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
const FilterBy = styled.button`
  background-color: transparent;
  border: 0;
  font-weight: 500;
  font-size: 0.85rem;
  word-spacing: 5px;
  letter-spacing: 1px;
  cursor: pointer;
  @media (max-width: 900px) {
    display: none;
  }
`;
const ItemsQuantity = styled.p`
  margin-right: 34px;
  text-align: center;
  font-weight: 500;
  font-size: clamp(0.7rem, 1.7vw + 1px, 0.9rem);
  word-spacing: 5px;
  @media (max-width: 900px) {
    margin: 8px 0px 8px 0px;
  }
`;
