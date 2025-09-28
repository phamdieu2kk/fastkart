import './App.css';
import { Outlet } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useEffect, useState, useCallback } from 'react';
import SummaryApi from './common';
import Context from './context';
import { useDispatch } from 'react-redux';
import { setUserDetails } from './store/userSlice';

function App() {
  const dispatch = useDispatch();
  const [cartProductCount, setCartProductCount] = useState(0);

  // ✅ Memo hóa fetchUserDetails bằng useCallback để useEffect dependency an toàn
  const fetchUserDetails = useCallback(async () => {
    try {
      const dataResponse = await fetch(SummaryApi.current_user.url, {
        method: SummaryApi.current_user.method,
        credentials: 'include',
      });

      const dataApi = await dataResponse.json();

      if (dataApi.success) {
        dispatch(setUserDetails(dataApi.data));
      }
    } catch (error) {
      console.error('Failed to fetch user details:', error);
    }
  }, [dispatch]);

  const fetchUserAddToCart = useCallback(async () => {
    try {
      const dataResponse = await fetch(SummaryApi.addToCartProductCount.url, {
        method: SummaryApi.addToCartProductCount.method,
        credentials: 'include',
      });

      const dataApi = await dataResponse.json();

      setCartProductCount(dataApi?.data?.count || 0);
    } catch (error) {
      console.error('Failed to fetch cart count:', error);
    }
  }, []);

  useEffect(() => {
    fetchUserDetails(); // user details
    fetchUserAddToCart(); // cart product count
  }, [fetchUserDetails, fetchUserAddToCart]); // ✅ thêm cả 2 dependency

  return (
    <Context.Provider
      value={{
        fetchUserDetails, // user detail fetch
        cartProductCount, // current user add to cart product count
        fetchUserAddToCart,
      }}
    >
      <ToastContainer position="top-center" />
      <Header />
      <main className="flex flex-col min-h-[calc(100vh-6rem)] w-full">
        <Outlet />
      </main>
      <Footer />
    </Context.Provider>
  );
}

export default App;
