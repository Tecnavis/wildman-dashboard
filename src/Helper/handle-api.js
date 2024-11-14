import axios from "axios";
import Swal from "sweetalert2";

// export const  URL = `${process.env.BASE_URL}`;
// export const  URL = `http://localhost:3000`;
export const  URL = `https://api.wildman.tecnavis.com`;
//delete customerorder
export const deleteCustomerOrder = async (id) => {
  const result = await Swal.fire({
    title: "Are you sure?",
    text: "You won't be able to revert this!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Yes, delete it!",
  });

  if (result.isConfirmed) {
    try {
      const response = await axios.delete(`${URL}/customerorder/${id}`);
      Swal.fire("Deleted!", "Your Order has been deleted.", "success");
      return response.data; 
    } catch (error) {
      Swal.fire("Error!", "There was a problem deleting the Order.", "error");
      console.error("Error deleting order:", error);
    }
  } 
};
//fetch all customerorder
export const fetchCustomerOrder = async () => {
  const response = await axios.get(`${URL}/customerorder`);
  return response.data;
}
//delete notification
export const deleteNotification = async (id) => {
    try {
      const response = await axios.delete(`${URL}/notification/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting notification:', error);
      throw error;
    }
  };

//fetch all notifications
export const fetchNotifications = async () => {
  const response = await axios.get(`${URL}/notification`);
  return response.data;
};

// Function to update delivery status and delivery date
export const updateDeliveryStatus = async (orderId, data) => {
    try {
      const response = await axios.put(`${URL}/notification/orders/${orderId}`, data);
      return response.data;
    } catch (error) {
      console.error("Error updating delivery status:", error);
      return { success: false, error: error.message };
    }
  };
//update banner
export const updateBanner = async (id, banner) => {
    const response = await axios.put(`${URL}/banner/${id}`, banner);
    return response.data;
}

//delete banner
export const deleteBanner = async (id) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    });
  
    if (result.isConfirmed) {
      try {
        const response = await axios.delete(`${URL}/banner/${id}`);
        Swal.fire("Deleted!", "Your banner has been deleted.", "success");
        return response.data; 
      } catch (error) {
        Swal.fire("Error!", "There was a problem deleting the banner.", "error");
        console.error("Error deleting banner:", error);
      }
    } 
  };
//fetch all banner
export const fetchBanner = async () => {
    const response = await axios.get(`${URL}/banner`);
    return response.data;
}
//fetch selesorder by id
export const fetchSalesOrderById = async (id) => {
    const response = await axios.get(`${URL}/salesorder/${id}`);
    return response.data;
}

//delete salesorder
export const deleteSalesOrder = async (id) => {
    const response = await axios.delete(`${URL}/salesorder/${id}`);
    return response.data;
}

//update sales order
export const updateSalesOrder = async (id, updatedOrder) => {
    try {
        const response = await axios.put(`${URL}/salesorder/${id}`, updatedOrder);
      return response.data;
    } catch (error) {
      if (error.response) {
        throw new Error(error.response.data.message || 'Server error occurred');
      } else if (error.request) {
        throw new Error('No response received from server');
      } else {
        throw new Error('Error setting up the request');
      }
    }
  };
//update purchae
export const updatePurchase = async (id, purchase) => {
    const response = await axios.put(`${URL}/purchase/${id}`, purchase);
    return response.data;
}

//edit purchase
export const editPurchase = async (id, purchase) => {
    const response = await axios.put(`${URL}/purchase/${id}`, purchase);
    return response.data;
}

//delete purchase
export const deletePurchase = async (id) => {
    const response = await axios.delete(`${URL}/purchase/${id}`);
    return response.data;
}

//fetch all purchase
export const fetchPurchase = async () => {
    const response = await axios.get(`${URL}/purchase`);
    return response.data;
}
//create customer
export const createCustomer = async (customer) => {
    const response = await axios.post(`${URL}/customer`, customer);
    return response.data;
}

//fetch all customers
export const fetchCustomers = async () => {
    const response = await axios.get(`${URL}/customer`);
    return response.data;
}
//fetch all salesOrders
export const fetchSalesOrders = async () => {
    const response = await axios.get(`${URL}/salesorder`);
    return response.data;
}
//fetch product by id

export const fetchProductById = async (id) => {
    const response = await axios.get(`${URL}/product/${id}`);
    return response.data;
}

//add to shopping bag
export const addToShoppingBag = async (productId, size, stock) => {
    const token = localStorage.getItem('Authorization'); 
    const response = await fetch(`${URL}/shopping`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`, 
      },
      body: JSON.stringify({
        productId,
        size,
        stock,
        quantity: 1, 
      }),
    });
    return response.json();
  };
  
//create supplier
export const createSupplier = async (supplier) => {
    const response = await axios.post(`${URL}/supplier`, supplier);
    return response.data;
}

//fetch all suppliers
export const fetchSuppliers = async () => {
    const response = await axios.get(`${URL}/supplier`);
    return response.data;
}

//delete supplier
export const deleteSupplier = async (id) => {
    const response = await axios.delete(`${URL}/supplier/${id}`);
    return response.data;
}
//update supplier
export const updateSupplier = async (id, supplier) => {
    const response = await axios.put(`${URL}/supplier/${id}`, supplier);
    return response.data;
}


//delete warehouse
export const deleteWarehouse = async (id) => {
    const response = await axios.delete(`${URL}/warehouse/${id}`);
    return response.data;
}
//update warehouse
export const updateWarehouse = async (id, warehouse) => {
    const response = await axios.put(`${URL}/warehouse/${id}`, warehouse);
    return response.data;
}

//fetch all warehouses
export const fetchWarehouses = async () => {
    const response = await axios.get(`${URL}/warehouse`);
    return response.data;
}

//create warehouse
export const createWarehouse = async (warehouse) => {
    const response = await axios.post(`${URL}/warehouse`, warehouse);
    return response.data;
};

//fetch all products
export const fetchProducts = async () => {
    const response = await axios.get(`${URL}/product`);
    return response.data;
}
//fetch all admins
export const fetchAdmins = async () => {
    const response = await axios.get(`${URL}/admin`);
    return response.data;
}
//login admin
export const loginAdmin = async (admin) => {
    const response = await axios.post(`${URL}/admin/login`, admin);
    return response.data;
};

//signup admin
export const signupAdmin = async (admin) => {
    const response = await axios.post(`${URL}/admin`, admin);
    return response.data;
};

//create main category
export const createMainCategory = async (category) => {
    const response = await axios.post(`${URL}/category`, category);
    return response.data;
};

//fetch main category
export const fetchMainCategory = async () => {
    const response = await axios.get(`${URL}/category`);
    return response.data;
}

//fetch sub category
export const fetchSubCategory = async () => {
    const response = await axios.get(`${URL}/subcategory`);
    return response.data;
}

//create sub category
export const createSubCategory = async (category) => {
    const response = await axios.post(`${URL}/subcategory`, category);
    return response.data;
};

export const filterSubCategory = async (mainCategoryId) => {
    const response = await axios.get(`${URL}/subcategory/subcategory?category=${mainCategoryId}`);
    return response.data;
}