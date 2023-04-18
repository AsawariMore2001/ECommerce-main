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

const MyOrders = () => {

    const [ordersData, setOrdersData] = useState([]);
    const [loading, setLoading] = useState(false);
    const { currentUser } = useAuth()
    // const collectionRef = doc(db, 'orders', currentUser.uid)
    // const { data: products, loading } = useGetDataNew(collectionRef);
    const handleClick = async () => {
        // console.log("clicked");
        // const snapShot = await getDocs(collection(db, 'neworder', currentUser.uid, "myorders"));
        // snapShot.forEach((doc) => {
        //     console.log(doc.data());
        // })
        console.log(ordersData);

    }

    useEffect(() => {



        const getData = async (uid) => {

            // await onSnapshot(collection(db, 'orders', currentUser.uid, "myorders"), (snapshot) => {
            //     setOrdersData(snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id })))
            // })
            setLoading(true)
            const auth = getAuth();

            try {

                const snapShot = await getDocs(collection(db, 'neworder', auth.currentUser.uid, "myorders"));
                // setOrdersData([]);
                // const temp = []
                // snapShot.forEach((doc) => {
                //     temp.push({ ...doc.data(), id: doc.id });

                // })
                // setOrdersData(temp);
                setOrdersData(snapShot.docs.map(doc => ({ ...doc.data(), id: doc.id })));

            } catch (error) {
                console.log(error)
            }



            // console.log(currentUser.uid)
            // const snapShot = await getDocs(collection(db, 'neworder', currentUser.uid, "myorders"));
            // setOrdersData(snapShot.docs.map(doc=>({...doc.data(),id:doc.id})));


            setLoading(false)

            // setOrdersData(querySnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id })))
        }
        getData();

    }, [])

    return (<Helmet title='Signup'>
        <section>{
            loading ? <Col lg='12' className='text-center' ><h5 className='fw-bold'>Processing Order</h5></Col> :
                <Container>
                    <button onClick={handleClick}> check </button>
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

    return (<>

        {
            outer_item.Items.map((item1, index) => {
               return <Trr item={item1} key={index} />
            })
        }
        <tr>
            <td>TotalQuantity: {outer_item.TotalQuantity}</td>
            <td>TotalAmount: {outer_item.TotalAmount}</td>

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


export default MyOrders;