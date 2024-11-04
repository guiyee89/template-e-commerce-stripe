import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { ItemDetailDesktop } from "./itemDetailDesktop/ItemDetailDesktop";
import { ItemDetailMobile } from "./itemDetailMobile/ItemDetailMobile";
import { db } from "../../../firebaseConfig";
import { collection, getDoc, doc } from "firebase/firestore";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useContext } from "react";
import { GlobalToolsContext } from "../../context/GlobalToolsContext";
import { bouncy } from "ldrs";
bouncy.register();

////////////////////////////////////////////////////
export const ItemDetailContainer = () => {
  const [selectedItem, setSelectedItem] = useState({});
  const { id } = useParams();
  const [loadingColorFilter, setLoadingColorFilter] = useState(false); //Activate image loaders on color filter

  const {
    windowWidth,
    setPageLoading,
    setVisible,
    progressComplete,
    setProgressComplete,
    progress,
  } = useContext(GlobalToolsContext);

  ////////////////////////////////////////////////////
  // ENCONTRAMOS PRODUCTO POR "ID" Y BUSCAMOS MAS ITEMS QUE COINCIDAN EN "productId" PARA RENDERIZAR
  useEffect(() => {
    setPageLoading(true);
    const delay = 400;
    const fetchItem = async () => {
      try {
        setVisible(true);
        setLoadingColorFilter(true);
        const itemCollection = collection(db, "products");
        const refDoc = doc(itemCollection, id);

        await getDoc(refDoc).then((response) => {
          setSelectedItem({
            ...response.data(),
            id: response.id,
          });
          setTimeout(() => {
            setPageLoading(false);
            setProgressComplete(true);
            if (progress === 100) {
              setVisible(false);
            }
          }, 250); // Set loading to false, progress to 100, and progressComplete to true after a delay
        });
      } catch (err) {
        console.log(err);
      }
    };
    const timer = setTimeout(fetchItem, delay);
    return () => {
      clearTimeout(timer);
    };
  }, [id]);

  ////////////////////////////////////////////////////
  return (
    <>
      <ToastContainer
        position="bottom-right"
        autoClose={1000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />
      {progressComplete && (
        <>
          {windowWidth > 950 ? (
            <ItemDetailDesktop
              selectedItem={selectedItem}
              setLoadingColorFilter={setLoadingColorFilter} //props to activate loaders on color filter
              loadingColorFilter={loadingColorFilter}
            />
          ) : (
            <ItemDetailMobile selectedItem={selectedItem} />
          )}
        </>
      )}
    </>
  );
};
