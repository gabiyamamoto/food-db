import express from 'express';
import * as FoodsController from '../controllers/foodController.js';

const router = express.Router();

router.get('/foods', FoodsController.getAll);
router.get('/foods/:id', FoodsController.getById);
router.put('/foods/:id', FoodsController.update);
router.delete('/foods/:id', FoodsController.remove);
router.post('/foods', FoodsController.create);

export default router;
