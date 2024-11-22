import React from 'react';

export const FetchImages = async (url) => {
    if (url) {
        const response = await fetch(url);
        const data = response.json()
        console.log(response);
        if (data.data) {
            if (data.data.image) {
                return data.data.image;
            }
        } else if (data.image) {
            return data.image;
        }
    }
    return null;
}

export default FetchImages;
