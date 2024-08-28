import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../../components/Card/Card";
import Label from '../../components/Label/Label';
import { Input } from '../../components/Input/Input';
import Checkbox from '../../components/Checkbox/Checkbox';
import { Button } from '../../components/Button/Button';
import { NavLink, useNavigate } from 'react-router-dom';
import { useFormik } from 'formik';
import axios from 'axios';
import { signupSchema } from '../../ValidationSchema/validations'; // Adjust the path as necessary
import toast from "react-hot-toast";
import logo from "../../assets/logo.png"


export function Signup() {
    const navigate = useNavigate()
    const formik = useFormik({
        initialValues: {
            email: '',
            password: '',
            fullName: '',
        },
        validationSchema: signupSchema,
        onSubmit: async (values, { setSubmitting, setErrors, resetForm }) => {
            try {
                const response = await axios.post(`${import.meta.env.VITE_APP_API_URL}/signup`, values);
                console.log('Registration successful:', response.data);
                resetForm()
                toast.success(response.data.message);
                navigate("/login")
            } catch (error) {
                console.error('Registration error:', error.response.data.error.details);
                toast.error(error.response.data.error.details);
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
                        <CardTitle className="text-2xl">Register your account</CardTitle>
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
                                />
                                {formik.touched.password && formik.errors.password ? (
                                    <div className="text-red-500 text-sm">{formik.errors.password}</div>
                                ) : null}
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="fullName">Full Name</Label>
                                <Input
                                    id="fullName"
                                    placeholder="John Doe"
                                    required
                                    {...formik.getFieldProps('fullName')}
                                />
                                {formik.touched.fullName && formik.errors.fullName ? (
                                    <div className="text-red-500 text-sm">{formik.errors.fullName}</div>
                                ) : null}
                            </div>
                        </CardContent>
                        <CardFooter className="pt-3">
                            <Button type="submit" className="w-full bg-sidebar" disabled={formik.isSubmitting}>
                            {formik.isSubmitting ? 'Registering...' : 'Register'}
                            </Button>
                        </CardFooter>
                    </form>
                </Card>
            </div>
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
