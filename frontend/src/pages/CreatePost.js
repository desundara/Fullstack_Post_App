import React, { useContext, useEffect } from 'react';
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from 'yup';
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { AuthContext } from '../helpers/AuthContext';

function CreatePost() {
    const navigate = useNavigate();
    const { authState } = useContext(AuthContext);

    const initialValues = {
        title: "",
        postText: "",
    };

    useEffect(() => {
        if (!localStorage.getItem("accessToken")) {
            navigate("/login");
        }
    }, [authState.status, navigate]);

    const validationSchema = Yup.object().shape({
        title: Yup.string().required("You must input a Title!"),
        postText: Yup.string().required("You should enter a post text"),    
    });

    const onSubmit = (data, { resetForm }) => {
        // ✅ Use environment variable for backend URL
        axios.post(`${process.env.REACT_APP_API_URL}/posts`, data, { 
            headers: { accessToken: localStorage.getItem("accessToken") },
        })
        .then((response) => {
            resetForm();
            navigate("/");
        })
        .catch((error) => {
            console.error("Error creating post:", error);
            alert("Failed to create post");
        });
    };

    return (
        <div className="createPostPage"> 
            <Formik 
                initialValues={initialValues} 
                validationSchema={validationSchema}
                onSubmit={onSubmit}
            >
                <Form className='createPostPage'>
                    <label>Title: </label>
                    <ErrorMessage name="title" component="span" />
                    <Field 
                        autoComplete="off"
                        id="inputCreatePost" 
                        name="title" 
                        placeholder="(Ex. Title...)" 
                    />

                    <label>Post: </label>
                    <ErrorMessage name="postText" component="span" />
                    <Field 
                        autoComplete="off"
                        id="inputCreatePost" 
                        name="postText" 
                        placeholder="(Ex. Post...)" 
                    />
                    
                    <button type='submit'>Create Post</button>
                </Form>
            </Formik>
        </div>
    );    
}

export default CreatePost;
