//Importamos el Custom Hoom para darle funcionalidad a los botones del contador
import { useCount } from "../../hooks/useCount";
import styled from "styled-components/macro";

//Usamos los datos como parametros en ItemCount
export const ItemCount = ({ initial = 1, stock, onAddToCart }) => {
  //Recibimos la data del contador y los productos del padre ProductDetail
  const { count, increment, decrement, reset } = useCount(initial, stock);

  return (
    <>
      <Wrapper>
        <CountButton onClick={decrement}>-</CountButton>
        <CountNumber> {count} </CountNumber>
        <CountButton onClick={increment} disabled={count >= stock}>
          +
        </CountButton>
        {/* <ResetButton onClick={reset}>Reset</ResetButton> */}

        <AddCartButton
          onClick={() => onAddToCart(count)}
          disabled={stock === 0 || count > stock}
        >
          Add to Cart
        </AddCartButton>
      </Wrapper>
    </>
  );
};
const Wrapper = styled.div`
  display: flex;
  gap: 1.2rem;
  align-items: flex-start;
  height: 70px;
  @media (max-width:950px){
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
// const ResetButton = styled.button`
//   font-size: 0.8rem;
//   font-weight: bold;
//   cursor: pointer;
//   width: 50px;
//   margin: 0 auto;
//   display: flex;
//   height: 30px;
//   align-items: center;
//   justify-content: center;
//   &:hover {
//     background-color: gray;
//     transition: ease-in-out 0.2s;
//   }
// `;

const AddCartButton = styled.button`
  width: 135px;
  height: 45px;
  font-size: 0.9rem;
  font-weight: bold;
  border-radius: 0.8rem;
  background: ${({ disabled }) => (disabled ? "#999" : "rgb(9 9 9)")};
  color: white;
  margin-left: 20px;
  cursor: pointer;
  &:hover {
    background-color: ${({ disabled }) => (disabled ? "#999" : "#454444")};
    transition: ${({ disabled }) => (disabled ? "none" : "ease-in-out 0.2s")};
  }
  &:active {
    background-color: ${({ disabled }) => (disabled ? "#999" : "#686565")};
    transition: ${({ disabled }) => (disabled ? "none" : "ease-in-out 0.3s")};
  }
`;

const CountNumber = styled.span`
  font-size: 1.4rem;
  font-weight: bold;
  color: black;
`;
