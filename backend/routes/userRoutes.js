import express from 'express';
import { registerUser, loginUser, logout, requestPasswordReset, resetPassword, getUserDetails, updatePassword, updateProfile, getUsersList, getSingleUser, updateUserRole, deleteUser} from '../controller/userController.js';
import { roleBasedAccess, verifyUserAuth } from '../middleware/userAuth.js';
// import { singleUpload } from '../routes/multer.js';
const router = express.Router();

router.route('/register').post(registerUser);
router.route('/login').post(loginUser);
router.route('/logout').post(logout);
router.route('/password/forgot').post(requestPasswordReset);
router.route('/password/reset/:token').put(resetPassword);
router.route('/profile').get(verifyUserAuth, getUserDetails);
router.route('/password/update').put(verifyUserAuth, updatePassword);
router.route('/profile/update').put(verifyUserAuth, updateProfile);
router.route('/admin/users')
.get(verifyUserAuth, roleBasedAccess("admin"), getUsersList);


router.route('/admin/user/:id')
.get(verifyUserAuth, roleBasedAccess("admin"), getSingleUser)
.put(verifyUserAuth, roleBasedAccess("admin"), updateUserRole)
.delete(verifyUserAuth, roleBasedAccess("admin"), deleteUser);








export default router;