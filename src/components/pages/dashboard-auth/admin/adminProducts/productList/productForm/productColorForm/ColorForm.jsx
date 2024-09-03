import { Box, Button, Modal, Typography } from "@mui/material";
import { GlobalToolsContext } from "../../../../../../../context/GlobalToolsContext";
import { useContext } from "react";
import styled from "styled-components/macro";
import CloseIcon from "@mui/icons-material/Close";

export const ColorForm = ({
  colorPickerOpen,
  setColorPickerOpen,
  colorMapping,
  handleColorSelect,
  selectedColors,
  handleColorRemove,
  handleClose,
}) => {
  const { windowWidth } = useContext(GlobalToolsContext);

  return (
    <>
      <Button
        type="button"
        onClick={() => setColorPickerOpen(true)}
        sx={{
          width: "40%",
          fontSize: windowWidth < 900 ? ".5rem" : ".7rem",
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
        <Modal
          open={colorPickerOpen}
          onClose={handleClose}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box
            sx={{
              display: "flex",
              flexWrap: "wrap",
              bgcolor: "background.paper",
              boxShadow: 24,
              border: "1px solid grey",
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              zIndex: 2,
              width: "300px",
            }}
          >
            <CloseIconBtn onClick={handleClose} />
            {Object.keys(colorMapping).map((color) => (
              <Box
                key={color} // Added key here
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
        </Modal>
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
              key={color} // Added key here
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
const CloseIconBtn = styled(CloseIcon)`
  cursor: pointer;
  top: -5px;
  right: -6px;
  position: absolute;
  z-index: 2;
  background-color: white;
  box-shadow: rgba(0, 0, 0, 0.85) 0px 0px 10px;
  @media (max-width: 750px) {
    font-size: 1.3rem !important;
  }
`;
