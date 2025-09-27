import React from 'react'
import SUCCESSIMAGE from '../assest/success.gif'
import { Link } from 'react-router-dom'

const Success = () => {
  return (
    <div className='flex flex-col items-center justify-center w-full max-w-md p-4 m-2 mx-auto rounded bg-slate-200'>
      <img
        src={SUCCESSIMAGE}
        width={150}
        height={150}
      />
      <p className='text-xl font-bold text-green-600'>Payment Successfully</p>
      <Link to={"/order"} className='p-2 px-3 mt-5 font-semibold text-green-600 border-2 border-green-600 rounded hover:bg-green-600 hover:text-white'>See Order</Link>
    </div>
  )
}

export default Success