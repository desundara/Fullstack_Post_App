import React from 'react'
import axios from "axios";
import { useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";

function Home() {
    const [listOfposts, setListOfPosts] = useState([]);
    const navigate  = useNavigate()

    useEffect(() => {
        axios.get("http://localhost:3001/posts")
            .then((response) => {
                setListOfPosts(response.data);
            })
            .catch((err) => {
                console.error("Error fetching posts:", err);
            });
    }, []);

    return (
        <div>
            {listOfposts.map((value, key) => {
                return (
                    <div
                        key={key}
                        className = "post" 
                        onClick={() => {
                            navigate(`/post/${value.id}`);
                        }}
                    >
                        <div className="title"> {value.title} </div>
                        <div className="body"> {value.postText} </div>
                        <div className="footer"> {value.username} </div>
                    </div>
                );
            })}
        </div>
    );
}

export default Home