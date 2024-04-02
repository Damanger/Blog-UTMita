import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import sanityClient from '../client';

const AllPost = () => {
    const [allPostData, setAllPostData] = useState(null);
    const [selectedImage, setSelectedImage] = useState(null);

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

    const handleMouseEnter = (index) => {
        setSelectedImage(index);
    }

    const handleMouseLeave = () => {
        setSelectedImage(null);
    }

    return (
        <div>
            <div>
                <h1 style={{display:'flex', justifyContent:'center'}}>Aseorías UTMitas</h1>
                <h2 style={{display:'flex', justifyContent:'center'}}>Tutores UTMitas</h2>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '10px', justifyContent: 'space-evenly', padding: '10px' }}>
                    {allPostData && allPostData.map((post, index) => (
                        <Link to={'/' + post.slug.current} key={post.slug.current}
                            style={{ display: 'flex', textAlign: 'center', 
                            flexDirection: 'column', justifyContent: 'center', 
                            textDecoration:'none', color:'black', 
                            opacity: selectedImage !== null && selectedImage !== index ? '0.4' : '1',
                            transition: 'opacity 0.6s ease' }}
                            onMouseEnter={() => handleMouseEnter(index)}
                            onMouseLeave={handleMouseLeave}>
                            <img src={post.mainImage.asset.url} style={{ width: '10rem', height: 'auto', margin: '0 auto' }} alt='UTMita' />
                            <h2 style={{ margin: '5px 0' }}>{post.title}</h2>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default AllPost
