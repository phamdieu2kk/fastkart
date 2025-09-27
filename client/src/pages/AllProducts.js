import React, { useEffect, useState } from 'react';
import UploadProduct from '../components/UploadProduct';
import SummaryApi from '../common';
import AdminProductCard from '../components/AdminProductCard';

const AllProducts = () => {
  const [openUploadProduct, setOpenUploadProduct] = useState(false);
  const [allProduct, setAllProduct] = useState([]);

  const fetchAllProduct = async () => {
    const response = await fetch(SummaryApi.allProduct.url);
    const dataResponse = await response.json();
    console.log("product data", dataResponse);
    setAllProduct(dataResponse?.data || []);
  };

  useEffect(() => {
    fetchAllProduct();
  }, []);

  return (
    <div className="px-4 py-4">
      <div className='flex items-center justify-between px-4 py-2 mb-4 bg-white rounded-md shadow-sm'>
        <h2 className='text-lg font-bold'>All Product</h2>
        <button  
          className='px-3 py-1 text-red-600 transition-all border-2 border-red-600 rounded-full hover:bg-red-600 hover:text-white' 
          onClick={() => setOpenUploadProduct(true)}
        >
          Upload Product
        </button>
      </div>

      {/** Responsive grid container */}
      <div className='grid grid-cols-1 gap-5 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5'>
        {allProduct.map((product, index) => (
          <AdminProductCard data={product} key={index} fetchdata={fetchAllProduct} />
        ))}
      </div>

      {/** Upload Product Modal */}
      {openUploadProduct && (
        <UploadProduct onClose={() => setOpenUploadProduct(false)} fetchData={fetchAllProduct} />
      )}
    </div>
  );
};

export default AllProducts;
