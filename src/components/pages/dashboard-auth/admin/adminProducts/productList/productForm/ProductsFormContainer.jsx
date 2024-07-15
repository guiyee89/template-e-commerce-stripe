import { useContext, useEffect, useState } from "react";
import { GlobalToolsContext } from "../../../../../../context/GlobalToolsContext";
import { ProductsForm } from "./ProductsForm";
import { db } from "../../../../../../../firebaseConfig";
import { addDoc, collection, doc, updateDoc } from "firebase/firestore";

export const ProductsFormContainer = ({
  selectedItem,
  setSelectedItem,
  handleClose,
  setIsChanged,
}) => {
  const { windowWidth } = useContext(GlobalToolsContext);
  const [addProduct, setAddProduct] = useState(false);
  const [existingImages, setExistingImages] = useState([]);
  const [categoryValue, setCategoryValue] = useState("");
  const [sizeValue, setSizeValue] = useState("");
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
  const [selectedColors, setSelectedColors] = useState(
    () => newProduct.color || []
  );

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

  ////////////          SUBMIT          //////////////
  //   const handleSubmit = async (e) => {
  //     e.preventDefault();

  //     const itemsCollection = collection(db, "products");

  //     if (selectedItem) {
  //       const price = parseFloat(selectedItem.unit_price);
  //       const discount = parseFloat(selectedItem.discount);
  //       const discountAmount = (price * discount) / 100;
  //       let totalPrice = price;
  //       totalPrice -= discountAmount;

  //       let updatedItem = {
  //         ...selectedItem,
  //         productId: parseInt(selectedItem.productId),
  //         unit_price: parseFloat(selectedItem.unit_price),
  //         discountPrice: totalPrice || null,
  //         stock: parseInt(selectedItem.stock),
  //         color: selectedItem.color /* .toLowerCase() */,
  //         size:
  //           typeof selectedItem.size === "number"
  //             ? parseFloat(selectedItem.size)
  //             : selectedItem.size.toLowerCase(),
  //         discount: discount || null,
  //         category: selectedItem.category.toLowerCase(),
  //       };

  //       await updateDoc(doc(itemsCollection, selectedItem.id), updatedItem).then(
  //         () => {
  //           setIsChanged();
  //           handleClose();
  //         }
  //       );
  //     } else {
  //       const price = parseFloat(newProduct.unit_price);
  //       const discount = parseFloat(newProduct.discount);
  //       let totalPrice = price;
  //       let newItem;

  //       //Agregamos propiedad "discount" (si lo hay) al objecto newItem
  //       if (discount) {
  //         const discountAmount = (price * discount) / 100;
  //         totalPrice -= discountAmount;
  //       }

  //       const length = 5;
  //       const nullArray = Array.from({ length }).map(() => null);
  //       newProduct.img.forEach((img, index) => {
  //         nullArray[index] = img;
  //       });

  //       if (discount) {
  //         newItem = {
  //           ...newProduct,
  //           productId: newProduct.productId ? parseInt(newProduct.productId) : 0,
  //           createdAt: new Date().toISOString(),
  //           unit_price: newProduct.unit_price
  //             ? parseFloat(newProduct.unit_price)
  //             : 0,
  //           discountPrice: totalPrice,
  //           stock: newProduct.stock ? parseInt(newProduct.stock) : 0,
  //           color: newProduct.color /* .toLowerCase() */ || "",
  //           size:
  //             typeof newProduct.size === "number"
  //               ? parseFloat(newProduct.size)
  //               : newProduct.size.toLowerCase() || "",
  //           title: newProduct.title || "",
  //           subtitle: newProduct.subtitle || "",
  //           description: newProduct.description || "",
  //           category: newProduct.category.toLowerCase() || "",
  //           img: nullArray,
  //           secondUnit: newProduct.secondUnit || "",
  //         };
  //       } else {
  //         newItem = {
  //           ...newProduct,
  //           productId: newProduct.productId ? parseInt(newProduct.productId) : 0,
  //           createdAt: new Date().toISOString(),
  //           unit_price: totalPrice,
  //           stock: newProduct.stock ? parseInt(newProduct.stock) : 0,
  //           color: newProduct.color /* .toLowerCase() */ || "",
  //           size:
  //             typeof newProduct.size === "number"
  //               ? parseFloat(newProduct.size)
  //               : newProduct.size.toLowerCase() || "",
  //           title: newProduct.title || "",
  //           subtitle: newProduct.subtitle || "",
  //           description: newProduct.description || "",
  //           category: newProduct.category.toLowerCase() || "",
  //           img: nullArray,
  //           secondUnit: newProduct.secondUnit || "",
  //         };
  //       }

  //       // create the newItem object and add it to Firestore
  //       await addDoc(itemsCollection, newItem);
  //       setAddProduct(true);
  //     }
  //     setIsChanged();
  //   };
  const calculateDiscountPrice = (price, discount) => {
    const discountAmount = (price * discount) / 100;
    return price - discountAmount;
  };

  const prepareExistingItem = (selectedItem) => {
    const price = parseFloat(selectedItem.unit_price);
    const discount = parseFloat(selectedItem.discount);
    const totalPrice = calculateDiscountPrice(price, discount);

    return {
      ...selectedItem,
      productId: parseInt(selectedItem.productId),
      unit_price: price,
      discountPrice: totalPrice || null,
      stock: parseInt(selectedItem.stock),
      color: selectedItem.color,
      size:
        typeof selectedItem.size === "number"
          ? parseFloat(selectedItem.size)
          : selectedItem.size.toLowerCase(),
      discount: discount || null,
      category: selectedItem.category.toLowerCase(),
    };
  };

  const prepareNewItem = (newProduct) => {
    const price = parseFloat(newProduct.unit_price);
    const discount = parseFloat(newProduct.discount);
    const totalPrice = calculateDiscountPrice(price, discount);
    const length = 5;
    const nullArray = Array.from({ length }).map(() => null);

    newProduct.img.forEach((img, index) => {
      nullArray[index] = img;
    });

    return {
      ...newProduct,
      productId: newProduct.productId ? parseInt(newProduct.productId) : 0,
      createdAt: new Date().toISOString(),
      unit_price: price,
      discountPrice: totalPrice,
      stock: newProduct.stock ? parseInt(newProduct.stock) : 0,
      color: newProduct.color || "",
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
  };

  const updateExistingItem = async (itemsCollection, selectedItem) => {
    const updatedItem = prepareExistingItem(selectedItem);
    await updateDoc(doc(itemsCollection, selectedItem.id), updatedItem).then(
      () => {
        setIsChanged();
        handleClose();
      }
    );
  };

  const addNewItem = async (itemsCollection, newProduct) => {
    const newItem = prepareNewItem(newProduct);
    await addDoc(itemsCollection, newItem);
    setAddProduct(true);
    setIsChanged();
  };

  ///////////////////////////////////////////////////////////////////////////////
  /*************                   HANDLE SUBMIT                    ************/
  const handleSubmit = async (e) => {
    e.preventDefault();

    const itemsCollection = collection(db, "products");

    if (selectedItem) {
      await updateExistingItem(itemsCollection, selectedItem);
    } else {
      await addNewItem(itemsCollection, newProduct);
    }
  };

  ///////////////////////////////////////////////////////////////////////////////
  /*************                   HANDLE CHANGE                    ************/
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

  return (
    <>
      <ProductsForm
        newProduct={newProduct}
        setNewProduct={setNewProduct}
        addProduct={addProduct}
        selectedItem={selectedItem}
        setSelectedItem={setSelectedItem}
        selectedColors={selectedColors}
        setSelectedColors={setSelectedColors}
        sizeValue={sizeValue}
        categoryValue={categoryValue}
        existingImages={existingImages}
        handleChange={handleChange}
        handleSubmit={handleSubmit}
      />
    </>
  );
};
