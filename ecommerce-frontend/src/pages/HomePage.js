import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Checkbox, Radio } from "antd";
import { Prices } from "../components/Prices";
import axios from "axios";
import toast from "react-hot-toast";
import Layout from "./../components/Layout/Layout";
import { AiOutlineReload } from "react-icons/ai";
import "../styles/Homepage.css";
import { useCart } from "../context/cart";

const HomePage = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [checked, setChecked] = useState([]);
  const [radio, setRadio] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [cart, setCart] = useCart();

  // Internal CSS for styling the filters and card images
  const cardImageStyle = {
    height: "200px",
    objectFit: "contain",
    backgroundColor: "#f8f8f8",
    padding: "10px",
  };

  const filterSectionStyle = {
    border: "1px solid #ddd",
    borderRadius: "5px",
    padding: "15px",
    background: "linear-gradient(to bottom, #333, #000)",
    marginBottom: "15px",
    minHeight: "200px",
    textAlign: "left",
    width: "90%",
    color: "#fff",
  };

  const filterHeaderStyle = {
    fontSize: "18px",
    fontWeight: "bold",
    textAlign: "left",
    marginBottom: "10px",
  };

  const checkboxContainerStyle = {
    display: "flex",
    alignItems: "center",
    marginLeft: "0",
  };

  // Get all categories
  const getAllCategory = async () => {
    try {
      const { data } = await axios.get(
        `${process.env.REACT_APP_API}/api/category/get-categories`
      );
      if (data?.success) {
        setCategories(data?.category);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getAllCategory();
    getTotal();
  }, []);

  // Get products
  const getAllProducts = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(
        `${process.env.REACT_APP_API}/api/product/product-list/${page}`
      );
      setLoading(false);
      setProducts(data.products);
    } catch (error) {
      setLoading(false);
      console.log(error);
    }
  };

  // Get total count
  const getTotal = async () => {
    try {
      const { data } = await axios.get(
        `${process.env.REACT_APP_API}/api/product/product-count`
      );
      setTotal(data?.total);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (page === 1) return;
    loadMore();
  }, [page]);

  // Load more
  const loadMore = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(
        `${process.env.REACT_APP_API}/api/product/product-list/${page}`
      );
      setLoading(false);
      setProducts([...products, ...data?.products]);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  // Filter by category
  const handleFilter = (value, id) => {
    let all = [...checked];
    if (value) {
      all.push(id);
    } else {
      all = all.filter((c) => c !== id);
    }
    setChecked(all);
  };

  useEffect(() => {
    if (!checked.length || !radio.length) getAllProducts();
  }, [checked.length, radio.length]);

  useEffect(() => {
    if (checked.length || radio.length) filterProduct();
  }, [checked, radio]);

  // Get filtered products
  const filterProduct = async () => {
    try {
      const { data } = await axios.post(
        `${process.env.REACT_APP_API}/api/product/product-filters`,
        {
          checked,
          radio,
        }
      );
      setProducts(data?.products);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Layout title={"All Products - Best offers "}>
      <img src="/images/banner.png" className="banner-img" alt="bannerimage" width={"100%"} />
      <div className="container-fluid row mt-3 home-page">
        <div className="col-md-3">
          <div style={filterSectionStyle}>
            <h4 style={filterHeaderStyle}>Filter By Price</h4>
            <div className="d-flex flex-column">
              <Radio.Group onChange={(e) => setRadio(e.target.value)}>
                {Prices?.map((p) => (
                  <div key={p._id}>
                    <Radio value={p.array}><span style={{ color: "#fff" }}>{p.name}</span></Radio>
                  </div>
                ))}
              </Radio.Group>
            </div>

            <div style={filterSectionStyle}>
              <h4 style={filterHeaderStyle}>Filter By Category</h4>
              <div className="d-flex flex-column">
                {categories?.map((c) => (
                  <div style={checkboxContainerStyle} key={c._id}>
                    <Checkbox onChange={(e) => handleFilter(e.target.checked, c._id)}>
                      <span style={{ color: "#fff" }}>{c.name}</span>
                    </Checkbox>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="d-flex flex-column" style={{ textAlign: "center" }}>
            <button className="btn btn-danger" onClick={() => window.location.reload()}>
              RESET FILTERS
            </button>
          </div>
        </div>

        <div className="col-md-9">
          <h1 className="text-center">All Products</h1>
          <div className="d-flex flex-wrap">
            {products?.map((p) => (
              <div className="card m-2" key={p._id}>
                <img
                  src={`${process.env.REACT_APP_API}/api/product/product-photo/${p._id}`}
                  className="card-img-top"
                  alt={p.name}
                  style={cardImageStyle}
                />
                <div className="card-body">
                  <div className="card-name-price">
                    <h6 className="card-title">{p.name.substring(0, 15)}...</h6>
                    <span className="card-title">
                      <span className="a-price-symbol">₹</span>
                      <span className="a-price-whole">{p.price}</span>
                    </span>
                  </div>
                  <p className="card-text">{p.description.substring(0, 20)}...</p>
                  <div className="card-name-price">
                    <button className="btn btn-primary ms-1" onClick={() => navigate(`/product/${p.slug}`)}>
                      More Details
                    </button>
                    <button
                      className="btn btn-secondary ms-1"
                      onClick={() => {
                        setCart([...cart, p]);
                        localStorage.setItem("cart", JSON.stringify([...cart, p]));
                        toast.success("Item Added to cart");
                      }}
                    >
                      Add To Cart
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="m-2 p-3">
            {products && products.length < total && (
              <button
                className="btn loadmore"
                onClick={(e) => {
                  e.preventDefault();
                  setPage(page + 1);
                }}
              >
                {loading ? "Loading ..." : <>Load more <AiOutlineReload /></>}
              </button>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default HomePage;