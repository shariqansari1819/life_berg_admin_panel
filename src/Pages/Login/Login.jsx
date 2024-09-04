import React, { useEffect } from 'react';
import { useFormik } from 'formik';
import { loginSchema } from '../../ValidationSchema/validations'; // Adjust the path as necessary
import axios from 'axios';
import Label from '../../components/Label/Label';
import { Input } from '../../components/Input/Input'; // Corrected import
import Checkbox from '../../components/Checkbox/Checkbox';
import { Button } from '../../components/Button/Button';
import { NavLink, useNavigate } from 'react-router-dom'; // Make sure to import NavLink
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../../components/Card/Card';
import toast from 'react-hot-toast';
import logo from "../../assets/logo.png"


const Login = () => {
    const navigate = useNavigate()
    const formik = useFormik({
        initialValues: {
            email: '',
            password: '',
        },
        validationSchema: loginSchema,
        onSubmit: async (values, { setSubmitting, setErrors, resetForm }) => {
            try {
                const response = await axios.post(`${import.meta.env.VITE_APP_API_URL}/login`, values);
                // console.log('Login successful:', response.data);
                if (response.data.success === true) {
                    resetForm()
                    toast.success(response.data.message);
                    localStorage.setItem('authToken', response.data.token)
                    navigate("/users")
                    navigate(0)
                }
                // Handle success (e.g., navigate to dashboard, show a success message, etc.)
            } catch (error) {
                console.error('Login error:', error);
                if (error?.response?.data?.error.details == 'Invalid password') {
                    toast.error(error?.response?.data?.error.details)
                }
                if (error?.response?.data?.error?.details.MESSAGE) {
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
            <div className="mx-auto w-full max-w-md space-y-2">
                <Card className="w-full max-w-md mx-auto">
                    <NavLink to="#" className="flex justify-center pt-3">
                        <img src={logo} alt="logo" width="80px" />
                    </NavLink>
                    <CardHeader>
                        <CardTitle className="text-2xl">Sign in to your account</CardTitle>
                        {/* <CardDescription>
                            Or{" "}
                            <NavLink
                                to="/register"
                                className="font-medium text-primary hover:underline"
                            >
                                Register your account
                            </NavLink>
                        </CardDescription>*/}
                    </CardHeader>
                    <form onSubmit={formik.handleSubmit}>
                        <CardContent className="py-1 space-y-2">
                            <div className="space-y-2">
                                <Label htmlFor="email">Email</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="m@example.com"
                                    required
                                    {...formik.getFieldProps('email')}
                                    className="w-full rounded-md"
                                />
                                {formik.touched.email && formik.errors.email ? (
                                    <div className="text-red-500 text-sm">{formik.errors.email}</div>
                                ) : null}
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="password">Password</Label>
                                <Input
                                    id="password"
                                    type="password"
                                    required
                                    {...formik.getFieldProps('password')}
                                    className="w-full rounded-md"

                                />
                                {formik.touched.password && formik.errors.password ? (
                                    <div className="text-red-500 text-sm">{formik.errors.password}</div>
                                ) : null}
                            </div>
                            <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                    {/* <div className="flex items-center">
                                        <Checkbox id="remember-me" name="remember-me" className="h-4 w-4 rounded" />
                                        <Label htmlFor="remember-me" className="ml-2 block text-sm text-foreground">
                                            Remember me
                                        </Label>
                                    </div>*/}
                                    <div className="text-sm">
                                        <NavLink
                                            to="/forget-password"
                                            className="font-medium text-primary hover:underline"
                                        >
                                            Forgot your password?
                                        </NavLink>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                        <CardFooter className="pt-3">
                            <Button type="submit" className="w-full bg-sidebar" disabled={formik.isSubmitting}>
                                {formik.isSubmitting ? 'Signing in...' : 'Signin'}
                            </Button>
                        </CardFooter>
                    </form>
                </Card>
            </div>
        </div>
    );
}

export default Login;

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

function XIcon(props) {
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
            <path d="M18 6 6 18" />
            <path d="m6 6 12 12" />
        </svg>
    );
}
