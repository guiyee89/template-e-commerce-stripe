import React, { useState } from "react";
import { styled } from "@mui/material/styles";
import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Switch from "@mui/material/Switch";
import Typography from "@mui/material/Typography";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";

export const SizeGuide = () => {
  const [isToogle, setIsToggle] = useState(false);
  const [tabValue, setTabValue] = useState(0);

  // Toggle between CM and Pulgadas
  const handleToggle = () => {
    setIsToggle((prevIsToggle) => !prevIsToggle);
    setTabValue((prevIsToggle) => (!prevIsToggle ? 1 : 0));
  };

  return (
    <div>
      <p
        style={{
          padding: "35px 50px 10px 12px",
          fontWeight: "500",
          fontSize: "clamp(0.5rem, .85rem + 0.1vw, 1.5rem)",
        }}
      >
        The measurements in the size chart are body measurements. Use the chart
        below to find the correct size. Scroll horizontally to see more sizes.
      </p>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          padding: "17px 50px 17px 17px",
          alignItems: "center",
        }}
      >
        {/* Title */}
        <Typography
          variant="h4"
          gutterBottom
          sx={{ fontSize: "1.2rem", marginRight: "50px", minWidth: "150px" }}
        >
          Tops Sizes
        </Typography>

        {/* Switch for Units */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            position: "relative",
          }}
        >
          {/* Toggle to 'in' (Inches) */}
          <Typography
            style={{
              fontWeight: "bold",
              color: isToogle ? "gray" : "black",
              marginRight: "8px",
              position: "absolute",
              left: "16px",
              top: "14px",
              zIndex: "1",
              transition: "all 0.3s ease",
              pointerEvents: "none",
            }}
            onClick={handleToggle}
          >
            in
          </Typography>

          {/* Switch Component */}
          <FormGroup>
            <FormControlLabel
              control={
                <MaterialUISwitch
                  checked={isToogle}
                  onChange={handleToggle}
                  sx={{ margin: 0 }}
                />
              }
              label=""
            />
          </FormGroup>

          {/* Toggle to 'cm' (Centimeters) */}
          <Typography
            style={{
              fontWeight: "bold",
              color: isToogle ? "black" : "gray",
              marginLeft: "8px",
              position: "absolute",
              right: "38px",
              top: "14px",
              zIndex: "1",
              transition: "all 0.3s ease",

              pointerEvents: "none",
            }}
            onClick={handleToggle}
          >
            cm
          </Typography>
        </div>
      </div>

      {tabValue === 0 && (
        <TableContainer>
          <Table>
            <TableHead sx={{ backgroundColor: "#f1eeee" }}>
              <TableRow>
                <TableCellTitle>Size</TableCellTitle>
                <TableCellTitle>XS</TableCellTitle>
                <TableCellTitle>S</TableCellTitle>
                <TableCellTitle>M</TableCellTitle>
                <TableCellTitle>L</TableCellTitle>
                <TableCellTitle>XL</TableCellTitle>
                <TableCellTitle>2XL</TableCellTitle>
              </TableRow>
            </TableHead>
            <TableBody>
              <TableRow>
                <TableCellTitle
                  sx={{ backgroundColor: "#f1eeee", width: "120px" }}
                >
                  Chest (in)
                </TableCellTitle>
                <StyledTableCell>31.5 - 35</StyledTableCell>
                <StyledTableCell>35 - 37.5</StyledTableCell>
                <StyledTableCell>37.5 - 41</StyledTableCell>
                <StyledTableCell>41 - 44</StyledTableCell>
                <StyledTableCell>44 - 48.5</StyledTableCell>
                <StyledTableCell>48.5 - 53.5</StyledTableCell>
              </TableRow>
              <TableRow>
                <TableCellTitle sx={{ backgroundColor: "#f1eeee" }}>
                  Waist (in)
                </TableCellTitle>
                <StyledTableCell>25.5 - 29</StyledTableCell>
                <StyledTableCell>29 - 32</StyledTableCell>
                <StyledTableCell>32 - 35</StyledTableCell>
                <StyledTableCell>35 - 38</StyledTableCell>
                <StyledTableCell>38 - 43</StyledTableCell>
                <StyledTableCell>43 - 47.5</StyledTableCell>
              </TableRow>
              <TableRow>
                <TableCellTitle sx={{ backgroundColor: "#f1eeee" }}>
                  Hips (in)
                </TableCellTitle>
                <StyledTableCell>31.5 - 35</StyledTableCell>
                <StyledTableCell>35 - 37.5</StyledTableCell>
                <StyledTableCell>37.5 - 41</StyledTableCell>
                <StyledTableCell>41 - 44</StyledTableCell>
                <StyledTableCell>44 - 47</StyledTableCell>
                <StyledTableCell>47 - 50.5"</StyledTableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
      )}
      {tabValue === 1 && (
        // Table for centimeters (CM)
        <TableContainer>
          <Table>
            <TableHead sx={{ backgroundColor: "#f1eeee" }}>
              <TableRow>
                <TableCellTitle>Size</TableCellTitle>
                <TableCellTitle>XS</TableCellTitle>
                <TableCellTitle>S</TableCellTitle>
                <TableCellTitle>M</TableCellTitle>
                <TableCellTitle>L</TableCellTitle>
                <TableCellTitle>XL</TableCellTitle>
                <TableCellTitle>2XL</TableCellTitle>
              </TableRow>
            </TableHead>
            <TableBody>
              <TableRow>
                <TableCellTitle
                  sx={{ backgroundColor: "#f1eeee", width: "120px" }}
                >
                  Chest (cm)
                </TableCellTitle>
                <StyledTableCell>87 - 92</StyledTableCell>
                <StyledTableCell>93 - 100</StyledTableCell>
                <StyledTableCell>101 - 108</StyledTableCell>
                <StyledTableCell>109 - 118</StyledTableCell>
                <StyledTableCell>119 - 130</StyledTableCell>
                <StyledTableCell>119 - 130</StyledTableCell>
              </TableRow>
              <TableRow>
                <TableCellTitle
                  sx={{ backgroundColor: "#f1eeee", fontWeight: "600" }}
                >
                  Waist (cm)
                </TableCellTitle>
                <StyledTableCell>75 - 80</StyledTableCell>
                <StyledTableCell>81 - 88</StyledTableCell>
                <StyledTableCell>89 - 96</StyledTableCell>
                <StyledTableCell>97 - 106</StyledTableCell>
                <StyledTableCell>107 - 120</StyledTableCell>
                <StyledTableCell>107 - 120</StyledTableCell>
              </TableRow>
              <TableRow>
                <TableCellTitle
                  sx={{ backgroundColor: "#f1eeee", fontWeight: "600" }}
                >
                  Hips (cm)
                </TableCellTitle>
                <StyledTableCell>89 - 96</StyledTableCell>
                <StyledTableCell>97 - 104</StyledTableCell>
                <StyledTableCell>105 - 112</StyledTableCell>
                <StyledTableCell>113 - 121</StyledTableCell>
                <StyledTableCell>122 - 130</StyledTableCell>
                <StyledTableCell>122 - 130</StyledTableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
      )}
      <Typography
        variant="h4"
        gutterBottom
        sx={{
          fontSize: "1.2rem",
          marginTop: "30px",
          padding: "17px 50px 17px 17px",
        }}
      >
        Bottoms Sizes
      </Typography>
      {tabValue === 0 && (
        // Table for inches (Pulgadas)
        <TableContainer>
          <Table>
            <TableHead sx={{ backgroundColor: "#f1eeee" }}>
              <TableRow>
                <TableCellTitle>Size</TableCellTitle>
                <TableCellTitle>XS</TableCellTitle>
                <TableCellTitle>S</TableCellTitle>
                <TableCellTitle>M</TableCellTitle>
                <TableCellTitle>L</TableCellTitle>
                <TableCellTitle>XL</TableCellTitle>
                <TableCellTitle>2XL</TableCellTitle>
              </TableRow>
            </TableHead>
            <TableBody>
              <TableRow>
                <TableCellTitle
                  sx={{
                    backgroundColor: "#f1eeee",
                    fontWeight: "600",
                    width: "120px",
                  }}
                >
                  Chest (in)
                </TableCellTitle>
                <StyledTableCell>25.5 - 29</StyledTableCell>
                <StyledTableCell>29 - 32</StyledTableCell>
                <StyledTableCell>32 - 35</StyledTableCell>
                <StyledTableCell>35 - 38</StyledTableCell>
                <StyledTableCell>38 - 43</StyledTableCell>
                <StyledTableCell>43 - 47.5</StyledTableCell>
              </TableRow>
              <TableRow>
                <TableCellTitle
                  sx={{ backgroundColor: "#f1eeee", fontWeight: "600" }}
                >
                  Waist (in)
                </TableCellTitle>
                <StyledTableCell>31.5 - 35</StyledTableCell>
                <StyledTableCell>35 - 37.5</StyledTableCell>
                <StyledTableCell>37.5 - 41</StyledTableCell>
                <StyledTableCell>41 - 44</StyledTableCell>
                <StyledTableCell>44 - 47</StyledTableCell>
                <StyledTableCell>47 - 50.5</StyledTableCell>
              </TableRow>
              <TableRow>
                <TableCellTitle
                  sx={{ backgroundColor: "#f1eeee", fontWeight: "600" }}
                >
                  Hips (in)
                </TableCellTitle>
                <StyledTableCell>31.5 - 35</StyledTableCell>
                <StyledTableCell>35 - 37.5</StyledTableCell>
                <StyledTableCell>37.5 - 41</StyledTableCell>
                <StyledTableCell>41 - 44</StyledTableCell>
                <StyledTableCell>44 - 47</StyledTableCell>
                <StyledTableCell>47 - 50.5</StyledTableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
      )}
      {tabValue === 1 && (
        // Table for centimeters (CM)
        <TableContainer>
          <Table>
            <TableHead sx={{ backgroundColor: "#f1eeee" }}>
              <TableRow>
                <TableCellTitle>Size</TableCellTitle>
                <TableCellTitle>XS</TableCellTitle>
                <TableCellTitle>S</TableCellTitle>
                <TableCellTitle>M</TableCellTitle>
                <TableCellTitle>L</TableCellTitle>
                <TableCellTitle>XL</TableCellTitle>
                <TableCellTitle>2XL</TableCellTitle>
              </TableRow>
            </TableHead>
            <TableBody>
              <TableRow>
                <TableCellTitle
                  sx={{ backgroundColor: "#f1eeee", width: "120px" }}
                >
                  Chest (cm)
                </TableCellTitle>
                <StyledTableCell>87 - 92</StyledTableCell>
                <StyledTableCell>93 - 100</StyledTableCell>
                <StyledTableCell>101 - 108</StyledTableCell>
                <StyledTableCell>109 - 118</StyledTableCell>
                <StyledTableCell>119 - 130</StyledTableCell>
                <StyledTableCell>119 - 130</StyledTableCell>
              </TableRow>
              <TableRow>
                <TableCellTitle
                  sx={{ backgroundColor: "#f1eeee", fontWeight: "600" }}
                >
                  Waist (cm)
                </TableCellTitle>
                <StyledTableCell>75 - 80</StyledTableCell>
                <StyledTableCell>81 - 88</StyledTableCell>
                <StyledTableCell>89 - 96</StyledTableCell>
                <StyledTableCell>97 - 106</StyledTableCell>
                <StyledTableCell>107 - 120</StyledTableCell>
                <StyledTableCell>107 - 120</StyledTableCell>
              </TableRow>
              <TableRow>
                <TableCellTitle
                  sx={{ backgroundColor: "#f1eeee", fontWeight: "600" }}
                >
                  Hips (cm)
                </TableCellTitle>
                <StyledTableCell>89 - 96</StyledTableCell>
                <StyledTableCell>97 - 104</StyledTableCell>
                <StyledTableCell>105 - 112</StyledTableCell>
                <StyledTableCell>113 - 121</StyledTableCell>
                <StyledTableCell>122 - 130</StyledTableCell>
                <StyledTableCell>122 - 130</StyledTableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
      )}
      <Typography
        variant="h4"
        gutterBottom
        sx={{
          fontSize: "1.2rem",
          marginTop: "30px",
          padding: "17px 50px 17px 17px",
        }}
      >
        Shoes Sizes
      </Typography>
      {tabValue === 0 && (
        // Table for inches (Pulgadas)
        <TableContainer>
          <Table>
            <TableHead sx={{ backgroundColor: "#f1eeee" }}>
              <TableRow>
                <TableCellTitle>Size</TableCellTitle>
                <TableCellTitle>3.5</TableCellTitle>
                <TableCellTitle>4</TableCellTitle>
                <TableCellTitle>4.5</TableCellTitle>
                <TableCellTitle>5</TableCellTitle>
                <TableCellTitle>5.5</TableCellTitle>
                <TableCellTitle>6</TableCellTitle>
                <TableCellTitle>6.5</TableCellTitle>
                <TableCellTitle>7</TableCellTitle>
                <TableCellTitle>7.5</TableCellTitle>
              </TableRow>
            </TableHead>
            <TableBody>
              <TableRow>
                <TableCellTitle
                  sx={{
                    backgroundColor: "#f1eeee",
                    fontWeight: "600",
                    width: "120px",
                  }}
                >
                  Foot Length (in)
                </TableCellTitle>
                <StyledTableCell>8 1/2</StyledTableCell>
                <StyledTableCell>8 11/16</StyledTableCell>
                <StyledTableCell>8 13/16</StyledTableCell>
                <StyledTableCell>9</StyledTableCell>
                <StyledTableCell>9 3/16</StyledTableCell>
                <StyledTableCell>9 5/16</StyledTableCell>
                <StyledTableCell>9 1/2</StyledTableCell>
                <StyledTableCell>9 11/16</StyledTableCell>
                <StyledTableCell>9 13/16</StyledTableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
      )}
      {tabValue === 1 && (
        // Table for centimeters (CM)
        <TableContainer>
          <Table>
            <TableHead sx={{ backgroundColor: "#f1eeee" }}>
              <TableRow>
                <TableCellTitle>Size</TableCellTitle>
                <TableCellTitle>3.5</TableCellTitle>
                <TableCellTitle>4</TableCellTitle>
                <TableCellTitle>4.5</TableCellTitle>
                <TableCellTitle>5</TableCellTitle>
                <TableCellTitle>5.5</TableCellTitle>
                <TableCellTitle>6</TableCellTitle>
                <TableCellTitle>6.5</TableCellTitle>
                <TableCellTitle>7</TableCellTitle>
                <TableCellTitle>7.5</TableCellTitle>
              </TableRow>
            </TableHead>
            <TableBody>
              <TableRow>
                <TableCellTitle
                  sx={{
                    backgroundColor: "#f1eeee",
                    fontWeight: "600",
                    width: "120px",
                  }}
                >
                  Foot Length (cm)
                </TableCellTitle>
                <StyledTableCell>21.6</StyledTableCell>
                <StyledTableCell>22</StyledTableCell>
                <StyledTableCell>22.4</StyledTableCell>
                <StyledTableCell>22.9</StyledTableCell>
                <StyledTableCell>23.3</StyledTableCell>
                <StyledTableCell>23.7</StyledTableCell>
                <StyledTableCell>24.1</StyledTableCell>
                <StyledTableCell>24.5</StyledTableCell>
                <StyledTableCell>25</StyledTableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </div>
  );
};
const TableCellTitle = styled(TableCell)`
  font-size: 0.8rem;
  font-weight: bold;
  text-align: center;
`;
const StyledTableCell = styled(TableCell)`
  font-size: 0.71rem;
  text-align: center;
`;

// Customized Material UI Switch
const MaterialUISwitch = styled(Switch)(({ theme }) => ({
  width: 118,
  height: 52,
  padding: 8,

  "&:hover .MuiSwitch-thumb": {
    boxShadow: "-1px 1px 8px rgba(0, 0, 0, 0.5)",
  },

  "& .MuiSwitch-switchBase": {
    transform: "translateX(-1px)",

    "&.Mui-checked": {
      color: "#fff",
      transform: "translateX(48px)",
      "& + .MuiSwitch-track": {
        opacity: 1,
        backgroundColor: "#f1f1f1",
      },
    },
    "&.MuiSwitch-switchBase:hover": {
      backgroundColor: "transparent",
    },
  },
  "& .MuiSwitch-thumb": {
    backgroundColor: "#ffffff",
    width: 53,
    height: 36,
    borderRadius: "45%",
    position: "absolute",
    left: 8,
    top: 8,
    boxShadow: "0 0 0 rgba(0, 0, 0, 0)",
    border: "1px solid darkgrey",
    transition: "box-shadow 0.2s ease-in-out",
  },
  "& .MuiSwitch-track": {
    opacity: 1,
    backgroundColor: "#f1f1f1",
    borderRadius: 30,
  },
}));
