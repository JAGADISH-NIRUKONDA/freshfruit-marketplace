import { Router } from 'express';
import { authenticate, authorize } from '../../middleware/auth.middleware.js';
import * as sellerController from './seller.controller.js';

const router = Router();

// Protect all seller routes with authentication and server-side seller/admin role check
router.use(authenticate, authorize('seller', 'admin'));

// 1. Seller Profile
router.get('/profile', sellerController.getProfile);
router.put('/profile', sellerController.updateProfile);

// 2. Dashboard KPIs & Metrics
router.get('/stats', sellerController.getStats);

// 3. Product Catalog Management (Scoped to Authenticated Seller)
router.get('/products', sellerController.getProducts);
router.post('/products', sellerController.createProduct);
router.get('/products/:id', sellerController.getProductById);
router.put('/products/:id', sellerController.updateProduct);
router.delete('/products/:id', sellerController.deleteProduct);

// 4. Quick Inventory & Stock Adjustment
router.patch('/inventory/:id/adjust', sellerController.adjustStock);

export default router;

