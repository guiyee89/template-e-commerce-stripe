import ContentLoader from "react-content-loader";
import styled from "styled-components/macro";
import { CartContext } from "../../../context/CartContext";
import React, { useContext } from "react";

const LoaderContainer = styled.div`
  margin: 0 auto;
  max-width: 600px;
  @media (max-width: 550px) {
    margin: 0 10px 0 20px; 
  }
`;

export const PaymentSkeletonLoader = (props) => {
  const { cart } = useContext(CartContext);

  return (
    <LoaderContainer>
      <ContentLoader
        speed={2}
        width={"100%"}
        height={600 + cart.length * 100} // Dynamically adjust height based on cart items
        viewBox={`0 0 600 ${700 + cart.length * 100}`}
        backgroundColor="#f3f3f3"
        foregroundColor="#ecebeb"
        {...props}
      >
        {/* Top "Powered by Stripe" */}
        <rect x="0" y="30" rx="4" ry="4" width="130" height="20" />

        {/* Loop through cart items to render product skeletons */}
        {cart.map((item, index) => {
          const yOffset = 80 + index * 100; // Adjust y-offset for each item in the cart
          return (
            <React.Fragment key={index}>
              {/* Product images */}
              <rect x="0" y={yOffset} rx="8" ry="8" width="80" height="80" />
              {/* Product details */}
              <rect x="100" y={yOffset} rx="4" ry="4" width="200" height="20" />
              <rect
                x="100"
                y={yOffset + 40}
                rx="4"
                ry="4"
                width="100"
                height="15"
              />
              {/* Product price */}
              <rect x="470" y={yOffset} rx="4" ry="4" width="100" height="25" />
            </React.Fragment>
          );
        })}

        {/* Shipping cost */}
        <rect
          x="420"
          y={80 + cart.length * 100}
          rx="4"
          ry="4"
          width="150"
          height="20"
        />

        {/* Payment method tabs */}
        <rect
          x="0"
          y={220 + cart.length * 100}
          rx="8"
          ry="8"
          width="270"
          height="70"
        />
        <rect
          x="300"
          y={220 + cart.length * 100}
          rx="8"
          ry="8"
          width="270"
          height="70"
        />

        {/* Card details form */}
        <rect
          x="0"
          y={330 + cart.length * 100}
          rx="4"
          ry="4"
          width="570"
          height="50"
        />
        <rect
          x="0"
          y={410 + cart.length * 100}
          rx="4"
          ry="4"
          width="270"
          height="50"
        />
        <rect
          x="300"
          y={410 + cart.length * 100}
          rx="4"
          ry="4"
          width="270"
          height="50"
        />
        <rect
          x="0"
          y={490 + cart.length * 100}
          rx="4"
          ry="4"
          width="570"
          height="50"
        />

        {/* Pay button */}
        <rect
          x="0"
          y={580 + cart.length * 100}
          rx="8"
          ry="8"
          width="570"
          height="70"
        />
      </ContentLoader>
    </LoaderContainer>
  );
};
