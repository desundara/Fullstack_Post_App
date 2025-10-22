import React, { useEffect, useState, useContext } from 'react'
import axios from "axios";
import { useParams } from 'react-router-dom';
import { AuthContext } from '../helpers/AuthContext';

function Post() {
    const { id } = useParams(); 
    const [postObject, setPostObject] = useState({});
    const [comments, setComments] = useState([])
    const [newComment, setNewComment] = useState("")
    const { authState } = useContext(AuthContext);

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

    return (
        <div className='postPage'>
            <div className='leftSide'>
                    <div className='post' id='individual'>
                        <div className='title'> {postObject.title}</div>
                        <div className='postText'> {postObject.postText}</div>
                        <div className='footer'> {postObject.username}</div>
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
                            .username === comment.username && <button>DELETE</button>}
                        </div>
                        )
                    })}
                </div>
            </div>
        </div>
    );
}

export default Post