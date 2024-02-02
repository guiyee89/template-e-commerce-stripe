import styled from "styled-components/macro";
import { ItemCount } from "../../../common/itemCount/ItemCount";
import { FilterDetail } from "../filterDetails/FilterDetail";
import { useState, useContext, useEffect } from "react";
import { CartContext } from "../../../context/CartContext";
import { ItemImageDesktop } from "./ItemImageDesktop";
import { Ring } from "@uiball/loaders";
import { GlobalToolsContext } from "../../../context/GlobalToolsContext";

export const ItemDetailDesktop = ({
  selectedItem,
  loadingColorFilter,
  setLoadingColorFilter,
}) => {
  const [filteredItem, setFilteredItem] = useState({}); //Filtered Item from FilterDetail component
  const { addToCart } = useContext(CartContext);
  const hasDiscount = "discount" in selectedItem;
  const { setProgress, setVisible } = useContext(GlobalToolsContext);
  const [loadingSizeFilter, setLoadingSizeFilter] = useState(false); //Activate size loader

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
    /* setFilteredItem({}); */ //Reset the filteredItem state after adding to cart
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
                onFilterItemChange={handleFilterItemChange}
                handleSizeLoading={handleSizeLoading}
                handleColorLoading={handleColorLoading}
              />
            </FilterWrapper>

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
                />
              )}
            </ItemCountWrapper>

            <Description>
              {Object.keys(filteredItem).length > 0
                ? filteredItem.description
                : selectedItem.description}
            </Description>

            <ReferenceWrapper>
              <SizeReference>Reference Size Model</SizeReference>
            </ReferenceWrapper>
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
  padding-left: 65px;
`;
const Discount = styled.h4`
  position: absolute;
  display: flex;
  top: 10px;
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
`;
const SubTitle = styled.h2`
  font-size: 1.3rem;
  text-align: center;
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
  padding: 6px 0 8px 0;
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
  flex-direction: column;
`;
const SizeReference = styled.p`
  text-transform: uppercase;
`;
