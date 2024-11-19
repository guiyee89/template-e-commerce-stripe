import styled from "styled-components/macro";
import { ItemCount } from "../../../common/itemCount/ItemCount";
import { FilterDetail } from "../filterDetails/FilterDetail";
import { useState, useContext } from "react";
import { CartContext } from "../../../context/CartContext";
import { ItemImageMobile } from "./ItemImageMobile";
import { Ring } from "@uiball/loaders";
import { GlobalToolsContext } from "../../../context/GlobalToolsContext";
import { Box, Modal } from "@mui/material";
import { SizeGuide } from "../sizeGuide/sizeGuide";
import CloseIcon from "@mui/icons-material/Close";

export const ItemDetailMobile = ({ selectedItem }) => {
  ///////////////////////////////////////////////////////////////////////////////////
  const [filteredItem, setFilteredItem] = useState({}); //Filtered Item from FilterColorSize component
  const { addToCart } = useContext(CartContext); //Function addToCart from Context
  const hasDiscount = "discount" in selectedItem; //Get discounted item
  const { setProgress, setVisible, setScrollDirection } =
    useContext(GlobalToolsContext);
  const [imgSkeletonLoader, setImgSkeletonLoader] = useState(false);
  const [loadingSizeFilter, setLoadingSizeFilter] = useState(false);
  const [counterLoading, setCounterLoading] = useState(false);
  const [sizeGuide, setSizeGuide] = useState(false);

  ///////////////////////////////////////////////////////////////////////////////////
  //On add to cart if selectedItem or filteredItem
  const onAddToCart = (quantity) => {
    let data = {
      ...selectedItem,
      quantity: quantity,
    };
    if (filteredItem && Object.keys(filteredItem).length > 0) {
      data = {
        ...filteredItem,
        quantity: quantity,
      };
    }
    addToCart(data);
    setScrollDirection("up");
  };

  ///////////////////////////////////////////////////////////////////////////////////
  //  handle filtering size & color  //
  const handleFilterItemChange = (item) => {
    if (item === undefined) {
      setFilteredItem(selectedItem);
    } else {
      setFilteredItem(item);
    }
  };

  ///Loader spinner for Size filters change disabling "Add Cart" Button
  const handleSizeLoading = () => {
    setLoadingSizeFilter(true);
    setTimeout(() => {
      setLoadingSizeFilter(false);
    }, 900);
  };

  //Loaders for Color change function with GlobalToolsContext on FilterDetail
  const handleColorLoading = () => {
    //setImgSkeletonLoader(true); //set Skeleton rendering on Mobile
    setVisible(true);
    setProgress(0);
  };

  //Size Modal Handlers
  const handleOpen = (e) => {
    setSizeGuide(true);
  };
  const handleClose = () => {
    setSizeGuide(false);
  };

  ///////////////////////////////////////////////////////////////////////////////////
  /* Render item details based on the existence of selectedItem or filteredItem */
  return (
    <Wrapper>
      {/* Check if either selectedItem or filteredItem exists */}
      {selectedItem?.id || Object.keys(filteredItem).length > 0 ? (
        <>
          {hasDiscount && selectedItem.discount !== null && (
            <Discount>-{selectedItem.discount}%</Discount>
          )}

          <Title>
            {Object.keys(filteredItem).length > 0
              ? filteredItem.title
              : selectedItem.title}
          </Title>

          {/* <SubTitle>
            {Object.keys(filteredItem).length > 0
              ? filteredItem.subtitle
              : selectedItem.subtitle}
          </SubTitle> */}

          <ItemImageMobile
            filteredItem={filteredItem}
            selectedItem={selectedItem}
            imgSkeletonLoader={imgSkeletonLoader}
            setImgSkeletonLoader={setImgSkeletonLoader}
          />
          <InsideWrapper>
            <FilterWrapper>
              <FilterDetail
                selectedItem={selectedItem}
                handleFilterItemChange={handleFilterItemChange}
                handleSizeLoading={handleSizeLoading}
                handleColorLoading={handleColorLoading}
              />
            </FilterWrapper>
            <ReferenceWrapper>
              <SizeImg src="https://res.cloudinary.com/derdim3m6/image/upload/v1724792275/web%20access/samples%20for%20e-commerce/Icons/2024-08-27_11h12_55-removebg-preview_s27dco.png" />
              <SizeReference onClick={handleOpen}>
                Reference Size Model
              </SizeReference>
            </ReferenceWrapper>

            {/* Modal for SizeGuide */}
            {/* Modal for SizeGuide */}
            <Modal open={sizeGuide} onClose={handleClose}>
              <Box
                sx={{
                  maxWidth: 800,
                  margin: "0 auto",
                  padding: "20px",
                  position: "relative",
                  top: "50px",
                  backgroundColor: "white",
                  overflow: "auto",
                }}
              >
                <SizeGuide onClose={handleClose} />
                <CloseIconBtn onClick={handleClose} />
              </Box>
            </Modal>
            <StockPriceWrapper>
              {hasDiscount && selectedItem.discount !== null ? (
                <ItemPriceWrapper>
                  <Price>
                    ${" "}
                    {Object.keys(filteredItem).length > 0
                      ? filteredItem.discountPrice.toFixed(2)
                      : selectedItem.discountPrice.toFixed(2)}
                  </Price>{" "}
                  <DiscountPrice hasDiscount={hasDiscount}>
                    ${" "}
                    {Object.keys(filteredItem).length > 0
                      ? filteredItem.unit_price.toFixed(2)
                      : selectedItem.unit_price.toFixed(2)}
                  </DiscountPrice>
                </ItemPriceWrapper>
              ) : (
                <Price>
                  ${" "}
                  {Object.keys(filteredItem).length > 0
                    ? filteredItem.unit_price.toFixed(2)
                    : selectedItem.unit_price.toFixed(2)}
                </Price>
              )}
              <Stock>
                Available Stock{" "}
                <Num>
                  {Object.keys(filteredItem).length > 0
                    ? filteredItem.stock
                    : selectedItem.stock}
                </Num>
              </Stock>
            </StockPriceWrapper>

            <ItemCountWrapper>
              {loadingSizeFilter ? ( // Render the ClipLoader and disable the ItemCount for 1 second when filtering
                <Loader>
                  <Ring size={32} lineWeight={6} speed={2} color="black" />
                </Loader>
              ) : (
                <ItemCount
                  stock={
                    Object.keys(filteredItem).length > 0
                      ? filteredItem.stock
                      : selectedItem.stock
                  }
                  initial={1}
                  onAddToCart={onAddToCart}
                  disabled={loadingSizeFilter}
                  counterLoading={counterLoading}
                  setCounterLoading={setCounterLoading}
                />
              )}
            </ItemCountWrapper>
            <Description>
              {Object.keys(filteredItem).length > 0
                ? filteredItem.description
                : selectedItem.description}
            </Description>
          </InsideWrapper>
        </>
      ) : (
        <div
          style={{ height: "20vh", display: "flex", alignItems: "flex-end" }}
        >
          <p style={{ fontSize: ".9rem" }}>
            Loading{" "}
            <l-bouncy
              size="25"
              speed="1.75"
              color="black"
              style={{ marginLeft: "10px" }}
            >
              {" "}
            </l-bouncy>
          </p>
        </div>
      )}
    </Wrapper>
  );
};

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  position: relative;
  align-items: center;
  justify-content: center;
  width: 65%;
  min-height: 100%;
  margin-bottom: 30px;
  @media (max-width: 820px) {
    width: 75%;
  }
  @media (max-width: 720px) {
    width: 85%;
  }
  @media (max-width: 650px) {
    width: 100%;
  }
`;
const Discount = styled.h4`
  position: absolute;
  display: flex;
  top: 105px;
  right: 84.6%;
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background-color: rgb(179, 70, 70);
  color: white;
  font-weight: bold;
  font-size: 1.1rem;
  line-height: 2.8;
  z-index: 1;
  cursor: pointer;
  align-items: center;
  justify-content: center;
  @media (max-width: 550px) {
    right: 82.6%;
  }
  @media (max-width: 450px) {
    width: 50px;
    height: 50px;
    font-size: 1rem;
    line-height: 1.2;
  }
`;
const InsideWrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 95%;
  gap: 0.3rem;
  align-items: flex-start;
  padding: 0px 65px 0px 0px;
  @media (max-width: 500px) {
    padding: 0;
  }
`;
const Title = styled.h1`
  font-size: 1.8rem;
  font-weight: bold;
  letter-spacing: -2px;
  text-transform: capitalize;
  padding: 50px 0 16px;
`;

const FilterWrapper = styled.div`
  width: 100%;
  margin: 23px 0 5px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const DiscountPrice = styled.span`
  color: ${(props) => (props.hasDiscount ? "#6c757d;" : "#a83737")};
  font-weight: 600;
  font-size: 1.13rem;
  font-style: italic;
  position: relative;
  &::after {
    content: ${(props) => (props.hasDiscount ? "''" : "none")};
    position: absolute;
    bottom: 50%;
    left: -2%;
    width: 103%;
    border-top: 0.13rem solid rgb(84 81 81);
  }
`;
const Price = styled.span`
  color: #a83737;
  font-weight: 600;
  font-size: 1.4rem;
  font-style: italic;
  position: relative;
`;
const ItemPriceWrapper = styled.h4`
  display: flex;
  align-items: center;
  width: fit-content;
  flex-direction: column-reverse;
  justify-content: space-around;
  justify-content: center;
`;
const StockPriceWrapper = styled.div`
  display: flex;
  align-items: center;
  width: 98%;
  padding: 10px 4px;
  justify-content: flex-start;
`;

const Stock = styled.p`
  font-size: 0.85rem;
  font-style: italic;
  padding-left: 60px;
`;
const Num = styled.span`
  color: #c92b2b;
  font-weight: bold;
  font-size: 1.2rem;
`;
const ItemCountWrapper = styled.div`
  position: relative;
  margin: 0 0;
  margin: 4px 0px 15px;
`;
const Loader = styled.div`
  height: 70px;
  display: flex;
  width: 177px;
  align-content: center;
  justify-content: flex-end;
`;
const Description = styled.p`
  font-size: 0.9rem;
  margin-top: -24px;
  line-height: 1.5;
  padding: 31px 12px 12px 0px;
`;
const ReferenceWrapper = styled.div`
  display: inline-flex;
  align-items: center;
  margin: 15px 0px;
  border-radius: 8px;
  padding: 0px 8px;
  transition: box-shadow 0.2s ease-in, background-color 0.2s ease-in,
    font-weight 0.2s ease-in;
  &:hover {
    box-shadow: rgba(0, 0, 0, 0.18) 0px 0px 20px;
    background-color: rgba(0, 0, 0, 0.06);
    font-weight: 600;
  }
`;
const SizeReference = styled.p`
  text-transform: uppercase;
  text-align: center;
  font-size: 0.8rem;
`;
const SizeImg = styled.img`
  width: 32px;
`;
const CloseIconBtn = styled(CloseIcon)`
  cursor: pointer;
  width: 1.3em !important;
  height: 1.3em !important;
  top: 7px;
  left: 95%;
  position: absolute;
  z-index: 2;
  border: 1px solid grey;
  box-shadow: rgba(0, 0, 0, 2) 0px 0px 3px;
  background-color: white;
  @media (max-width: 750px) {
    width: 1.1em !important;
    height: 1.1em !important;
  }
  @media (max-width: 700px) {
    left: 90%;
  }
`;
