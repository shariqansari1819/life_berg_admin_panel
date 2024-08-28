import React from 'react';
import { useFormik } from 'formik';
import { resetPasswordSchema } from '../../ValidationSchema/validations'; // Adjust the path as necessary
import axios from 'axios';
import Label from '../../components/Label/Label';
import { Input } from '../../components/Input/Input'; // Corrected import
import { Button } from '../../components/Button/Button';
import { NavLink, useNavigate } from 'react-router-dom'; // Make sure to import NavLink
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../../components/Card/Card';
import toast from 'react-hot-toast';
import logo from "../../assets/logo.png"

export function ResetPassword() {
    const navigate = useNavigate()
    const formik = useFormik({
        initialValues: {
            email: '',
            password: '',
            forgotPasswordNonce: '',
        },
        validationSchema: resetPasswordSchema,
        onSubmit: async (values, { setSubmitting, setErrors, resetForm }) => {
            try {
                const response = await axios.post(`${import.meta.env.VITE_APP_API_URL}/restore-password`, values);
                console.log('Password reset request successful:', response.data);
                resetForm()
                toast.success(response.data.message)
                navigate("/login")
                // Handle success (e.g., show a success message)
            } catch (error) {
                console.error('Password reset request error:', error.response.data.error.details.MESSAGE);
                if(error.response.data.error.details.MESSAGE){
                    toast.error(error.response.data.error.details.MESSAGE)
                }
                // Handle error (e.g., show error messages)
                if (error.response && error.response.data && error.response.data.errors) {
                    setErrors(error.response.data.errors);
                }
            } finally {
                setSubmitting(false);
            }
        },
    });

    return (
        <div className="flex min-h-[100dvh] flex-col items-center justify-center bg-background px-4 py-12 sm:px-6 lg:px-8">
            <Card className="w-full max-w-md mx-auto">
                <NavLink to="#" className="flex justify-center pt-3">
                   <img src={logo} alt="logo" width="80px" />
                </NavLink>
                <CardHeader>
                    <CardTitle className="text-2xl">Reset Password</CardTitle>
                    <CardDescription>
                        Enter your email address, new password, and OTP to reset your password.
                    </CardDescription>
                    <CardDescription>
                            Or{" "}
                            <NavLink
                                to="/login"
                                className="font-medium text-primary hover:underline"
                            >
                            Sign in to your account
                            </NavLink>
                        </CardDescription>
                </CardHeader>
                <CardContent className="pt-0">
                    <form onSubmit={formik.handleSubmit} className="space-y-4">
                        <div>
                            <Label htmlFor="email">Email Address</Label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="Enter your email"
                                {...formik.getFieldProps('email')}
                                className="w-full rounded-md"
                            />
                            {formik.touched.email && formik.errors.email ? (
                                <div className="text-red-500 text-sm">{formik.errors.email}</div>
                            ) : null}
                        </div>
                        <div>
                            <Label htmlFor="password">Password</Label>
                            <Input
                                id="password"
                                type="password"
                                placeholder="Enter your password"
                                {...formik.getFieldProps('password')}
                                className="w-full rounded-md"
                            />
                            {formik.touched.password && formik.errors.password ? (
                                <div className="text-red-500 text-sm">{formik.errors.password}</div>
                            ) : null}
                        </div>
                        <div>
                            <Label htmlFor="otp">OTP</Label>
                            <Input
                                id="otp"
                                type="text"
                                placeholder="Enter your OTP"
                                {...formik.getFieldProps('forgotPasswordNonce')}
                                className="w-full rounded-md"
                            />
                            {formik.touched.forgotPasswordNonce && formik.errors.forgotPasswordNonce ? (
                                <div className="text-red-500 text-sm">{formik.errors.forgotPasswordNonce}</div>
                            ) : null}
                        </div>
                        <Button type="submit" className="w-full bg-sidebar" disabled={formik.isSubmitting}>
                            {formik.isSubmitting ? 'Resetting...' : 'Reset Password'}
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}

function MountainIcon(props) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="m8 3 4 8 5-5 5 15H2L8 3z" />
        </svg>
    );
}
