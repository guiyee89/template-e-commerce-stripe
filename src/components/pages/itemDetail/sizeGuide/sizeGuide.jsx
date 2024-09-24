import {
  Box,
  Tab,
  Tabs,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import { useState } from "react";

export const SizeGuide = () => {
  const [tabValue, setTabValue] = useState(0);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  return (
    <>
      <Typography variant="h4" gutterBottom>
        Talles de Prendas Superiores para Hombre
      </Typography>

      <Tabs
        value={tabValue}
        onChange={handleTabChange}
        aria-label="size guide tabs"
      >
        <Tab label="Pulgadas" />
        <Tab label="CM" />
      </Tabs>

      {tabValue === 0 && (
        // Table for inches (Pulgadas)
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Etiqueta del producto</TableCell>
                <TableCell>XS</TableCell>
                <TableCell>S</TableCell>
                <TableCell>M</TableCell>
                <TableCell>L</TableCell>
                <TableCell>XL</TableCell>
                <TableCell>2XL</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              <TableRow>
                <TableCell>Pecho</TableCell>
                <TableCell>32 1/2 - 34"</TableCell>
                <TableCell>34 1/2 - 36"</TableCell>
                <TableCell>36 1/2 - 39"</TableCell>
                <TableCell>39 1/2 - 42"</TableCell>
                <TableCell>43 - 46 1/2"</TableCell>
                <TableCell>47 - 51"</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Cintura</TableCell>
                <TableCell>27 1/2 - 29"</TableCell>
                <TableCell>29 1/2 - 31 1/2"</TableCell>
                <TableCell>32 - 34 1/2"</TableCell>
                <TableCell>35 - 38"</TableCell>
                <TableCell>38 1/2 - 42"</TableCell>
                <TableCell>42 1/2 - 47"</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Cadera</TableCell>
                <TableCell>32 - 33 1/2"</TableCell>
                <TableCell>34 - 36"</TableCell>
                <TableCell>36 1/2 - 39"</TableCell>
                <TableCell>39 1/2 - 42 1/2"</TableCell>
                <TableCell>42 1/2 - 45 1/2"</TableCell>
                <TableCell>46 - 49"</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {tabValue === 1 && (
        // Table for centimeters (CM)
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Etiqueta del producto</TableCell>
                <TableCell>XS</TableCell>
                <TableCell>S</TableCell>
                <TableCell>M</TableCell>
                <TableCell>L</TableCell>
                <TableCell>XL</TableCell>
                <TableCell>2XL</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              <TableRow>
                <TableCell>Pecho</TableCell>
                <TableCell>87 - 92cm</TableCell>
                <TableCell>93 - 100cm</TableCell>
                <TableCell>101 - 108cm</TableCell>
                <TableCell>109 - 118cm</TableCell>
                <TableCell>119 - 130cm</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Cintura</TableCell>
                <TableCell>75 - 80cm</TableCell>
                <TableCell>81 - 88cm</TableCell>
                <TableCell>89 - 96cm</TableCell>
                <TableCell>97 - 106cm</TableCell>
                <TableCell>107 - 120cm</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Cadera</TableCell>
                <TableCell>89 - 96cm</TableCell>
                <TableCell>97 - 104cm</TableCell>
                <TableCell>105 - 112cm</TableCell>
                <TableCell>113 - 121cm</TableCell>
                <TableCell>122 - 130cm</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
      )}

      <Typography variant="h6" gutterBottom sx={{ marginTop: 4 }}>
        Talle Largo
      </Typography>
      <Typography>
        Los talles largos están diseñados para hombres de más de 189 cm (6'2").
      </Typography>
    </>
  );
};
