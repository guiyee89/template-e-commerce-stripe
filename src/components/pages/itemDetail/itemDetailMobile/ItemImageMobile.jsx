import { useState, useEffect, useContext } from "react";
import styled from "styled-components/macro";
import Carousel from "react-bootstrap/Carousel";
import NextButtonSVG from "../../../../assets/arrow-right-336-svgrepo-com.svg";
import PrevButtonSVG from "../../../../assets/arrow-left-335-svgrepo-com.svg";
import { GlobalToolsContext } from "../../../context/GlobalToolsContext";
import { ClipLoader } from "react-spinners";

export const ItemImageMobile = ({
  filteredItem,
  selectedItem,
  imgSkeletonLoader,
  setImgSkeletonLoader,
}) => {
  const [selectedImage, setSelectedImage] = useState({ index: 0, source: "" });
  const [imagesToRender, setImagesToRender] = useState([]);
  const filteredImagesToRender = imagesToRender.filter(
    (image) => image !== null
  ); //Render images - Avoid null values in array
  const [filterColorLoading, setFilterColorLoading] = useState(false);

  const { setProgress, setVisible, progress, isMenuOpen } =
    useContext(GlobalToolsContext);

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

  const handleImageSwitch = (newIndex) => {
    setSelectedImage({ source: imagesToRender[newIndex], index: newIndex });
  };

  const trackImageLoadingProgress = () => {
    const nonNullImages = imagesToRender.filter((image) => image !== null);

    const totalImages = nonNullImages.length;

    let loadedImages = 0;

    imagesToRender.forEach((imageSrc) => {
      const image = new Image();
      image.src = imageSrc;
      image.onload = () => {
        loadedImages++;
        if (loadedImages < totalImages) {
          setFilterColorLoading(true);
        } else {
          setProgress(100);
          setImgSkeletonLoader(false); // Set loader to false when all images are loaded
          setFilterColorLoading(false);
        }
      };
    });
  };

  useEffect(() => {
    console.log("activando size filter");
    if (imagesToRender.length > 0) {
      trackImageLoadingProgress();
    } else {
      setProgress(100);
    }
    if (imgSkeletonLoader === false) {
      setProgress(100);
      setProgress(99);
      if (progress === 99) {
        setTimeout(() => {
          setProgress(100);
          setVisible(false);
        }, 1000);
      }
    }
  }, [imagesToRender, setProgress, setVisible]);

  return (
    <>
      {imgSkeletonLoader === true ? (
        <LoaderContainer>
          <ClipLoader color="#8f501a" size={35} />
        </LoaderContainer>
      ) : (
        <Wrapper imgSkeleton="false">
          <MainImgWrapper>
            <StyledCarousel
              isMenuOpen={isMenuOpen}
              interval={null}
              activeIndex={selectedImage.index}
              onSelect={handleImageSwitch}
            >
              {filteredImagesToRender.map((image, index) => (
                <CarouselItem key={index}>
                  {filterColorLoading === true && imgSkeletonLoader === true ? (
                    <LoaderContainer>
                      <ClipLoader color="#8f501a" size={25} />
                    </LoaderContainer>
                  ) : (
                    <MainImg
                      imgSkeleton="false"
                      src={image}
                      id={
                        selectedItem?.id ||
                        (filteredItem?.id && filteredItem.id)
                      }
                    />
                  )}
                </CarouselItem>
              ))}
            </StyledCarousel>
          </MainImgWrapper>
        </Wrapper>
      )}
    </>
  );
};

const Wrapper = styled.div`
  display: flex;
  width: 100%;
  flex-direction: column-reverse;
  align-items: flex-start;
  position: relative;
`;
const StyledCarousel = styled(Carousel)`
  width: 100%;
  .carousel-inner {
    .carousel-item {
      transition: opacity 0.2s ease, transform 0.18s ease;
    }
  }
  .carousel-indicators {
    z-index: ${({ isMenuOpen }) => (isMenuOpen ? "1" : "0")};
    transition: z-index 0.2s ease-in-out;
  }
  .carousel-indicators [data-bs-target] {
    box-sizing: content-box;
    flex: 0 1 auto;
    width: 25px;
    height: 3px;
    padding: 0px;
    margin-right: 8px;
    margin-left: 7px;
    text-indent: -999px;
    cursor: pointer;
    background-color: #000;
    background-clip: padding-box;
    border: 0;
    border-top: 11px solid transparent;
    border-bottom: 10px solid transparent;
    opacity: 0.3;
    transition: opacity 0.3s ease-in-out;
  }
  .carousel-indicators .active {
    opacity: 1;
  }
  .carousel-control-next {
    right: -20px;
  }
  .carousel-control-next-icon {
    background-image: url(${NextButtonSVG});
  }
  .carousel-control-prev {
    left: -20px;
    z-index: 0;
  }
  .carousel-control-prev-icon {
    background-image: url(${PrevButtonSVG});
  }
`;
const CarouselItem = styled(Carousel.Item)`
  width: 100%;
  aspect-ratio: 3/4;
`;
const MainImgWrapper = styled.div`
  display: flex;
`;
const MainImg = styled.img`
  object-fit: cover;
  width: 100%;
  height: 100%;
  border: 1px solid lightgray;
  flex-grow: 1;
`;
const LoaderContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  @media (max-width: 950px) {
    min-height: ${(props) => (props.imgSkeleton ? "550px" : "550px")};
  }
  @media (max-width: 470px) {
    margin-bottom: 10px;
    width: 95%;
    min-height: ${(props) => (props.imgSkeleton ? "350px" : "350px")};
  }
  @media (max-width: 330px) {
    min-height: ${(props) => (props.imgSkeleton ? "320px" : "320px")};
    width: 100%;
  }
`;
