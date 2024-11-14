import React, { useState } from 'react';
import axios from 'axios';
import { Button } from 'react-bootstrap';
import { URL } from '../../../Helper/handle-api';
import Swal from 'sweetalert2';

const AttributePane = () => {
  const [attributeFormBtn, setAttributeFormBtn] = useState(false);
  const [attributeType, setAttributeType] = useState('');
  const [attributeValue, setAttributeValue] = useState('');

  const handleAttributeFormBtn = () => {
    setAttributeFormBtn(!attributeFormBtn);
  };

  const handleAttributeSubmit = async () => {
    if (attributeType && attributeValue) {
      try {
        await axios.post(`${URL}/attribute`, {
          type: attributeType,
          value: attributeValue,
        });
        Swal.fire('Success', 'Attribute added successfully', 'success');
        setAttributeValue(''); // Clear input after adding
      } catch (error) {
        console.error(error);
        Swal.fire('Error', 'An error occurred while adding the attribute', 'error');
      }
    } else {
      Swal.fire('Error', 'Attribute type and value are required', 'error');
    }
  };

  return (
    <div className="add-product-attribute">
      <div className="form-group">
        <select 
          className="form-control form-control-sm" 
          value={attributeType} 
          onChange={(e) => setAttributeType(e.target.value)}
        >
          <option value="">Custom Product Attribute</option>
          <option value="color">Color</option>
          <option value="size">Size</option>
          <option value="tag">Tag</option>
        </select>
        <button 
          className="btn btn-sm btn-icon btn-primary" 
          id="addAttr" 
          onClick={handleAttributeFormBtn}
        >
          <i className={`fa-light ${attributeFormBtn ? 'fa-minus' : 'fa-plus'}`}></i>
        </button>
      </div>
      <div className={`form-group rounded border p-3 d-block mt-20 ${attributeFormBtn ? '' : 'd-none'}`}>
        <div className="row g-3">
          <div className="col-md-4">
            <input 
              type="text" 
              className="form-control form-control-sm mb-10" 
              placeholder="Name" 
              value={attributeValue}
              onChange={(e) => setAttributeValue(e.target.value)}
            />
          </div>
          <div className="col-md-8">
            <div className="row g-0 g-lg-3 g-sm-1">
              <div className="col-11 col-xs-10">
                <Button 
                  className="btn btn-sm btn-primary" 
                  style={{ width: '98%', height: '39px' }}
                  onClick={handleAttributeSubmit}
                >
                  Add
                </Button>
              </div>
              <div className="col-1 col-xs-2 d-flex justify-content-end">
                <button className="btn btn-sm btn-icon btn-danger remove-option w-100" onClick={handleAttributeFormBtn}>
                  <i className="fa-light fa-trash-can"></i>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <br/>
    </div>
  );
};

export default AttributePane;
