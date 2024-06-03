import {
  FormControl,
  FormControlLabel,
  Radio,
  RadioGroup,
} from "@mui/material";
import LocalShippingOutlinedIcon from "@mui/icons-material/LocalShippingOutlined";
import StorefrontOutlinedIcon from "@mui/icons-material/StorefrontOutlined";
import { useState } from "react";

export const ShippingButtons = ({ setShippingMethod }) => {
  const [selectedValue, setSelectedValue] = useState("ship");

  const handleChange = (event) => {
    const value = event.target.value;
    setSelectedValue(value);
    setShippingMethod(value);
  };

  return (
    <div style={{ width: "100%" }}>
      <FormControl sx={{ width: "100%", margin: "20px 0" }}>
        <RadioGroup
          sx={{
            gap: ".3rem",
          }}
          aria-label="shipping-method"
          value={selectedValue}
          onChange={handleChange}
        >
          <LocalShippingOutlinedIcon
            sx={{
              position: "absolute",
              right: "20px",
              top: "20px",
              color: selectedValue === "ship" && "#1773b0",
            }}
            fontSize="small"
          />
          <FormControlLabel
            value="ship"
            sx={{
              width: "100%",
              border:
                selectedValue === "ship"
                  ? "1px solid #1773b0"
                  : "1px solid lightgrey",
              backgroundColor: selectedValue === "ship" ? "#f0f5ff" : "none",
              borderTopLeftRadius: "8px",
              borderTopRightRadius: "8px",
              padding: "6px",
              marginLeft: "0",
              ".css-ahj2mt-MuiTypography-root": {
                fontSize: ".88rem",
              },
            }}
            control={<Radio />}
            label="Ship"
          />
          <StorefrontOutlinedIcon
            sx={{
              position: "absolute",
              right: "20px",
              bottom: "20px",
              color: selectedValue === "pick_up" && "#1773b0",
            }}
            fontSize="small"
          />
          <FormControlLabel
            value="pick_up"
            sx={{
              width: "100%",
              border:
                selectedValue === "pick_up"
                  ? "1px solid #1773b0"
                  : "1px solid lightgrey",
              backgroundColor: selectedValue === "pick_up" ? "#f0f5ff" : "none",
              borderBottomLeftRadius: "8px",
              borderBottomRightRadius: "8px",
              padding: "6px",
              marginLeft: "0",
              ".css-ahj2mt-MuiTypography-root": {
                fontSize: ".88rem",
              },
            }}
            control={<Radio />}
            label="Pick up"
          />
        </RadioGroup>
      </FormControl>
    </div>
  );
};
