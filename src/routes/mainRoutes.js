import { Router } from 'express';

const router = Router();

router.get('/', (req, res) => {
    res.sendFile(req.app.get('indexFile'));
});

export default router;
