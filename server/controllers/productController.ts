
import { Request, Response } from 'express';
import { Product } from '../models/product.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const getProducts = asyncHandler(async (req: Request, res: Response) => {
  const products = await Product.find({});
  res.json(products);
});

export const getProductById = asyncHandler(async (req: Request, res: Response) => {
  const product = await Product.findById(req.params.id);
  if (product) {
    res.json(product);
  } else {
    res.status(404).json({ message: 'Product not found' });
  }
});

export const createProduct = asyncHandler(async (req: Request, res: Response) => {
  const product = new Product(req.body);
  const createdProduct = await product.save();
  res.status(201).json(createdProduct);
});
