import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import SUCCESSIMAGE from '../assest/success.gif';
import FAILEDIMAGE from '../assest/cancel.gif';
import displayVNDCurrency from '../helpers/displayCurrency';

const Cancel = () => {
  const location = useLocation();
  const query = new URLSearchParams(location.search);
  const status = query.get('status'); // success / failed
  const orderId = query.get('orderId'); // id order
  const amount = query.get('amount'); // tổng tiền (nếu gửi từ backend)

  const isSuccess = status === 'success';

  return (
    <div className='flex flex-col items-center justify-center w-full max-w-md p-4 m-2 mx-auto rounded bg-slate-200'>
      <img
        src={isSuccess ? SUCCESSIMAGE : FAILEDIMAGE}
        width={150}
        height={150}
        className='mix-blend-multiply'
      />
      <p className={`font-bold text-xl ${isSuccess ? 'text-green-600' : 'text-red-600'}`}>
        {isSuccess ? 'Payment Success' : 'Payment Failed'}
      </p>
      {amount && (
        <p className='mt-2 text-gray-700'>
          Total Amount: {displayVNDCurrency(Number(amount))}
        </p>
      )}
      <Link 
        to={isSuccess ? `/orders/${orderId}` : '/cart'} 
        className={`p-2 px-3 mt-5 border-2 rounded font-semibold ${isSuccess ? 'border-green-600 text-green-600 hover:bg-green-600 hover:text-white' : 'border-red-600 text-red-600 hover:bg-red-600 hover:text-white'}`}
      >
        {isSuccess ? 'View Order' : 'Go To Cart'}
      </Link>
    </div>
  );
};

export default Cancel;
