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
import styled from "styled-components/macro";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import { ProductsForm } from "./ProductsForm";
import { addDoc, collection, deleteDoc, doc } from "firebase/firestore";
import { db } from "../../../../../firebaseConfig";
import { useContext, useState } from "react";
import { PriceDiscountForm } from "./PriceDiscountForm";
import { GlobalToolsContext } from "../../../../context/GlobalToolsContext";
import { DeleteImages } from "./deleteImages/DeleteImages";

export const ProductList = ({
  products,
  setIsChanged,
  foundProduct,
  searchProduct,
  setSearchProduct,
  fetchItemsByProductId,
}) => {
  const { windowWidth } = useContext(GlobalToolsContext);

  // Sort items by color and size
  const customSort = (itemA, itemB) => {
    // First, compare by color
    if (itemA.color < itemB.color) return -1;
    if (itemA.color > itemB.color) return 1;
    // If colors are the same, compare by size
    if (itemA.size < itemB.size) return -1;
    if (itemA.size > itemB.size) return 1;
    // If both color and size are the same, items are considered equal
    return 0;
  };
  // Sort the items array
  Array.isArray(products) && products.sort(customSort);

  const [open, setOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  const handleClose = () => {
    setOpen(false);
  };

  const handleOpen = (product) => {
    setSelectedItem(product);
    setOpen(true);
  };

  const copyProduct = async (id) => {
    const itemsCollection = collection(db, "products");
    const selectedProduct = products.find((product) => product.id === id);
    // Remove the 'id' field to let Firebase generate a new ID
    const copyItem = { ...selectedProduct };
    delete copyItem.id;

    await addDoc(itemsCollection, copyItem);

    setIsChanged();
  };

  const deleteProduct = async (id) => {
    await deleteDoc(doc(db, "products", id));
    setIsChanged(); // Toggle isChanged to trigger useEffect
  };

  return (
    <>
      <ProductListWrapper>
        {/* DELETE UNUSED IMAGES BUTTON COMPONENT */}
        {/* <DeleteImages /> */}
        <ProductsButtonsContainer windowWidth={windowWidth}>
          <div>
            <TextFieldInput
              label="Buscar por ID"
              variant="outlined"
              name="id"
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
              onClick={() => fetchItemsByProductId()}
            >
              Buscar
            </Button>
          </div>
          <div style={{ marginLeft: "7px" }}>
            <AddButton
              variant="contained"
              sx={{
                marginTop: "17px",
                fontSize: "0.7rem",
                backgroundColor: "black",
                "&:hover": {
                  backgroundColor: "#4b4d4e",
                },
              }}
              onClick={() => handleOpen(null)}
            >
              Nuevo Producto
            </AddButton>
          </div>
        </ProductsButtonsContainer>
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
              <TableContainer>
                <Table sx={{ minWidth: 650 }} aria-label="simple table">
                  <TableHead
                    sx={{ position: "sticky", top: "0", zIndex: "100" }}
                  >
                    <TableRow sx={{ position: "sticky", top: "0" }}>
                      <TableCell align="center">ID</TableCell>
                      <TableCell align="center">Imagen</TableCell>
                      <TableCell align="center">Titulo</TableCell>
                      <TableCell align="center">Precio</TableCell>
                      <TableCell align="center">Descuento</TableCell>
                      <TableCell align="center">Stock</TableCell>
                      <TableCell align="center">Size</TableCell>
                      <TableCell align="center">Color</TableCell>
                      <TableCell align="center">Categoria</TableCell>
                      <TableCell align="center">
                        Editar / Copiar / Borrar
                      </TableCell>
                    </TableRow>
                  </TableHead>

                  <TableBody>
                    {Array.isArray(products) &&
                      products.map((product) => (
                        <TableRow
                          key={product.id}
                          sx={{
                            "&:last-child td, &:last-child th": { border: 0 },
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
                          <TableCell align="center" component="th" scope="row">
                            {product.title}
                          </TableCell>
                          <TableCell align="center" component="th" scope="row">
                            $ {product.unit_price}
                          </TableCell>
                          <TableCell
                            align="center"
                            component="th"
                            scope="row"
                            sx={{ padding: "0px" }}
                          >
                            {product.discount ? (
                              <>
                                {product.discount}% {/* <br /> */} ( $
                                {product.discountPrice} )
                              </>
                            ) : (
                              "-"
                            )}
                          </TableCell>

                          <TableCell align="center" component="th" scope="row">
                            {product.stock}
                          </TableCell>
                          <TableCell
                            align="center"
                            component="th"
                            scope="row"
                            sx={{ textTransform: "uppercase" }}
                          >
                            {product.size}
                          </TableCell>
                          <TableCell
                            align="center"
                            component="th"
                            scope="row"
                            sx={{ textTransform: "capitalize" }}
                          >
                            {product.color}
                          </TableCell>
                          <TableCell
                            align="center"
                            component="th"
                            scope="row"
                            sx={{ textTransform: "capitalize" }}
                          >
                            {product.category}
                          </TableCell>
                          <TableCell
                            align="center"
                            component="th"
                            scope="row"
                            sx={{ padding: "4px", minWidth: "130px" }}
                          >
                            <IconButton onClick={() => handleOpen(product)}>
                              <EditIcon />
                            </IconButton>
                            <IconButton onClick={() => copyProduct(product.id)}>
                              <ContentCopyIcon />
                            </IconButton>
                            <IconButton
                              onClick={() => deleteProduct(product.id)}
                            >
                              <DeleteIcon />
                            </IconButton>
                          </TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </>
          )}

          <Modal
            sx={{ maxWidth: "1000px", margin: "0 auto" }}
            open={open}
            onClose={handleClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
          >
            <Box sx={style}>
              <ProductsForm
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
  width: 80%;
  margin: 80px 0 100px 0;
  @media (max-width: 950px) {
    width: 100%;
  }
`;
const ProductsButtonsContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${(props) => (props.windowWidth < 600 ? "1rem" : "8.1rem")};
  justify-content: ${(props) =>
    props.windowWidth < 750 ? "space-between" : "center"};
  margin: ${(props) =>
    props.windowWidth < 750 ? "0 16px 0 0" : "0 0 0 -67px"};
`;

const TextFieldInput = styled(TextField)`
  .css-1t8l2tu-MuiInputBase-input-MuiOutlinedInput-input {
    padding: 11.5px 4px;
    text-align: center;
  }
`;
const AddButton = styled(Button)``;

const ProductListContainer = styled.div`
  margin-top: 30px;
`;
const ImgCell = styled(TableCell)`
  width: 9%;
`;
const Img = styled.img`
  min-width: 60px;
  height: 70px;
  object-fit: contain;
`;
const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "100%",
  bgcolor: "background.paper",
  border: "none!importat",
  boxShadow: 24,
  outline: 0,
};

const DiscountFormContainer = styled.div``;
