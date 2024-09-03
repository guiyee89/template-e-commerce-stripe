import { useState } from "react";
import { ColorForm } from "./ColorForm";

export const ColorFormContainer = ({
  setNewProduct,
  selectedItem,
  setSelectedItem,
  selectedColors,
  setSelectedColors,
}) => {
  
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

  const handleClose = () => {
    setColorPickerOpen(false);
  };

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
  return (
    <>
      <ColorForm
        colorPickerOpen={colorPickerOpen}
        setColorPickerOpen={setColorPickerOpen}
        colorMapping={colorMapping}
        handleColorSelect={handleColorSelect}
        selectedColors={selectedColors}
        handleColorRemove={handleColorRemove}
        handleClose={handleClose}
      />
    </>
  );
};
