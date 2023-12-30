import express from 'express';
import fs from 'fs';
import { body, validationResult } from 'express-validator';

  const validateAddProduct = [
      body('title').notEmpty().isString(),
      body('description').notEmpty().isString(),
      body('code').notEmpty().isString(),
      body('price').notEmpty().isNumeric(),
      body('stock').notEmpty().isNumeric(),
      body('category').notEmpty().isString(),
      body('status').optional().isBoolean(),
      (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
          res.setHeader('Content-Type','application/json');
          return res.status(400).json({ errors: errors.array() });
        }
        next();
      }
    ];

  const validateUpdateProduct = [
    body('title').optional().isString(),
    body('description').optional().isString(),
    body('code').optional().isString(),
    body('price').optional().isNumeric(),
    body('stock').optional().isNumeric(),
    body('category').optional().isString(),
    body('status').optional().isBoolean(),
     (req, res, next) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        res.setHeader('Content-Type','application/json');
        return res.status(400).json({ errors: errors.array() });
      }
      next();
    }
  ];

  const getLastId = (items) => {
    if (items.length === 0) {
      return 1;
    }
    const lastItem = items[items.length - 1];
    return lastItem.id + 1;
  };

  const router = express.Router();
  const productsPath = './productos.json';

  const readJSONFile = (filePath) => {
    try {
      if (fs.existsSync(filePath)) {
      const data = fs.readFileSync(filePath, 'utf-8');
      return JSON.parse(data);
      }
      else {
        const data = [];
        return data;
      }
    } catch (error) {
      return [error];
    }}
  ;

  const writeJSONFile = (filePath, data) => {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
  };

  router.get('/products', (req, res) => {
    const limit = req.query.limit ? parseInt(req.query.limit) : undefined;
    const products = readJSONFile(productsPath);
    res.setHeader('Content-Type','application/json');
    if (limit) {
      const limitedProducts = products.slice(0, limit);
      res.json(limitedProducts);
    } else {
      res.json(products);
    }
  });

  router.get('/products/:pid', (req, res) => {
    const products = readJSONFile(productsPath);
    const product = products.find(p => p.id == req.params.pid);
    res.setHeader('Content-Type','application/json');
    if (product) {
      res.json(product);
    } else {
      res.status(404).send('Producto no encontrado');
    }
  });

  router.post('/products',validateAddProduct ,(req, res) => {
    const products = readJSONFile(productsPath);
    const newProduct = req.body;
    newProduct.id = getLastId(products);
    if (newProduct.status!=false) {newProduct.status=true};
    products.push(newProduct);
    writeJSONFile(productsPath, products);
    const io = req.app.locals.io;
    io.emit('productCreated', products);
    res.setHeader('Content-Type','application/json');
    res.status(201).json(newProduct);
  });

  router.put('/products/:pid', validateUpdateProduct, (req, res) => {
    const products = readJSONFile(productsPath);
    const productId = req.params.pid;
    const updatedProduct = req.body;
    const index = products.findIndex(p => p.id == productId);
    if (index !== -1) {
      products[index] = { ...products[index], ...updatedProduct };
      writeJSONFile(productsPath, products);
      res.setHeader('Content-Type','application/json');
      res.json(products[index]);} 
    else {
      res.setHeader('Content-Type','application/json');
      res.status(404).send('Producto no encontrado');
    }
  });

  router.delete('/products/:pid', (req, res) => {
    const products = readJSONFile(productsPath);
    const productId = req.params.pid;
    const index = products.findIndex(p => p.id == productId);
    if (index !== -1) {
      const filteredProducts = products.filter(p => p.id != productId);
      writeJSONFile(productsPath, filteredProducts);
      const io = req.app.locals.io;
      io.emit('productDeleted', filteredProducts);
      res.setHeader('Content-Type','application/json');
      res.send(`Producto con ID ${productId} eliminado`);}
    else {
      res.setHeader('Content-Type','application/json');
      res.status(404).send('Producto no encontrado');}
  });

  const getProducts = () => {
  let products = readJSONFile(productsPath);
    return products;
  }
  export {getProducts}

export default router;