import React from 'react'
import { Link } from 'react-router-dom'

function PageNotFound() {
    return (
    <div>Page Not Found
        <h3>
            {""}
            Go to the Home Page: <Link to="/">Home Page</Link>
        </h3>
    </div>
    )
}

export default PageNotFound