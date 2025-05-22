const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const Order = require('../models/order');
const Product = require('../models/product');

router.get('/', async (req, res) => {
  try {
    const orders = await Order.find()
      .populate('product', 'name price') // sadece name ve price alanlarını getir
      .exec();

    res.status(200).json({
      count: orders.length,
      orders: orders.map(order => ({
        _id: order._id,
        name: order.name,
        product: order.product,
        quantity: order.quantity,
        request: {
          type: 'GET',
          url: `http://localhost:3000/orders/${order._id}`
        }
      }))
    });
  } catch (err) {
    res.status(500).json({ error: err });
  }
});


router.post('/', async (req, res) => {
  try {
    // Ürün veritabanında var mı kontrol et
    const product = await Product.findById(req.body.productId);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    const order = new Order({
      name: req.body.name, // Kullanıcının ismi
      product: req.body.productId, // Ürün ID'si
      quantity: req.body.quantity // Adet
    });

    const result = await order.save();

    res.status(201).json({
      message: 'Order stored',
      createdOrder: {
        _id: result._id,
        name: result.name,
        product: result.product,
        quantity: result.quantity
      },
      request: {
        type: 'GET',
        url: `http://localhost:3000/orders/${result._id}`
      }
    });
  } catch (err) {
    res.status(500).json({ error: err });
  }
});


router.get('/:orderId', async (req, res) => {
  const id = req.params.orderId;
  try {
    const order = await Order.findById(id).
    populate('product', 'name price');

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    res.status(200).json({
      _id: order._id,
      name: order.name,
      product: order.product,
      quantity: order.quantity,
      request: {
        type: 'GET',
        description: 'Get all orders',
        url: 'http://localhost:3000/orders'
      }
    });
  } catch (err) {
    res.status(500).json({ error: err });
  }
});


router.delete('/:orderId', async (req, res) => {
  const id = req.params.orderId;

  try {
    const result = await Order.deleteOne({ _id: id });

    if (result.deletedCount === 0) {
      return res.status(404).json({ message: 'Order not found' });
    }

    res.status(200).json({
      message: 'Order deleted',
      request: {
        type: 'POST',
        description: 'Create a new order',
        url: 'http://localhost:3000/orders',
        body: {
          name: 'String',
          product: 'Product ID',
          quantity: 'Number'
        }
      }
    });
  } catch (err) {
    res.status(500).json({ error: err });
  }
});



module.exports = router;