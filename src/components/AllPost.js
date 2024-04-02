import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import sanityClient from '../client';
import '../css/AllPost.css';

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
        )
        .then(data => setAllPostData(data))
        .catch(err => console.error(err));
    }, [])

    return (
        <div>
            <div>
                <h1 style={{display:'flex', justifyContent:'center'}}>Aseorías UTMitas</h1>
                <h2 style={{display:'flex', justifyContent:'center'}}>Tutores UTMitas</h2>
                <div className="grid-container">
                    {allPostData && allPostData.map((post) => (
                        <Link to={'/' + post.slug.current} key={post.slug.current} className="grid-item">
                            <img src={post.mainImage.asset.url} alt='UTMita' width="160" height="auto" className="post-image" />
                            <h2>{post.title}</h2>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default AllPost;
