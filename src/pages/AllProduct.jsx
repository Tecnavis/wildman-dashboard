import React, { useEffect, useState } from 'react'
import Footer from '../components/footer/Footer'
import AllProductHeader from '../components/header/AllProductHeader'
import AllProductTableFilter from '../components/filter/AllProductTableFilter'
import AllProductTable from '../components/tables/AllProductTable'
import { fetchProducts } from '../Helper/handle-api'

const AllProductMainContent = () => {
    const [products, setProducts] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [outOfStockCount, setOutOfStockCount] = useState(0);
    const [inStockCount, setInStockCount] = useState(0);

    useEffect(() => {
        const fetchProduct = async () => {
            const response = await fetchProducts();
            setProducts(response);
            setFilteredProducts(response);
            
            updateStockCounts(response);
        };
        fetchProduct();
    }, []);

    const updateStockCounts = (productsToCount) => {
        let outOfStock = 0;
        let inStock = 0;
        
        productsToCount.forEach(product => {
            const totalStock = product.sizes.reduce((total, size) => total + size.stock, 0);
            if (totalStock === 0) {
                outOfStock++;
            } else {
                inStock++;
            }
        });
        
        setOutOfStockCount(outOfStock);
        setInStockCount(inStock);
    };

    const handleFilter = (filteredProducts) => {
        setFilteredProducts(filteredProducts);
        updateStockCounts(filteredProducts);
    };

    return (
        <div className="main-content">
            <div className="row g-4">
                <div className="col-12">
                    <div className="panel">
                        <AllProductHeader />
                        <div className="panel-body">
                            <div className="product-table-quantity d-flex justify-content-between align-items-center mb-20">
                                <ul className="mb-0">
                                    <li className="text-white">All ({filteredProducts.length})</li>
                                    <li>In Stock ({inStockCount})</li>
                                    <li>Out of Stock ({outOfStockCount})</li>
                                </ul>
                            </div>
                            <AllProductTableFilter products={products} onFilter={handleFilter} />
                            <AllProductTable filteredProducts={filteredProducts} />
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
}

export default AllProductMainContent