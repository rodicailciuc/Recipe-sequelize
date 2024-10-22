import db from '../models/index.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

import validateEmail from '../utils/validateEmail.js';
import validatePassword from '../utils/validatePassword.js';
import hashPassword from '../utils/hashPassword.js';
import matchPasswords from '../utils/matchPasswords.js';

const User = db.users;

const userControllers = {
    getRegisterForm: (req, res) => {
        res.status(200).render('register-form');
    },
    getRegister: async (req, res) => {
        // const { email, password, rePassword } = req.body;
        // const userExist = await User.findOne({ where: { email: email } });

        // if (userExist) {
        //     return res.status(404).render('404', {
        //         title: 'User already exist',
        //         message: 'User already exist'
        //     });
        // }
        // const isEmailValid = validateEmail(email);
        // const isPasswordValid = validatePassword(password);
        // const doPasswordsMatch = matchPasswords(password, rePassword);

        // if (isEmailValid && isPasswordValid && doPasswordsMatch) {
        //     const hashedPassword = hashPassword(password);
        //     const newUser = {
        //         email,
        //         password: hashedPassword
        //     };
        //     await User.create(newUser);
        //     res.status(302).redirect('/api/login');
        // } else {
        //     return res.status(400).render('404', {
        //         title: 'Error invalid email or password',
        //         message: 'Error invalid email or password'
        //     });
        // }
        try {
            const { email, password, rePassword } = req.body;

            // Check if user already exists
            const userExist = await User.findOne({ where: { email: email } });
            if (userExist) {
                return res.status(409).render('404', {
                    title: 'User already exists',
                    message:
                        'User already exists. Please login or use another email.'
                });
            }

            // Validate email, password, and password confirmation
            const isEmailValid = validateEmail(email);
            const isPasswordValid = validatePassword(password);
            const doPasswordsMatch = matchPasswords(password, rePassword);

            if (!isEmailValid || !isPasswordValid || !doPasswordsMatch) {
                return res.status(400).render('404', {
                    title: 'Invalid input',
                    message:
                        'Please provide a valid email, password, and confirm password.'
                });
            }

            // Hash password (use await if hashPassword is asynchronous)
            const hashedPassword = await hashPassword(password);

            // Create new user
            const newUser = {
                email,
                password: hashedPassword
            };
            await User.create(newUser);

            // Redirect to login
            res.status(302).redirect('/api/login');
        } catch (error) {
            console.error('Error during registration:', error);
            return res.status(500).render('404', {
                title: 'Server error',
                message:
                    'An error occurred during registration. Please try again later.'
            });
        }
    },
    getLoginForm: (req, res) => {
        res.status(200).render('login-form');
    },
    getLogin: async (req, res) => {
        const { email, password } = req.body;
        const userExist = await User.findOne({ where: { email: email } });

        if (!userExist) {
            return res.status(404).render('404', {
                title: 'Email does not exist',
                message: 'Email does not exist, please register'
            });
        }

        bcrypt.compare(password, userExist.password, (err, isValid) => {
            if (err) {
                return res.status(404).render('404', {
                    title: 'Invalid email or password',
                    message: 'Invalid email or password'
                });
            }
            if (isValid) {
                const token = jwt.sign(
                    { email: userExist.email },
                    process.env.TOKEN_SECRET
                );
                res.cookie('id', userExist.id, { httpOnly: true });
                res.cookie('token', token, { httpOnly: true });
                res.status(302).redirect('/api/recipes');
            }
        });
    },
    getLogout: async (req, res) => {
        res.clearCookie('id');
        res.clearCookie('token');
        res.status(302).redirect('/api/login');
    }
};

export default userControllers;
