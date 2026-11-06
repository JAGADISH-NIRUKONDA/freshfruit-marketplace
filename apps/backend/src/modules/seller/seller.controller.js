import * as sellerService from './seller.service.js';
import { successResponse } from '../../utils/response.js';

export const getProfile = async (req, res, next) => {
  try {
    const data = await sellerService.getSellerProfile(req.user._id);
    return successResponse(res, {
      message: 'Seller farm profile fetched successfully',
      data,
    });
  } catch (err) {
    next(err);
  }
};

export const updateProfile = async (req, res, next) => {
  try {
    const data = await sellerService.updateSellerProfile(req.user._id, req.body);
    return successResponse(res, {
      message: 'Seller farm profile updated successfully',
      data,
    });
  } catch (err) {
    next(err);
  }
};

export const getStats = async (req, res, next) => {
  try {
    const data = await sellerService.getSellerStats(req.user._id);
    return successResponse(res, {
      message: 'Seller dashboard statistics fetched successfully',
      data,
    });
  } catch (err) {
    next(err);
  }
};

export const getProducts = async (req, res, next) => {
  try {
    const data = await sellerService.getSellerProducts(req.user._id, req.query);
    return successResponse(res, {
      message: 'Seller products retrieved successfully',
      data,
    });
  } catch (err) {
    next(err);
  }
};

export const createProduct = async (req, res, next) => {
  try {
    const data = await sellerService.createSellerProduct(req.user._id, req.body);
    return successResponse(res, {
      statusCode: 201,
      message: 'Product created and listed successfully',
      data: { product: data },
    });
  } catch (err) {
    next(err);
  }
};

export const getProductById = async (req, res, next) => {
  try {
    const data = await sellerService.getSellerProductById(req.user._id, req.params.id);
    return successResponse(res, {
      message: 'Product retrieved successfully',
      data: { product: data },
    });
  } catch (err) {
    next(err);
  }
};

export const updateProduct = async (req, res, next) => {
  try {
    const data = await sellerService.updateSellerProduct(req.user._id, req.params.id, req.body);
    return successResponse(res, {
      message: 'Product updated successfully',
      data: { product: data },
    });
  } catch (err) {
    next(err);
  }
};

export const deleteProduct = async (req, res, next) => {
  try {
    const data = await sellerService.deleteSellerProduct(req.user._id, req.params.id);
    return successResponse(res, {
      message: 'Product removed from your orchard catalog',
      data,
    });
  } catch (err) {
    next(err);
  }
};

export const adjustStock = async (req, res, next) => {
  try {
    const data = await sellerService.adjustSellerInventory(req.user._id, req.params.id, req.body);
    return successResponse(res, {
      message: 'Inventory stock level adjusted successfully',
      data: { product: data },
    });
  } catch (err) {
    next(err);
  }
};

