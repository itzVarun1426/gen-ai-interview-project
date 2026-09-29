import {Router} from 'express';
import multer from 'multer';
import authController from '../controllers/auth.controller.js';
import authMiddleware from '../middlewares/auth.middleware.js';

const upload = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 10 * 1024 * 1024 } // 10MB limit
});

const router = Router();

/**
 * @POST /api/auth/register
 * @description create new user 
 * @access public
 */
router.post("/register",authController.registerUser);

/**
 * @POST /api/auth/login
 * @description login user
 * @access public
 */
router.post("/login",authController.loginUser);

/**
 * @POST /api/auth/google
 * @description login or register user via Google
 * @access public
 */
router.post("/google",authController.googleAuth);

/**
 * @POST /api/auth/logout
 * @description logout user
 * @access private
*/
router.post("/logout",authController.logoutUser);

/**
 * @GET /api/auth/get-me
 * @description returns current user information
 * @access private 
 */
router.get("/get-me",authMiddleware.authUser,authController.getCurrentUser);

/**
 * @PUT /api/auth/profile
 * @description update user profile details
 * @access private
 */
router.put("/profile", authMiddleware.authUser, authController.updateProfile);

/**
 * @POST /api/auth/upload-avatar
 * @description upload user profile picture (AWS S3 or Local)
 * @access private
 */
router.post("/upload-avatar", authMiddleware.authUser, upload.single("avatar"), authController.uploadAvatar);

export default router;