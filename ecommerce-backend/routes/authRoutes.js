const express = require('express');
const { signUp, login, testApi, forgotpassword } = require('../controllers/authController');
const { requireSignIn, isAdmin } = require('../middlewares/authMiddleware');

const router = express.Router();

//register user
router.post('/register', signUp);

//login user
router.post('/login', login);

//forgot password
router.post('/forgot-password', forgotpassword)

//test routes
router.get('/test', requireSignIn, isAdmin, testApi);

//protected route auth for user
router.get('/user-auth', requireSignIn, (req, res) => {
    res.status(200).send({ ok: true });
});

//protected route auth for admin
router.get('/admin-auth', requireSignIn, isAdmin, (req, res) => {
    res.status(200).send({ ok: true });
})

module.exports = router;