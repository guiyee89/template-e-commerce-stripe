import { useState } from "react";

const useItemLoader = () => {
    const [itemLoaders, setItemLoaders] = useState({});
  
    const setLoader = (itemId, isLoading) => {
      setItemLoaders(prev => ({ ...prev, [itemId]: isLoading }));
    };
  
    return [itemLoaders, setLoader];
  };
  
  export default useItemLoader;