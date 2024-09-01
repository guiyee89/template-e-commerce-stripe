import styled from "styled-components/macro";
import { ItemCount } from "../../../common/itemCount/ItemCount";
import { FilterDetail } from "../filterDetails/FilterDetail";
import { useState, useContext, useEffect } from "react";
import { CartContext } from "../../../context/CartContext";
import { ItemImageDesktop } from "./ItemImageDesktop";
import { Ring } from "@uiball/loaders";
import { GlobalToolsContext } from "../../../context/GlobalToolsContext";
import { SizeGuide } from "../sizeGuide/sizeGuide";
import { Box, Modal } from "@mui/material";

export const ItemDetailDesktop = ({
  selectedItem,
  loadingColorFilter,
  setLoadingColorFilter,
}) => {
  const [filteredItem, setFilteredItem] = useState({}); //Filtered Item from FilterDetail component
  const { addToCart } = useContext(CartContext);
  const hasDiscount = "discount" in selectedItem;
  const { setProgress, setVisible, setScrollDirection } =
    useContext(GlobalToolsContext);
  const [loadingSizeFilter, setLoadingSizeFilter] = useState(false); //Activate size loader
  const [counterLoading, setCounterLoading] = useState(false);
  const [sizeGuide, setSizeGuide] = useState(false);

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

  //Handle filtering size & color
  const handleFilterItemChange = (item) => {
    if (item === undefined) {
      setFilteredItem(selectedItem || filteredItem);
    } else {
      setFilteredItem(item);
    }
  };

  ///Loader for Size filters change
  const handleSizeLoading = () => {
    setLoadingColorFilter(false); //Disable loaders for images on size filtering
    setLoadingSizeFilter(true);
    setTimeout(() => {
      setLoadingSizeFilter(false);
    }, 900);
  };

  //Loaders for Color change
  const handleColorLoading = () => {
    setLoadingColorFilter(true);
    setVisible(true);
    setProgress(0);
  };

  const handleOpen = (e) => {
    setSizeGuide(true);
  };

  const handleClose = () => {
    setSizeGuide(false);
  };

  
  //Render item details based on the existence of selectedItem or filteredItem
  return (
    <Wrapper>
      {selectedItem?.id || Object.keys(filteredItem).length > 0 ? (
        <>
          <ItemImageDesktop
            filteredItem={filteredItem}
            selectedItem={selectedItem}
            loadingColorFilter={loadingColorFilter} //Enable loaders for images on color filter
          />

          {hasDiscount && selectedItem.discount !== null && (
            <Discount>-{selectedItem.discount}%</Discount>
          )}
          <InsideWrapper>
            <Title>
              {Object.keys(filteredItem).length > 0
                ? filteredItem.title
                : selectedItem.title}
            </Title>

            <SubTitle>
              {Object.keys(filteredItem).length > 0
                ? filteredItem.subtitle
                : selectedItem.subtitle}
            </SubTitle>

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
            <Modal open={sizeGuide} onClose={handleClose}>
              <Box
                sx={{
                  maxWidth: 800,
                  padding: 2,
                  margin: "0 auto",
                  padding: "20px",
                  position: "relative",
                  top: "50px",
                  backgroundColor: "white",
                  overflow: "auto",
                }}
              >
                <SizeGuide onClose={handleClose} />
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
              {loadingSizeFilter ? ( //Render the Loader and disable the ItemCount for 1 second when filtering Sizes
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
        <div></div>
      )}
    </Wrapper>
  );
};

const Wrapper = styled.div`
  display: flex;
  position: relative;
  -webkit-box-align: center;
  align-items: flex-start;
  -webkit-box-pack: center;
  justify-content: flex-end;
  height: 900px;
  width: 100%;
  max-width: 1300px;
  margin: 0 auto;
  padding: 50px 0 0 65px;
`;
const Discount = styled.h4`
  position: absolute;
  display: flex;
  top: 76px;
  right: 79.6%;
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background-color: rgb(179, 70, 70);
  color: white;
  font-weight: bold;
  font-size: 1.1rem;
  line-height: 2.8;
  cursor: pointer;
  align-items: center;
  justify-content: center;
`;
const InsideWrapper = styled.div`
  display: flex;
  flex-direction: column;
  height: 85%;
  width: 450px;
  gap: 1.4rem;
  margin-left: 12px;
  -webkit-box-pack: justify;
  align-items: flex-start;
  justify-content: flex-start;
`;
const Title = styled.h1`
  font-size: 2.4rem;
  font-weight: bold;
  letter-spacing: -2px;
  margin-top: -11px;
  margin-bottom: -32px;
  text-align: center;
  text-transform: capitalize;
`;
const SubTitle = styled.h2`
  font-size: 1.3rem;
  text-align: center;
  text-transform: capitalize;
`;
const FilterWrapper = styled.div`
  width: 95%;
  display: flex;
  align-items: center;
`;
const DiscountPrice = styled.span`
  color: ${(props) => (props.hasDiscount ? "#6c757d;" : "#a83737")};
  font-weight: 600;
  font-size: 1.13rem;
  font-style: italic;
  padding: 6px 0 6px 0;
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
`;
const StockPriceWrapper = styled.div`
  display: flex;
  align-items: center;
  width: 95%;
  padding: 8px 11px;
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
  padding-right: 30px;
`;
const ReferenceWrapper = styled.div`
  display: flex;
  flex-direction: row;
  -webkit-box-align: center;
  align-items: center;
  border-radius: 8px;
  padding: 0px 8px 0 0;
  cursor: pointer;
  &:hover {
    background-color: rgb(228 225 225 / 66%);
    transition: background-color 0.1s ease-in-out;
    font-weight: 500;
  }
`;
const SizeImg = styled.img`
  width: 32px;
`;
const SizeReference = styled.p`
  text-transform: uppercase;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.7rem;
`;
