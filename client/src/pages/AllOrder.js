import React, { useEffect, useState } from 'react'
import SummaryApi from '../common'
import moment from 'moment'
import displayINRCurrency from '../helpers/displayCurrency'

const AllOrder = () => {
    const [data,setData] = useState([])

    const fetchOrderDetails = async()=>{
      const response = await fetch(SummaryApi.allOrder.url,{
        method : SummaryApi.allOrder.method,
        credentials : 'include'
      })
  
      const responseData = await response.json()
  
      setData(responseData.data)
      console.log("order list",responseData)
    }
  
    useEffect(()=>{
      fetchOrderDetails()
    },[])
  
    return (
      <div className='h-[calc(100vh-190px)] overflow-y-scroll'>
        {
           !data[0] && (
            <p>No Order available</p>
           )
        }
  
        <div className='w-full p-4'>
            {
              data.map((item,index)=>{
                return(
                  <div key={item.userId+index}>
                     <p className='text-lg font-medium'>{moment(item.createdAt).format('LL')}</p> 
                     <div className='p-2 border rounded'>
                          <div className='flex flex-col justify-between lg:flex-row'>
                              <div className='grid gap-1'>
                                {
                                  item?.productDetails.map((product,index)=>{
                                    return(
                                      <div key={product.productId+index} className='flex gap-3 bg-slate-100'>
                                          <img 
                                            src={product.image[0]}
                                            className='object-scale-down p-2 w-28 h-28 bg-slate-200'
                                          />
                                          <div>
                                            <div className='text-lg font-medium text-ellipsis line-clamp-1'>{product.name}</div>
                                            <div className='flex items-center gap-5 mt-1'>
                                              <div className='text-lg text-red-500'>{displayINRCurrency(product.price)}</div>
                                              <p>Quantity : {product.quantity}</p>
                                            </div>
                                          </div>
                                      </div>
                                    )
                                  })
                                }
                              </div>
                              <div className='flex flex-col gap-4 p-2 min-w-[300px]'>
                                <div>
                                    <div className='text-lg font-medium'>Payment Details : </div>
                                    <p className='ml-1 '>Payment method : {item.paymentDetails.payment_method_type[0]}</p>
                                    <p className='ml-1 '>Payment Status : {item.paymentDetails.payment_status}</p>
                                </div>
                                <div>
                                  <div className='text-lg font-medium'>Shipping Details :</div>
                                  {
                                    item.shipping_options.map((shipping,index)=>{
                                      return(
                                        <div key={shipping.shipping_rate} className='ml-1 '>
                                          Shipping Amount : {shipping.shipping_amount}
                                        </div>
                                      )
                                    })                      
                                  }
                                </div>
                              </div>
                          </div>
  
                        <div className='ml-auto font-semibold w-fit lg:text-lg'>
                          Total Amount : {item.totalAmount}
                        </div>
                     </div>
                  </div>
                )
              })
            }
        </div>
      </div>
    )
}

export default AllOrder