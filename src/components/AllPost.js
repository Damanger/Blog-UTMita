import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import sanityClient from '../client';

const AllPost = () => {
    const [allPostData, setAllPostData] = useState(null);

    useEffect(() =>{
        sanityClient.fetch(
            `*[_type == 'post']{
                title, 
                slug,
                mainImage{
                    asset->{
                        _id,
                        url
                    }
                }
            }`
        );
    }, [])
    return (
        <h1>All Post Page</h1>
    )
}

export default AllPost
