// routes/contactRoutes.js (convert to ESM and standard route shape)
import express from 'express'
import { sendContactMessage } from '../controllers/contactController.js'

const router = express.Router()

// POST / -> create a contact message
router.post('/', async (req, res) => {
	return sendContactMessage(req, res)
})

export default router
