import express from 'express';
import { getSavedItems, saveItem, updateSavedItem, deleteSavedItem } from '../controllers/savedController.js';

const router = express.Router();

router.get('/', getSavedItems);
router.post('/', saveItem);
router.patch('/:id', updateSavedItem);
router.delete('/:id', deleteSavedItem);

export default router;

