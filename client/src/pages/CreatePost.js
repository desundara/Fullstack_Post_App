import React from 'react';
import {Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from 'yup';
import axios from "axios";
import { useNavigate } from "react-router-dom";

function CreatePost() {
    const navigate = useNavigate();

    const initialValues = {
        title: "",
        postText: "",
        username: "",
    };

    const validationSchema = Yup.object().shape({
        title: Yup.string().required("You must input a Title!"),
        postText: Yup.string().required("You should enter a post text"),
        username: Yup.string().min(3).max(15).required("You must enter username"),
    });

    const onSubmit = (data, { resetForm }) => {
            axios.post("http://localhost:3001/posts", data)
            .then((response) => {
            navigate("/home");
            resetForm();
        })
        .catch((error) => {
            console.error("Error creating post:", error);
        });
    };

    return (
        <div className="createPostPage"> 
            <Formik initialValues={initialValues} 
            validationSchema={validationSchema}
            onSubmit={onSubmit}>
                <Form className='createPostPage'>
                    <label>Title: </label>
                    <ErrorMessage name="title" component="span" />
                    <Field 
                    autocomplete="off"
                    id="inputCreatePost" 
                    name="title" 
                    placeholder="(Ex. Title...)" 
                    />
                    <label>Post: </label>
                    <ErrorMessage name="postText" component="span" />
                    <Field 
                    autocomplete="off"
                    id="inputCreatePost" 
                    name="postText" 
                    placeholder="(Ex. Post...)" 
                    />
                    <label>Username: </label>
                    <ErrorMessage name="username" component="span" />
                    <Field 
                    autocomplete="off"
                    id="inputCreatePost" 
                    name="username" 
                    placeholder="(Ex. Siril...)" 
                    />

                    <button type='submit'>Create Post</button>
                </Form>
            </Formik>
        </div>
    );    
}

export default CreatePost