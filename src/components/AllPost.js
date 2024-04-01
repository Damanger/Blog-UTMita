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
        )
        .then(data => setAllPostData(data))
        .catch(err => console.error(err));
    }, [])
    return (
        <div>
            <div>
                <h1 style={{display:'flex', justifyContent:'center'}}>Aseorías UTMitas</h1>
                <h2 style={{display:'flex', justifyContent:'center'}}>Tutores UTMitas</h2>
                <div>
                    {allPostData && allPostData.map((post, index) => (
                        <Link to={'/' + post.slug.current} key={post.slug.current}>
                            <span key={index}>
                                <img src={post.mainImage.asset.url} style={{width:'10rem', height:'auto'}} alt='UTMita'/>
                                <span>
                                    <h2>{post.title}</h2>
                                </span>
                            </span>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default AllPost
