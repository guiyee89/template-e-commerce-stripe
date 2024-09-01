import { Badge } from "@mui/material";
import ShoppingBagOutlinedIcon from "@mui/icons-material/ShoppingBagOutlined";
import styled from "styled-components/macro";
import { GlobalToolsContext } from "../../context/GlobalToolsContext";
import { useContext } from "react";

export const CartWidget = ({ totalItems, isDashboard }) => {
  const { toggleSideCart, windowWidth } = useContext(GlobalToolsContext);

  return (
    <>
      <CartWidgetWrapper
        onClick={toggleSideCart}
        windowWidth={windowWidth}
        isDashboard={isDashboard}
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
  margin-bottom: ${(props) => (props.windowWidth > 900 ? "-0" : "0")};
  padding: ${(props) => (props.windowWidth > 900 ? "0 0 0 0" : "8px 0 0 0")};
  display: ${(props) =>
    props.isDashboard ? "none" : "block"}; 
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
  margin-top: ${(props) => (props.windowWidth > 900 ? "2px" : "0")};
`;
