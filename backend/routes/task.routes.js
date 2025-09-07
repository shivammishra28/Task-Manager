import express from 'express';
import { auth } from '../middlewares/auth.js';
import { createTask, listTasks, updateTask, deleteTask } from '../controllers/Task.controller.js';

const router = express.Router();
router.use(auth);

router.get('/', listTasks);
router.post('/', createTask);
router.put('/:id', updateTask);
router.delete('/:id', deleteTask);

export default router;
