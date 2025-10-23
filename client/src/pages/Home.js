import React, { useContext } from 'react'
import axios from "axios";
import { useEffect, useState } from 'react';
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from '../helpers/AuthContext';

function Home() {
    const [listOfPosts, setListOfPosts] = useState([]);
    const [likedPosts, setLikedPosts ] = useState([])
    const navigate  = useNavigate()
    const { authState } = useContext(AuthContext);

    useEffect(() => {
        if (!localStorage.getItem("accessToken")) {
            navigate("/login");
        } else {
            axios
            .get("http://localhost:3001/posts",{
                    headers: { accessToken: localStorage.getItem("accessToken")}}
            )
                .then((response) => {
                    setListOfPosts(response.data.listOfPosts);
                    setLikedPosts(response.data.likedPosts.map((like) => like.PostId))
                    })
                .catch((err) => {
                    console.error("Error fetching posts:", err);
                });
            }
        }, [authState.status, navigate]);
    

    const likePost = (postId) => {
        axios.post(
            "http://localhost:3001/likes", 
            { PostId: postId},
            {headers: { accessToken: localStorage.getItem("accessToken")}}
        ).then((response) => {
            setListOfPosts(listOfPosts.map((post) => {
                if (post.id === postId) {
                    if (response.data.liked) {
                        return {...post, Likes: [...post.Likes, 0]}
                    } else {
                        const likesArray = post.Likes;
                        likesArray.pop();
                        return {...post, Likes: likesArray }
                    }
                } else {
                    return post;
                }
            }))
        })

        if (likedPosts.includes(postId)) {
            setLikedPosts(
                likedPosts.filter((id) => {
                    return id != postId
                }))
        } else {
            setLikedPosts([...likedPosts, postId])
        }
    }

    return (
        <div>
            {listOfPosts.map((value, key) => {
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
                        <div className="footer"> 
                            <Link to={`/profile/${value.UserId}`}>{value.username}</Link>
                            <button 
                                onClick={(event) => {
                                    event.stopPropagation();
                                    event.preventDefault();
                                    likePost(value.id);
                                }}
                                className={
                                    likedPosts.includes(value.id) ? "unlikeBtn" : "likeBtn"
                                }>
                                👍
                            </button>
                                <label> {value.Likes.length}</label>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}

export default Home