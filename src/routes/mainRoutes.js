import { Router } from 'express';
const router = Router();

router.get('/', (req, res) => {
    res.send('<h1>Bienvenido al Portafolio Profesional</h1><p>Estado: En desarrollo</p>');
});

export default router;
