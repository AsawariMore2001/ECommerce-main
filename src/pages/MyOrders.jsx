import React, { useState } from 'react'
import Helmet from '../components/Helmet/Helmet'
import { Container, Col, Row, Form, FormGroup } from 'reactstrap'
import { Link } from 'react-router-dom'
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth } from '../firebase.config';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { storage } from '../firebase.config';
import { toast } from 'react-toastify'
import { db } from '../firebase.config';

import { setDoc, doc, updateDoc } from 'firebase/firestore';
import '../styles/myorders.css'
import { async } from '@firebase/util';
import { useNavigate } from 'react-router-dom';
import { motion } from "framer-motion";


const MyOrders = () => {

    return (<Helmet title='Signup'>
        <section>
            <Container>
                <table className='table border'>
                    <thead>
                        <tr>
                            <th>Image</th>
                            <th>Product Name</th>
                            <th>Price</th>
                            <th>Qty</th>
                            <th>Warranty</th>
                        </tr>
                    </thead>

                    <tbody>
                        <tr>
                            <td>
                                {/* <img src={item.imgUrl} alt="" /> */}
                            </td>
                            <td>product name</td>
                            <td>price</td>
                            <td>quantity</td>
                            <td>
                                <motion.i
                                    whileTap={{ scale: 1.2 }}
                                    className="ri-delete-bin-5-line"
                                ></motion.i>{" "}
                            </td>
                        </tr><tr>
                            <td>
                                {/* <img src={item.imgUrl} alt="" /> */}
                            </td>
                            <td>product name</td>
                            <td>price</td>
                            <td>quantity</td>
                            <td>
                                <motion.i
                                    whileTap={{ scale: 1.2 }}
                                    className="ri-delete-bin-5-line"
                                ></motion.i>{" "}
                            </td>
                        </tr>
                    </tbody>
                </table>

            </Container>
        </section>
    </Helmet>
    )
};

export default MyOrders;