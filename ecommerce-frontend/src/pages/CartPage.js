import React, { useState } from "react";
import Layout from "./../components/Layout/Layout";
import { useCart } from "../context/cart";
import { useAuth } from "../context/auth";
import { useNavigate } from "react-router-dom";
import GooglePayButton from '@google-pay/button-react';
import axios from "axios";
import toast from "react-hot-toast";
import "../styles/CartStyles.css";
import { environment } from "../environment.ts";

const CartPage = () => {
  const [auth, setAuth] = useAuth();
  const [cart, setCart] = useCart();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const apiUrl = environment.apiUrl;

  // Total price calculation
  const totalPrice = () => {
    try {
      let total = 0;
      cart?.forEach((item) => {
        total += item.price;
      });
      return total.toLocaleString("en-IN", {
        style: "currency",
        currency: "INR",
      });
    } catch (error) {
      console.log(error);
    }
  };

  // Delete item from cart
  const removeCartItem = (pid) => {
    try {
      let myCart = [...cart];
      let index = myCart.findIndex((item) => item._id === pid);
      myCart.splice(index, 1);
      setCart(myCart);
      localStorage.setItem("cart", JSON.stringify(myCart));
    } catch (error) {
      console.log(error);
    }
  };

  // Handle Google Pay success
  const handleGooglePaySuccess = async (paymentData) => {
    try {
      setLoading(true);
      const { paymentMethodData } = paymentData;
      const token = paymentMethodData.tokenizationData.token;
      const { data } = await axios.post(`${apiUrl}/api/product/googlepay/payment`, {
        token,
        cart,
      });
      setLoading(false);
      localStorage.removeItem("cart");
      setCart([]);
      navigate("/dashboard/user/orders");
      toast.success("Payment Completed Successfully");
    } catch (error) {
      console.log(error);
      setLoading(false);
      toast.error("Payment failed.");
    }
  };

  // Handle Razorpay Payment
  const handleRazorpayPayment = async () => {
    try {
      const amount = totalPrice().replace(/[^0-9.-]+/g, ""); // Remove non-numeric characters
      const { data: order } = await axios.post(`${apiUrl}/api/product/razorpay/create-order`, { amount });

      const options = {
        key: 'YOUR_RAZORPAY_KEY_ID',
        amount: order.amount,
        currency: order.currency,
        name: 'Your Store',
        description: 'Thank you for your purchase!',
        order_id: order.id,
        handler: async (response) => {
          const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = response;
          const verificationPayload = {
            order_id: razorpay_order_id,
            payment_id: razorpay_payment_id,
            signature: razorpay_signature,
          };

          // Verify payment with backend
          const verificationResponse = await axios.post(`${apiUrl}/api/product/razorpay/verify`, verificationPayload);

          if (verificationResponse.data.success) {
            localStorage.removeItem("cart");
            setCart([]);
            navigate("/dashboard/user/orders");
            toast.success("Payment completed successfully");
          } else {
            toast.error("Payment verification failed");
          }
        },
        prefill: {
          name: auth.user.name,
          email: auth.user.email,
          contact: auth.user.phone,
        },
        theme: {
          color: '#3399cc',
        },
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (error) {
      console.error("Payment failed", error);
      toast.error("Payment initiation failed");
    }
  };

  return (
    <Layout>
      <div className="cart-page">
        <div className="row">
          <div className="col-md-12">
            <h1 className="text-center bg-light p-2 mb-1">
              {!auth?.user ? "Hello Guest" : `Hello ${auth?.token && auth?.user?.name}`}
              <p className="text-center">
                {cart?.length
                  ? `You have ${cart.length} items in your cart${auth?.token ? "" : ", please login to checkout!"}`
                  : "Your Cart Is Empty"}
              </p>
            </h1>
          </div>
        </div>
        <div className="container">
          <div className="row">
            <div className="col-md-7">
              {cart?.map((p) => (
                <div className="row card flex-row" key={p._id}>
                  <div className="col-md-4">
                    <img
                      src={`http://localhost:5000/api/product/product-photo/${p._id}`}
                      className="card-img-top"
                      alt={p.name}
                      width="100%"
                      height={"130px"}
                    />
                  </div>
                  <div className="col-md-4">
                    <p>{p.name}</p>
                    <p>{p.description.substring(0, 30)}</p>
                    <p>Price: {p.price}</p>
                  </div>
                  <div className="col-md-4 cart-remove-btn">
                    <button
                      className="btn btn-danger"
                      onClick={() => removeCartItem(p._id)}
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>
            <div className="col-md-5 cart-summary">
              <h2>Cart Summary</h2>
              <p>Total | Checkout | Payment</p>
              <hr />
              <h4>Total: {totalPrice()}</h4>

              {auth?.user?.address ? (
                <div className="mb-3">
                  <h4>Current Address</h4>
                  <h5>{auth?.user?.address}</h5>
                  <button
                    className="btn btn-outline-warning"
                    onClick={() => navigate("/dashboard/user/profile")}
                  >
                    Update Address
                  </button>
                </div>
              ) : (
                <div className="mb-3">
                  {auth?.token ? (
                    <button
                      className="btn btn-outline-warning"
                      onClick={() => navigate("/dashboard/user/profile")}
                    >
                      Update Address
                    </button>
                  ) : (
                    <button
                      className="btn btn-outline-warning"
                      onClick={() => navigate("/login", { state: "/cart" })}
                    >
                      Please Login to checkout
                    </button>
                  )}
                </div>
              )}

              {/* Google Pay Integration */}
              {cart?.length && auth?.token && (
                <div className="mt-3">
                  <GooglePayButton
                    environment="TEST"
                    buttonSizeMode="fill"
                    paymentRequest={{
                      apiVersion: 2,
                      apiVersionMinor: 0,
                      allowedPaymentMethods: [{
                        type: 'CARD',
                        parameters: {
                          allowedAuthMethods: ['PAN_ONLY', 'CRYPTOGRAM_3DS'],
                          allowedCardNetworks: ['MASTERCARD', 'VISA'],
                        },
                        tokenizationSpecification: {
                          type: 'PAYMENT_GATEWAY',
                          parameters: {
                            gateway: 'stripe',
                            'stripe:version': '2018-10-31',
                            'stripe:publishableKey': 'your-publishable-key',
                          },
                        },
                      }],
                      merchantInfo: {
                        merchantId: 'YOUR_MERCHANT_ID',
                        merchantName: 'Your Store',
                      },
                      transactionInfo: {
                        totalPriceStatus: 'FINAL',
                        totalPriceLabel: 'Total',
                        totalPrice: totalPrice().replace(/[^0-9.-]+/g, ""),
                        currencyCode: 'INR',
                        countryCode: 'IN',
                      },
                    }}
                    onLoadPaymentData={handleGooglePaySuccess}
                    className="google-pay-button"
                  />
                </div>
              )}

              {/* Razorpay Integration */}
              {cart?.length && auth?.token && (
                <button onClick={handleRazorpayPayment} className="btn btn-primary mt-3">
                  Pay with Razorpay
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default CartPage;