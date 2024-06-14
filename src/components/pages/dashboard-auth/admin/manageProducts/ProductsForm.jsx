import {
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import DeleteIcon from "@mui/icons-material/Delete";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { useContext, useEffect, useState } from "react";
import styled from "styled-components/macro";
import { db, uploadFile } from "../../../../../firebaseConfig";
import { addDoc, collection, doc, updateDoc } from "firebase/firestore";
import { GlobalToolsContext } from "../../../../context/GlobalToolsContext";
import { Ring } from "@uiball/loaders";
import { bouncy } from "ldrs";
import TaskAltIcon from "@mui/icons-material/TaskAlt";
bouncy.register();

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
  const [imageQueue, setImageQueue] = useState([]); // State for manage images loading order
  const [categoryValue, setCategoryValue] = useState("");

  //Loader after image upload success
  const [isLoadingImage, setIsLoadingImage] = useState({
    1: false,
    2: false,
    3: false,
    4: false,
    5: false,
  });
  //Loader while image upload
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
  //Confirmed image upload state
  const [confirmedImageUpload, setConfirmedImageUpload] = useState({
    1: false,
    2: false,
    3: false,
    4: false,
    5: false,
  });

  const [newProduct, setNewProduct] = useState({
    productId: "",
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

  //Render images if selectedItem
  useEffect(() => {
    if (selectedItem) {
      setExistingImages(selectedItem.img);
    }
  }, [selectedItem]);

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
    setCategoryValue(value);
  };

  /////*****         HANDLE IMAGE INPUTS        ******///////

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

  //fetch original image URL and replace for resized image URL
  const getResizedImageUrl = async (originalUrl) => {
    try {
      // Construct the URL for the resized image based on the original URL
      const resizedUrl = originalUrl.replace(/(\.[^.]*)?$/, "_600x600$1");

      // Return the resized URL
      return resizedUrl;
    } catch (error) {
      console.error("Error getting resized image URL:", error);
      throw error;
    }
  };

  //Image queue processing
  useEffect(() => {
    const handleImageQueue = async () => {
      if (imageQueue.length > 0) {
        const { inputNumber, selectedFiles } = imageQueue[0];

        try {
          const newUrls = await Promise.all(
            selectedFiles.map(async (selectedFile) => {
              return await uploadFile(selectedFile);
            })
          );

          const resizedUrls = await Promise.all(
            newUrls.map(async (newUrl) => {
              const resizedUrl = await getResizedImageUrl(newUrl);
              return resizedUrl;
            })
          );

          // Set the uploaded image URLs to the corresponding input numbers
          if (selectedItem) {
            setSelectedItem((prevSelectedItem) => {
              const imgCopy = [...(prevSelectedItem.img || [])];
              imgCopy[inputNumber - 1] = resizedUrls[0];
              return {
                ...prevSelectedItem,
                img: imgCopy,
              };
            });
          } else {
            setNewProduct((prevProduct) => {
              const imgCopy = [...(prevProduct.img || [])];
              imgCopy[inputNumber - 1] = resizedUrls[0];
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

          setIsLoadingImage((prevLoading) => ({
            ...prevLoading,
            [inputNumber]: true,
          }));

          // Set the confirmedImageUpload state for this input to true
          setConfirmedImageUpload((prevConfirmedImageUpload) => ({
            ...prevConfirmedImageUpload,
            [inputNumber]: true,
          }));

          // Remove the processed item from the queue
          setImageQueue((prevQueue) => {
            const updatedQueue = [...prevQueue];
            updatedQueue.shift(); // Use shift to remove the first item
            return updatedQueue;
          });

          setTimeout(() => {
            setIsLoadingImage((prevLoading) => ({
              ...prevLoading,
              [inputNumber]: false,
            }));
          }, 2000);
        }
      } else {
        // No more items in the queue, set isQueueProcessing to false
        setIsQueueProcessing(false);
      }
    };
    // Call handleImageQueue initially
    if (imageQueue.length > 0) {
      handleImageQueue();
    }
  }, [imageQueue, selectedItem, newProduct]);

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
    setIsLoadingImage((prevLoading) => ({
      ...prevLoading,
      [inputNumber]: true,
    }));

    const imgCopy = [...(selectedItem?.img || [])];
    // Mark the deleted slot as empty
    imgCopy[inputNumber - 1] = null;

    if (selectedItem) {
      setSelectedItem({ ...selectedItem, img: imgCopy });
      setTimeout(() => {
        setIsLoadingImage((prevLoading) => ({
          ...prevLoading,
          [inputNumber]: false,
        }));
      }, 2000);
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
        productId: parseInt(selectedItem.productId),
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
          productId: newProduct.productId ? parseInt(newProduct.productId) : 0,
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
          productId: newProduct.productId ? parseInt(newProduct.productId) : 0,
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

  // Define a mapping of color names to CSS color values
  const colorMapping = {
    black: "#000000",
    white: "#ffffff",
    grey: "#8e8e8e",
    blue: "#2626e4",
    purple: "#dc10ce",
    pink: "#ea7baf",
    red: "#e81a1a",
    orange: "#f49d2c",
    yellow: "#e6d21a",
    green: "#24df13",
    brown: "#682f21",
  };

  // Function to determine if the text should be white based on the background color
  const isDarkColor = (color) => {
    const darkColors = ["#000000", "#2626e4", "#dc10ce", "#e81a1a", "#682f21"];
    return darkColors.includes(color);
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
                    name="productId"
                    defaultValue={selectedItem?.productId}
                    onChange={handleChange}
                    size="small"
                    // helperText={errors.productId}
                    // error={errors.productId ? true : false}
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
                    size="small"
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
                    size="small"
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
                    size="small"
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
                    size="small"
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
                    size="small"
                    // helperText={errors.stock}
                    // error={errors.stock ? true : false}
                    sx={{ marginBottom: "18px" }}
                    InputLabelProps={{
                      style: { fontSize: "14px" },
                    }}
                  />
                </Div>
                <Div>
                  <FormControl>
                    <InputLabel
                      sx={{ fontSize: "14px", lineHeight: ".8" }}
                      id="demo-simple-select-label"
                    >
                      Product Category
                    </InputLabel>
                    <InputSelect
                      label="Product Category"
                      variant="outlined"
                      name="category"
                      defaultValue={selectedItem ? selectedItem.category : ""}
                      onChange={handleChange}
                      size="small"
                      //helperText={errors.category}
                      //error={errors.category ? true : false}
                      sx={{ marginBottom: "18px" }}
                    >
                      <MenuItem value={"bags"}>Bags</MenuItem>
                      <MenuItem value={"hoodies"}>Hoodies</MenuItem>
                      <MenuItem value={"pants"}>Pants</MenuItem>
                      <MenuItem value={"shoes"}>Shoes</MenuItem>
                      <MenuItem value={"shirts"}>Shirts</MenuItem>
                    </InputSelect>
                  </FormControl>
                </Div>
                <Div>
                  <FormControl>
                    <InputLabel
                      sx={{ fontSize: "14px", lineHeight: ".8" }}
                      id="demo-simple-select-label"
                    >
                      Color
                    </InputLabel>
                    <InputSelect
                      label="Color"
                      variant="outlined"
                      name="color"
                      defaultValue={selectedItem ? selectedItem.color : ""}
                      onChange={handleChange}
                      size="small"
                      // helperText={errors.color}
                      // error={errors.color ? true : false}
                      sx={{ marginBottom: "18px" }}
                      renderValue={(selected) => (
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            backgroundColor: colorMapping[selected],
                            color: isDarkColor(colorMapping[selected])
                              ? "white"
                              : "black",
                            padding: "5px 10px",
                            borderRadius: "4px",
                          }}
                        >
                          {selected.charAt(0).toUpperCase() + selected.slice(1)}
                        </div>
                      )}
                    >
                      {Object.keys(colorMapping).map((color) => (
                        <MenuItem
                          key={color}
                          value={color}
                          style={{
                            backgroundColor: colorMapping[color],
                            color: isDarkColor(colorMapping[color])
                              ? "white"
                              : "black",
                          }}
                        >
                          {color.charAt(0).toUpperCase() + color.slice(1)}
                        </MenuItem>
                      ))}
                    </InputSelect>
                  </FormControl>
                </Div>
                <Div>
                  <FormControl>
                    <InputLabel
                      sx={{ fontSize: "14px", lineHeight: ".8" }}
                      id="demo-simple-select-label"
                    >
                      Size
                    </InputLabel>
                    <InputSelect
                      label="Size"
                      variant="outlined"
                      name="size"
                      defaultValue={selectedItem ? selectedItem.size : ""}
                      onChange={handleChange}
                      size="small"
                      //helperText={errors.category}
                      //error={errors.category ? true : false}
                      sx={{ marginBottom: "18px" }}
                    >
                      {categoryValue === "shoes" || categoryValue === "bags"
                        ? [
                            <MenuItem key={39} value={39}>
                              39
                            </MenuItem>,
                            <MenuItem key={40} value={40}>
                              40
                            </MenuItem>,
                            <MenuItem key={41} value={41}>
                              41
                            </MenuItem>,
                            <MenuItem key={42} value={42}>
                              42
                            </MenuItem>,
                            <MenuItem key={43} value={43}>
                              43
                            </MenuItem>,
                            <MenuItem key={44} value={44}>
                              44
                            </MenuItem>,
                            <MenuItem key={45} value={45}>
                              45
                            </MenuItem>,
                          ]
                        : [
                            <MenuItem key={"xs"} value={"xs"}>
                              X Small
                            </MenuItem>,
                            <MenuItem key={"s"} value={"s"}>
                              Small
                            </MenuItem>,
                            <MenuItem key={"m"} value={"m"}>
                              Medium
                            </MenuItem>,
                            <MenuItem key={"l"} value={"l"}>
                              Large
                            </MenuItem>,
                            <MenuItem key={"xl"} value={"xl"}>
                              X Large
                            </MenuItem>,
                            <MenuItem key={"xxl"} value={"xxl"}>
                              XX Large
                            </MenuItem>,
                          ]}
                    </InputSelect>
                  </FormControl>
                </Div>
                <Div>
                  <Input
                    label="Descripción del Producto"
                    variant="outlined"
                    name="description"
                    defaultValue={selectedItem?.description}
                    onChange={handleChange}
                    size="small"
                    // helperText={errors.description}
                    // error={errors.description ? true : false}
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
                          display: "flex",
                          height: "170px",
                        }}
                      >
                        <ImgPlaceHolder>
                          <p>{index + 1}</p>{" "}
                          <div
                            style={{
                              width: "85px",
                              height: "100px",
                            }}
                          >
                            {isLoadingImage[index + 1] ? (
                              <div
                                style={{
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "center",
                                  width: "85px",
                                  height: "100px",
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
                                  height: "100px",
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
                            width: "85px",
                            height: "100px",
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
                              {/* <DeleteIcon
                                onClick={() => handleDeleteImage(slotIndex)}
                                sx={{
                                  cursor: "pointer",
                                  display: "flex",
                                  alignItems: "center",
                                  marginTop: "8px",
                                  height: "2em",
                                  width: "100%",
                                  fontSize: ".65rem",
                                }}
                              /> */}
                            </>
                          ) : (
                            // Render this if not confirmed
                            <label
                              style={{
                                height: "100px",
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
                      >
                        {/* {inputNumber === 1 ? "Imagen Principal" : "(Opcional)"}{" "} */}
                      </h2>
                      <LoadBtnContainer>
                        <LoadImgBtn
                          component="label"
                          variant="contained"
                          startIcon={
                            confirmedImageUpload[inputNumber] === false &&
                            isLoading[inputNumber] === false && (
                              <CloudUploadIcon />
                            )
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
                          {file[inputNumber].length > 0 &&
                          !isLoading[inputNumber] ? (
                            <TaskAltIcon color="success" fontSize="small" />
                          ) : !isLoading[inputNumber] ? (
                            "Cargar"
                          ) : (
                            <Ring
                              size={20}
                              lineWeight={7}
                              speed={1}
                              color="black"
                            />
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
                            {/* <CancelBtn
                              onClick={() => handleCancelFile(inputNumber)}
                            >
                              cancel{" "}
                            </CancelBtn> */}
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
                                    onClick={
                                      /* handleConfirmAllImages */ () =>
                                        handleImage(inputNumber)
                                    }
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
const InputSelect = styled(Select)`
  .css-1t8l2tu-MuiInputBase-input-MuiOutlinedInput-input {
    padding: 12.5px 5px;
  }
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
  flex-direction: column;
  @media (max-width: 56.25rem) {
    flex-direction: column;
  }
`;
const Div = styled.div`
  display: flex;
  flex-direction: column;
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
  margin-top: 20px;
  padding-top: 24px;
  box-shadow: rgba(0, 0, 0, 0.45) 0px 0px 6px;
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
