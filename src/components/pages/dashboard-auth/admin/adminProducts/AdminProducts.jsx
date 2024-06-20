import { useState } from "react";
import styled from "styled-components/macro";
import { collection, getDocs, query, where } from "firebase/firestore";
import { useEffect } from "react";
import { db } from "../../../../../firebaseConfig";
import { ProductList } from "./productList/ProductList";
import "ldrs/helix";
// import { DeleteImages } from "./productList/deleteImages/DeleteImages";


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
      }, 1200);
    } else {
      fetchItemsByProductId(searchProduct);
    }
  }, [isChanged]);

  const handleIsChanged = () => {
    setIsChanged(!isChanged); // Toggle isChanged to trigger useEffect
  };

  if (productLoading) {
    return (
      <BouncyLoader>
        <l-helix size="35" speed="1.25" color="black"></l-helix>
      </BouncyLoader>
    );
  }

  return (
    <>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          position: "relative",
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

const BouncyLoader = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  padding-right: 175px;
  padding-bottom: 250px;
`;
