import {
  Box,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import DeleteIcon from "@mui/icons-material/Delete";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { useContext, useEffect, useState } from "react";
import styled from "styled-components/macro";
import { db, uploadFile } from "../../../../../../firebaseConfig";
import { addDoc, collection, doc, updateDoc } from "firebase/firestore";
import { GlobalToolsContext } from "../../../../../context/GlobalToolsContext";
import { Ring } from "@uiball/loaders";
import { bouncy } from "ldrs";
bouncy.register();
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
  const [imageQueue, setImageQueue] = useState([]); // State for manage images loading order
  const [categoryValue, setCategoryValue] = useState("");
  const [sizeValue, setSizeValue] = useState("");

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

  const colorMapping = {
    Black: "#000000",
    White: "#ffffff",
    Grey: "#8e8e8e",
    "Light Blue": "#269be4",
    Blue: "#2626e4",
    Navy: "#04046e",
    Purple: "#dc10ce",
    Pink: "#ea7baf",
    Red: "#e81a1a",
    Orange: "#f49d2c",
    Yellow: "#e6d21a",
    "Light Green": "#67dd4d",
    Green: "#24df13",
    Brown: "#682f21",
  };
  const [colorPickerOpen, setColorPickerOpen] = useState(false);
  const [selectedColors, setSelectedColors] = useState(() => newProduct.color || []);


  //Render images if selectedItem
  useEffect(() => {
    if (selectedItem) {
      setExistingImages(selectedItem.img);
      setCategoryValue(selectedItem.category || "");
      setSizeValue(selectedItem.size || "");
      setSelectedColors(selectedItem.color || []);
    }
    console.log(selectedColors);
  }, [selectedItem]);

  const handleColorSelect = (color) => {
    setSelectedColors((prevColors) => {
      if (prevColors.length >= 3 || prevColors.includes(color)) {
        return prevColors;
      }
      const newColors = [...prevColors, color];

      setNewProduct((prevProduct) => ({
        ...prevProduct,
        color: newColors,
      }));

      if (selectedItem) {
        setSelectedItem((prevSelectedItem) => ({
          ...prevSelectedItem,
          color: newColors,
        }));
      }
      return newColors;
    });
    setColorPickerOpen(false);
  };

  const handleColorRemove = (color) => {
    setSelectedColors((prevColors) => {
      const newColors = prevColors.filter((c) => c !== color);

      setNewProduct((prevProduct) => ({
        ...prevProduct,
        color: newColors,
      }));

      if (selectedItem) {
        setSelectedItem((prevSelectedItem) => ({
          ...prevSelectedItem,
          color: newColors,
        }));
      }

      return newColors;
    });
  };

  ///////*****         HANDLE CHANGE        ******///////
  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "category") {
      setCategoryValue(value);
    }
    if (name === "size") {
      setSizeValue(value);
    }

    if (selectedItem) {
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
      const resizedUrl = originalUrl.replace(/(\.[^.]*)?$/, "_1200x1600$1");

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
        color: selectedItem.color /* .toLowerCase() */,
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
          createdAt: new Date().toISOString(),
          unit_price: newProduct.unit_price
            ? parseFloat(newProduct.unit_price)
            : 0,
          discountPrice: totalPrice,
          stock: newProduct.stock ? parseInt(newProduct.stock) : 0,
          color: newProduct.color /* .toLowerCase() */ || "",
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
          createdAt: new Date().toISOString(),
          unit_price: totalPrice,
          stock: newProduct.stock ? parseInt(newProduct.stock) : 0,
          color: newProduct.color /* .toLowerCase() */ || "",
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
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-around",
                    width: "80%",
                    gap: "1rem",
                    margin: "0 auto",
                    flexDirection: "column",
                  }}
                >
                  <p
                    style={{
                      textAlign: "center",
                      textTransform: "uppercase",
                      fontWeight: "500",
                      borderTop: "1px solid darkgrey",
                      padding: "30px 0 30px",
                      textDecoration:"underline",
                    }}
                  >
                    Product Information
                  </p>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      width: "100%",
                      gap: "2rem",
                    }}
                  >
                    <Div style={{ width: "33%" }}>
                      <Input
                        label="Product ID"
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
                    <Div style={{ width: "67%" }}>
                      <Input
                        label="Product Name"
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
                  </div>
                  <Div>
                    <Input
                      label="Product Subtitle"
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
                </div>
                <div
                  style={{
                    width: "80%",
                    margin: "0px auto",
                    paddingBottom: "50px",
                    borderTop: "1px solid darkgrey",
                    borderBottom: "1px solid darkgrey",
                  }}
                >
                  <p
                    style={{
                      textTransform: "uppercase",
                      fontWeight: "500",
                      padding: "30px 0 30px",
                      textDecoration:"underline",
                      textAlign: "center",
                    }}
                  >
                    Product Price & Details
                  </p>
                  <PriceDetailsContainer>
                    <ProductPriceContainer>
                      <Div
                        style={{
                          position: "relative",
                        }}
                      >
                        <span
                          style={{
                            position: "absolute",
                            left: "-12px",
                            top: "8px",
                          }}
                        >
                          $
                        </span>
                        <Input
                          label="Price"
                          variant="outlined"
                          name="unit_price"
                          defaultValue={selectedItem?.unit_price}
                          onChange={handleChange}
                          size="small"
                          // helperText={errors.unit_price}
                          // error={errors.unit_price ? true : false}
                          InputLabelProps={{
                            style: { fontSize: "14px" },
                          }}
                        />
                      </Div>
                      <Div style={{ position: "relative" }}>
                        <span
                          style={{
                            position: "absolute",
                            left: "75px",
                            top: "8px",
                            fontSize: ".9rem",
                          }}
                        >
                          ( % )
                        </span>
                        <Input
                          label="Discount"
                          variant="outlined"
                          name="discount"
                          defaultValue={selectedItem?.discount}
                          onChange={handleChange}
                          size="small"
                          // helperText={errors.discount}
                          // error={errors.discount ? true : false}
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
                          defaultValue={
                            selectedItem && selectedItem.stock !== undefined
                              ? selectedItem.stock
                              : ""
                          }
                          onChange={handleChange}
                          size="small"
                          // helperText={errors.stock}
                          // error={errors.stock ? true : false}
                          InputLabelProps={{
                            style: { fontSize: "14px" },
                          }}
                        />
                      </Div>
                    </ProductPriceContainer>
                    <ProductsDetailsContainer>
                      <Div style={{ width: "100%" }}>
                        <FormControl>
                          <InputLabel
                            sx={{ fontSize: "14px", lineHeight: ".8" }}
                            id="demo-simple-select-label"
                          >
                            Category
                          </InputLabel>
                          <InputSelect
                            label="Product Category"
                            variant="outlined"
                            name="category"
                            defaultValue={
                              selectedItem ? selectedItem.category : ""
                            }
                            onChange={handleChange}
                            size="small"
                            //helperText={errors.category}
                            //error={errors.category ? true : false}
                          >
                            <MenuItem value={"bags"}>Bags</MenuItem>
                            <MenuItem value={"hoodies"}>Hoodies</MenuItem>
                            <MenuItem value={"pants"}>Pants</MenuItem>
                            <MenuItem value={"shoes"}>Shoes</MenuItem>
                            <MenuItem value={"shirts"}>Shirts</MenuItem>
                          </InputSelect>
                        </FormControl>
                      </Div>

                      <Div
                        style={{
                          position: "relative",
                          display: "flex",
                          flexDirection: "row",
                          justifyContent: "space-between",
                          alignItems:"center",
                          border: "1px solid darkgrey",
                          borderRadius: "4px",
                          padding: "2px",
                        }}
                      >
                        <Button
                          type="button"
                          onClick={() => setColorPickerOpen(true)}
                          sx={{
                            width: "40%",
                            fontSize: ".7rem",
                            marginRight: "10px",
                            padding: "8px 0",
                            height:"30px"
                          }}
                          size="medium"
                          variant="contained"
                        >
                          + add color
                        </Button>
                        {colorPickerOpen && (
                          <Box
                            sx={{
                              display: "flex",
                              flexWrap: "wrap",
                              p: 1,
                              bgcolor: "background.paper",
                              boxShadow: 3,
                              border: "1px solid grey",
                              position: "absolute",
                              top: "44px",
                              zIndex: 2,
                              width: "300px",
                            }}
                          >
                            {Object.keys(colorMapping).map((color) => (
                              <Box
                                key={color}
                                sx={{
                                  display: "flex",
                                  flexDirection: "column",
                                  alignItems: "center",
                                  margin: "5px",
                                  width: "80px",
                                  border: "1px solid darkgrey",
                                  borderRadius: "4px",
                                }}
                              >
                                <Box
                                  sx={{
                                    width: "100%",
                                    height: "34px",
                                    bgcolor: colorMapping[color],
                                    cursor: "pointer",
                                    borderRadius: "4px",
                                    border: "1px solid darkgrey",
                                  }}
                                  onClick={() => handleColorSelect(color)}
                                />
                                <Typography
                                  variant="body2"
                                  sx={{
                                    cursor: "pointer",
                                  }}
                                  onClick={() => handleColorSelect(color)}
                                >
                                  {color}
                                </Typography>
                              </Box>
                            ))}
                          </Box>
                        )}

                        {selectedColors.length > 0 && (
                          <div
                            style={{
                              display: "flex",
                              gap: ".6rem",
                            }}
                          >
                            {selectedColors.map((color) => (
                              <div
                                key={color}
                                style={{
                                  width: "40px",
                                  height: "34px",
                                  borderRadius: "6px",
                                  backgroundColor: colorMapping[color],
                                  position: "relative",
                                  display: "inline-block",
                                  border: "1px solid darkgrey",
                                }}
                              >
                                <CloseIcon
                                  onClick={() => handleColorRemove(color)}
                                  style={{
                                    position: "absolute",
                                    top: "-5px",
                                    right: "-6px",
                                    width: "16px",
                                    height: "16px",
                                    cursor: "pointer",
                                    color: "#fff",
                                    backgroundColor: "rgba(0, 0, 0, 0.5)",
                                    borderRadius: "50%",
                                  }}
                                />
                              </div>
                            ))}
                          </div>
                        )}
                      </Div>
                      <Div style={{ width: "100%" }}>
                        <FormControl>
                          <InputLabel
                            sx={{ fontSize: "14px", lineHeight: ".8" }}
                            id="size-label"
                          >
                            Size
                          </InputLabel>
                          <InputSelect
                            label="Size-"
                            id="size"
                            name="size"
                            value={sizeValue}
                            onChange={handleChange}
                            size="small"
                          >
                            {categoryValue === "shoes" ||
                            categoryValue === "bags"
                              ? [39, 40, 41, 42, 43, 44, 45].map((size) => (
                                  <MenuItem key={size} value={size}>
                                    {size}
                                  </MenuItem>
                                ))
                              : ["xs", "s", "m", "l", "xl", "xxl"].map(
                                  (size) => (
                                    <MenuItem key={size} value={size}>
                                      {size.toUpperCase()}
                                    </MenuItem>
                                  )
                                )}
                          </InputSelect>
                        </FormControl>
                      </Div>
                    </ProductsDetailsContainer>
                  </PriceDetailsContainer>
                </div>
                <Div style={{ width: "80%", margin: " 0 auto" }}>
                  <Input
                    id="standard-textarea"
                    label="Product Description"
                    multiline
                    variant="outlined"
                    rows={4}
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
              {selectedItem ? "Confirm changes" : "Create product"}
            </SubmitBtn>
          </Form>
        </FormWrapper>
      )}
    </>
  );
};

const FormWrapper = styled.div`
  width: 100%;
  height: 100%;
  overflow-y: auto;
  padding: 32px 12px;
  background-color: #bac7e194;
  ::-webkit-scrollbar {
    width: 12px;
  }
  ::-webkit-scrollbar-thumb {
    background-color: #3f3f3f;
    border-radius: 25px;
  }
  ::-webkit-scrollbar-thumb:hover {
    background-color: #555;
  }
  ::-webkit-scrollbar-track {
    background-color: #f1f1f1;
  }
`;
const Form = styled.form`
  display: flex;
  flex-direction: column;
  margin: 0 auto;
  width: 88%;
  background-color: rgb(253, 253, 253);
  box-shadow: rgba(0, 0, 0, 0.45) 0px 4px 27px -4px;
  border-radius: 10px;
  padding-bottom: 60px;
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
  width: 33%;
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
  display: flex;
  flex-direction: column;
  gap: 2rem;
  padding: 70px 0px 20px;
  margin: 0px auto 18px;
  box-shadow: rgba(0, 0, 0, 0.45) 0px -13px 11px -15px;
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
  margin: 0px auto 28px;
  width: 90%;
  padding-top: 24px;
  box-shadow: rgba(0, 0, 0, 0.45) 0px 14px 10px -14px;
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
const PriceDetailsContainer = styled.div`
  display: flex;
`;
const ProductPriceContainer = styled.div`
  width: 100%;
  padding-right: 20px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: 1.5rem;
`;
const ProductsDetailsContainer = styled.div`
  width: 100%;
  padding-left: 20px;
  border-left: 1px solid grey;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: 1.5rem;
`;
