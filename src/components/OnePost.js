import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import sanityClient from '../client';
import imageUrlBuilder from '@sanity/image-url';
import BlockContent from '@sanity/block-content-to-react';

const builder = imageUrlBuilder(sanityClient);

const urlFor = (source) => {
    return builder.image(source);
}

const OnePost = () => {
    const [postData, setPostData] = useState(null);
    const { slug } = useParams();

    useEffect(() => {
        sanityClient.fetch(
            `*[slug.current == $slug]{
                title,
                slug,
                mainImage{
                    asset->{
                        _id,
                        url
                    }
                },
                body,
                "name": author->name
            }`,
            { slug }
        )
        .then(data => setPostData(data[0]))
        .catch(err => console.error(err));
    }, [slug]) 

    if (!postData || !postData.title) {
        return <div style={{ display: 'flex', justifyContent: 'center', alignContent: 'center', position:'absolute', top:'50%', left:'50%', transform:'translate(-50%,-50%)', textAlign:'center', fontSize:'2rem' }}>Estamos contactando UTMitas para dar asesorías</div>;
    }

    return (
        <div>
            <h2 style={{display:'flex', justifyContent:'center'}}>{postData.title}</h2>
            <div style={{display:'flex', justifyContent:'center'}}>
                <h4>{postData.name}</h4>
            </div>
            <div style={{display:'flex', justifyContent:'center'}}>
                <img src={urlFor(postData.mainImage).url()} alt='Imagen_UTMita' style={{height:'10rem'}}/>
            </div>
            <div style={{display:'flex', justifyContent:'center'}}>
                <BlockContent blocks={postData.body}/>
            </div>
        </div>
    )
}

export default OnePost
