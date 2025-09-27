import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import SummaryApi from '../common';
import VerticalCard from '../components/VerticalCard';

const SearchProduct = () => {
  const query = useLocation();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchProduct = async () => {
    setLoading(true);
    try {
      const response = await fetch(SummaryApi.searchProduct.url + query.search);
      const dataResponse = await response.json();
      setData(dataResponse.data || []);
    } catch (err) {
      console.error(err);
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProduct();
  }, [query]);

  return (
    <div className="container p-4 mx-auto">
      {/* Loading Spinner */}
      {loading && (
        <div className="flex flex-col items-center justify-center py-20">
          <div className="w-12 h-12 mb-4 border-4 border-gray-300 rounded-full border-t-yellow-400 animate-spin"></div>
          <p className="text-lg font-medium text-gray-600">Đang tải sản phẩm...</p>
        </div>
      )}

      {!loading && (
        <>
          <p className="my-3 text-lg font-semibold">
            Kết quả tìm kiếm: {data.length}
          </p>

          {data.length === 0 ? (
            <p className="p-4 text-lg text-center bg-white rounded shadow">
              Không tìm thấy dữ liệu...
            </p>
          ) : (
            <VerticalCard loading={loading} data={data} />
          )}
        </>
      )}
    </div>
  );
};

export default SearchProduct;
