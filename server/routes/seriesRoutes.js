const express = require('express');
const router = express.Router();
const { 
  getAllSeries, 
  getSeriesById, 
  createSeries, 
  updateSeriesById, 
  deleteSeriesById 
} = require('../controllers/seriesController');  

router.get('/series', getAllSeries);

router.get('/series/:id', getSeriesById);

router.post('/series', createSeries);

router.put('/series/:id', updateSeriesById);

router.delete('/series/:id', deleteSeriesById);

module.exports = router;
