import React, { useEffect, useState } from 'react';
import ProductCard from '../components/ProductCard';
import api from '../axiosConfig';
import '../styles/AllProducts.css';

interface Product {
  _id: string;
  name: string;
  description: string;
  oldPrice: number;
  discountPrice: number;
  category: string;
  brand: string;
  series: string;
  scale: string;
  stock: number;
  image: string;
}

interface PriceRange {
  min: number;
  max: number;
  label: string;
}

const priceRanges: PriceRange[] = [
  { min: 0, max: 500000, label: 'Dưới 500,000đ' },
  { min: 500000, max: 1000000, label: '500,000đ - 1,000,000đ' },
  { min: 1000000, max: 2000000, label: '1,000,000đ - 2,000,000đ' },
  { min: 2000000, max: 5000000, label: '2,000,000đ - 5,000,000đ' },
  { min: 5000000, max: Infinity, label: 'Trên 5,000,000đ' },
];

const AllProducts: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState({
    brand: '',
    series: '',
    scale: '',
    priceRange: '',
    sortBy: 'default'
  });
  const [uniqueFilters, setUniqueFilters] = useState({
    brands: new Set<string>(),
    series: new Set<string>(),
    scales: new Set<string>()
  });

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await api.get('/products/products');
        setProducts(response.data);
        
        const brands = new Set(response.data.map((p: Product) => p.brand));
        const series = new Set(response.data.map((p: Product) => p.series));
        const scales = new Set(response.data.map((p: Product) => p.scale));
        
        setUniqueFilters({ brands, series, scales });
      } catch (err) {
        console.error('Lỗi khi tải sản phẩm:', err);
        setError('Không thể tải danh sách sản phẩm');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const filteredProducts = products.filter(product => {
    const matchesBrand = !filters.brand || product.brand === filters.brand;
    const matchesSeries = !filters.series || product.series === filters.series;
    const matchesScale = !filters.scale || product.scale === filters.scale;
    
    // Lọc theo khoảng giá
    let matchesPrice = true;
    if (filters.priceRange) {
      const selectedRange = priceRanges.find(range => 
        range.label === filters.priceRange
      );
      if (selectedRange) {
        matchesPrice = product.discountPrice >= selectedRange.min && 
                      product.discountPrice < selectedRange.max;
      }
    }

    return matchesBrand && matchesSeries && matchesScale && matchesPrice;
  });

  // Sắp xếp sản phẩm
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (filters.sortBy) {
      case 'price-asc':
        return a.discountPrice - b.discountPrice;
      case 'price-desc':
        return b.discountPrice - a.discountPrice;
      default:
        return 0;
    }
  });

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        Đang tải sản phẩm...
      </div>
    );
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  return (
    <div className="all-products-page">
      <div className="filters-section">
        <h2>Bộ lọc</h2>
        
        <div className="filter-group">
          <label>Thương hiệu:</label>
          <select 
            value={filters.brand}
            onChange={(e) => setFilters({...filters, brand: e.target.value})}
          >
            <option value="">Tất cả</option>
            {[...uniqueFilters.brands].map(brand => (
              <option key={brand} value={brand}>{brand}</option>
            ))}
          </select>
        </div>

        <div className="filter-group">
          <label>Series:</label>
          <select 
            value={filters.series}
            onChange={(e) => setFilters({...filters, series: e.target.value})}
          >
            <option value="">Tất cả</option>
            {[...uniqueFilters.series].map(series => (
              <option key={series} value={series}>{series}</option>
            ))}
          </select>
        </div>

        <div className="filter-group">
          <label>Tỷ lệ:</label>
          <select 
            value={filters.scale}
            onChange={(e) => setFilters({...filters, scale: e.target.value})}
          >
            <option value="">Tất cả</option>
            {[...uniqueFilters.scales].map(scale => (
              <option key={scale} value={scale}>{scale}</option>
            ))}
          </select>
        </div>

        <div className="filter-group">
          <label>Khoảng giá:</label>
          <select
            value={filters.priceRange}
            onChange={(e) => setFilters({...filters, priceRange: e.target.value})}
          >
            <option value="">Tất cả</option>
            {priceRanges.map((range, index) => (
              <option key={index} value={range.label}>
                {range.label}
              </option>
            ))}
          </select>
        </div>

        <div className="filter-group">
          <label>Sắp xếp theo:</label>
          <select
            value={filters.sortBy}
            onChange={(e) => setFilters({...filters, sortBy: e.target.value})}
          >
            <option value="default">Mặc định</option>
            <option value="price-asc">Giá tăng dần</option>
            <option value="price-desc">Giá giảm dần</option>
          </select>
        </div>

        <button 
          className="clear-filters"
          onClick={() => setFilters({ 
            brand: '', 
            series: '', 
            scale: '', 
            priceRange: '',
            sortBy: 'default'
          })}
        >
          Xóa bộ lọc
        </button>
      </div>

      <div className="products-section">
        <h1>Tất cả sản phẩm</h1>
        <div className="products-count">
          Hiển thị {sortedProducts.length} sản phẩm
        </div>
        
        <div className="products-grid">
          {sortedProducts.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default AllProducts; 