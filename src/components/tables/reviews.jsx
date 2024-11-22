import { OverlayScrollbarsComponent } from 'overlayscrollbars-react';
import React, { useEffect, useState } from 'react';
import { fetchReviews, URL,deleteReview } from '../../Helper/handle-api';
import "./style.css"

const Review = () => {
  const [allReview, setAllReview] = useState([]);
  const [expandedReviews, setExpandedReviews] = useState({});

  useEffect(() => {
    fetchReviews().then((res) => {
      setAllReview(res);
    });
  }, []);

  const toggleExpand = (id) => {
    setExpandedReviews((prev) => ({
      ...prev,
      [id]: !prev[id], // Toggle the expand state for the given review ID
    }));
  };

  const renderReviewText = (text, id) => {
    const isExpanded = expandedReviews[id];
    const maxLength = 30;
  
    if (isExpanded || text.length <= maxLength) {
      return (
        <div>
          {text.split('\n').map((line, index) => (
            <p key={index}>{line}</p> // Display each line in a separate paragraph
          ))}
          {text.length > maxLength && (
            <span
              className="read-more"
              onClick={() => toggleExpand(id)}
              style={{ color: 'blue', cursor: 'pointer' }}
            >
              Show Less
            </span>
          )}
        </div>
      );
    } else {
      return (
        <p>
          {text.substring(0, maxLength)}...
          <span
            className="read-more"
            onClick={() => toggleExpand(id)}
            style={{ color: 'blue', cursor: 'pointer' }}
          >
            Read More
          </span>
        </p>
      );
    }
  };
  

  return (
    <div className="col-12">
      <div className="card">
        <div className="card-header">Customized Data Table</div>
        <div className="card-body">
          <OverlayScrollbarsComponent>
            <table
              className="table table-dashed table-hover digi-dataTable all-product-table table-striped"
              id="allProductTable"
            >
              <thead>
                <tr>
                  <th>Image</th>
                  <th>Review</th>
                  <th>Rating</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {allReview.map((data) => (
                  <tr key={data._id}>
                    <td>
                      <td>
                        <div className="table-product-card">
                          <div className="part-img">
                            {data.image ? (
                              <img
                                src={`${URL}/images/${data.image}`}
                                alt="Product"
                                style={{
                                  width: "50px",
                                  height: "50px",
                                  borderRadius: "5px",
                                }}
                              />
                            ) : null}
                          </div>
                        </div>
                      </td>
                    </td>
                    <td>{renderReviewText(data.review, data._id)}</td>
                    <td>
                      <div className="rating">
                        {Array.from({ length: 5 }, (_, index) => (
                          <i
                            key={index}
                            className={`fa-solid fa-star ${
                              index < data.rating ? "starred" : ""
                            }`}
                          />
                        ))}
                      </div>
                    </td>
                    <td>
                      <div className="btn-box">
                        <button className="btn btn-danger btn-sm" onClick={()=>deleteReview(data._id)}>
                          <i className="fa-light fa-trash"></i>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </OverlayScrollbarsComponent>
        </div>
      </div>
    </div>
  );
};

export default Review;
