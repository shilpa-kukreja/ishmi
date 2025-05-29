import express from 'express';
import { registerUser, loginUser, forgotPassword, resetPassword, adminLogin, allUsers, deleteUser, GoggleloginUser } from '../controllers/authController.js';

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password/:token', resetPassword);
router.post('/admin',adminLogin)
router.get('/all-partner',allUsers)
router.post('/gogglelogin',GoggleloginUser)
router.delete('/delete/:id', deleteUser);

export default router;