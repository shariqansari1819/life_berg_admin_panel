import React, { useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useMutation, useQueryClient } from "@tanstack/react-query";

// Yup validation schema
const validationSchema = Yup.object().shape({
    title: Yup.string().required("Title is required"),
    dateRange: Yup.array()
        .test("startDate-endDate", "Both start and end dates are required", (value) => {
            const [startDate, endDate] = value;
            return startDate && endDate; // Ensure both start and end dates are selected
        })
        .test(
            "startDate-before-endDate",
            "End date must be after start date",
            function (value) {
                const [startDate, endDate] = value;
                return startDate && endDate ? startDate <= endDate : true; // Ensure the end date is after start date
            }
        ),
});

const ViewBanner = ({ data, onClose }) => {
    const [dateRange, setDateRange] = useState([null, null]);
    const [error, setError] = useState(null);
    const queryClient = useQueryClient();

    const initialValues = {
        title: data?.title,
        dateRange: [data?.startDate ? new Date(data?.startDate) : null, data?.endDate ? new Date(data?.endDate) : null], // Ensure dates are Date objects
    };

    const mutation = useMutation({
        mutationFn: async (newBanner) => {
            const token = localStorage.getItem("authToken");
            const response = await fetch(
                `${import.meta.env.VITE_APP_API_URL}/banner/update`,
                {
                    method: "PUT",
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(newBanner),
                }
            );
            const data = await response.json(); // Capture the response data here
            return data;
        },
        onSuccess: (data) => {
            queryClient.invalidateQueries("bannersdsd"); // Assuming you have a query with this key
            console.log("Banner created successfully:", data?.error?.details?.MESSAGE);
            setError(data?.error?.details?.MESSAGE);
            if (data?.error?.STATUS !== 400) {
                onClose();
            }
        },
        onError: (error) => {
            console.error("Error creating article:", error);
        },
    });

    const handleSubmit = (values) => {
        const [startDate, endDate] = values.dateRange;
        // Ensure valid date objects before converting to ISO format
        const isoStartDate = startDate instanceof Date && !isNaN(startDate) ? startDate.toISOString() : null;
        const isoEndDate = endDate instanceof Date && !isNaN(endDate) ? endDate.toISOString() : null;

        console.log({
            title: values.title,
            startDate: isoStartDate,
            endDate: isoEndDate,
        });

        mutation.mutate({
            id: data?._id,
            title: values.title,
            startDate: isoStartDate,
            endDate: isoEndDate,
        });
    };

    return (
        <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
        >
            {({ setFieldValue, values }) => (
                <Form className="space-y-4">
                    <div>
                        <label className="block mb-1">Title:</label>
                        <Field
                            name="title"
                            type="text"
                            className="border p-2 w-full"
                            placeholder="Enter title"
                        />
                        <ErrorMessage
                            name="title"
                            component="div"
                            className="text-red-500"
                        />
                    </div>

                    <div>
                        <label className="block mb-1">Date Range:</label>
                        <DatePicker
                            selectsRange
                            startDate={values.dateRange[0]}
                            endDate={values.dateRange[1]}
                            onChange={(update) => {
                                setFieldValue("dateRange", update);
                                setDateRange(update);
                            }}
                            minDate={new Date()} // Disable past dates
                            isClearable
                            className="border p-2 w-full"
                            placeholderText="Select date range"
                        />
                        <ErrorMessage
                            name="dateRange"
                            component="div"
                            className="text-red-500"
                        />
                    </div>

                    {error && <div className="text-red-500">{error}</div>}

                    <button type="submit" className="bg-blue-500 text-white px-4 py-2">
                        Submit
                    </button>
                </Form>
            )}
        </Formik>
    );
};

export default ViewBanner;
