import {
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import styled from "styled-components/macro";
import { ImageFormContainer } from "./productsImageForm/ImageFormContainer";
import { ColorFormContainer } from "./productColorForm/ColorFormContainer";

export const ProductsForm = ({
  newProduct,
  setNewProduct,
  addProduct,
  selectedItem,
  setSelectedItem,
  handleChange,
  handleSubmit,
  selectedColors,
  setSelectedColors,
  sizeValue,
  categoryValue,
  existingImages,
}) => {
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
                      textDecoration: "underline",
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
                    {/******   ID FORM   *******/}
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

                    {/******   NAME FORM   *******/}
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

                  {/******   SUBTITLE FORM   *******/}
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
                      textDecoration: "underline",
                      textAlign: "center",
                    }}
                  >
                    Product Price & Details
                  </p>
                  <PriceDetailsContainer>
                    {/******   PRICE FORM   *******/}
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

                      {/******   DISCOUNT FORM   *******/}
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

                      {/******   STOCK FORM   *******/}
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
                      
                      {/******   CATEGORY FORM    *******/}
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

                      {/******   COLOR FORM COMPONENT   *******/}
                      <Div
                        style={{
                          position: "relative",
                          display: "flex",
                          flexDirection: "row",
                          justifyContent: "space-between",
                          alignItems: "center",
                          border: "1px solid darkgrey",
                          borderRadius: "4px",
                          padding: "2px",
                        }}
                      >
                        <ColorFormContainer
                          selectedItem={selectedItem}
                          setSelectedItem={setSelectedItem}
                          setNewProduct={setNewProduct}
                          selectedColors={selectedColors}
                          setSelectedColors={setSelectedColors}
                        />
                      </Div>

                      {/*********   SIZE FORM    ********/}
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

                {/*********   DESCRIPTION FORM    ********/}
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

              {/*********   IMAGES FROM COMPONENT     ********/}
              <ImageFormContainer
                newProduct={newProduct}
                setNewProduct={setNewProduct}
                existingImages={existingImages}
                selectedItem={selectedItem}
                setSelectedItem={setSelectedItem}
              />
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
