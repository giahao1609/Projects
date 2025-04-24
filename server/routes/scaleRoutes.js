const express = require('express');
const router = express.Router();
const{ getAllScales, getScaleById, createScale, updateScaleById, deleteScaleById } = require('../controllers/scaleController.js');


router.get('/scales', getAllScales);

router.get('/scales/:id', getScaleById);

router.post('/scales', createScale);

router.put('/scales/:id', updateScaleById);

router.delete('/scales/:id', deleteScaleById);

module.exports = router;

