
import express, { Router } from "express";

import searchProducts from "../apis/search-products";
import { createCategoriesApi, deleteCategoriesApi, readCategoriesApi, updateCategoriesApi } from "../apis/crud-categories";
import { createAttributesApi, deleteAttributesApi, readAttributesApi, updateAttributesApi } from "../apis/crud-attributes";
import { createProductsApi, deleteProductsApi, readProductsApi, updateProductsApi } from "../apis/crud-products";
import getProductsByCategoryAndStatus from "../apis/get-products-by-category-and-status";

const router: Router = express.Router();



// Routes from Search Products
router.post("/search-products", searchProducts);

// Routes for CRUD categories
router.post("/create-category", createCategoriesApi);
router.post("/get-category-by-id", readCategoriesApi);
router.post("/update-category-by-id", updateCategoriesApi);
router.post("/delete-category-by-id", deleteCategoriesApi);

// Routes for CRUD attributes
router.post("/create-attribute", createAttributesApi);
router.post("/get-attribute-by-id", readAttributesApi);
router.post("/update-attribute-by-id", updateAttributesApi);
router.post("/delete-attribute-by-id", deleteAttributesApi);

// Routes for CRUD products
router.post("/create-product", createProductsApi);
router.post("/get-product-by-id", readProductsApi);
router.post("/update-product-by-id", updateProductsApi);
router.post("/delete-product-by-id", deleteProductsApi);

router.post("/get-products-by-category-and-status", getProductsByCategoryAndStatus);



export default router;
