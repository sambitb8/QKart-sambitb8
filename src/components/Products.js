import { Search, SentimentDissatisfied } from "@mui/icons-material";
import {
  CircularProgress,
  Grid,
  InputAdornment,
  TextField,
} from "@mui/material";
import { Box } from "@mui/system";
import axios from "axios";
import { useSnackbar } from "notistack";
import React, { useEffect, useState } from "react";
import { config } from "../App";
import Footer from "./Footer";
import Header from "./Header";
import "./Products.css";
import ProductCard from "./ProductCard";
import Cart from "./Cart";
import { generateCartItemsFrom } from "./Cart";

// Definition of Data Structures used
/**
 * @typedef {Object} Product - Data on product available to buy
 *
 * @property {string} name - The name or title of the product
 * @property {string} category - The category that the product belongs to
 * @property {number} cost - The price to buy the product
 * @property {number} rating - The aggregate rating of the product (integer out of five)
 * @property {string} image - Contains URL for the product image
 * @property {string} _id - Unique ID for the product
 */

const Products = () => {
  const [product, setProduct] = useState([]);
  const [stopLoad, setStopLoad] = useState(false);
  const [cartData, setCartData] = useState([]);

  const url = `${config.endpoint}/products`;
  const urlCart = `${config.endpoint}/cart`;

  const { enqueueSnackbar } = useSnackbar();
  let timer;

  // const prop = {
  //   name: "Tan Leatherette Weekender Duffle",
  //   category: "Fashion",
  //   cost: 150,
  //   rating: 4,
  //   image:
  //     "https://crio-directus-assets.s3.ap-south-1.amazonaws.com/ff071a1c-1099-48f9-9b03-f858ccc53832.png",
  //   _id: "PmInA797xJhMIPti",
  // };

  // TODO: CRIO_TASK_MODULE_PRODUCTS - Fetch products data and store it
  /**
   * Make API call to get the products list and store it to display the products
   *
   * @returns { Array.<Product> }
   *      Array of objects with complete data on all available products
   *
   * API endpoint - "GET /products"
   *
   * Example for successful response from backend:
   * HTTP 200
   * [
   *      {
   *          "name": "iPhone XR",
   *          "category": "Phones",
   *          "cost": 100,
   *          "rating": 4,
   *          "image": "https://i.imgur.com/lulqWzW.jpg",
   *          "_id": "v4sLtEcMpzabRyfx"
   *      },
   *      {
   *          "name": "Basketball",
   *          "category": "Sports",
   *          "cost": 100,
   *          "rating": 5,
   *          "image": "https://i.imgur.com/lulqWzW.jpg",
   *          "_id": "upLK9JbQ4rMhTwt4"
   *      }
   * ]
   *
   * Example for failed response from backend:
   * HTTP 500
   * {
   *      "success": false,
   *      "message": "Something went wrong. Check the backend console for more details"
   * }
   */

  const performAPICall = async (setUrl = "") => {
    try {
      const res = !setUrl ? await axios.get(url) : await axios.get(setUrl);
      setProduct(res.data);
    } catch (err) {
      if (!err.response)
        enqueueSnackbar(
          "Something went wrong. Check that the backend is running, reachable and returns valid JSON",
          { variant: "error", autoHideDuration: 2000 }
        );
      if (err.response) {
        setProduct(err.response.data);
        setStopLoad(true);
      }
    }
  };

  // TODO: CRIO_TASK_MODULE_PRODUCTS - Implement search logic
  /**
   * Definition for search handler
   * This is the function that is called on adding new search keys
   *
   * @param {string} text
   *    Text user types in the search bar. To filter the displayed products based on this text.
   *
   * @returns { Array.<Product> }
   *      Array of objects with complete data on filtered set of products
   *
   * API endpoint - "GET /products/search?value=<search-query>"
   *
   */
  const performSearch = async (text) => {
    try {
      const url = `${config.endpoint}/products/search?value=${text}`;
      performAPICall(url);
    } catch (err) {}
  };

  // TODO: CRIO_TASK_MODULE_PRODUCTS - Optimise API calls with debounce search implementation
  /**
   * Definition for debounce handler
   * With debounce, this is the function to be called whenever the user types text in the searchbar field
   *
   * @param {{ target: { value: string } }} event
   *    JS event object emitted from the search input field
   *
   * @param {NodeJS.Timeout} debounceTimeout
   *    Timer id set for the previous debounce call
   *
   */
  const debounceSearch = (event, debounceTimeout) => {
    timer && clearTimeout(timer);
    timer = setTimeout(
      () => performSearch(event.target.value),
      debounceTimeout
    );
  };

  const fetchCart = async (token) => {
    try {
      if (!token) return;
      const res = await axios.get(urlCart, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      setCartData(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  const isItemInCart = (items, productId) => {
    return items.findIndex((item) => item.productId === productId) !== -1;
  };

  const addToCart = async (
    token,
    items,
    products,
    productId,
    qty,
    options = { preventDuplicate: false }
  ) => {
    if (!token) {
      enqueueSnackbar("Login to add an item to the Cart", {
        variant: "warning",
        autoHideDuration: 2000,
      });
      return;
    }

    if (options.preventDuplicate && isItemInCart(items, productId)) {
      enqueueSnackbar(
        "Item already in cart. Use the cart sidebar to update quantity or remove item.",
        { variant: "warning", autoHideDuration: 2000 }
      );
      return;
    }

    try {
      const res = await axios.post(
        urlCart,
        { productId, qty },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      setCartData(res.data);
    } catch (err) {
      console.error(err.message);
    }
  };

  useEffect(() => {
    performAPICall();
    fetchCart(localStorage.getItem("token"));
  }, []);

  return (
    <Box>
      <Header
        children
        performSearch={performSearch}
        debounceSearch={debounceSearch}
      />

      {/* Search view for mobiles */}
      <Grid container className="product-container">
        <Grid
          container
          item
          className={localStorage.getItem("token") && "product-list"}
        >
          <TextField
            className="search-mobile"
            size="small"
            fullWidth
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <Search color="primary" />
                </InputAdornment>
              ),
            }}
            placeholder="Search for items/categories"
            name="search"
            onChange={(e) => debounceSearch(e, 500)}
          />
          <Grid container spacing={{ xs: 2, md: 3 }} className="container--box">
            <Grid item className="product-grid">
              <Box className="hero">
                <p className="hero-heading">
                  India’s{" "}
                  <span className="hero-highlight">FASTEST DELIVERY</span> to
                  your door step
                </p>
              </Box>
            </Grid>
            <Grid container item sx={{ mr: 3, ml: 1, mb: 10 }} spacing={3}>
              {product.length > 0 ? (
                product.map((p) => {
                  return (
                    <Grid item xs={6} md={3}>
                      <ProductCard
                        product={p}
                        handleAddToCart={async () =>
                          await addToCart(
                            window.localStorage.getItem("token"),
                            cartData,
                            product,
                            p._id,
                            1,
                            { preventDuplicate: true }
                          )
                        }
                      />{" "}
                    </Grid>
                  );
                })
              ) : stopLoad ? (
                <Grid
                  container
                  item
                  direction="column"
                  justifyContent="flex-start"
                  alignItems="center"
                  spacing={3}
                >
                  <Grid item>
                    <SentimentDissatisfied />
                  </Grid>
                  <Grid item>
                    <strong>No products found</strong>
                  </Grid>
                </Grid>
              ) : (
                <Grid
                  container
                  item
                  direction="column"
                  justifyContent="flex-start"
                  alignItems="center"
                  spacing={3}
                >
                  <Grid item>
                    <CircularProgress />
                  </Grid>
                  <Grid item>
                    <strong>Loading Products...</strong>
                  </Grid>
                </Grid>
              )}
            </Grid>
          </Grid>
        </Grid>
        {localStorage.getItem("token") && (
          <Grid item className="product-cart">
            <Cart
              products={product}
              items={generateCartItemsFrom(cartData, product)}
              handleQuantity={addToCart}
            />
          </Grid>
        )}
      </Grid>
      <Footer />
    </Box>
  );
};

export default Products;
