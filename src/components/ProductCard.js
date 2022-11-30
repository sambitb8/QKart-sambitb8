import { AddShoppingCartOutlined } from "@mui/icons-material";
import {
  Button,
  Stack,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Rating,
  Typography,
} from "@mui/material";
import Box from "@mui/material/Box";
import React from "react";
import "./ProductCard.css";

const ProductCard = ({ product, handleAddToCart }) => {
  return (
    <Card className="card">
       <CardMedia
        component="img"
        alt={product.name}
        image={product.image}
      />
      <CardContent>
        <Typography gutterBottom variant="h6" component="div">
        {product.name}
        </Typography>
        <Typography sx={{fontWeight: "bold"}} gutterBottom variant="h6" component="div">
        ${product.cost}
        </Typography>
        <Rating name="read-only" value={product.rating} readOnly />
      </CardContent>
      <CardActions>
        <Button sx={{width: "100%"}} size="large" variant="contained" color="primary" onClick={() => handleAddToCart(product)}>
        <Stack
          direction="row"
          spacing={1}
        >
        <AddShoppingCartOutlined />
        <Box>ADD TO CART</Box>
        </Stack>
        </Button>
      </CardActions>
    </Card>
  );
};

export default ProductCard;
