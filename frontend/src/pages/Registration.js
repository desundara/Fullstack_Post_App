import React from 'react'
import {Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from 'yup';
import axios  from 'axios';
import { useNavigate } from 'react-router-dom';

function Registration() {
    const navigate = useNavigate();
    const initialValues = {
        username: "",
        password: "",
    };

    const validationSchema = Yup.object().shape({
        username: Yup.string().min(3).max(15).required(),
        password: Yup.string().min(4).max(20).required(),
    });

    const onSubmit = (data) => {
        axios.post("http://localhost:3001/auth", data).then(() => {
            console.log(data);
            navigate("/login"); // ✅ redirect to login page after register
        });
    };

    return (
        <div>
            <Formik 
                initialValues={initialValues} 
                validationSchema={validationSchema}
                onSubmit={onSubmit}
            >
                <Form className='registrationPage'> 
                    <label>Username: </label>
                    <ErrorMessage name="username" component="span" />
                    <Field 
                        autoComplete="off"
                        className="inputField"
                        name="username" 
                        placeholder="(Ex. Siril...)" 
                    />

                    <label>Password: </label>
                    <ErrorMessage name="password" component="span" />
                    <Field 
                        autoComplete="off"
                        type="password"
                        className="inputField"
                        name="password" 
                        placeholder="Your Password.." 
                    />
                    <button type='submit'>Register</button>
                </Form>
            </Formik>
        </div>
    )
}

export default Registration