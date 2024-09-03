import { Button } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import DeleteIcon from "@mui/icons-material/Delete";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import styled from "styled-components/macro";
import { Ring } from "@uiball/loaders";
import { bouncy } from "ldrs";
bouncy.register();
import TaskAltIcon from "@mui/icons-material/TaskAlt";
import { GlobalToolsContext } from "../../../../../../../context/GlobalToolsContext";
import { useContext } from "react";

export const ImageForm = ({
  selectedItem,
  existingImages,
  handleImage,
  isLoadingImage,
  handleDeleteImage,
  confirmedImageUpload,
  file,
  handleFileInputChange,
  handleCancelFile,
  isLoading,
}) => {
  const { windowWidth } = useContext(GlobalToolsContext);

  return (
    <>
      <ImagesInputsContainer>
        {selectedItem ? (
          <ImageContainer>
            {existingImages.map((image, index) => (
              <div
                key={index}
                style={{
                  display: "flex",
                  height: "170px",
                }}
              >
                <ImgPlaceHolder>
                  <p>{index + 1}</p>{" "}
                  <div
                    style={{
                      width: windowWidth < 850 ? "60px" : "85px",
                      height: windowWidth < 850 ? "70px" : "100px",
                    }}
                  >
                    {isLoadingImage[index + 1] ? (
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          width: windowWidth < 850 ? "60px" : "85px",
                          height: windowWidth < 850 ? "70px" : "100px",
                          border: "1px solid gray",
                        }}
                      >
                        <l-bouncy
                          size="25"
                          speed="1.75"
                          color="black"
                        ></l-bouncy>
                      </div>
                    ) : image ? (
                      <img
                        src={image}
                        alt={`image uploaded ${index + 1}`}
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                          fontSize: ".7rem",
                          border: "1px solid gray",
                        }}
                      />
                    ) : (
                      <label
                        style={{
                          height: windowWidth < 850 ? "70px" : "100px",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          textAlign: "center",
                          border: "1px solid gray",
                          fontSize: ".68rem",
                        }}
                      >
                        Imagen
                      </label>
                    )}
                  </div>
                  {image && (
                    <DeleteIcon
                      onClick={() => handleDeleteImage(index + 1)}
                      sx={{
                        cursor: "pointer",
                        display: "flex",
                        height: "2em",
                      }}
                      fontSize="small"
                    />
                  )}
                </ImgPlaceHolder>
              </div>
            ))}
          </ImageContainer>
        ) : (
          <ImageContainer>
            {[1, 2, 3, 4, 5].map((slotIndex) => (
              <div
                key={slotIndex}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  height: "170px",
                  position: "relative",
                }}
              >
                <p
                  style={{
                    textAlign: "center",
                  }}
                >
                  {slotIndex}
                </p>{" "}
                <div
                  style={{
                    width: windowWidth < 850 ? "60px" : "85px",
                    height: windowWidth < 850 ? "70px" : "100px",
                    border: "1px solid gray",
                  }}
                >
                  {confirmedImageUpload[slotIndex] ? (
                    <>
                      <img
                        src={
                          file[slotIndex].length > 0
                            ? URL.createObjectURL(file[slotIndex][0])
                            : ""
                        }
                        alt={
                          file[slotIndex].length > 0
                            ? "Image uploaded"
                            : "No Image Available"
                        }
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                        }}
                      />
                    </>
                  ) : (
                    // Render this if not confirmed
                    <label
                      style={{
                        height: windowWidth < 850 ? "70px" : "100px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: ".68rem",
                      }}
                    >
                      Imagen
                    </label>
                  )}
                </div>
              </div>
            ))}
          </ImageContainer>
        )}

        <InputsContainer>
          {[1, 2, 3, 4, 5].map((inputNumber) => (
            <div key={inputNumber}>
              <h2
                style={{
                  textAlign: "center",
                  paddingTop: "10px",
                }}
              ></h2>
              <LoadBtnContainer>
                <LoadImgBtn
                  component="label"
                  variant="contained"
                  startIcon={
                    confirmedImageUpload[inputNumber] === false &&
                    isLoading[inputNumber] === false && <CloudUploadIcon />
                  }
                  size="small"
                  sx={{
                    fontSize: "0.6125rem",
                    "& .MuiButton-label": {
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    },
                  }}
                  disabled={file[inputNumber].length > 0}
                >
                  {file[inputNumber].length > 0 && !isLoading[inputNumber] ? (
                    <TaskAltIcon color="success" fontSize="small" />
                  ) : !isLoading[inputNumber] ? (
                    "Cargar"
                  ) : (
                    <Ring size={20} lineWeight={7} speed={1} color="black" />
                  )}
                  <input
                    type="file"
                    id={`fileInput${inputNumber}`}
                    multiple
                    onChange={(e) => {
                      const selectedFiles = Array.from(e.target.files);
                      handleFileInputChange(inputNumber, selectedFiles);
                    }}
                    style={{
                      display: "none",
                    }}
                  />
                </LoadImgBtn>

                {file[inputNumber].length > 0 && (
                  <div>
                    <CancelUploadedFile
                      sx={{
                        cursor: "pointer",
                        position: "absolute",
                        top: "-22px",
                        left: "42px",
                      }}
                      fontSize="small"
                      onClick={() => handleCancelFile(inputNumber)}
                    />
                    {!isLoading[inputNumber] && (
                      <>
                        {confirmedImageUpload[inputNumber] === true ? (
                          <div
                            style={{
                              display: "flex",
                              justifyContent: "center",
                            }}
                          ></div>
                        ) : (
                          <ConfirmImgLoadBtn
                            variant="contained"
                            size="small"
                            sx={{
                              marginTop: "5px",
                              paddingBottom: "3px",
                              fontSize: "0.6125rem",
                              position: "absolute",
                              top: "-4px",
                              lineHeight: "1.95",
                            }}
                            onClick={() => handleImage(inputNumber)}
                            style={{
                              display: isLoading[inputNumber] && "none",
                            }}
                          >
                            confirm
                          </ConfirmImgLoadBtn>
                        )}
                      </>
                    )}
                  </div>
                )}
              </LoadBtnContainer>
            </div>
          ))}
        </InputsContainer>
      </ImagesInputsContainer>
    </>
  );
};

const ConfirmImgLoadBtn = styled(Button)`
  width: 100px;
  @media (max-width: 420px) {
    width: 70px;
  }
`;
const LoadImgBtn = styled(Button)`
  width: 100px;
  @media (max-width: 850px){
    width: 70px;
  }
  @media (max-width: 550px){
    width: 60px;
  }
`;

const LoadBtnContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  position: relative;
`;
const CancelUploadedFile = styled(CloseIcon)`
  width: 0.8em !important;
  top: -18px !important;
  left: 84px !important;
`;
const ImagesInputsContainer = styled.div`
  display: flex;
  flex-direction: column-reverse;
  -webkit-box-pack: start;
  justify-content: flex-start;
  margin: 0px auto 28px;
  width: 90%;
  padding-top: 24px;
  box-shadow: rgba(0, 0, 0, 0.45) 0px 14px 10px -14px;
  overflow-x: auto;
  @media (max-width: 500px) {
    margin-left: 0px;
    width: 98%;
  }
`;
const InputsContainer = styled.div`
  display: flex;
  justify-content: space-around;
  height: 48px;
`;
const ImageContainer = styled.div`
  display: flex;
  justify-content: space-around;
  margin: 12px 0 40px;
`;
const ImgPlaceHolder = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  align-items: center;
  justify-content: flex-start;
`;
