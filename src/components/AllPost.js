import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import sanityClient from '../client';
import BlockContent from '@sanity/block-content-to-react';
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
                },
                body
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
        post.title.toLowerCase().includes(searchText.toLowerCase()) || 
        (typeof post.body === 'object' && JSON.stringify(post.body).toLowerCase().includes(searchText.toLowerCase()))
    );            

    const handleSearchChange = (event) => {
        const text = event.target.value;
        setSearchText(text);
    };

    return (
        <>
            <h1 style={{display:'flex', justifyContent:'center', paddingTop:'5rem'}}>Aseorías UTeMitas</h1>
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
                        <div className="card">
                            <div className="image">
                                <Link to={'/' + post.slug.current}>
                                    <img src={post.mainImage.asset.url} alt='UTMita' width="160" height="auto" className="post-image" />
                                </Link>
                            </div>
                            <span className="title">
                                <Link to={'/' + post.slug.current}>
                                    <h2>{post.title}</h2>
                                </Link>
                                <div className='materias'>
                                    <BlockContent blocks={post.body}/>
                                </div>
                            </span>
                        </div>
                    </div>
                ))}
            </div>
        </>
    )
}

export default AllPost;
