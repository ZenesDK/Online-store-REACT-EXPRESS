const express = require('express');
const { nanoid } = require('nanoid');
const cors = require('cors');

// Подключаем Swagger
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const app = express();
const port = 3000;

// Middleware
app.use(express.json());
app.use(cors({ 
  origin: "http://localhost:3001", 
  methods: ["GET", "POST", "PATCH", "DELETE"], 
  allowedHeaders: ["Content-Type", "Authorization"] 
}));

// Логирование запросов
app.use((req, res, next) => {
  res.on('finish', () => {
    console.log(`[${new Date().toISOString()}] [${req.method}] ${res.statusCode} ${req.path}`);
    if (req.method === 'POST' || req.method === 'PUT' || req.method === 'PATCH') {
      console.log('Body:', req.body);
    }
  });
  next();
});

// Начальные данные - 10 товаров
let products = [
  { id: nanoid(6), name: 'Ноутбук ASUS ROG', category: 'Ноутбуки', description: 'Игровой ноутбук с RTX 3060, 16GB RAM, 512GB SSD', price: 89990, stock: 5, rating: 4.8 },
  { id: nanoid(6), name: 'Смартфон iPhone 14', category: 'Смартфоны', description: '6.1" Super Retina XDR, A15 Bionic, 128GB', price: 79990, stock: 8, rating: 4.9 },
  { id: nanoid(6), name: 'Наушники Sony WH-1000XM4', category: 'Аудио', description: 'Беспроводные наушники с шумоподавлением', price: 24990, stock: 12, rating: 4.7 },
  { id: nanoid(6), name: 'Монитор Samsung Odyssey', category: 'Мониторы', description: '27" 240Hz, 1ms, QLED изогнутый', price: 45990, stock: 3, rating: 4.6 },
  { id: nanoid(6), name: 'Клавиатура Logitech G Pro', category: 'Периферия', description: 'Механическая, Hot-swap, RGB', price: 12990, stock: 15, rating: 4.5 },
  { id: nanoid(6), name: 'Мышь Razer DeathAdder V2', category: 'Периферия', description: 'Оптическая, 20000 DPI, RGB', price: 4990, stock: 20, rating: 4.4 },
  { id: nanoid(6), name: 'Планшет iPad Air', category: 'Планшеты', description: '10.9" Liquid Retina, M1, 64GB', price: 54990, stock: 4, rating: 4.8 },
  { id: nanoid(6), name: 'Умные часы Galaxy Watch 6', category: 'Аксессуары', description: '44mm, GPS, NFC, пульсометр', price: 29990, stock: 7, rating: 4.6 },
  { id: nanoid(6), name: 'SSD Samsung 1TB', category: 'Комплектующие', description: 'NVMe M.2, 3500MB/s чтение', price: 8990, stock: 11, rating: 4.9 },
  { id: nanoid(6), name: 'Веб-камера Logitech C920', category: 'Периферия', description: 'Full HD 1080p, автофокус', price: 6990, stock: 6, rating: 4.3 }
];

// Функция-помощник для поиска товара
function findProductOr404(id, res) {
  const product = products.find(p => p.id === id);
  if (!product) {
    res.status(404).json({ error: "Product not found" });
    return null;
  }
  return product;
}

// ==================== SWAGGER КОНФИГУРАЦИЯ ====================

/**
 * @swagger
 * components:
 *   schemas:
 *     Product:
 *       type: object
 *       required:
 *         - name
 *         - category
 *         - description
 *         - price
 *         - stock
 *       properties:
 *         id:
 *           type: string
 *           description: Автоматически сгенерированный уникальный ID товара
 *           example: "abc123"
 *         name:
 *           type: string
 *           description: Название товара
 *           example: "Ноутбук ASUS ROG"
 *         category:
 *           type: string
 *           description: Категория товара
 *           example: "Ноутбуки"
 *         description:
 *           type: string
 *           description: Подробное описание товара
 *           example: "Игровой ноутбук с RTX 3060, 16GB RAM, 512GB SSD"
 *         price:
 *           type: number
 *           description: Цена товара в рублях
 *           example: 89990
 *         stock:
 *           type: integer
 *           description: Количество товара на складе
 *           example: 5
 *         rating:
 *           type: number
 *           description: Рейтинг товара (от 0 до 5)
 *           example: 4.8
 *     ProductInput:
 *       type: object
 *       required:
 *         - name
 *         - category
 *         - description
 *         - price
 *         - stock
 *       properties:
 *         name:
 *           type: string
 *           description: Название товара
 *           example: "Новый товар"
 *         category:
 *           type: string
 *           description: Категория товара
 *           example: "Электроника"
 *         description:
 *           type: string
 *           description: Подробное описание товара
 *           example: "Описание нового товара"
 *         price:
 *           type: number
 *           description: Цена товара в рублях
 *           example: 9990
 *         stock:
 *           type: integer
 *           description: Количество товара на складе
 *           example: 10
 *         rating:
 *           type: number
 *           description: Рейтинг товара (от 0 до 5)
 *           example: 4.5
 *     Error:
 *       type: object
 *       properties:
 *         error:
 *           type: string
 *           description: Сообщение об ошибке
 *           example: "Product not found"
 */

// Настройки Swagger
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API интернет-магазина TechStore',
      version: '1.0.0',
      description: 'API для управления товарами в интернет-магазине электроники',
      contact: {
        name: 'Разработчик',
        email: 'your.email@example.com'
      },
    },
    servers: [
      {
        url: 'http://localhost:3000',
        description: 'Локальный сервер разработки',
      },
    ],
    tags: [
      {
        name: 'Products',
        description: 'Управление товарами'
      }
    ]
  },
  // Путь к файлам с JSDoc комментариями
  apis: ['./server.js'],
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);

// Подключаем Swagger UI по адресу /api-docs
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// ==================== МАРШРУТЫ API ====================

/**
 * @swagger
 * /api/products:
 *   post:
 *     summary: Создание нового товара
 *     tags: [Products]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ProductInput'
 *     responses:
 *       201:
 *         description: Товар успешно создан
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 *       400:
 *         description: Ошибка валидации данных
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
app.post("/api/products", (req, res) => {
  const { name, category, description, price, stock, rating } = req.body;
  
  if (!name?.trim() || !category?.trim() || !description?.trim()) {
    return res.status(400).json({ error: "Name, category and description are required" });
  }
  
  const newProduct = {
    id: nanoid(6),
    name: name.trim(),
    category: category.trim(),
    description: description.trim(),
    price: Number(price) || 0,
    stock: Number(stock) || 0,
    rating: Number(rating) || 0
  };
  
  products.push(newProduct);
  res.status(201).json(newProduct);
});

/**
 * @swagger
 * /api/products:
 *   get:
 *     summary: Возвращает список всех товаров
 *     tags: [Products]
 *     responses:
 *       200:
 *         description: Список товаров
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Product'
 */
app.get("/api/products", (req, res) => {
  res.json(products);
});

/**
 * @swagger
 * /api/products/{id}:
 *   get:
 *     summary: Получает товар по ID
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID товара
 *     responses:
 *       200:
 *         description: Данные товара
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 *       404:
 *         description: Товар не найден
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
app.get("/api/products/:id", (req, res) => {
  const id = req.params.id;
  const product = findProductOr404(id, res);
  if (!product) return;
  res.json(product);
});

/**
 * @swagger
 * /api/products/{id}:
 *   patch:
 *     summary: Обновляет данные товара
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID товара
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ProductInput'
 *     responses:
 *       200:
 *         description: Обновлённый товар
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 *       400:
 *         description: Нет данных для обновления
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Товар не найден
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
app.patch("/api/products/:id", (req, res) => {
  const id = req.params.id;
  const product = findProductOr404(id, res);
  if (!product) return;
  
  const updates = req.body;
  
  if (Object.keys(updates).length === 0) {
    return res.status(400).json({ error: "Nothing to update" });
  }
  
  if (updates.name !== undefined) product.name = updates.name.trim();
  if (updates.category !== undefined) product.category = updates.category.trim();
  if (updates.description !== undefined) product.description = updates.description.trim();
  if (updates.price !== undefined) product.price = Number(updates.price);
  if (updates.stock !== undefined) product.stock = Number(updates.stock);
  if (updates.rating !== undefined) product.rating = Number(updates.rating);
  
  res.json(product);
});

/**
 * @swagger
 * /api/products/{id}:
 *   delete:
 *     summary: Удаляет товар
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID товара
 *     responses:
 *       204:
 *         description: Товар успешно удалён (нет тела ответа)
 *       404:
 *         description: Товар не найден
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
app.delete("/api/products/:id", (req, res) => {
  const id = req.params.id;
  const exists = products.some(p => p.id === id);
  
  if (!exists) {
    return res.status(404).json({ error: "Product not found" });
  }
  
  products = products.filter(p => p.id !== id);
  res.status(204).send();
});

// ==================== ОБРАБОТКА ОШИБОК ====================

// 404 для всех остальных маршрутов
app.use((req, res) => {
  res.status(404).json({ error: "Not found" });
});

// Глобальный обработчик ошибок
app.use((err, req, res, next) => {
  console.error("Unhandled error:", err);
  res.status(500).json({ error: "Internal server error" });
});

// Запуск сервера
app.listen(port, () => {
  console.log(`🚀 Сервер запущен на http://localhost:${port}`);
  console.log(`📚 Документация Swagger доступна по адресу http://localhost:${port}/api-docs`);
  console.log(`📦 Товаров в базе: ${products.length}`);
});