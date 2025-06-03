import { Router, Request, Response } from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import pdfParse from 'pdf-parse';
import { analyzeDocumentWithAI } from '../services/ai.service';
import mammoth from 'mammoth';
import textract from 'textract';
import { AppDataSource } from '../config/database';
import { Assessment } from '../models/Assessment';

const router = Router();

// Set up multer storage
const storage = multer.diskStorage({
  destination: function (_req, _file, cb) {
    cb(null, path.join(__dirname, '../../uploads'));
  },
  filename: function (_req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({ storage });

// Helper to extract text from .doc files using textract (callback-based)
function extractDocText(filePath: string): Promise<string> {
  return new Promise((resolve, reject) => {
    textract.fromFileWithPath(filePath, (error, text) => {
      if (error) reject(error);
      else resolve(text || '');
    });
  });
}

// POST /api/documents/upload
router.post('/upload', upload.single('document'), async (req: Request, res: Response) => {
  if (!req.file) {
    return res.status(400).json({ status: 'error', message: 'No file uploaded' });
  }

  const product = req.body.product || 'Unknown Product';

  try {
    let extractedText = '';
    if (req.file.mimetype === 'application/pdf') {
      const dataBuffer = fs.readFileSync(req.file.path);
      const pdfData = await pdfParse(dataBuffer);
      extractedText = pdfData.text;
    } else if (req.file.mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
      const result = await mammoth.extractRawText({ path: req.file.path });
      extractedText = result.value;
    } else if (req.file.mimetype === 'application/msword') {
      extractedText = await extractDocText(req.file.path);
    } else {
      return res.status(400).json({ status: 'error', message: 'Only PDF and Word files are supported for AI parsing at this time.' });
    }

    let aiResult = null;
    try {
      aiResult = await analyzeDocumentWithAI(extractedText, product);
    } catch (aiErr) {
      return res.status(500).json({ status: 'error', message: 'AI analysis failed', error: aiErr });
    }

    let aiJson: any = { summary: '', controls: [], risks: [] };
    try {
      aiJson = JSON.parse(aiResult);
    } catch (e) {
      aiJson.summary = aiResult;
    }

    // Store in DB
    const assessmentRepo = AppDataSource.getRepository(Assessment);
    const assessment = assessmentRepo.create({
      product,
      filename: req.file.filename,
      summary: aiJson.summary,
      controls: aiJson.controls,
      risks: aiJson.risks,
    });
    await assessmentRepo.save(assessment);

    return res.status(201).json({ status: 'success', file: req.file, ai: aiJson, assessment });
  } catch (err) {
    return res.status(500).json({ status: 'error', message: 'Failed to process document', error: err });
  }
});

export default router; 