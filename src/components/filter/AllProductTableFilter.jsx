import React, { useContext, useState } from 'react'
import { Form } from 'react-bootstrap'
import { DigiContext } from '../../context/DigiContext';
import SelectFilter from './SelectFilter';

const AllProductTableFilter = ({ products, onFilter }) => {
    const { handleTableFilterReset } = useContext(DigiContext);
    const [selectedCategory, setSelectedCategory] = useState('0');
    const [selectedStock, setSelectedStock] = useState('0');

    const categories = [...new Set(products.map(product => product.mainCategory))];

    const handleCategoryChange = (e) => {
        setSelectedCategory(e.target.value);
    };

    const handleStockChange = (e) => {
        setSelectedStock(e.target.value);
    };

    const applyFilters = () => {
        let filtered = [...products];

        if (selectedCategory !== '0') {
            filtered = filtered.filter(product => product.mainCategory === selectedCategory);
        }

        if (selectedStock !== '0') {
            filtered = filtered.filter(product => {
                const totalStock = product.sizes.reduce((sum, size) => sum + size.stock, 0);
                switch (selectedStock) {
                    case '1': return totalStock > 0;
                    case '2': return totalStock === 0;
                    case '3': return product.backorder;
                    default: return true;
                }
            });
        }

        onFilter(filtered);
    };

    const resetFilters = () => {
        setSelectedCategory('0');
        setSelectedStock('0');
        onFilter(products);
    };

    return (
        <div className="table-filter-option all-products-table-header">
            <div className="row g-3">
                <div className="col-xl-10 col-10 col-xs-12">
                    <div className="row g-3">
                        <div className="col">
                            <Form.Select 
                                className="form-control form-control-sm"
                                value={selectedCategory}
                                onChange={handleCategoryChange}
                            >
                                <option value="0">All Category</option>
                                {categories.map((category, index) => (
                                    <option key={index} value={category}>{category}</option>
                                ))}
                            </Form.Select>
                        </div>
                        <div className="col">
                            <Form.Select 
                                className="form-control form-control-sm"
                                value={selectedStock}
                                onChange={handleStockChange}
                            >
                                <option value="0">All Product Stock</option>
                                <option value="1">In stock</option>
                                <option value="2">Out of stock</option>
                                <option value="3">On backorder</option>
                            </Form.Select>
                        </div>
                        <div className="col">
                            <button className="btn btn-sm btn-primary" onClick={applyFilters}>
                                <i className="fa-light fa-filter"></i> Filter
                            </button>
                            <button className="btn btn-sm btn-secondary ml-2" onClick={resetFilters}>
                                Reset
                            </button>
                        </div>
                    </div>
                </div>
                <div className="col-xl-2 col-2 col-xs-12 d-flex justify-content-end align-items-center">
                    <div id="productTableLength">
                        {/* <SelectFilter/> */}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default AllProductTableFilter