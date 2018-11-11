import { Router } from 'express';
import { expressPermissions } from './authentication'; 
import multer from './multer';

const router = Router();

router.use('/', expressPermissions, multer);

export default router;