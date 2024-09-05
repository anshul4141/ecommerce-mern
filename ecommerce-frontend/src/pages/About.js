import React from "react";
import Layout from "./../components/Layout/Layout";

const About = () => {
    return (
        <Layout title={"About us - Ecommer app"}>
            <div className="row contactus ">
                <div className="col-md-6 ">
                    <img
                        src="/images/about.jpeg"
                        alt="contactus"
                        style={{ width: "100%" }}
                    />
                </div>
                <div className="col-md-4">
                    <p className="text-justify mt-2">
                        Our eCommerce app offers a seamless shopping experience, allowing customers to browse and purchase a wide range of products with ease. Featuring a user-friendly interface, secure payment options, and fast delivery services, our app ensures convenience and satisfaction for every shopper. Whether you're searching for electronics, fashion, home essentials, or unique gifts, our app provides detailed product descriptions, reviews, and personalized recommendations to help you make informed choices. With 24/7 customer support and regular deals, shopping has never been more accessible and rewarding. Download now and transform the way you shop online!
                    </p>
                </div>
            </div>
        </Layout>
    );
};

export default About;
