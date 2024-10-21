import React, { useState, useEffect } from "react";
import Layout from "./../components/Layout/Layout";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { useCart } from "../context/cart";
import toast from "react-hot-toast";

const ProductDetails = () => {
  const params = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState({});
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [cart, setCart] = useCart();

  useEffect(() => {
    if (params?.slug) getProduct();
  }, [params?.slug]);

  const getProduct = async () => {
    try {
      const { data } = await axios.get(
        `${process.env.REACT_APP_API}/api/product/get-product/${params.slug}`
      );
      setProduct(data?.product);
      getSimilarProduct(data?.product._id, data?.product.category._id);
    } catch (error) {
      console.log(error);
    }
  };

  const getSimilarProduct = async (pid, cid) => {
    try {
      const { data } = await axios.get(
        `${process.env.REACT_APP_API}/api/product/related-product/${pid}/${cid}`
      );
      setRelatedProducts(data?.products);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Layout>
      <div className="row container product-details" style={{ marginTop: "120px" }}>
        <div className="col-md-6" style={{ display: "flex", justifyContent: "center" }}>
          <img
            src={`${process.env.REACT_APP_API}/api/product/product-photo/${product._id}`}
            className="img-fluid"
            alt={product.name}
            style={{
              maxHeight: "350px",
              maxWidth: "100%",
              objectFit: "contain",
              border: "1px solid #ddd",
              borderRadius: "8px",
              padding: "10px",
              backgroundColor: "#f8f8f8",
            }}
          />
        </div>
        <div className="col-md-6 product-details-info" style={{ padding: "20px" }}>
          <h1 className="text-center">Product Details</h1>
          <hr />
          <h6>Name: {product.name}</h6>
          <h6>Description: {product.description}</h6>
          <h6>
            Price:{" "}
            {product?.price?.toLocaleString("en-IN", {
              style: "currency",
              currency: "INR",
            })}
          </h6>
          <h6>Category: {product?.category?.name}</h6>
          <button
            className="btn btn-secondary mt-3"
            onClick={() => {
              setCart([...cart, product]);
              localStorage.setItem("cart", JSON.stringify([...cart, product]));
              toast.success("Item Added to cart");
            }}
          >
            Add To Cart
          </button>
        </div>
      </div>
      <hr />
      <div className="row container similar-products" style={{ marginTop: "40px" }}>
        <h4>Similar Products ➡️</h4>
        {relatedProducts.length < 1 && <p className="text-center">No Similar Products found</p>}
        <div className="d-flex flex-wrap justify-content-center">
          {relatedProducts?.map((p) => (
            <div
              className="card m-2"
              key={p._id}
              style={{
                width: "16rem",
                border: "none",
                boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                transition: "transform 0.3s ease, box-shadow 0.3s ease",
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.transform = "scale(1.05)";
                e.currentTarget.style.boxShadow = "0 8px 16px rgba(0, 0, 0, 0.2)";
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.transform = "scale(1)";
                e.currentTarget.style.boxShadow = "0 4px 8px rgba(0, 0, 0, 0.1)";
              }}
            >
              <img
                src={`${process.env.REACT_APP_API}/api/product/product-photo/${p._id}`}
                className="card-img-top"
                alt={p.name}
                style={{
                  height: "180px",
                  width: "100%",
                  objectFit: "contain", // Ensures the image is not cut off
                  borderTopLeftRadius: "5px",
                  borderTopRightRadius: "5px",
                  backgroundColor: "#f8f8f8", // Added background color
                }}
              />
              <div className="card-body">
                <div className="card-name-price">
                  <h5 className="card-title">{p.name}</h5>
                  <h5 className="card-title card-price">
                    {p.price.toLocaleString("en-IN", {
                      style: "currency",
                      currency: "INR",
                    })}
                  </h5>
                </div>
                <p className="card-text">{p.description.substring(0, 60)}...</p>
                <button
                  className="btn btn-info mt-2"
                  onClick={() => navigate(`/product/${p.slug}`)}
                >
                  More Details
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Layout>
  );
};

export default ProductDetails;