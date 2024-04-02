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
    }, []);

    return (
        <>
            <h1 style={{display:'flex', justifyContent:'center'}}>Aseorías UTMitas</h1>
            <h2 style={{display:'flex', justifyContent:'center'}}>Tutores UTMitas</h2>
            <div className="grid-container">
                {allPostData && allPostData.map((post) => (
                    <div key={post.slug.current} className="grid-item">
                        <Link to={'/' + post.slug.current}>
                            <img src={post.mainImage.asset.url} alt='UTMita' width="160" height="auto" className="post-image" />
                        </Link>
                        <div style={{display:'flex', justifyContent:'center', alignItems:'flex-end', height:'100%'}}>
                            <h2>{post.title}</h2>
                        </div>
                    </div>
                ))}
            </div>
        </>
    )
}

export default AllPost;
