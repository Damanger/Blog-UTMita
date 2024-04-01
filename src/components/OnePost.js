import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import sanityClient from '../client';
import { ImageUrlBuilder } from '@sanity/image-url';
import BlockContent from '@sanity/block-content-to-react';

const builder = ImageUrlBuilder(sanityClient);

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
                "name": author->name,
                "authorImage": author->image
            }`,
            { slug }
        )
        .then(data => setPostData(data))
        .catch(err => console.error(err));
    }, [slug])

    return (
        <h1>One Post Page</h1>
    )
}

export default OnePost
