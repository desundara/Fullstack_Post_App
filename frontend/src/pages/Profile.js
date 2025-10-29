import React, { useEffect, useState, useContext } from 'react'
import { useParams } from 'react-router-dom'
import axios from 'axios'
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../helpers/AuthContext';

function Profile() {
    let {id} = useParams()
    const [username, setUsername] = useState("")
    const [listOfPosts, setListOfPosts] = useState([])
    const [loading, setLoading] = useState(true) // Loading state එකක්
    const [error, setError] = useState(null)
    const navigate = useNavigate()
    const { authState } = useContext(AuthContext);

    useEffect(() => {
        setLoading(true)
        setError(null)

        Promise.all([
            axios.get(`http://localhost:3001/auth/basicinfo/${id}`),
            axios.get(`http://localhost:3001/posts/byUserId/${id}`)
        ])
        .then(([userResponse, postsResponse]) => {
            setUsername(userResponse.data.username)
            setListOfPosts(postsResponse.data || [])
            setLoading(false)
        })
        .catch((err) => {
            console.error("Error fetching data:", err)
            if (err.response && err.response.status === 404) {
                setError("User not found")
            } else {
                setError("Failed to load profile")
            }
            setListOfPosts([])
            setLoading(false)
        })
    }, [id])

    // Loading state
    if (loading) {
        return (
            <div className='profilePageContainer'>
                <div className='basicInfo'>
                    <h3>Loading...</h3>
                </div>
            </div>
        )
    }

    // Error state
    if (error) {
        return (
            <div className='profilePageContainer'>
                <div className='basicInfo'>
                    <h3>{error}</h3>
                </div>
            </div>
        )
    }

    return (
    <div className='profilePageContainer'>
        <div className='basicInfo'><h3>Username: {username} </h3></div>
        {authState.username === username && (
            <button 
            onClick={() => {
                navigate('/changepassword')
                }}>
                    Change My Password
            </button>)}
        <div className='listOfPosts'>
            {listOfPosts.map((value, key) => {
                return (
                    <div
                        key={value.id}
                        className = "post" 
                        onClick={() => {
                            navigate(`/post/${value.id}`);
                        }}
                    >
                        <div className="title"> {value.title} </div>
                        <div className="body"> {value.postText} </div>
                        <div className="footer"> 
                            {value.username} 
                            <button>
                                
                            </button>
                                <label> {value.Likes.length}</label>
                        </div>
                    </div>
                );
            })}
        </div>
    </div>
    )
}

export default Profile