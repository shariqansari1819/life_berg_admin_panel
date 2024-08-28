import * as Yup from 'yup';


export const signupSchema = Yup.object().shape({
    email: Yup.string().email('Invalid email').required('Email is required'),
    password: Yup.string()
        .min(8, 'Password must be at least 8 characters')
        .max(32, 'Password cannot be more than 32 characters')
        .matches(/[A-Z]/, 'Password must contain at least one uppercase letter')
        .matches(/[a-z]/, 'Password must contain at least one lowercase letter')
        .matches(/\d/, 'Password must contain at least one digit')
        .matches(/[@$!%*?&#]/, 'Password must contain at least one special character')
        .required('Password is required'),
    fullName: Yup.string()
        .matches(/^[A-Za-z\s\-']+$/, 'Full name can only contain alphabetic characters, spaces, hyphens, and apostrophes')
        .required('Full name is required'),
});


export const loginSchema = Yup.object().shape({
    email: Yup.string().email('Invalid email address').required('Email is required'),
    password: Yup.string()
        .min(8, 'Password must be at least 8 characters')
        .max(32, 'Password must not exceed 32 characters')
        .matches(/[a-z]/, 'Password must contain at least one lowercase letter')
        .matches(/[A-Z]/, 'Password must contain at least one uppercase letter')
        .matches(/\d/, 'Password must contain at least one number')
        .matches(/[@$!%*?&#]/, 'Password must contain at least one special character')
        .required('Password is required'),
});



export const forgetPasswordSchema = Yup.object().shape({
    email: Yup.string().email('Invalid email address').required('Email is required'),
});


export const resetPasswordSchema = Yup.object().shape({
    email: Yup.string().email('Invalid email address').required('Email is required'),
    password: Yup.string()
        .min(8, 'Password must be at least 8 characters')
        .max(32, 'Password must not exceed 32 characters')
        .matches(/[A-Z]/, 'Password must contain at least one uppercase letter')
        .matches(/[a-z]/, 'Password must contain at least one lowercase letter')
        .matches(/[0-9]/, 'Password must contain at least one digit')
        .matches(/[!@#$%^&*(),.?":{}|<>]/, 'Password must contain at least one special character')
        .required('Password is required'),
    forgotPasswordNonce: Yup.string().required('OTP is required')
});