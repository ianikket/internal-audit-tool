import { Router, Request, Response } from 'express';
import { AppDataSource } from '../config/database';
import { Assessment } from '../models/Assessment';

const router = Router();
const assessmentRepo = AppDataSource.getRepository(Assessment);

// GET /api/assessments - list all
router.get('/', async (_req: Request, res: Response) => {
  const assessments = await assessmentRepo.find({ order: { createdAt: 'DESC' } });
  res.json({ status: 'success', data: assessments });
});

// GET /api/assessments/:id - get one
router.get('/:id', async (req: Request, res: Response) => {
  const assessment = await assessmentRepo.findOneBy({ id: Number(req.params.id) });
  if (!assessment) return res.status(404).json({ status: 'error', message: 'Not found' });
  res.json({ status: 'success', data: assessment });
});

// PUT /api/assessments/:id - edit
router.put('/:id', async (req: Request, res: Response) => {
  const assessment = await assessmentRepo.findOneBy({ id: Number(req.params.id) });
  if (!assessment) return res.status(404).json({ status: 'error', message: 'Not found' });
  const { product, summary, controls, risks } = req.body;
  assessment.product = product ?? assessment.product;
  assessment.summary = summary ?? assessment.summary;
  assessment.controls = controls ?? assessment.controls;
  assessment.risks = risks ?? assessment.risks;
  await assessmentRepo.save(assessment);
  res.json({ status: 'success', data: assessment });
});

// DELETE /api/assessments/:id - delete
router.delete('/:id', async (req: Request, res: Response) => {
  const assessment = await assessmentRepo.findOneBy({ id: Number(req.params.id) });
  if (!assessment) return res.status(404).json({ status: 'error', message: 'Not found' });
  await assessmentRepo.remove(assessment);
  res.json({ status: 'success' });
});

export default router; 