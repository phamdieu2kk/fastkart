import React from 'react'
import CategoryList from '../components/CategoryList'
import BannerProduct from '../components/BannerProduct'
import HorizontalCardProduct from '../components/HorizontalCardProduct'
import VerticalCardProduct from '../components/VerticalCardProduct'
import ProductPolicies from '../components/ProductPolicies'

import BannerSectionOne from '../components/BannerSectionOne'
import BannerSection from '../components/BannerSection'
import ProductBaner from '../components/ProductBaner'
import Newsletter from '../components/Newsletter'
const Home = () => {
  return (
     <div >
        <CategoryList/>
       <BannerProduct/>
   
    
      <ProductPolicies/>

      
<HorizontalCardProduct category={"bánh kem"} heading={"BÁNH KEM NGỌT NGÀO"} />
<HorizontalCardProduct category={"bánh mì"} heading={"BÁNH MÌ TƯƠI NGON"} />

<VerticalCardProduct category={"đồ uống"} heading={"THỨC UỐNG MÁT LẠNH"} />
<VerticalCardProduct category={"bánh bao"} heading={"BÁNH BAO NGON MỖI NGÀY"} />

<BannerSectionOne/>
{/* 
<VerticalCardProduct category={"bánh ngọt"} heading={"BÁNH NGỌT HẢO HẠNG"} /> */}


<VerticalCardProduct category={"bánh trung thu"} heading={"SẮC VỊ TRUNG THU"} />
<BannerSection/>

<VerticalCardProduct category={"bánh theo mùa"} heading={"HƯƠNG VỊ THEO MÙA"} />
<VerticalCardProduct category={"bánh tráng miệng"} heading={"MÓN TRÁNG MIỆNG NGỌT NGÀO"} />

<ProductBaner/>
<VerticalCardProduct category={"bánh đông lạnh"} heading={"TIỆN LỢI – BÁNH ĐÔNG LẠNH"} />
<Newsletter/>


      
    </div>
  )
}

export default Home
