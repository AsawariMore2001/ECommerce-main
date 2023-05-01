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

    const [ordersData, setOrdersData] = useState({});
    const [loading, setLoading] = useState(false);
    const { currentUser } = useAuth()
    // const collectionRef = doc(db, 'orders', currentUser.uid)
    // const { data: products, loading } = useGetDataNew(collectionRef);
    const checkData = () => {
        console.log(ordersData);
    }

    const updateStatus = (id, data, isProcessing, isApproved) => {
        // setOrdersData((prev) => {
        //     return { ...prev, [newDoc.id]: { ...newDoc.data(), "doc_id": doc.id, "customer_name": doc.data().name, "processing": false } };
        // })
        setOrdersData((prev) => {
            return { ...prev, [id]: { ...data, "processing": isProcessing, "OrderStatus": isApproved } };
        })


    }
    useEffect(() => {

        const getData = async () => {

            setLoading(true)

            try {


                const snapShot = await getDocs(collection(db, 'neworder'));
                // setOrdersData(snapShot.docs.map(doc => ({ ...doc.data(), id: doc.id })));
                snapShot.docs.forEach(async (doc) => {
                    // console.log(doc.id);
                    const snapShot1 = await getDocs(collection(db, 'neworder', doc.id, "myorders"));
                    snapShot1.docs.forEach((newDoc) => {
                        // console.log(doc.id, doc.data().name, newDoc.data(),);
                        setOrdersData((prev) => {
                            return { ...prev, [newDoc.id]: { ...newDoc.data(), "doc_id": doc.id, "customer_name": doc.data().name, "processing": false } };
                        })
                    })
                    // setOrdersData(snapShot1.docs.map(newDoc => ({ ...newDoc.data(), id: newDoc.id })));
                })
                // setOrdersData(snapShot.docs.map(async doc => {
                //     const snapShot1 = await getDocs(collection(db, 'neworder', doc.id, "myorders"));
                //     return { data: snapShot1.docs.map(newDoc => ({ ...newDoc.data(), id: newDoc.id })), id: doc.id };

                // }))

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
                    <button onClick={checkData}> check</button>
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
                                Object.entries(ordersData).map(([key, value]) => (
                                    <Tr outer_item={key} data={value} key={key} updateStatus={updateStatus} />
                                ))

                            }

                        </tbody>
                    </table>

                </Container>}
        </section>
    </Helmet>
    )
};

const Tr = ({ outer_item, data, updateStatus }) => {

    // const [outerItemOrdersData, setOuterItemOrdersData] = useState([])

    // useEffect(() => {

    //     const getData = async () => {
    //         try {
    //             const snapShot = await getDocs(collection(db, 'neworder', outer_item.id, "myorders"));
    //             setOuterItemOrdersData(snapShot.docs.map(doc => ({ ...doc.data(), id: doc.id })));
    //             console.log(outerItemOrdersData);
    //         } catch (error) {
    //             console.log(error)
    //         }


    //     }
    //     getData();

    // }, [])
    const viewNFT = () => {
        alert("view nft!");
    }

    const mintNFT = async (id, data) => {

        if (data.OrderStatus === "Pending") {

            updateStatus(outer_item, data, true, false);

            const orderRef = doc(db, 'neworder', data.doc_id, "myorders", id)
            await updateDoc(orderRef, {
                OrderStatus: "Approved"
            });

            updateStatus(outer_item, data, false, true);

        }
        else if (data.OrderStatus === "Approved") {

            viewNFT();
        }
    }


    return (<>


        {
            data.processing ? <tr><td>Processing ...</td></tr> :
                <tr>
                    <td>{outer_item}</td>
                    <td>{data.customer_name}</td>
                    <td>{data.TotalAmount}</td>
                    <td>{data.TotalQuantity}</td>
                    <td><button onClick={() => { mintNFT(outer_item, data) }}>{data.OrderStatus == "Approved" ? "View NFT" : "Mint NFT"}</button></td>
                </tr>
        }





    </>
    );
};

// const Trr = ({ item }) => {
//     return (<tr>
//         <td>
//             <img src={item.imgUrl} alt="" />
//         </td>
//         <td>{item.productName}</td>
//         <td>${item.price}</td>
//         <td>{item.quantity}px</td>
//         <td>
//             <motion.i
//                 whileTap={{ scale: 1.2 }}
//                 className="ri-delete-bin-5-line"
//             ></motion.i>{" "}
//         </td>

//     </tr>)
// }


export default Orders;