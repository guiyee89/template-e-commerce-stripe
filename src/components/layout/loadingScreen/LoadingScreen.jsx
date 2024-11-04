import { useContext } from "react";
import { GlobalToolsContext } from "../../context/GlobalToolsContext";
import useGlobalLocation from "../../hooks/useGlobalLocation";
import { HeroSmall } from "../heroSmall/HeroSmall";
import { NavMobile } from "../navbar/navMobile/NavMobile";
import styled from "styled-components/macro";
import { NavDesktop } from "../navbar/navDesktop/NavDesktop";
import { LoadingTopBar } from "../../common/loadingTopBars/LoadingTopBar";

export const LoadingScreen = () => {
  const { windowWidth } = useContext(GlobalToolsContext);

  const {
    isHome,
    isDashboard,
    isCheckout,
    isContactUs,
    isCompletion,
    isUserOrder,
  } = useGlobalLocation();

  return (
    <>
      <LoadingWrapper>
        {!isHome && <LoadingTopBar />}
        {!isDashboard &&
          !isCheckout &&
          !isContactUs &&
          !isCompletion &&
          !isUserOrder && <HeroSmall />}
        {isDashboard ? (
          windowWidth > 1100 ? (
            <NavDesktop />
          ) : (
            <NavMobile />
          )
        ) : windowWidth > 900 ? (
          <NavDesktop />
        ) : (
          <NavMobile />
        )}
      </LoadingWrapper>
    </>
  );
};
const LoadingWrapper = styled.div`
  overflow: scroll;
  position: fixed;
  top: 0;
  width: 100%;
  height: 100vh;
  padding: ${({ windowWidth }) => (windowWidth > 830 ? "0 17px 0 0" : "0")};
`;
