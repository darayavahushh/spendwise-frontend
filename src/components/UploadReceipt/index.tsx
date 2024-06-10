import {
  Box,
  Button,
  CircularProgress,
  Divider,
  Typography,
  IconButton,
  Select,
  MenuItem,
} from "@mui/material";
import { FC, useEffect, useState } from "react";
import UploadIcon from "@mui/icons-material/Upload";
import CancelIcon from "@mui/icons-material/Cancel";
import { Category } from "../shared/types/Category";
import { CategoriesApiClient } from "../../api/Clients/CategoriesApiClients";
import { CategoryModel } from "../../api/Models/CategoryModel";
import { ScanReceiptPopup } from "./ScanReceiptPopup";
import { CategorizedProduct } from "../shared/types/CategorizedProduct";
import { CategorizedProductModel } from "../../api/Models/CategorizedProductModel";
import { useNavigate } from "react-router-dom";
import { SaveCartModel } from "../../api/Models/SaveCartModel";
import { ReceiptsApiClient } from "../../api/Clients/ReceiptsApiClient";
import { ScannedProduct } from "../shared/types/ScannedProduct";

import "./UploadReceipt.css";

export const UploadReceipt: FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isSetupComplete, setIsSetupComplete] = useState(false);
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const [scannedImage, setScannedImage] = useState<File | null>(null);
  const [categorizedProducts, setCategorizedProducts] = useState<
    CategorizedProduct[]
  >([]);
  const navigate = useNavigate();

  const fetchCategories = async () => {
    try {
      const res = await CategoriesApiClient.getAllAsync();
      const categories = res.map((e: CategoryModel) => ({ ...e } as Category));
      setCategories(categories);
      setIsSetupComplete(true);
    } catch (error: any) {
      console.log(error);
    }
  };

  const saveProductsInReceipt = async () => {
    try {
      const model: SaveCartModel = {
        date: new Date(),
        categoryProducts: categorizedProducts.map(
          (el) => ({ ...el } as CategorizedProductModel)
        ),
      };
      await ReceiptsApiClient.saveCart(model);
      navigate("/products");
    } catch (error: any) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const deleteProduct = (categoryName: string, productName: string) => {
    setCategorizedProducts((prevProducts) =>
      prevProducts.map((category) =>
        category.name === categoryName
          ? {
              ...category,
              products: category.products.filter(
                (product) => product.name !== productName // make it by ID not name as with name deletes 2 of the same!
              ),
            }
          : category
      )
    );
  };

  const updateProductCategory = (
    productName: string,
    newCategoryName: string
  ) => {
    setCategorizedProducts((prevProducts) => {
      let productToMove: ScannedProduct | undefined;

      // Find and remove the product from the current category
      const updatedProducts = prevProducts.map((category) => {
        const productIndex = category.products.findIndex(
          (p) => p.name === productName
        );
        if (productIndex > -1) {
          productToMove = category.products[productIndex];
          const updatedProducts = [...category.products];
          updatedProducts.splice(productIndex, 1);
          return { ...category, products: updatedProducts };
        }
        return category;
      });

      // Add the product to the new category if it was found
      if (productToMove) {
        // Check if the new category already exists
        const newCategoryIndex = updatedProducts.findIndex(
          (category) => category.name === newCategoryName
        );
        if (newCategoryIndex > -1) {
          // Add the product to the existing category
          updatedProducts[newCategoryIndex].products.push(productToMove);
        } else {
          // Add a new category with the moved product
          updatedProducts.push({
            id: updatedProducts.length + 1, // Assuming id is just an incrementing number
            name: newCategoryName,
            products: [productToMove],
          });
        }
      }

      return updatedProducts;
    });
  };

  return !isSetupComplete ? (
    <Box className={"spinner-layout"}>
      <CircularProgress />
    </Box>
  ) : (
    <Box>
      <Box className={"upload-receipt-section"}>
        <Box className={"upload-receipt-title-text"}>Upload a receipt</Box>
        <Button
          size="medium"
          color="primary"
          variant="contained"
          onClick={handleOpen}
        >
          <UploadIcon fontSize="large" color="secondary" />
        </Button>
      </Box>

      <Divider />

      {scannedImage && (
        <>
          <Box className={"uploaded-image-section"}>
            <Box>
              <Box className={"uploaded-image-container"}>
                <Box
                  className={"upload-receipt-title-text"}
                  textAlign={"center"}
                >
                  Uploaded image
                </Box>
                <img
                  src={URL.createObjectURL(scannedImage)}
                  className={"uploaded-image"}
                />
              </Box>
            </Box>
            <Box className={"categorized-products-section"}>
              <Box className={"upload-receipt-title-text"}>
                Categorized Products
              </Box>
              <Button
                onClick={() => saveProductsInReceipt()}
                variant="contained"
                className={"save-products-button"}
              >
                Save products
              </Button>
              {categorizedProducts.map((category) => (
                <Box key={category.id} className={"category-box"}>
                  <Typography variant="h6" className={"category-name"}>
                    {category.name}
                  </Typography>
                  <Box className={"products-list"}>
                    {category.products.map((product, index) => (
                      <Box key={index} className={"product-box"}>
                        <Typography className={"product-name"}>
                          {product.name}
                        </Typography>
                        <Typography className={"product-quantity"}>
                          Quantity: {product.quantity}
                        </Typography>
                        <Typography className={"product-price"}>
                          Price: ${product.price.toFixed(2)}
                        </Typography>
                        <IconButton
                          onClick={() =>
                            deleteProduct(category.name, product.name)
                          }
                        >
                          <CancelIcon color="primary" fontSize="large" />
                        </IconButton>
                        <Select
                          value={category.name}
                          onChange={(event) =>
                            updateProductCategory(
                              product.name,
                              event.target.value as string
                            )
                          }
                        >
                          {categories.map((cat) => (
                            <MenuItem key={cat.id} value={cat.name}>
                              {cat.name}
                            </MenuItem>
                          ))}
                        </Select>
                      </Box>
                    ))}
                  </Box>
                </Box>
              ))}
            </Box>
          </Box>
        </>
      )}

      <ScanReceiptPopup
        open={open}
        onClose={handleClose}
        categories={categories}
        onScanning={(file: File, categorizedProducts: CategorizedProduct[]) => {
          setScannedImage(file);
          setCategorizedProducts(categorizedProducts);
        }}
      />
    </Box>
  );
};
