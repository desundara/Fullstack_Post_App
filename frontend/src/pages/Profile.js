import React, { useEffect, useState, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../helpers/AuthContext';

function Profile() {
    const { id } = useParams();
    const [username, setUsername] = useState("");
    const [listOfPosts, setListOfPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const { authState } = useContext(AuthContext);

    useEffect(() => {
        setLoading(true);
        setError(null);

        Promise.all([
            axios.get(`${process.env.REACT_APP_API_URL}/auth/basicinfo/${id}`),
            axios.get(`${process.env.REACT_APP_API_URL}/posts/byUserId/${id}`)
        ])
        .then(([userResponse, postsResponse]) => {
            setUsername(userResponse.data.username);
            setListOfPosts(postsResponse.data || []);
            setLoading(false);
        })
        .catch((err) => {
            console.error("Error fetching profile:", err);
            if (err.response && err.response.status === 404) setError("User not found");
            else setError("Failed to load profile");
            setListOfPosts([]);
            setLoading(false);
        });
    }, [id]);

    if (loading) return (
        <div className='profilePageContainer'>
            <div className='basicInfo'>
                <h3>Loading...</h3>
            </div>
        </div>
    );

    if (error) return (
        <div className='profilePageContainer'>
            <div className='basicInfo'>
                <h3>{error}</h3>
            </div>
        </div>
    );

    return (
        <div className='profilePageContainer'>
            <div className='basicInfo'>
                <h3>Username: {username}</h3>
            </div>
            {authState.username === username && (
                <button onClick={() => navigate('/changepassword')}>
                    Change My Password
                </button>
            )}
            <div className='listOfPosts'>
                {listOfPosts.map((post) => (
                    <div
                        key={post.id}
                        className="post"
                        onClick={() => navigate(`/post/${post.id}`)}
                    >
                        <div className="title">{post.title}</div>
                        <div className="body">{post.postText}</div>
                        <div className="footer">
                            {post.username}
                            <label> {post.Likes.length}</label>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Profile;
