import { Badge } from "@mui/material";
import ShoppingBagOutlinedIcon from "@mui/icons-material/ShoppingBagOutlined";
import styled from "styled-components/macro";
import { GlobalToolsContext } from "../../context/GlobalToolsContext";
import { useContext } from "react";

export const CartWidget = ({ totalItems }) => {
  const { toggleSideCart, isCartOpen, windowWidth } =
    useContext(GlobalToolsContext);

  return (
    <>
      <CartWidgetWrapper
        onClick={toggleSideCart}
        isCartOpen={isCartOpen}
        windowWidth={windowWidth}
      >
        <Contador
          badgeContent={totalItems}
          aria-label={totalItems}
          color="warning"
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "left",
          }}
        >
          <CartWrapper windowWidth={windowWidth}>
            <ShoppingBagOutlinedIcon fontSize="medium" />
          </CartWrapper>
        </Contador>
      </CartWidgetWrapper>
    </>
  );
};
const CartWidgetWrapper = styled.div`
  cursor: pointer;
  margin-bottom: ${(props) => (props.windowWidth > 900 ? "-13px" : "-0")};
  padding: ${(props) =>
    props.isCartOpen && props.windowWidth > 900 ? "0" : "0 0 0 0"};
`;

const Contador = styled(Badge)`
  z-index: 0;

  .css-16rm5dn-MuiBadge-badge {
    font-size: 0.75rem;
    height: 21.2px;
    bottom: 4px;
    border-radius: 50%;
    min-width: 22px;
    @media screen and (max-width: 50rem) {
      border-radius: 50%;
    }
  }
`;
const CartWrapper = styled.div`
  margin-top: ${(props) => (props.windowWidth > 900 ? "3px" : "0")};
`;
