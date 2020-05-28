import { Router } from 'express';
import multer from 'multer';
import multerConfig from './config/multer';

import UserController from './app/controllers/UserController';
import SessionController from './app/controllers/SessionController';
import FileController from './app/controllers/FileController';

import authMiddleware from './app/middlewares/auth';
import MatrixController from './app/controllers/MatrixController';
import BreederController from './app/controllers/BreederController';
import MatingController from './app/controllers/MatingController';
import BullController from './app/controllers/BullControler';

const routes = new Router();
const upload = multer(multerConfig);

routes.post('/users', UserController.store);
routes.post('/sessions', SessionController.store);

routes.use(authMiddleware);

routes.put('/users', UserController.update);

routes.get('/matrices', MatrixController.index);
routes.post('/matrices', MatrixController.store);
routes.put('/matrices/:id', MatrixController.update);
routes.delete('/matrices/:id', MatrixController.delete);

routes.get('/breeders', BreederController.index);
routes.post('/breeders', BreederController.store);
routes.put('/breeders/:id', BreederController.update);
routes.delete('/breeders/:id', BreederController.delete);

routes.get('/matings', MatingController.index);
routes.post('/matings', MatingController.store);
routes.put('/matings/:id', MatingController.update);
routes.delete('/matings/:id', MatingController.delete);

routes.get('/bulls', BullController.index);
routes.post('/bulls', BullController.store);
routes.put('/bulls/:id', BullController.update);
routes.delete('/bulls/:id', BullController.delete);

routes.get('/files/:id', FileController.index);
routes.delete('/files/:id', FileController.delete);
routes.post('/files/:id', upload.single('file'), FileController.store);

export default routes;
