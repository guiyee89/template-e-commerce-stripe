import {
  Box,
  Button,
  IconButton,
  Modal,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
} from "@mui/material";
import styled, { keyframes } from "styled-components/macro";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import { addDoc, collection, deleteDoc, doc } from "firebase/firestore";
import { db } from "../../../../../../firebaseConfig";
import { useContext, useState } from "react";
import { PriceDiscountForm } from "./PriceDiscountForm";
import { GlobalToolsContext } from "../../../../../context/GlobalToolsContext";
import { Ring } from "@uiball/loaders";
import { ProductsFormContainer } from "./productForm/ProductsFormContainer";

export const ProductList = ({
  products,
  setIsChanged,
  foundProduct,
  searchProduct,
  setSearchProduct,
  fetchItemsByProductId,
}) => {
  const [open, setOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const { windowWidth } = useContext(GlobalToolsContext);
  const [newlyCopiedIds, setNewlyCopiedIds] = useState([]);
  const [searchLoading, setSearchLoading] = useState(false);

  // Sort items by color and size - highlight the last sorted item
  const customSort = (itemA, itemB) => {
    const sizeOrder = ["xs", "s", "m", "l", "xl", "xxl"];

    // First, compare by color
    if (itemA.color < itemB.color) return -1;
    if (itemA.color > itemB.color) return 1;

    // Check if sizes are numeric or alphabetic
    const isNumericA = !isNaN(itemA.size);
    const isNumericB = !isNaN(itemB.size);
    if (isNumericA && isNumericB) {
      // If both sizes are numeric, compare as numbers
      const sizeComparison = itemA.size - itemB.size;
      if (sizeComparison !== 0) return sizeComparison;
    } else if (!isNumericA && !isNumericB) {
      // If both sizes are alphabetic, compare based on the custom order
      const indexA = sizeOrder.indexOf(itemA.size.toLowerCase());
      const indexB = sizeOrder.indexOf(itemB.size.toLowerCase());
      const sizeComparison = indexA - indexB;
      if (sizeComparison !== 0) return sizeComparison;
    } else {
      // If one is numeric and the other is alphabetic, prioritize alphabetic
      return isNumericA ? 1 : -1;
    }
    // Compare by createdAt timestamp if colors and sizes are equal
    if (new Date(itemA.createdAt) < new Date(itemB.createdAt)) return -1;
    if (new Date(itemA.createdAt) > new Date(itemB.createdAt)) return 1;
    // If both items are equal in all criteria, return 0
    return 0;
  };

  // Sort the items array
  Array.isArray(products) && products.sort(customSort);

  const handleClose = () => {
    setOpen(false);
  };

  const handleOpen = (product) => {
    setSelectedItem(product);
    setOpen(true);
  };

  //Copy product function
  const copyProduct = async (id) => {
    const itemsCollection = collection(db, "products");
    const selectedProduct = products.find((product) => product.id === id);
    const copyItem = {
      ...selectedProduct,
      createdAt: new Date().toISOString(), // Set createdAt to current date and time
    };
    // Remove the 'id' field to let Firebase generate a new ID
    delete copyItem.id;
    const docRef = await addDoc(itemsCollection, copyItem);
    const newId = docRef.id;

    setIsChanged();
    // Add the newly copied item ID to the list
    setNewlyCopiedIds([...newlyCopiedIds, newId]);

    setTimeout(() => {
      // Remove the newly highlighted copied item ID from the list
      setNewlyCopiedIds((prevIds) =>
        prevIds.filter((itemId) => itemId !== newId)
      );
    }, 8000);
  };

  const deleteProduct = async (id) => {
    await deleteDoc(doc(db, "products", id));
    setIsChanged(); // Toggle isChanged to trigger useEffect
  };

  const handleSearchSubmit = (event) => {
    event.preventDefault();
    setSearchLoading(true);
    setTimeout(() => {
      fetchItemsByProductId(searchProduct);
      setSearchLoading(false);
    }, 1000);
  };

  return (
    <>
      <ProductListWrapper>
        <form onSubmit={handleSearchSubmit}>
          <ProductsButtonsContainer windowWidth={windowWidth}>
            <div>
              <TextFieldInput
                label="Buscar por ID"
                variant="outlined"
                name="id"
                size="small"
                value={searchProduct}
                onChange={(e) => setSearchProduct(e.target.value)}
                sx={{
                  marginTop: "12px",
                  marginLeft: "8px",
                  width: "130px",
                  "&.MuiInputBase-input": {
                    padding: "10.5px 14px",
                  },
                }}
                InputLabelProps={{
                  style: { fontSize: "12px", zIndex: "0" },
                }}
              />
              <Button
                type="submit"
                variant="contained"
                sx={{
                  marginLeft: "10px",
                  marginTop: "18px",
                  marginRight: "68px",
                  fontSize: "0.7rem",
                  backgroundColor: "black",
                  "&:hover": {
                    backgroundColor: "#4b4d4e",
                  },
                }}
              >
                {searchLoading ? (
                  <div
                    style={{
                      width: "48.6px",
                      height: "20px",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <Ring size={15} lineWeight={4} speed={1} color="white" />
                  </div>
                ) : (
                  <p
                    style={{
                      fontSize: windowWidth < 700 ? ".52rem" : "0.67rem",
                    }}
                  >
                    Search
                  </p>
                )}
              </Button>
            </div>
            <div style={{ margin: "1px 0 0 7px" }}>
              <Button
                variant="contained"
                sx={{
                  marginTop: "17px",
                  fontSize: windowWidth < 700 ? ".52rem" : "0.67rem",
                  backgroundColor: "black",
                  "&:hover": {
                    backgroundColor: "#4b4d4e",
                  },
                }}
                onClick={() => handleOpen(null)}
              >
                <p
                  style={{
                    display: "flex",
                    alignItems: "center",
                    lineHeight: "1.05",
                  }}
                >
                  <span
                    style={{
                      fontSize: windowWidth < 700 ? ".8rem" : "1.2rem",
                      fontWeight: "bold",
                      paddingRight: "0.5rem",
                    }}
                  >
                    +
                  </span>
                  add product
                </p>
              </Button>
            </div>
          </ProductsButtonsContainer>
        </form>
        <ProductListContainer>
          {foundProduct === true && (
            <>
              <DiscountFormContainer>
                <PriceDiscountForm
                  selectedItem={selectedItem}
                  setSelectedItem={setSelectedItem}
                  setIsChanged={setIsChanged}
                  products={products}
                />
              </DiscountFormContainer>
              <TableListContainer>
                <Table sx={{ minWidth: 650 }} aria-label="simple table">
                  <TableHead
                    sx={{
                      backgroundColor: "#bac7e194",
                      fontWeight: "bold",
                    }}
                  >
                    <TableRow>
                      <TableCell
                        align="center"
                        sx={{
                          padding: windowWidth < 600 && "10px",
                          fontSize: windowWidth < 600 && "0.7rem",
                        }}
                      >
                        ID
                      </TableCell>
                      <TableCell
                        align="center"
                        sx={{
                          padding: windowWidth < 600 && "10px",
                          fontSize: windowWidth < 600 && "0.7rem",
                        }}
                      >
                        Image
                      </TableCell>
                      <TableCell
                        align="center"
                        sx={{
                          padding: windowWidth < 600 && "10px",
                          fontSize: windowWidth < 600 && "0.7rem",
                        }}
                      >
                        Titulo
                      </TableCell>
                      <TableCell
                        align="center"
                        sx={{
                          padding: windowWidth < 600 && "10px",
                          fontSize: windowWidth < 600 && "0.7rem",
                        }}
                      >
                        Precio
                      </TableCell>
                      <TableCell
                        align="center"
                        sx={{
                          padding: windowWidth < 600 && "10px",
                          fontSize: windowWidth < 600 && "0.7rem",
                        }}
                      >
                        Descuento
                      </TableCell>
                      <TableCell
                        align="center"
                        sx={{
                          padding: windowWidth < 600 && "10px",
                          fontSize: windowWidth < 600 && "0.7rem",
                        }}
                      >
                        Stock
                      </TableCell>
                      <TableCell
                        align="center"
                        sx={{
                          padding: windowWidth < 600 && "10px",
                          fontSize: windowWidth < 600 && "0.7rem",
                        }}
                      >
                        Size
                      </TableCell>
                      <TableCell
                        align="center"
                        sx={{
                          padding: windowWidth < 600 && "10px",
                          fontSize: windowWidth < 600 && "0.7rem",
                        }}
                      >
                        Color
                      </TableCell>
                      <TableCell
                        align="center"
                        sx={{
                          padding: windowWidth < 600 && "10px",
                          fontSize: windowWidth < 600 && "0.7rem",
                        }}
                      >
                        Categoria
                      </TableCell>
                      <TableCell
                        align="center"
                        sx={{
                          padding: windowWidth < 600 && "10px",
                          fontSize: windowWidth < 600 && "0.7rem",
                        }}
                      >
                        Actions
                      </TableCell>
                    </TableRow>
                  </TableHead>

                  <TableBody>
                    {Array.isArray(products) &&
                      products.map((product) => (
                        <AnimatedTableRow
                          key={product.id}
                          label="New"
                          className={
                            newlyCopiedIds.includes(product.id)
                              ? "highlighted"
                              : ""
                          }
                          sx={{
                            "&:last-child td, &:last-child th": { border: 0 },
                            backgroundColor: newlyCopiedIds.includes(product.id)
                              ? "rgba(253, 253, 253, 0.8)"
                              : "inherit",
                          }}
                        >
                          <TableCell align="center" component="th" scope="row">
                            {product.productId}
                          </TableCell>
                          <ImgCell
                            align="center"
                            component="th"
                            scope="row"
                            sx={{
                              padding: windowWidth < 1100 ? "8px" : "12px",
                            }}
                          >
                            <Img src={product.img[0]} />
                          </ImgCell>
                          <TableCell
                            align="center"
                            component="th"
                            scope="row"
                            sx={{
                              textTransform: "capitalize",
                              padding: windowWidth < 600 && "10px",
                              fontSize: windowWidth < 600 && "0.72rem",
                            }}
                          >
                            {product.title}
                          </TableCell>
                          <TableCell
                            align="center"
                            component="th"
                            scope="row"
                            sx={{
                              padding: windowWidth < 600 && "10px",
                              fontSize: windowWidth < 600 && "0.72rem",
                            }}
                          >
                            $ {product.unit_price}
                          </TableCell>
                          <TableCell
                            align="center"
                            component="th"
                            scope="row"
                            sx={{
                              padding: "0px",
                              fontSize: windowWidth < 600 && "0.72rem",
                            }}
                          >
                            {product.discount ? (
                              <>
                                {product.discount}% <br /> ( $
                                {product.discountPrice} )
                              </>
                            ) : (
                              "-"
                            )}
                          </TableCell>

                          <TableCell
                            align="center"
                            component="th"
                            scope="row"
                            sx={{
                              fontSize: windowWidth < 600 && "0.72rem",
                            }}
                          >
                            {product.stock}
                          </TableCell>
                          <TableCell
                            align="center"
                            component="th"
                            scope="row"
                            sx={{
                              textTransform: "uppercase",
                              fontSize: windowWidth < 600 && "0.72rem",
                            }}
                          >
                            {product.size}
                          </TableCell>
                          <TableCell
                            align="center"
                            component="th"
                            scope="row"
                            sx={{
                              textTransform: "capitalize",
                              whiteSpace: "normal",
                              lineHeight: "1.2",
                              padding: "0",
                              minWidth: "80px",
                              fontSize: windowWidth < 600 && "0.72rem",
                            }}
                          >
                            {product.color.map((color, index) => (
                              <span
                                key={color}
                                style={{
                                  fontSize:
                                    index === 0 && windowWidth > 600
                                      ? ".85rem"
                                      : ".72rem",
                                  fontWeight: index === 0 ? "500" : "normal",
                                }}
                              >
                                {index > 0 && <br />}
                                {color}
                              </span>
                            ))}
                          </TableCell>
                          <TableCell
                            align="center"
                            component="th"
                            scope="row"
                            sx={{
                              textTransform: "capitalize",
                              fontWeight: "500",
                              fontSize: windowWidth < 600 && "0.72rem",
                            }}
                          >
                            {product.category}
                          </TableCell>
                          <TableCell
                            align="center"
                            component="th"
                            scope="row"
                            sx={{
                              padding: "4px",
                              minWidth: "130px",
                              position: "relative",
                              fontWeight: "500",
                            }}
                          >
                            {newlyCopiedIds.includes(product.id) && (
                              <NewLabel>New</NewLabel>
                            )}
                            <IconButton onClick={() => handleOpen(product)}>
                              <EditIcon
                                sx={{ fontSize: windowWidth < 600 && "1.2rem" }}
                              />
                            </IconButton>
                            <IconButton onClick={() => copyProduct(product.id)}>
                              <ContentCopyIcon
                                sx={{ fontSize: windowWidth < 600 && "1.2rem" }}
                              />
                            </IconButton>
                            <IconButton
                              onClick={() => deleteProduct(product.id)}
                            >
                              <DeleteIcon
                                sx={{ fontSize: windowWidth < 600 && "1.2rem" }}
                              />
                            </IconButton>
                          </TableCell>
                        </AnimatedTableRow>
                      ))}
                  </TableBody>
                </Table>
              </TableListContainer>
            </>
          )}

          <Modal
            sx={{ maxWidth: "1000px", margin: "0 auto" }}
            open={open}
            onClose={handleClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
          >
            <Box sx={{ ...style, width: windowWidth < 700 ? "100%" : "82%" }}>
              <ProductsFormContainer
                handleClose={handleClose}
                setIsChanged={setIsChanged}
                selectedItem={selectedItem}
                setSelectedItem={setSelectedItem}
              />
            </Box>
          </Modal>
        </ProductListContainer>
      </ProductListWrapper>
    </>
  );
};

const ProductListWrapper = styled.div`
  grid-column: 2/7;
  margin: 0 10px 0 0;
  overflow-x: auto;
  width: 100%;
  height: 100%;
  box-shadow: rgba(0, 0, 0, 0.45) 2px 0px 6px;
  border-top-right-radius: 10px;
  border-bottom-right-radius: 10px;
  @media (max-width: 1100px) {
    width: 100%;
    height: 980px;
    box-shadow: rgba(0, 0, 0, 0) 0 0px 0;
  }
  @media (max-width: 800px) {
    width: 100%;
  }
  @media (max-width: 600px) {
    width: 100%;
    height: auto;
  }
`;
const ProductsButtonsContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${(props) => (props.windowWidth < 600 ? "0" : "1rem")};
  justify-content: ${(props) =>
    props.windowWidth < 750 ? "space-between" : "space-around"};
  margin: ${(props) =>
    props.windowWidth < 750 ? "0 16px 0 0" : "8px 0px 0px 7px;"};
`;

const TextFieldInput = styled(TextField)`
  .css-1t8l2tu-MuiInputBase-input-MuiOutlinedInput-input {
    padding: 11.5px 4px;
    text-align: center;
  }
`;

const TableListContainer = styled(TableContainer)`
  box-shadow: rgba(0, 0, 0, 0.25) 0px 0px 2px;
  padding: 12px 10px;
  height: 512px;
  @media (max-width: 1100px) {
    height: 800px;
    padding: 0;
  }
  ::-webkit-scrollbar {
    width: 8px;
  }
  ::-webkit-scrollbar-thumb {
    background-color: #888;
    border-radius: 5px;
  }
  ::-webkit-scrollbar-thumb:hover {
    background-color: #555;
  }
  ::-webkit-scrollbar-track {
    background-color: #f1f1f1;
  }
`;
const ProductListContainer = styled.div`
  margin: 16px 16px 12px 16px;
  @media (max-width: 600px) {
    margin: 20px 0;
  }
`;
const ImgCell = styled(TableCell)`
  width: 9%;
`;
const Img = styled.img`
  min-width: 60px;
  height: 70px;
  object-fit: contain;
  border: 1px solid lightgray;
`;
// Add CSS for the highlighted effect
const highlightAnimation = keyframes`
  0% { background-color: #a7dadf; }
  50% { background-color: #cff6f1; }
  100% { background-color: #a7dadf; }
`;

const AnimatedTableRow = styled(TableRow)`
  &.highlighted {
    animation: ${highlightAnimation} 1s alternate 8;
  }
`;
const NewLabel = styled.span`
  position: absolute;
  top: 0;
  right: 0;
  margin: 2px 4px;
  padding: 2px 6px;
  background-color: #f50057;
  color: white;
  font-size: 0.75rem;
  font-weight: bold;
  border-radius: 4px;
`;
const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  height: "90%",
  borderRadius: "12px",
  bgcolor: "background.paper",
  border: "none!importat",
  boxShadow: 24,
  outline: 0,
};

const DiscountFormContainer = styled.div``;
