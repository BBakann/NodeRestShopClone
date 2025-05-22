const express = require('express');
const router = express.Router();

const mongoose = require('mongoose');
const Product = require('../models/product');

const upload = require('../middlewares/uploadImage');

router.get('/', async (req, res) => {
  try {
    const products = await Product.find();
    res.status(200).json({
      count: products.length,
      products: products.map(prod => ({
        _id: prod._id,
      name: prod.name,
      price: prod.price,
      imageUrl: prod.imageUrl ? `http://localhost:3000/uploads/${prod.imageUrl}` : null,
      request: {
        type: 'GET',
        url: `http://localhost:3000/products/${prod._id}`
  }
}))

    });
  } catch (err) {
    res.status(500).json({ error: err });
  }
});


router.post('/', upload.single('productImage'), async (req, res) => {
  try {
    const product = new Product({
      name: req.body.name,
      price: req.body.price,
      imageUrl: req.file ? req.file.filename : null
    });

    const result = await product.save();
    res.status(201).json({
      message: 'Product created successfully',
      createdProduct: result
    });
  } catch (err) {
    res.status(500).json({ error: err });
  }
});


router.get('/:productId', async (req, res) => {
  const id = req.params.productId;

  try {
    const product = await Product.findById(id); // id'yi arar

    if (product) {
      res.status(200).json({
        product: {
          _id: product._id,
          name: product.name,
          price: product.price,
          imageUrl: product.imageUrl ? `http://localhost:3000/uploads/${product.imageUrl}` : null,
          request: {
            type: 'GET',
            url: `http://localhost:3000/products`
          }
        }
      });
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (err) {
    res.status(500).json({ error: err });
  }
});


router.patch('/:productId', async (req, res) => {
  const id = req.params.productId;

  const updateOps = {};
  for (const ops of req.body) {
    updateOps[ops.propName] = ops.value;
  }

  try {
    const result = await Product.updateOne({ _id: id }, { $set: updateOps });

    res.status(200).json({
      message: 'Product updated',
      result: result,
      request: {
        type: 'GET',
        url: `http://localhost:3000/products/${id}`
      }
    });
  } catch (err) {
    res.status(500).json({ error: err });
  }
});


router.delete('/:productId', async (req, res) => {
  const id = req.params.productId;

  try {
    const result = await Product.deleteOne({ _id: id });
    res.status(200).json({
      message: 'Product deleted',
      result: result,
      request: {
        type: 'POST',
        url: 'http://localhost:3000/products',
        body: {
          name: 'String',
          price: 'Number'
        }
      }
    });
  } catch (err) {
    res.status(500).json({ error: err });
  }
});

module.exports = router;