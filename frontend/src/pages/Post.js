import React, { useEffect, useState, useContext } from 'react'
import axios from "axios";
import { useParams, useNavigate } from 'react-router-dom';
import { AuthContext } from '../helpers/AuthContext';

function Post() {
    const { id } = useParams(); 
    const [postObject, setPostObject] = useState({});
    const [comments, setComments] = useState([])
    const [newComment, setNewComment] = useState("")
    const { authState } = useContext(AuthContext);
    const navigate = useNavigate();

    useEffect(() => {
        axios.get(`http://localhost:3001/posts/byId/${id}`).
        then((response) => {
            setPostObject(response.data);
            })
            .catch((error) => {
                console.error("Error fetching post:", error);
            });

        axios.get(`http://localhost:3001/comments/${id}`).
        then((response) => {
            setComments(response.data);
            })
            .catch((error) => {
                console.error("Error fetching post:", error);
            });
    }, [id]);

    const addComment = () => {
        if (!newComment.trim()) return;

        const token = localStorage.getItem("accessToken");
        console.log("Token:", token); //Add this to check if token exists
        
        if (!token) {
            alert("Please login first!");
            return;
        }

        axios.post(`http://localhost:3001/comments`, {
        commentText: newComment,
        postId: id,
        //username: authState.username  // <-- logged-in user
    },
        {
            headers: {
                accessToken: localStorage.getItem("accessToken"),
            },
        }
        )
        .then((response) => {
            if (response.data.error) {
                alert("Error from server:", response.data.error);
            } else {
                console.log("Comment added!", response.data);
                setComments([...comments, response.data]);
                setNewComment(""); 
            }
        })
        .catch((err) => {
            console.error("Error adding comment:", err);
        });
    };

    const deleteComment = (commentId) => {
        if (!window.confirm("Are you sure you want to delete this comment?")) return;

        axios.delete(`http://localhost:3001/comments/${commentId}`, {
            headers: { accessToken: localStorage.getItem("accessToken") },
        })
        .then(() => {
            setComments(comments.filter((val) => val.id !== commentId));
            alert("Comment deleted successfully!"); // Add this alert
        })
        .catch((err) => {
            console.error("Failed to delete comment:", err);
            alert("Failed to delete comment");
        });
    };

    const deletePost = (postId) => {
        if (!window.confirm("Are you sure you want to delete this post?")) return;

        axios.delete(`http://localhost:3001/posts/${postId}`, {
            headers: { accessToken: localStorage.getItem("accessToken") }
        })
        .then(() => {
            alert("Post deleted successfully!");
            navigate("/");
        })
        .catch((err) => {
            console.error("Failed to delete post:", err);
            alert("Failed to delete post");
        });
    };

    const editPost = (option) => {
        if (option === "title") {
            let newTitle = prompt("Enter New Title:");
            if (!newTitle || !newTitle.trim()) return;

            axios.post(
                `http://localhost:3001/posts/title`, 
                {
                    newTitle: newTitle, 
                    id: id,
                },
                {
                    headers: { accessToken: localStorage.getItem("accessToken") },
                }
            )
            .then((response) => {
                setPostObject({ ...postObject, title: newTitle });
                alert("Title updated successfully!");
            })
            .catch((err) => {
                console.error("Failed to update title:", err);
                alert("Failed to update title");
            });
        } else {
            let newPostText = prompt("Enter New Text:");
            if (!newPostText || !newPostText.trim()) return;

            axios.post(
                `http://localhost:3001/posts/postText`, 
                {
                    newText: newPostText, 
                    id: id,
                },
                {
                    headers: { accessToken: localStorage.getItem("accessToken") },
                }
            )
            .then((response) => {
                setPostObject({ ...postObject, postText: newPostText });
                alert("Post text updated successfully!");
            })
            .catch((err) => {
                console.error("Failed to update post text:", err);
                alert("Failed to update post text");
            });
        }
    };

    return (
        <div className='postPage'>
            <div className='leftSide'>
                    <div className='post' id='individual'>
                        <div 
                            className='title' 
                            onClick={() => {
                                if (authState.username === postObject.username) {
                                    editPost("title")
                                }
                                }}> 
                                    {postObject.title}
                                </div>
                        <div className='postText' 
                            onClick={() => {
                                if (authState.username === postObject.username) {
                                editPost("postText")
                                }
                            }}> 
                                    {postObject.postText}
                                    </div>
                        <div className='footer'> 
                            {postObject.username}{""}
                            {authState.username === postObject.username && (
                                <button className="deletePostBtn"
                                    onClick={() => {
                                        deletePost(postObject.id)                                    
                                        }}> 
                                        Delete Post
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            <div className='rightSide'>
                <div className='addCommentContainer'>
                    <input 
                    type='text' 
                    placeholder='Comment...' 
                    autoComplete='off' 
                    value={newComment}
                    onChange={(event) => 
                        {setNewComment(event.target.value)}}/>
                    <button onClick={addComment}> Add Comment</button>
                </div>
                <div className='listOfComments'>
                    {comments.map((comment, key) => {
                        return (
                        <div key={key} className='comment'> {comment.commentText}
                            <label> Username: {comment.username}</label>
                            {authState
                            .username === comment.username && (
                            <button onClick={() => {deleteComment(comment.id)}}>DELETE</button>
                            )}
                        </div>
                        )
                    })}
                </div>
            </div>
        </div>
    );
}

export default Post