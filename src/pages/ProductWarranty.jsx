import React, { useState, useRef, useEffect } from "react";
import { Container, Row, Col } from "reactstrap";
import { useParams } from "react-router-dom";
import Helmet from "../components/Helmet/Helmet";
import CommonSection from "../components/UI/CommonSection";
import "../styles/product-details.css";
import { motion } from "framer-motion";
import ProductsList from "../components/UI/ProductsList";
import { useDispatch } from "react-redux";
import { cartActions } from "../redux/slices/cartSlice";
import { toast } from "react-toastify";
import useGetData from "../custom-hooks/useGetData";
import cam1 from '../assets/images/cam1.jpeg';

import { db } from "../firebase.config";
import { doc, getDoc } from "firebase/firestore";

const ProductWarranty= () => {

    return(
        <Helmet title="Product Warranty">
            <CommonSection title="Product Warratny" />
            <section className="pt-0>">
                <Container>
                    <Row>
                        <Col lg='6'>
                        <img src={cam1} alt="" />
                        </Col>

                        <Col lg='6'>
                        <div className="product__details">
                        <h2>Sony Camera</h2>
                        
                        <div className="d-flex align-items-center gap-5 mb-3">
                        <span className="product__price"><br/>Price: ₹1299</span>
                        <span><br/>Category: camera</span>
                        </div>
                            <h5>Warranty period:  1 Year</h5>
                        </div>
                        <table><br/>
                            <tr>Product id: (id from firebase)</tr>
                            <br/>
                            <tr><td> Issued date: 12/03/2023</td>
                            </tr><br/>
                            <tr><td>Expiary date: 12/03/2024</td></tr>
                            <tr></tr>
                        </table>
                        
                        </Col>
                    </Row>
                </Container>
            </section>
            

        </Helmet>

    );
};

export default ProductWarranty;
