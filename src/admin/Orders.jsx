import React, { useState, useEffect } from 'react'
import Helmet from '../components/Helmet/Helmet'
import { Container, Col, Row, Form, FormGroup } from 'reactstrap'
import { Link } from 'react-router-dom'
import { createUserWithEmailAndPassword, updateProfile, getAuth, onAuthStateChanged } from "firebase/auth";
import { auth } from '../firebase.config';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { storage } from '../firebase.config';
import { toast } from 'react-toastify'
import { db } from '../firebase.config';

import { setDoc, doc, updateDoc, collection, onSnapshot, getDocs, query } from 'firebase/firestore';
import '../styles/myorders.css'
import { async } from '@firebase/util';
import { useNavigate } from 'react-router-dom';
import { motion } from "framer-motion";
import useGetDataNew from "../custom-hooks/useGetDataNew";
import useAuth from "../custom-hooks/useAuth"

const Orders = () => {

    const [ordersData, setOrdersData] = useState([]);
    const [loading, setLoading] = useState(false);
    const { currentUser } = useAuth()
    // const collectionRef = doc(db, 'orders', currentUser.uid)
    // const { data: products, loading } = useGetDataNew(collectionRef);


    useEffect(() => {

        const getData = async () => {

            setLoading(true)

            try {


                const snapShot = await getDocs(collection(db, 'neworder'));
                setOrdersData(snapShot.docs.map(doc => ({ ...doc.data(), id: doc.id })));

            } catch (error) {
                console.log(error)
            }
            setLoading(false)

        }
        getData();

    }, [])

    return (<Helmet title='Signup'>
        <section>{
            loading ? <Col lg='12' className='text-center' ><h5 className='fw-bold'>Loading Orders</h5></Col> :
                <Container>
                    <table className='table border'>
                        <thead>
                            <tr>
                                <th>Order Id</th>
                                <th>Customer Name</th>
                                <th>Price</th>
                                <th>Qty</th>
                                <th>Warranty Status</th>
                            </tr>
                        </thead>

                        <tbody>
                            {
                                ordersData.map((item, index) => (
                                    <Tr outer_item={item} key={index} />
                                ))
                            }
                        </tbody>
                    </table>

                </Container>}
        </section>
    </Helmet>
    )
};

const Tr = ({ outer_item }) => {

    const [outerItemOrdersData, setOuterItemOrdersData] = useState([])

    useEffect(() => {

        const getData = async () => {
            try {
                const snapShot = await getDocs(collection(db, 'neworder', outer_item.id, "myorders"));
                setOuterItemOrdersData(snapShot.docs.map(doc => ({ ...doc.data(), id: doc.id })));
                console.log(outerItemOrdersData);
            } catch (error) {
                console.log(error)
            }


        }
        getData();

    }, [])


    return (<>

        <tr>
            <td>{outer_item.id}</td>
            <td>{outer_item.name}</td>
        </tr>
    </>
    );
};

const Trr = ({ item }) => {
    return (<tr>
        <td>
            <img src={item.imgUrl} alt="" />
        </td>
        <td>{item.productName}</td>
        <td>${item.price}</td>
        <td>{item.quantity}px</td>
        <td>
            <motion.i
                whileTap={{ scale: 1.2 }}
                className="ri-delete-bin-5-line"
            ></motion.i>{" "}
        </td>

    </tr>)
}


export default Orders;