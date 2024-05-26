import { Router } from 'express'
import { CategoryController } from './controller';

export class CategoryRoutes{
    static get routes():Router{
        const router = Router();
        const controller = new CategoryController();
        router.get('/', controller.getCategories);
        router.post('/', controller.createCategory);
        return router
    }
}