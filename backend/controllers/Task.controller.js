import Task from '../models/Task.js';
import { createTaskSchema, updateTaskSchema } from '../validations/task.validation.js';

export const createTask = async (req, res) => {
  const { value, error } = createTaskSchema.validate(req.body);
  if (error) return res.status(400).json({ message: error.message });

  const task = await Task.create({ ...value, user: req.user.id });
  res.status(201).json({ task });
};

export const listTasks = async (req, res) => {
  const userId = req.user.id;
  const { page = 1, limit = 10, search = '', status = 'all' } = req.query;

  const query = { user: userId };
  if (status === 'pending' || status === 'done') query.status = status;
  if (search) {
    const rx = new RegExp(search, 'i');
    query.$or = [{ title: rx }, { description: rx }];
  }

  const pageNum = Math.max(parseInt(page), 1);
  const pageSize = Math.min(Math.max(parseInt(limit), 1), 50);

  const [items, total] = await Promise.all([
    Task.find(query).sort({ createdAt: -1 }).skip((pageNum - 1) * pageSize).limit(pageSize),
    Task.countDocuments(query)
  ]);

  res.json({
    items,
    total,
    page: pageNum,
    limit: pageSize,
    pages: Math.ceil(total / pageSize)
  });
};

export const updateTask = async (req, res) => {
  const { id } = req.params;
  const { value, error } = updateTaskSchema.validate(req.body);
  if (error) return res.status(400).json({ message: error.message });

  const task = await Task.findOne({ _id: id, user: req.user.id });
  if (!task) return res.status(404).json({ message: 'Task not found' });

  Object.assign(task, value);
  await task.save();
  res.json({ task });
};

export const deleteTask = async (req, res) => {
  const { id } = req.params;
  const task = await Task.findOneAndDelete({ _id: id, user: req.user.id });
  if (!task) return res.status(404).json({ message: 'Task not found' });
  res.json({ ok: true });
};
