import React from "react";
import Layout from "./../components/Layout/Layout";
import { useSearch } from "../context/search";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/cart";
import toast from "react-hot-toast";
import { environment } from "../environment.ts";


const Search = () => {
  const [values] = useSearch();
  const navigate = useNavigate();
  const [cart, setCart] = useCart();
  const apiUrl = environment.apiUrl;


  return (
    <Layout title={"Search results"}>
      <div className="container">
        <div className="text-center">
          <h1>Search Results</h1>
          <div className="d-flex flex-wrap mt-4">
            {values?.results.map((p) => (
              <div
                className="card m-2"
                style={{
                  width: "18rem",
                  border: "none",
                  boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
                  transition: "transform 0.3s ease, box-shadow 0.3s ease",
                }}
                key={p._id}
                onMouseOver={(e) => {
                  e.currentTarget.style.transform = "scale(1.05)";
                  e.currentTarget.style.boxShadow = "0 8px 16px rgba(0, 0, 0, 0.3)";
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.transform = "scale(1)";
                  e.currentTarget.style.boxShadow = "0 4px 8px rgba(0, 0, 0, 0.2)";
                }}
              >
                <img
                  src={`${apiUrl}/api/product/product-photo/${p._id}`}
                  className="card-img-top"
                  alt={p.name}
                  style={{
                    height: "200px",
                    objectFit: "contain",
                    padding: "10px",
                    backgroundColor: "#f8f8f8",
                    borderTopLeftRadius: "5px",
                    borderTopRightRadius: "5px",
                  }}
                />
                <div className="card-body">
                  <h5 className="card-title">{p.name}</h5>
                  <p className="card-text">{p.description.substring(0, 30)}...</p>
                  <p className="card-text"> ₹ {p.price}</p>
                  <button
                    className="btn btn-primary ms-1"
                    onClick={() => navigate(`/product/${p.slug}`)}
                  >
                    More Details
                  </button>
                  <button
                    className="btn btn-secondary ms-1"
                    onClick={() => {
                      setCart([...cart, p]);
                      localStorage.setItem("cart", JSON.stringify([...cart, p]));
                      toast.success('Item Added to cart');
                    }}
                  >
                    ADD TO CART
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Search;