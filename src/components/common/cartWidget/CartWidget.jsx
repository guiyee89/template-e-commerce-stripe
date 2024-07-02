import { Badge } from "@mui/material";
import ShoppingBagOutlinedIcon from "@mui/icons-material/ShoppingBagOutlined";
import styled from "styled-components/macro";
import { GlobalToolsContext } from "../../context/GlobalToolsContext";
import { useContext } from "react";

export const CartWidget = ({ totalItems }) => {
  const { toggleSideCart, scroll, isOpen, windowWidth } =
    useContext(GlobalToolsContext);

  return (
    <>
      <CartWidgetWrapper
        onClick={toggleSideCart}
        scrolled={scroll}
        isOpen={isOpen}
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
          <CartWrapper scrolled={scroll} windowWidth={windowWidth}>
            <ShoppingBagOutlinedIcon fontSize="medium" />
          </CartWrapper>
        </Contador>
      </CartWidgetWrapper>
    </>
  );
};
const CartWidgetWrapper = styled.div`
  cursor: pointer;
  margin-bottom: ${(props) =>
    props.windowWidth > 900
      ? props.scrolled === "scrolled"
        ? "-13px"
        : "-13px"
      : props.windowWidth < 900
      ? props.scrolled === "scrolled"
        ? "-10px"
        : "-10px"
      : "0"};
  /* transition: margin-bottom
    ${(props) => (props.scrolled === "scrolled" ? "0.25s" : "0.25s")}
    ease-in-out; */
  padding: ${(props) =>
    props.isOpen && props.windowWidth > 900 ? "0" : "0 0 0 0"};
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
  width: ${(props) => (props.scrolled === "scrolled" ? "none" : "none")};
  /* transition: width ${(props) => (props.scrolled ? "0.25s" : "0.06s")}
    ease-in-out; */
  margin-top: ${(props) =>
    props.windowWidth < 900
      ? props.scrolled === "scrolled"
        ? "3px"
        : "3px"
      : "3px"};
`;
