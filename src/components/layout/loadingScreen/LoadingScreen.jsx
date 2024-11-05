import useGlobalLocation from "../../hooks/useGlobalLocation";
import styled from "styled-components/macro";
import { LoadingTopBar } from "../../common/loadingTopBars/LoadingTopBar";

export const LoadingScreen = () => {
  const { isHome } = useGlobalLocation();

  return (
    <>
      <LoadingWrapper>{!isHome && <LoadingTopBar />}</LoadingWrapper>
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
