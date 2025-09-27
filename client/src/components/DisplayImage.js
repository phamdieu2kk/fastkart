// DisplayImage.jsx
import React from 'react';
import { CgClose } from 'react-icons/cg';

const DisplayImage = ({ imgUrl, onClose }) => {
  return (
    <div className='fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-80'>
      <div className='relative'>
        <img src={imgUrl} alt='full' className='max-h-[80vh] max-w-[80vw]' />
        <div className='absolute text-2xl text-white cursor-pointer top-2 right-2' onClick={onClose}>
          <CgClose />
        </div>
      </div>
    </div>
  );
};

export default DisplayImage;
