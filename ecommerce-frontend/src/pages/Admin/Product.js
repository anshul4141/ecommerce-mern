import React, { useState, useEffect } from "react";
import AdminMenu from "../../components/Layout/AdminMenu";
import Layout from "./../../components/Layout/Layout";
import axios from "axios";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";

const Products = () => {
  const [products, setProducts] = useState([]);

  // get all products
  const getAllProducts = async () => {
    try {
      const { data } = await axios.get(`${process.env.REACT_APP_API}/api/product/get-product`);
      setProducts(data.products);
    } catch (error) {
      console.log(error);
      toast.error("Something Went Wrong");
    }
  };

  // lifecycle method
  useEffect(() => {
    getAllProducts();
  }, []);

  return (
    <Layout>
      <div className="row dashboard">
        <div className="col-md-3">
          <AdminMenu />
        </div>
        <div className="col-md-9">
          <h1 className="text-center">All Products List</h1>
          <div className="d-flex flex-wrap" style={styles.cardContainer}>
            {products?.map((p) => (
              <Link
                key={p._id}
                to={`/dashboard/admin/product/${p.slug}`}
                className="product-link"
                style={styles.cardLink}
              >
                <div className="card" style={styles.card}>
                  <img
                    src={`${process.env.REACT_APP_API}/api/product/product-photo/${p._id}`}
                    className="card-img-top"
                    alt={p.name}
                    style={styles.cardImage} // Adjust image size
                  />
                  <div className="card-body">
                    <h5 className="card-title">{p.name}</h5>
                    <p className="card-text">{p.description.substring(0, 60)}...</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
};

// Internal CSS styles
const styles = {
  cardContainer: {
    justifyContent: 'space-between',
  },
  cardLink: {
    flex: '1 0 calc(25% - 1rem)', // Adjust to 4 cards per row with space
    margin: '0.5rem', // Margin around each card
    textDecoration: 'none', // Remove underline from link
  },
  card: {
    height: '300px', // Fixed height for uniformity
    width: '100%', // Full width of the card link
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between', // Space between elements in the card
  },
  cardImage: {
    height: '150px', // Set a fixed height for images
    width: '100%', // Ensure the image covers the full width of the card
    objectFit: 'contain', // Adjust this to contain to prevent cutting
  },
};

export default Products;