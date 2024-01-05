import { Button, TextField } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { useContext, useEffect, useState } from "react";
import styled from "styled-components/macro";
import { db, uploadFile } from "../../../../../firebaseConfig";
import { addDoc, collection, doc, updateDoc } from "firebase/firestore";
import { GlobalToolsContext } from "../../../../context/GlobalToolsContext";
import { Ring } from "@uiball/loaders";
import TaskAltIcon from "@mui/icons-material/TaskAlt";

export const ProductsForm = ({
  selectedItem,
  setSelectedItem,
  handleClose,
  setIsChanged,
}) => {
  const { windowWidth } = useContext(GlobalToolsContext);
  const [addProduct, setAddProduct] = useState(false);
  const [existingImages, setExistingImages] = useState([]);
  let [allSelectedFiles, setAllSelectedFiles] = useState([]);
  const [isQueueProcessing, setIsQueueProcessing] = useState(false); // Use a queue to handle concurrency of handleImage
  const [imageQueue, setImageQueue] = useState([]);

  const [isLoading, setIsLoading] = useState({
    1: false,
    2: false,
    3: false,
    4: false,
    5: false,
  });
  const [file, setFile] = useState({
    1: [],
    2: [],
    3: [],
    4: [],
    5: [],
  });

  const [confirmedImageUpload, setConfirmedImageUpload] = useState({
    1: false,
    2: false,
    3: false,
    4: false,
    5: false,
  });
  const [newProduct, setNewProduct] = useState({
    userId: "",
    title: "",
    subtitle: "",
    unit_price: "",
    discountPrice: "",
    stock: "",
    color: "",
    size: "",
    description: "",
    category: "",
    img: [],
    secondUnit: "",
  });

  ///////*****         HANDLE CHANGE        ******///////
  const handleChange = (e) => {
    const { name, value } = e.target;
    if (selectedItem) {
      // Check if the input is a number and set the size accordingly
      setSelectedItem((prevSelectedItem) => ({
        ...prevSelectedItem,
        [name]: isNaN(value) ? value : parseInt(value, 10),
      }));
    } else {
      setNewProduct((prevProduct) => ({
        ...prevProduct,
        [name]: isNaN(value) ? value : parseInt(value, 10),
      }));
    }
  };

  /////*****         HANDLE IMAGE INPUTS        ******///////

  // Set existing images for rendering
  useEffect(() => {
    if (selectedItem) {
      setExistingImages(selectedItem.img);
    }
  }, [selectedItem]);

  // Activate states for handling image uploading queues
  const handleImage = (inputNumber) => {
    setIsQueueProcessing(true);
    setIsLoading((prevLoading) => ({
      ...prevLoading,
      [inputNumber]: true,
    }));
    try {
      // Add the image upload request to the queue
      setImageQueue((prevQueue) => [
        ...prevQueue,
        { inputNumber, selectedFiles: file[inputNumber] },
      ]);
    } catch (error) {}
  };

  useEffect(() => {
    const handleImageQueue = async () => {
      if (imageQueue.length > 0) {
        console.log(imageQueue);
        const { inputNumber, selectedFiles } = imageQueue[0];

        try {
          const imageUrlPromises = selectedFiles.map(async (selectedFile) => {
            return await uploadFile(selectedFile);
          });

          const newUrls = await Promise.all(imageUrlPromises);

          // Set the uploaded image URL to the corresponding input number
          if (selectedItem) {
            setSelectedItem((prevSelectedItem) => {
              const imgCopy = [...(prevSelectedItem.img || [])];
              imgCopy[inputNumber - 1] = newUrls[0];
              return {
                ...prevSelectedItem,
                img: imgCopy,
              };
            });
          } else {
            setNewProduct((prevProduct) => {
              const imgCopy = [...(prevProduct.img || [])];
              imgCopy[inputNumber - 1] = newUrls[0];
              return {
                ...prevProduct,
                img: imgCopy,
              };
            });
          }
        } catch (error) {
          console.error("Error uploading image:", error);
        } finally {
          // Reset the loading state after the upload is complete or if an error occurs
          setIsLoading((prevLoading) => ({
            ...prevLoading,
            [inputNumber]: false,
          }));

          // Set the confirmedImageUpload state for this input to true
          setConfirmedImageUpload((prevConfirmedImageUpload) => ({
            ...prevConfirmedImageUpload,
            [inputNumber]: true,
          }));

          // Find the index of the processed item in the queue
          const processedItemIndex = imageQueue.findIndex(
            (item) => item.inputNumber === inputNumber
          );
          // Remove the processed item from the queue
          setImageQueue((prevQueue) => {
            const updatedQueue = [...prevQueue];
            updatedQueue.shift(processedItemIndex, 1);
            return updatedQueue;
          });
        }
      } else {
        // No more items in the queue, set isQueueProcessing to false
        setIsQueueProcessing(false);
      }
    };
    // Call handleImageQueue initially
    handleImageQueue();
  }, [imageQueue, selectedItem, newProduct, uploadFile]);

  // CODE SNIPPET: Confirm all image together into there imageQueue array
  // // Function to handle the confirmation of all images
  // const handleConfirmAllImages = () => {
  //   // Iterate over all selected files and trigger handleImage
  //   for (let inputNumber = 1; inputNumber <= 5; inputNumber++) {
  //     if (file[inputNumber].length > 0 && !isLoading[inputNumber]) {
  //       handleImage(inputNumber);
  //     }
  //   }
  // };

  // // Set a queue for each image being uploaded
  // useEffect(() => {
  //   const handleImageQueue = async () => {
  //     if (imageQueue.length > 0) {
  //       const { inputNumber } = imageQueue[0];
  //       // Check if the corresponding isLoading state is false

  //       try {
  //         const { inputNumber, selectedFiles } = imageQueue[0];
  //         const imageUrlPromises = selectedFiles.map(async (selectedFile) => {
  //           const imageUrl = await uploadFile(selectedFile);
  //           return imageUrl;
  //         });
  //         const newUrls = await Promise.all(imageUrlPromises);

  //         if (selectedItem) {
  //           const imgCopy = selectedItem.img ? [...selectedItem.img] : [];
  //           imgCopy[inputNumber - 1] = newUrls[0];
  //           setSelectedItem((prevSelectedItem) => ({
  //             ...prevSelectedItem,
  //             img: imgCopy,
  //           }));
  //         } else {
  //           const imgCopy = newProduct.img ? [...newProduct.img] : [];
  //           imgCopy[inputNumber - 1] = newUrls[0];
  //           setNewProduct((prevProduct) => ({
  //             ...prevProduct,
  //             img: imgCopy,
  //           }));
  //         }
  //       } finally {
  //         // Reset the loading state after the upload is complete or if an error occurs
  //         setIsLoading((prevLoading) => ({
  //           ...prevLoading,
  //           [inputNumber]: false,
  //         }));
  //         // Remove the processed item from the queue
  //         setImageQueue((prevQueue) => prevQueue.slice(1));

  //         // Set the confirmedImageUpload state for this input to true
  //         setConfirmedImageUpload((prevConfirmedImageUpload) => ({
  //           ...prevConfirmedImageUpload,
  //           [inputNumber]: true,
  //         }));
  //       }
  //     }
  //   };
  //   handleImageQueue();
  //   if (imageQueue.length < 1) {
  //     setIsQueueProcessing(false);
  //   }
  // }, [imageQueue, selectedItem]);

  // Set a queue for each image being uploaded

  // Merge the selected files with the existing files for the input

  const handleFileInputChange = (inputNumber, selectedFiles) => {
    const updatedFiles = { ...file };
    updatedFiles[inputNumber] = [
      ...updatedFiles[inputNumber],
      ...selectedFiles,
    ];

    setFile(updatedFiles);
    // Combine all the selected files into one array
    allSelectedFiles = Object.keys(updatedFiles).reduce((acc, key) => {
      return [...acc, ...updatedFiles[key]];
    }, []);

    setAllSelectedFiles(allSelectedFiles);
  };

  //////////         CANCEL / DELETE IMAGES       ///////////
  const handleCancelFile = (inputNumber) => {
    // Create a copy of the current file object
    const updatedFiles = { ...file };
    // Clear the selected file at the specified inputNumber
    updatedFiles[inputNumber] = [];

    setFile(updatedFiles);
    // Combine all the selected files into one array
    const allSelectedFiles = Object.keys(updatedFiles).reduce((acc, key) => {
      if (Array.isArray(updatedFiles[key])) {
        return [...acc, ...updatedFiles[key]];
      } else {
        return acc;
      }
    }, []);
    setAllSelectedFiles(allSelectedFiles);
    // Clear the file input value
    const fileInput = document.querySelector(`#fileInput${inputNumber}`);
    if (fileInput) {
      fileInput.value = ""; // Reset the input value
    }

    // Set the confirmedImageUpload state for this input to false
    setConfirmedImageUpload((prevConfirmedImageUpload) => ({
      ...prevConfirmedImageUpload,
      [inputNumber]: false,
    }));
  };

  const handleDeleteImage = (inputNumber) => {
    const imgCopy = [...(selectedItem?.img || [])];
    // Mark the deleted slot as empty
    imgCopy[inputNumber - 1] = null;

    if (selectedItem) {
      setSelectedItem({ ...selectedItem, img: imgCopy });
    } else {
      setNewProduct((prevProduct) => ({
        ...prevProduct,
        img: imgCopy,
      }));
    }
  };

  ////////////          SUBMIT          //////////////
  const handleSubmit = async (e) => {
    e.preventDefault();

    const itemsCollection = collection(db, "products");

    if (selectedItem) {
      const price = parseFloat(selectedItem.unit_price);
      const discount = parseFloat(selectedItem.discount);
      const discountAmount = (price * discount) / 100;
      let totalPrice = price;
      totalPrice -= discountAmount;

      let updatedItem = {
        ...selectedItem,
        userId: parseInt(selectedItem.userId),
        unit_price: parseFloat(selectedItem.unit_price),
        discountPrice: totalPrice || null,
        stock: parseInt(selectedItem.stock),
        color: selectedItem.color.toLowerCase(),
        size:
          typeof selectedItem.size === "number"
            ? parseFloat(selectedItem.size)
            : selectedItem.size.toLowerCase(),
        discount: discount || null,
        category: selectedItem.category.toLowerCase(),
      };

      await updateDoc(doc(itemsCollection, selectedItem.id), updatedItem).then(
        () => {
          setIsChanged();
          handleClose();
        }
      );
    } else {
      const price = parseFloat(newProduct.unit_price);
      const discount = parseFloat(newProduct.discount);
      let totalPrice = price;
      let newItem;

      //Agregamos propiedad "discount" (si lo hay) al objecto newItem
      if (discount) {
        const discountAmount = (price * discount) / 100;
        totalPrice -= discountAmount;
      }

      const length = 5;
      const nullArray = Array.from({ length }).map(() => null);
      newProduct.img.forEach((img, index) => {
        nullArray[index] = img;
      });

      if (discount) {
        newItem = {
          ...newProduct,
          userId: newProduct.userId ? parseInt(newProduct.userId) : 0,
          unit_price: newProduct.unit_price
            ? parseFloat(newProduct.unit_price)
            : 0,
          discountPrice: totalPrice,
          stock: newProduct.stock ? parseInt(newProduct.stock) : 0,
          color: newProduct.color.toLowerCase() || "",
          size:
            typeof newProduct.size === "number"
              ? parseFloat(newProduct.size)
              : newProduct.size.toLowerCase() || "",
          discountPrice: totalPrice,
          title: newProduct.title || "",
          subtitle: newProduct.subtitle || "",
          description: newProduct.description || "",
          category: newProduct.category.toLowerCase() || "",
          img: nullArray,
          secondUnit: newProduct.secondUnit || "",
        };
      } else {
        newItem = {
          ...newProduct,
          userId: newProduct.userId ? parseInt(newProduct.userId) : 0,
          unit_price: totalPrice,
          stock: newProduct.stock ? parseInt(newProduct.stock) : 0,
          color: newProduct.color.toLowerCase() || "",
          size:
            typeof newProduct.size === "number"
              ? parseFloat(newProduct.size)
              : newProduct.size.toLowerCase() || "",
          title: newProduct.title || "",
          subtitle: newProduct.subtitle || "",
          description: newProduct.description || "",
          category: newProduct.category.toLowerCase() || "",
          img: nullArray,
          secondUnit: newProduct.secondUnit || "",
        };
      }

      // Now, you can create the newItem object and add it to Firestore
      await addDoc(itemsCollection, newItem);
      setAddProduct(true);
    }
    setIsChanged();
  };

  //YUP VALIDATION
  //que no se valide mientras escribo, sino al hacer submit
  // validateOnChange: false,
  // //validar los datos
  // validationSchema: Yup.object({
  //   name: Yup.string()
  //     .required("Este campo es obligatorio")
  //     .min(3, "Minimo 3 caracteres"),
  //   email: Yup.string()
  //     .email("Este campo no corresponde a un email valido")
  //     .required("Este campo es obligatorio"),
  //   phone: Yup.string()
  //     .required("Este campo es obligatorio")
  //     .min(10, "Debe contener 10 numeros")
  //     .max(15, "Debe contener 10 numeros"),
  // }),

  return (
    <>
      {addProduct ? (
        <SuccessMessage>Product added successfully!</SuccessMessage>
      ) : (
        <FormWrapper>
          <Form onSubmit={handleSubmit}>
            <InfoImageContainer>
              <ProductInfo>
                <Div>
                  <Input
                    label="ID del Producto"
                    variant="outlined"
                    name="userId"
                    defaultValue={selectedItem?.userId}
                    onChange={handleChange}
                    // helperText={errors.userId}
                    // error={errors.userId ? true : false}
                    sx={{ marginBottom: "18px" }}
                    InputLabelProps={{
                      style: { fontSize: "14px" },
                    }}
                  />
                </Div>
                <Div>
                  <Input
                    label="Nombre del producto"
                    variant="outlined"
                    name="title"
                    defaultValue={selectedItem?.title}
                    onChange={handleChange}
                    // helperText={errors.title}
                    // error={errors.title ? true : false}
                    sx={{ marginBottom: "18px" }}
                    InputLabelProps={{
                      style: { fontSize: "14px" },
                    }}
                  />
                </Div>
                <Div>
                  <Input
                    label="Subtitulo del producto"
                    variant="outlined"
                    name="subtitle"
                    defaultValue={selectedItem?.subtitle}
                    onChange={handleChange}
                    // helperText={errors.subtitle}
                    // error={errors.subtitle ? true : false}
                    sx={{ marginBottom: "18px" }}
                    InputLabelProps={{
                      style: { fontSize: "14px" },
                    }}
                  />
                </Div>
                <Div>
                  <Input
                    label="Precio"
                    variant="outlined"
                    name="unit_price"
                    defaultValue={selectedItem?.unit_price}
                    onChange={handleChange}
                    // helperText={errors.unit_price}
                    // error={errors.unit_price ? true : false}
                    sx={{ marginBottom: "18px" }}
                    InputLabelProps={{
                      style: { fontSize: "14px" },
                    }}
                  />
                </Div>
                <Div>
                  <Input
                    label="Descuento en %"
                    variant="outlined"
                    name="discount"
                    defaultValue={selectedItem?.discount}
                    onChange={handleChange}
                    // helperText={errors.discount}
                    // error={errors.discount ? true : false}
                    sx={{ marginBottom: "18px" }}
                    InputLabelProps={{
                      style: { fontSize: "14px" },
                    }}
                  />
                </Div>
                <Div>
                  <Input
                    label="Stock"
                    variant="outlined"
                    name="stock"
                    defaultValue={selectedItem?.stock}
                    onChange={handleChange}
                    // helperText={errors.stock}
                    // error={errors.stock ? true : false}
                    sx={{ marginBottom: "18px" }}
                    InputLabelProps={{
                      style: { fontSize: "14px" },
                    }}
                  />
                </Div>
                <Div>
                  <Input
                    label="Color"
                    variant="outlined"
                    name="color"
                    defaultValue={selectedItem?.color}
                    onChange={handleChange}
                    // helperText={errors.color}
                    // error={errors.color ? true : false}
                    sx={{ marginBottom: "18px" }}
                    InputLabelProps={{
                      style: { fontSize: "14px" },
                    }}
                  />
                </Div>
                <Div>
                  <Input
                    label="Talle (Ejemplo: s - m - l - 41 -42 - 43)"
                    variant="outlined"
                    name="size"
                    defaultValue={selectedItem?.size}
                    onChange={handleChange}
                    // helperText={errors.size}
                    // error={errors.size ? true : false}
                    sx={{ marginBottom: "18px" }}
                    InputLabelProps={{
                      style: { fontSize: "14px" },
                    }}
                  />
                </Div>
                <Div>
                  <Input
                    label="Descripción del Producto"
                    variant="outlined"
                    name="description"
                    defaultValue={selectedItem?.description}
                    onChange={handleChange}
                    // helperText={errors.description}
                    // error={errors.description ? true : false}
                    sx={{ marginBottom: "18px" }}
                    InputLabelProps={{
                      style: { fontSize: "14px" },
                    }}
                  />
                </Div>
                <Div>
                  <Input
                    label="Categoria del Producto"
                    variant="outlined"
                    name="category"
                    defaultValue={selectedItem?.category}
                    onChange={handleChange}
                    // helperText={errors.category}
                    // error={errors.category ? true : false}
                    sx={{ marginBottom: "18px" }}
                    InputLabelProps={{
                      style: { fontSize: "14px" },
                    }}
                  />
                </Div>
              </ProductInfo>
              <ImagesInputsContainer>
                {selectedItem ? (
                  <ImageContainer>
                    {existingImages.map((image, index) => (
                      <div
                        key={index}
                        style={{
                          height: "19%",
                          paddingTop: "5px",
                          borderTop: "1px solid lightgray",
                          borderBottom: "1px solid lightgrey",
                        }}
                      >
                        <p
                          style={{
                            textAlign: "center",
                            marginLeft: windowWidth < 600 ? "0px" : "35px",
                            marginBottom: "-21px",
                            paddingTop: "5px",
                          }}
                        >
                          {index + 1}
                        </p>{" "}
                        <CloseIcon
                          onClick={() => handleDeleteImage(index + 1)}
                          sx={{ cursor: "pointer", display: "flex" }}
                          fontSize="small"
                        />
                        <div
                          style={{
                            width: "70px",
                            height: "80px",
                            marginLeft: windowWidth < 600 ? "0px" : "35px",
                            border: image ? "1px solid gray" : "none",
                            marginBottom: "20px",
                          }}
                        >
                          {image ? (
                            <img
                              src={image}
                              alt={`imagen de producto ${index + 1}`}
                              style={{
                                width: "100%",
                                height: "100%",
                                objectFit: "cover",
                              }}
                            />
                          ) : (
                            <label
                              style={{
                                height: "80px",
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
                      </div>
                    ))}
                  </ImageContainer>
                ) : (
                  <ImageContainer>
                    {/* Render 5 empty slots here for newProduct*/}
                    {[1, 2, 3, 4, 5].map((slotIndex) => (
                      <div
                        key={slotIndex}
                        style={{
                          height: "19%",
                          paddingTop: "5px",
                          borderTop: "1px solid lightgray",
                          borderBottom: "1px solid lightgrey",
                        }}
                      >
                        <p
                          style={{
                            textAlign: "center",
                            marginLeft: windowWidth < 600 ? "0px" : "35px",
                          }}
                        >
                          {slotIndex}
                        </p>{" "}
                        <div
                          style={{
                            width: "70px",
                            height: "80px",
                            marginLeft: windowWidth < 600 ? "0px" : "35px",
                            border: "1px solid gray",
                            marginBottom: "20px",
                          }}
                        >
                          {confirmedImageUpload[slotIndex] ? (
                            // Render the uploaded image if confirmed
                            <img
                              src={
                                file[slotIndex].length > 0
                                  ? URL.createObjectURL(file[slotIndex][0])
                                  : ""
                              }
                              alt={
                                file[slotIndex].length > 0
                                  ? "Product Image"
                                  : "No Image Available"
                              }
                              style={{
                                width: "100%",
                                height: "100%",
                                objectFit: "cover",
                              }}
                            />
                          ) : (
                            // Render this if not confirmed
                            <label
                              style={{
                                height: "80px",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                textAlign: "center",
                                fontSize: ".68rem",
                                border: "1px solid lightgray",
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
                    <div
                      key={inputNumber}
                      style={{
                        height: "19%",
                        paddingTop: "5px",
                        borderTop: "1px solid lightgray",
                        borderBottom: "1px solid lightgrey",
                        width: "98%",
                      }}
                    >
                      <h2
                        style={{
                          margin: "-3px 14px 0 20px",
                          paddingTop: "10px",
                        }}
                      >
                        {inputNumber === 1 ? "Imagen Principal" : "(Opcional)"}{" "}
                      </h2>
                      <ImageDiv>
                        <LoadImgBtn
                          component="label"
                          variant="contained"
                          startIcon={<CloudUploadIcon />}
                          size="small"
                          sx={{
                            margin: "5px 60px 20px 10px",
                            fontSize: "0.6125rem",
                            "& .MuiButton-label": {
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                            },
                          }}
                          disabled={file[inputNumber].length > 0}
                        >
                          {file[inputNumber].length > 0 ||
                          isLoading[inputNumber]
                            ? "Modificar"
                            : "Cargar"}
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
                                right: "50%",
                              }}
                              fontSize="small"
                              onClick={() => handleCancelFile(inputNumber)}
                            />
                            {isLoading[inputNumber] ? (
                              <div style={{ marginLeft: "-15px" }}>
                                <Ring
                                  size={25}
                                  lineWeight={7}
                                  speed={1}
                                  color="black"
                                />
                              </div>
                            ) : (
                              <>
                                {confirmedImageUpload[inputNumber] === true ? (
                                  <div style={{ marginLeft: "-15px" }}>
                                    <TaskAltIcon
                                      color="success"
                                      fontSize="large"
                                    />
                                  </div>
                                ) : (
                                  <ConfirmImgLoadBtn
                                    variant="contained"
                                    size="small"
                                    sx={{
                                      marginTop: "5px",
                                      paddingBottom: "3px",
                                      fontSize: "0.6125rem",
                                    }}
                                    onClick={
                                      /* handleConfirmAllImages */ () =>
                                        handleImage(inputNumber)
                                    }
                                    style={{
                                      display: isLoading[inputNumber] && "none",
                                    }}
                                  >
                                    Confirmar
                                  </ConfirmImgLoadBtn>
                                )}
                              </>
                            )}
                          </div>
                        )}
                      </ImageDiv>
                    </div>
                  ))}
                </InputsContainer>
              </ImagesInputsContainer>
            </InfoImageContainer>
            <SubmitBtn
              type="submit"
              variant="contained"
              sx={{
                margin: "20px auto",
                backgroundColor: "black",
                "&:hover": {
                  backgroundColor: "#4b4d4e",
                },
              }}
            >
              {selectedItem ? "Confirmar cambios" : "Crear Producto"}
            </SubmitBtn>
          </Form>
        </FormWrapper>
      )}
    </>
  );
};

const FormWrapper = styled.div`
  width: 100%;
  max-height: 600px;
  overflow-y: auto;
  padding: 20px 12px;
`;
const Form = styled.form`
  display: flex;
  flex-direction: column;
  margin: 0 auto;
  width: 90%;
`;
const Input = styled(TextField)`
  .css-1t8l2tu-MuiInputBase-input-MuiOutlinedInput-input {
    padding: 12.5px 5px;
  }
`;
const ConfirmImgLoadBtn = styled(Button)`
  width: 100px;
  @media (max-width: 420px) {
    width: 70px;
  }
`;
const LoadImgBtn = styled(Button)`
  width: 100px;
`;
const SubmitBtn = styled(Button)`
  width: 25%;
  @media (max-width: 900px) {
    width: 200px;
  }
`;
const SuccessMessage = styled.p`
  color: #091209;
  font-weight: bold;
  text-align: center;
`;
const ProductInfo = styled.div`
  width: 100%;
`;
const InfoImageContainer = styled.div`
  display: flex;
  @media (max-width: 56.25rem) {
    flex-direction: column;
  }
`;
const Div = styled.div`
  display: flex;
  flex-direction: column;
`;
const ImageDiv = styled.div`
  display: flex;
  -webkit-box-align: center;
  align-items: flex-start;
  -webkit-box-pack: start;
  justify-content: space-between;
  margin: 21px 0px 0 10px;
  position: relative;
`;
const CancelUploadedFile = styled(CloseIcon)`
  @media (max-width: 900px) {
    left: 30%;
  }
  @media (max-width: 570px) {
    left: 36%;
  }
  @media (max-width: 500px) {
    left: 40%;
  }
  @media (max-width: 392px) {
    left: 44%;
  }
`;
const ImagesInputsContainer = styled.div`
  display: flex;
  justify-content: flex-start;
  width: 85%;
  margin-left: 15px;
  @media (max-width: 500px) {
    margin-left: 0px;
    width: 98%;
  }
`;
const InputsContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 98%;
`;
const ImageContainer = styled.div`
  display: flex;
  flex-direction: column;
`;
