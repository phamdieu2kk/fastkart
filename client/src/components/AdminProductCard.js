import React, { useState } from 'react';
import { MdModeEditOutline } from "react-icons/md";
import AdminEditProduct from './AdminEditProduct';
import displayINRCurrency from '../helpers/displayCurrency';

const AdminProductCard = ({ data, fetchdata }) => {
    const [editProduct, setEditProduct] = useState(false);

    return (
        <div className="w-full max-w-[220px] p-4 bg-white rounded-lg shadow-md hover:shadow-lg flex flex-col items-center">
            <div className='flex items-center justify-center w-full h-40'>
                <img src={data?.productImage[0]} alt={data.productName} className='object-cover w-full h-full rounded-md' />
            </div>

            <h1 className='mt-2 text-lg font-semibold text-center line-clamp-2'>{data.productName}</h1>
            <p className='text-sm text-center text-gray-500 line-clamp-2'>{data.description}</p>

            <div className='flex items-center justify-between w-full mt-2'>
                <p className='font-semibold text-red-600'>{displayINRCurrency(data.sellingPrice)}</p>
                <div className='p-2 bg-green-100 rounded-full cursor-pointer hover:bg-green-600 hover:text-white' onClick={() => setEditProduct(true)}>
                    <MdModeEditOutline />
                </div>
            </div>

            {editProduct && (
                <AdminEditProduct productData={data} onClose={() => setEditProduct(false)} fetchdata={fetchdata} />
            )}
        </div>
    );
};

export default AdminProductCard;
