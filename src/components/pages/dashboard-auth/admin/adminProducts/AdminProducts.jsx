import { useState } from "react";
import styled from "styled-components/macro";
import { collection, getDocs, query, where } from "firebase/firestore";
import { useEffect } from "react";
import { db } from "../../../../../firebaseConfig";
import { ProductList } from "./productList/ProductList";
import { Ring } from "@uiball/loaders";
//import { DeleteImages } from "./productList/deleteImages/DeleteImages";//!Button for erasing Imgs from Database storage

export const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [searchProduct, setSearchProduct] = useState(""); // State to store the productId for searching
  const [foundProduct, setFoundProduct] = useState(false);
  const [isChanged, setIsChanged] = useState(false);
  const [productLoading, setProductLoading] = useState(true);

  const fetchItemsByProductId = async (productId) => {
    const itemsCollection = collection(db, "products");
    const q = query(
      itemsCollection,
      where("productId", "==", parseFloat(productId))
    );
    console.log("Fetching...");
    const snapshot = await getDocs(q);
    const items = snapshot.docs.map((doc) => ({
      ...doc.data(),
      id: doc.id,
    }));
    setProducts(items);
    setFoundProduct(true);
  };

  useEffect(() => {
    if (searchProduct.trim() === "") {
      // Fetch the first product on initial render if no searchProduct
      fetchItemsByProductId(1);
      setTimeout(() => {
        setProductLoading(false);
      }, 700);
    } else {
      fetchItemsByProductId(searchProduct);
    }
  }, [isChanged]);

  const handleIsChanged = () => {
    setIsChanged(!isChanged); // Toggle isChanged to trigger useEffect
  };

  if (productLoading) {
    return (
      <Loader>
        <Ring size={40} lineWeight={6} speed={1} color="black" />
      </Loader>
    );
  }

  return (
    <>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          position: "relative",
          gridColumn: "2/7",
        }}
      >
        {/* <DeleteImages /> */}
        <ProductList
          products={products}
          setIsChanged={handleIsChanged}
          foundProduct={foundProduct}
          searchProduct={searchProduct}
          setSearchProduct={setSearchProduct}
          fetchItemsByProductId={() => fetchItemsByProductId(searchProduct)} // Pass the function with the current searchProduct
        />
      </div>
    </>
  );
};

const Loader = styled.div`
  width: 100%;
  border-bottom-right-radius: 5px;
  border-top-right-radius: 7px;
  padding-right: 209px;
  box-shadow: rgba(0, 0, 0, 0.45) 2px 0px 6px;
  grid-column: 2/7;
  display: flex;
  align-items: center;
  justify-content: center;
  @media (max-width: 1100px) {
    box-shadow: rgba(0, 0, 0, 0) 0px 0px 0px;
    display: flex;
    justify-content: center;
    padding: 150px 0;
  }
`;
