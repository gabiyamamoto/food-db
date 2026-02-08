import express from 'express';
import * as FoodsController from '../controllers/foodController.js';

const router = express.Router();

// São objetos roteadores que fazem tipo "essa URL com esse método → chama esse controller"
router.get('/foods', FoodsController.getAll);
router.get('/foods/:id', FoodsController.getById);
router.put('/foods/:id', FoodsController.update);
router.delete('/foods/:id', FoodsController.remove);
router.post('/foods', FoodsController.create);

// Default export → uma coisa principal
// Named export → várias funções/valores
export default router;