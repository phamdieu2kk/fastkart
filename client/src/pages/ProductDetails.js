import React, { useCallback, useContext, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import SummaryApi from '../common';
import { FaStar, FaStarHalf } from "react-icons/fa";
import displayINRCurrency from '../helpers/displayCurrency';
import CategroyWiseProductDisplay from '../components/CategoryWiseProductDisplay';
import addToCart from '../helpers/addToCart';
import Context from '../context';
import ProductPolicies from '../components/ProductPolicies';
const ProductDetails = () => {
  const [data,setData] = useState({
    productName : "",
    brandName : "",
    category : "",
    productImage : [],
    description : "",
    price : "",
    sellingPrice : "",
    rating: 0
  });
  const params = useParams();
  const [loading,setLoading] = useState(true);
  const productImageListLoading = new Array(4).fill(null);
  const [activeImage,setActiveImage] = useState("");
  const [zoomImageCoordinate,setZoomImageCoordinate] = useState({x:0,y:0});
  const [zoomImage,setZoomImage] = useState(false);
  const { fetchUserAddToCart } = useContext(Context);
  const navigate = useNavigate();

  const fetchProductDetails = async()=>{
    setLoading(true);
    try {
      const response = await fetch(SummaryApi.productDetails.url,{
        method : SummaryApi.productDetails.method,
        headers : {"content-type" : "application/json"},
        body : JSON.stringify({ productId : params?.id })
      });
      const dataReponse = await response.json();
      setData(dataReponse?.data);
      setActiveImage(dataReponse?.data?.productImage[0]);
    } catch(err){
      console.error(err);
    } finally{
      setLoading(false);
    }
  }

  useEffect(()=>{ fetchProductDetails() },[params]);

  const handleMouseEnterProduct = (imageURL)=>{ setActiveImage(imageURL); }

  const handleZoomImage = useCallback((e) =>{
    if(window.innerWidth < 1024) return; // chỉ desktop mới zoom
    setZoomImage(true);
    const { left , top, width , height } = e.target.getBoundingClientRect();
    const x = (e.clientX - left) / width;
    const y = (e.clientY - top) / height;
    setZoomImageCoordinate({x,y});
  },[]);

  const handleLeaveImageZoom = ()=>{ setZoomImage(false); }

  const handleAddToCart = async(e,id) =>{
    await addToCart(e,id);
    fetchUserAddToCart();
  }

  const handleBuyProduct = async(e,id)=>{
    await addToCart(e,id);
    fetchUserAddToCart();
    navigate("/cart");
  }

  return (
    <div className='container p-4 mx-auto'>
      {/* Main container responsive */}
      <div className='flex flex-col md:flex-row gap-6 min-h-[300px]'>
        {/* Images + Thumbnails */}
        <div className='flex flex-col w-full gap-4 md:flex-row-reverse md:w-auto'>
          {/* Main Image */}
          <div className='relative w-full md:w-[400px] h-[300px] md:h-[400px] bg-slate-200 p-2 flex-shrink-0'>
            {loading ? (
              <div className='w-full h-full bg-slate-200 animate-pulse'/>
            ) : (
              <>
                <img 
                  src={activeImage} 
                  alt='main'
                  className='object-contain w-full h-full cursor-zoom-in'
                  onMouseMove={handleZoomImage}
                  onMouseLeave={handleLeaveImageZoom}
                />
                {/* Zoom ảnh Desktop */}
                {zoomImage && (
                  <div className='hidden lg:block absolute -right-[420px] top-0 w-[400px] h-[400px] border border-gray-300 overflow-hidden bg-white'>
                    <div className='w-full h-full scale-150 bg-no-repeat bg-contain'
                      style={{backgroundImage:`url(${activeImage})`,
                              backgroundPosition:`${zoomImageCoordinate.x*100}% ${zoomImageCoordinate.y*100}%`
                      }}/>
                  </div>
                )}
              </>
            )}
          </div>

          {/* Thumbnails */}
          <div className='flex gap-2 overflow-x-auto md:flex-col md:overflow-x-hidden scrollbar-none'>
            {loading ? (
              productImageListLoading.map((_,i)=>(
                <div key={i} className='w-20 h-20 rounded lg:w-20 lg:h-20 bg-slate-200 animate-pulse'/>
              ))
            ) : (
              data?.productImage?.map((imgURL,idx)=>(
                <div key={idx} className={`w-20 h-20 p-1 rounded cursor-pointer border ${activeImage===imgURL ? "border-indigo-500" : "border-gray-300"}`}>
                  <img src={imgURL} alt={`thumb-${idx}`} className='object-contain w-full h-full' 
                    onMouseEnter={()=>handleMouseEnterProduct(imgURL)} 
                    onClick={()=>handleMouseEnterProduct(imgURL)}
                  />
                </div>
              ))
            )}
          </div>
        </div>

        {/* Product Details */}
        <div className='flex flex-col w-full gap-3 md:w-1/2'>
          {loading ? (
            <div className='space-y-2'>
              <div className='w-24 h-6 rounded bg-slate-200 animate-pulse'></div>
              <div className='w-full h-8 rounded bg-slate-200 animate-pulse'></div>
              <div className='w-32 h-6 rounded bg-slate-200 animate-pulse'></div>
              <div className='w-full h-6 rounded bg-slate-200 animate-pulse'></div>
              <div className='flex gap-2'>
                <div className='w-24 h-10 rounded bg-slate-200 animate-pulse'></div>
                <div className='w-24 h-10 rounded bg-slate-200 animate-pulse'></div>
              </div>
              <div className='w-full h-16 rounded bg-slate-200 animate-pulse'></div>
            </div>
          ) : (
            <>
              <p className='inline-block px-2 py-1 text-red-600 bg-red-200 rounded-full w-fit'>{data?.brandName}</p>
              <h2 className='text-2xl font-medium lg:text-4xl'>{data?.productName}</h2>
              <p className='capitalize text-slate-400'>{data?.category}</p>

              {/* Rating */}
              <div className='flex items-center gap-1 text-yellow-500'>
                {Array(5).fill("").map((_,i)=> i < Math.floor(data.rating) ? <FaStar key={i}/> : i < data.rating ? <FaStarHalf key={i}/> : <FaStar key={i} className='text-gray-300'/>)}
                <span className='ml-2 text-sm'>({data.rating})</span>
              </div>

              {/* Price */}
              <div className='flex items-center gap-2 my-1 text-2xl font-medium lg:text-3xl'>
                <p className='text-red-600'>{displayINRCurrency(data.sellingPrice)}</p>
                <p className='line-through text-slate-400'>{displayINRCurrency(data.price)}</p>
              </div>

              {/* Buttons */}
              <div className='flex flex-col gap-3 my-2 sm:flex-row'>
                <button className='border-2 border-red-600 rounded px-3 py-2 min-w-[120px] text-red-600 font-medium hover:bg-red-600 hover:text-white transition'
                  onClick={(e)=>handleBuyProduct(e,data?._id)}>Buy now</button>
                <button className='border-2 border-red-600 rounded px-3 py-2 min-w-[120px] font-medium text-white bg-red-600 hover:text-red-600 hover:bg-white transition'
                  onClick={(e)=>handleAddToCart(e,data?._id)}>Add To Cart</button>
              </div>

              {/* Description */}
              <div>
                <p className='my-1 font-medium text-slate-600'>Description:</p>
                <p>{data?.description}</p>
              </div>
            </>
          )}
          <div className="mt-6">
  <ProductPolicies layout="detail" />
</div>

        </div>
       
      </div>

      {/* Recommended Products */}
      {data?.category && (
        <CategroyWiseProductDisplay category={data.category} heading={"Recommended Product"} />
      )}
    </div>
  )
}

export default ProductDetails;
