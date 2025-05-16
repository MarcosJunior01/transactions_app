const express = require('express');
const upload = require('../middlewares/upload.middleware');
const controller = require('../controllers/transaction.controller');
const { verifyToken, isAdmin } = require('../middlewares/authJwt');

const router = express.Router();

router.post('/upload', 
  verifyToken,
  isAdmin,
  upload.single('file'), 
  controller.upload
);

router.get('/', 
  verifyToken,
  isAdmin,
  controller.findAll
);

router.get('/my-transactions',
  verifyToken, 
  controller.findByUser
);

module.exports = router;