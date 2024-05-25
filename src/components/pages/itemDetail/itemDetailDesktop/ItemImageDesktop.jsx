import React, { useState, useEffect } from "react";
import styled from "styled-components/macro";
import { GlobalToolsContext } from "../../../context/GlobalToolsContext";
import { useContext } from "react";
import { ClipLoader } from "react-spinners";

export const ItemImageDesktop = ({
  filteredItem,
  selectedItem,
  loadingColorFilter,
}) => {
  const [selectedImage, setSelectedImage] = useState({ index: 0, source: "" });
  const [imagesToRender, setImagesToRender] = useState([]);
  const filteredImagesToRender = imagesToRender.filter(
    (image) => image !== null
  ); //Render images - Avoid null values in array
  const { progress, setProgress, setVisible, windowHeight } =
    useContext(GlobalToolsContext);
  const [loadedImages, setLoadedImages] = useState(0);

  useEffect(() => {
    if (selectedItem) {
      setImagesToRender(selectedItem.img.slice(0, 5));
      setSelectedImage({ image: selectedItem.img[0], index: 0 });
    }
  }, [selectedItem]);

  useEffect(() => {
    if (filteredItem && Object.keys(filteredItem).length > 0) {
      setImagesToRender(filteredItem.img.slice(0, 5));
      // Find the selected image index in the filtered item's images
      const selectedImageIndex = filteredItem.img.indexOf(selectedImage.source);

      setSelectedImage({
        index: selectedImageIndex !== -1 ? selectedImageIndex : 0,
        source: selectedImage.source,
      });
    }
  }, [filteredItem]);

  const handleImageClick = (image, index) => {
    setSelectedImage({ index, source: image });
  };

  useEffect(() => {
    const totalImages = imagesToRender.length;

    const trackImageLoad = (index) => {
      const image = new Image();
      image.src = imagesToRender[index];
      image.onload = () => {
        // This image is loaded
        setLoadedImages((prevLoadedImages) => prevLoadedImages + 1);
      };
    };

    if (imagesToRender.length > 0) {
      setLoadedImages(0); // Reset the loaded image count
      for (let i = 0; i < totalImages; i++) {
        trackImageLoad(i);
      }
    }
  }, [imagesToRender]);

  useEffect(() => {
    const totalImages = imagesToRender.filter((image) => image !== null).length;

    if (loadedImages === totalImages) {
      // All non-null images are loaded
      setProgress(100);
      if (progress === 100) {
        setVisible(false);
      }
    }
  }, [loadedImages, setVisible]);

  return (
    <Wrapper>
      <ImgAsideWrapper>
        {filteredImagesToRender.map((image, index) => (
          <React.Fragment key={`img-aside-${index}`}>
            {image !== null &&
            loadedImages <= index &&
            loadingColorFilter === true ? (
              <LoaderContainer key={`loader-container-${index}`}>
                <ClipLoader color="#8f501a" size={17} />
              </LoaderContainer>
            ) : (
              <ImgAside
                key={`img-aside-${index}`}
                src={image}
                alt=""
                isSelected={selectedImage.index === index}
                onClick={() => handleImageClick(image, index)}
              />
            )}
          </React.Fragment>
        ))}
      </ImgAsideWrapper>

      <MainImgWrapper>
        {filteredImagesToRender.map((image, index) => (
          <MainImg
            windowHeight={windowHeight}
            key={`main-img-${index}`}
            src={image}
            id={selectedItem?.id || (filteredItem?.id && filteredItem.id)}
            translationDirection={
              selectedImage.index === index
                ? "none"
                : selectedImage.index < index
                ? "translateX(-100%)"
                : "translateX(100%)"
            }
            isVisible={selectedImage.index === index}
          />
        ))}
      </MainImgWrapper>
    </Wrapper>
  );
};

const Wrapper = styled.div`
  display: flex;
  width: 85%;
  height: 100%;
  margin-left: -35px;
  margin-right: 20px;
`;
const ImgAsideWrapper = styled.aside`
  width: 18.8%;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-top: 1.5px;
`;

const ImgAside = styled.img`
  cursor: pointer;
  box-shadow: ${({ isSelected }) =>
    isSelected
      ? "rgba(0, 0, 0, 0.55) 0px 0px 3.5px"
      : "rgba(0, 0, 0, 0.65) 0px 0px 3px"};
  border: ${({ isSelected }) => (isSelected ? "1px solid black" : "none")};
  width: ${({ isSelected }) => (isSelected ? "63%" : "60%")};
  height: ${({ isSelected }) => (isSelected ? "11%" : "10.7%")};
  object-fit: cover;
`;
const LoaderContainer = styled.div`
  width: 81%;
  display: flex;
  justify-content: center;
  height: 12.5%;
  align-items: center;
`;
const MainImgWrapper = styled.div`
  width: 100%;
 /*  min-height: 920px;  */
  top: 0;
  left: 0;
  display: flex;
  position: relative;
  overflow: hidden;
`;

const MainImg = styled.img`
  width: 100%;
  position: absolute;
  overflow: hidden;
  /* border: 1px solid lightgray; */
  object-fit: cover;
  transform: ${({ translationDirection }) => translationDirection};
  opacity: ${({ isVisible }) => (isVisible ? "1" : "0")};
  transition: transform 0.10s ease, opacity 0.20s ease;
  @media (min-width:1200px){
    height: 80%;
  }
  @media (max-width:1199px){
    min-height: 600px;
  }
  @media (max-width:1050px){
    min-height: 500px;
  }
`;
