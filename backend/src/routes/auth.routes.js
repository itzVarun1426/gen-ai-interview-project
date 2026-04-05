import {Router} from 'express';
import authController from '../controllers/auth.controller.js';
import authMiddleware from '../middlewares/auth.middleware.js';


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


export default router;