const express = require('express');
const router = express.Router();
const { getAllBrands, getBrandById, createBrand, updateBrandById, deleteBrandById } = require('../controllers/brandController');
const { getProductsByBrand } = require('../controllers/productController'); 
router.get('/brands', getAllBrands);
router.get('/brands/:id', getBrandById);
router.post('/brands', createBrand);
router.put('/brands/:id', updateBrandById);
router.delete('/brands/:id', deleteBrandById);

router.get('/brands/:brandId', getProductsByBrand); 

module.exports = router;
