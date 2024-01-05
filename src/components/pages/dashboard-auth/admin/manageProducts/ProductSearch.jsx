import { useState } from "react";
import { collection, getDocs, query, where } from "firebase/firestore";
import { useEffect } from "react";
import { db } from "../../../../../firebaseConfig";
import { ProductList } from "./ProductList";


export const ProductSearch = () => {
  const [products, setProducts] = useState([]);
  const [searchProduct, setSearchProduct] = useState(""); // State to store the userId for searching
  const [foundProduct, setFoundProduct] = useState(false);
  const [isChanged, setIsChanged] = useState(false);

  const fetchItemsByUserId = async () => {
    if (searchProduct.trim() !== "") {
      const itemsCollection = collection(db, "products");
      const q = query(
        itemsCollection,
        where("userId", "==", parseFloat(searchProduct))
      );
      console.log("fetcheando...");
      const snapshot = await getDocs(q);
      const items = snapshot.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }));
      setProducts(items);
      setFoundProduct(true);
    } else {
      setProducts([]);
      setFoundProduct(false);
    }
  };

  // Use an effect to fetch products by searching or editing
  useEffect(() => {
    fetchItemsByUserId();
  }, [isChanged]);

  const handleIsChanged = () => {
    setIsChanged(!isChanged); // Toggle isChanged to trigger useEffect
  };

  console.log(products);

  return (
    <>
      <ProductList
        products={products}
        setIsChanged={handleIsChanged}
        foundProduct={foundProduct}
        searchProduct={searchProduct}
        setSearchProduct={setSearchProduct}
        fetchItemsByUserId={fetchItemsByUserId}
      />
    </>
  );
};

