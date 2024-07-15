import { Box, Button, Typography } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { bouncy } from "ldrs";
bouncy.register();

export const ColorForm = ({
  colorPickerOpen,
  setColorPickerOpen,
  colorMapping,
  handleColorSelect,
  selectedColors,
  handleColorRemove,
}) => {
    
  return (
    <>
      <Button
        type="button"
        onClick={() => setColorPickerOpen(true)}
        sx={{
          width: "40%",
          fontSize: ".7rem",
          marginRight: "10px",
          padding: "8px 0",
          height: "30px",
        }}
        size="medium"
        variant="contained"
      >
        + add color
      </Button>
      {colorPickerOpen && (
        <Box
          sx={{
            display: "flex",
            flexWrap: "wrap",
            p: 1,
            bgcolor: "background.paper",
            boxShadow: 3,
            border: "1px solid grey",
            position: "absolute",
            top: "44px",
            zIndex: 2,
            width: "300px",
          }}
        >
          {Object.keys(colorMapping).map((color) => (
            <Box
              key={color}
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                margin: "5px",
                width: "80px",
                border: "1px solid darkgrey",
                borderRadius: "4px",
              }}
            >
              <Box
                sx={{
                  width: "100%",
                  height: "34px",
                  bgcolor: colorMapping[color],
                  cursor: "pointer",
                  borderRadius: "4px",
                  border: "1px solid darkgrey",
                }}
                onClick={() => handleColorSelect(color)}
              />
              <Typography
                variant="body2"
                sx={{
                  cursor: "pointer",
                }}
                onClick={() => handleColorSelect(color)}
              >
                {color}
              </Typography>
            </Box>
          ))}
        </Box>
      )}

      {selectedColors.length > 0 && (
        <div
          style={{
            display: "flex",
            gap: ".6rem",
          }}
        >
          {selectedColors.map((color) => (
            <div
              key={color}
              style={{
                width: "40px",
                height: "34px",
                borderRadius: "6px",
                backgroundColor: colorMapping[color],
                position: "relative",
                display: "inline-block",
                border: "1px solid darkgrey",
              }}
            >
              <CloseIcon
                onClick={() => handleColorRemove(color)}
                style={{
                  position: "absolute",
                  top: "-5px",
                  right: "-6px",
                  width: "16px",
                  height: "16px",
                  cursor: "pointer",
                  color: "#fff",
                  backgroundColor: "rgba(0, 0, 0, 0.5)",
                  borderRadius: "50%",
                }}
              />
            </div>
          ))}
        </div>
      )}
    </>
  );
};
