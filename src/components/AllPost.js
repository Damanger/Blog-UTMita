import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import sanityClient from '../client';
import '../css/AllPost.css';

const AllPost = () => {
    const [allPostData, setAllPostData] = useState(null);
    const [searchText, setSearchText] = useState('');

    useEffect(() => {
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

    useEffect(() => {
        const gridItems = document.querySelectorAll('.grid-item');
        gridItems.forEach((item, index) => {
            item.style.animationDelay = `${index * 0.1}s`;
        });
    }, [allPostData]);

    const filteredPosts = allPostData && allPostData.filter(post =>
        post.title.toLowerCase().includes(searchText.toLowerCase())
    );

    const handleSearchChange = (event) => {
        const text = event.target.value;
        setSearchText(text);
        if (text.toLowerCase() === 'computación') {
            setSearchText('');
        }
    };

    return (
        <>
            <h1 style={{display:'flex', justifyContent:'center'}}>Aseorías UTeMitas</h1>
            <h2 style={{display:'flex', justifyContent:'center'}}>Tutores UTeMitas</h2>
            <div className="input-wrapper">
                <input
                    type="text"
                    name="text"
                    className="input"
                    placeholder='Buscar'
                    value={searchText}
                    onChange={handleSearchChange}
                />
            </div>
            <div className="grid-container" >
                {filteredPosts && filteredPosts.map((post) => (
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
