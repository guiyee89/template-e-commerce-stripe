import { useState } from "react";
import { useCount } from "../../hooks/useCount";
import styled from "styled-components/macro";
import { Ring } from "@uiball/loaders";
import { useContext } from "react";
import { GlobalToolsContext } from "../../context/GlobalToolsContext";
import { useEffect } from "react";

export const ItemCount = ({
  initial = 1,
  stock,
  onAddToCart,
  counterLoading,
  setCounterLoading,
  onCountChange,
}) => {
  const { count, increment, decrement, reset } = useCount(initial, stock);
  const [isLoading, setIsLoading] = useState(false);
  const { visible } = useContext(GlobalToolsContext);

  useEffect(() => {
    if (visible) {
      setTimeout(() => {
        reset();
      }, 1300);
    }
  }, [visible]);

  useEffect(() => {
    if (onCountChange) {
      onCountChange(count);
    }
  }, [count, onCountChange]);

  const handleIncrement = () => {
    setCounterLoading(true);
    increment();
    setTimeout(() => {
      setCounterLoading(false);
    }, 450);
  };

  const handleDecrement = () => {
    setCounterLoading(true);
    decrement();
    setTimeout(() => {
      setCounterLoading(false);
    }, 450);
  };

  return (
    <Wrapper>
      <CountButton onClick={handleDecrement} disabled={count === 1}>
        -
      </CountButton>
      {counterLoading ? (
        <CounterLoader>
          <Ring size={16} lineWeight={5} speed={1} color="black" />
        </CounterLoader>
      ) : (
        <CountNumber>{count}</CountNumber>
      )}
      <CountButton onClick={handleIncrement} disabled={count >= stock}>
        +
      </CountButton>
      <AddCartBtn
        onClick={() => {
          onAddToCart(count);
          setTimeout(() => {
            setIsLoading(false);
          }, 1500);
          setIsLoading(true);
        }}
        disabled={stock === 0 || count > stock || isLoading}
      >
        {isLoading ? (
          <AddLoader>
            <Ring size={25} lineWeight={5} speed={1} color="black" />
          </AddLoader>
        ) : (
          <SpanAddCart>Add to Cart</SpanAddCart>
        )}
      </AddCartBtn>
    </Wrapper>
  );
};
const Wrapper = styled.div`
  display: flex;
  gap: 1.2rem;
  align-items: flex-start;
  height: 70px;
  @media (max-width: 950px) {
    justify-content: center;
  }
`;

const CountButton = styled.button`
  width: 35px;
  height: 35px;
  border-radius: 50%;
  font-size: 1.5rem;
  font-weight: bold;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  &:hover {
    background-color: gray;
    transition: ease-in-out 0.2s;
  }
`;

const AddCartBtn = styled.button`
  width: 160px;
  margin: 0 auto;
  padding: 0;
  border: none;
  transform: rotate(0deg);
  transform-origin: center;
  height: 42px;
  font-weight: 500;
  text-decoration: none;
  font-size: 1.1rem;
  cursor: pointer;
  padding-bottom: 2px;
  border-radius: 5px;
  box-shadow: 0 2px 0 #494a4b;
  transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  background-color: #cf873e;
  :active {
    transform: translateY(5px);
    padding-bottom: 0px;
    outline: 0;
  }
`;
const SpanAddCart = styled.span`
  background: #f1f5f8;
  display: block;
  padding: 0.3rem 1rem;
  border-radius: 5px;
  border: 2px solid #494a4b;
  font-family: "Gochi Hand", cursive;
  :hover {
    transform: ${({ isLoading }) =>
      isLoading ? "none" : "translateY(-1.2px)"};
    box-shadow: ${({ isLoading }) =>
      isLoading ? "none" : "rgba(0, 0, 0, 0.2) 0px 15px 15px"};
  }
`;
const CounterLoader = styled.div`
  display: flex;
  -webkit-box-pack: center;
  justify-content: center;
  align-items: center;
  padding: 0.35rem 0;
  width: 24px;
  cursor: not-allowed;
`;
const AddLoader = styled.div`
  display: flex;
  -webkit-box-pack: center;
  justify-content: center;
  align-items: center;
  background-color: rgb(241, 245, 248);
  border: 2px solid #494a4b;
  border-radius: 5px;
  padding: 0.35rem 1rem;
  cursor: not-allowed;
`;

const CountNumber = styled.span`
  font-size: 1.4rem;
  font-weight: bold;
  color: black;
  display: flex;
  width: 24px;
  justify-content: center;
`;
