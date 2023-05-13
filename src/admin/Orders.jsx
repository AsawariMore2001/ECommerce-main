import React, { useState, useEffect } from 'react'
import Helmet from '../components/Helmet/Helmet'
import { Container, Col, Row, Form, FormGroup } from 'reactstrap'
import { Link, redirect } from 'react-router-dom'
import { createUserWithEmailAndPassword, updateProfile, getAuth, onAuthStateChanged } from "firebase/auth";
import { auth } from '../firebase.config';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { storage } from '../firebase.config';
import { toast } from 'react-toastify'
import { db } from '../firebase.config';

import { setDoc, doc, updateDoc, collection, onSnapshot, getDocs, getDoc, query, addDoc, arrayUnion } from 'firebase/firestore';
import '../styles/myorders.css'
import { async } from '@firebase/util';
import { useNavigate } from 'react-router-dom';
import { motion } from "framer-motion";
import useGetDataNew from "../custom-hooks/useGetDataNew";
import useAuth from "../custom-hooks/useAuth"
import Marketplace from "../Marketplace.json";
import { uploadJSONToIPFS } from "../pinata"
import "../styles/admin_order.css"


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
            return { ...prev, [id]: { ...data, "processing": isProcessing, "OrderStatus": isApproved ? "Approved" : "Pending" } };
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


    const ethers = require("ethers");
    const [message, updateMessage] = useState("");
    let navigate = useNavigate();

    async function listNFT(ipfsURL) {

        //Upload data to IPFS
        try {
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            const signer = provider.getSigner();

            //Pull the deployed contract instance
            let contract = new ethers.Contract(
                Marketplace.address,
                Marketplace.abi,
                signer
            );

            let add = "0x517CbE9762a4C53e6923B33FdFC7F1Dc2771941f";
            let metadataURL = ipfsURL;

            //actually create the NFT
            let transaction = await contract.createToken(add, metadataURL);
            const res = await transaction.wait();
            // let transaction = await contract.getLatestIdToListedToken();
            let transaction1 = await contract.getCurrentToken();
            // let transaction = await contract.getMyNFTs();

            console.log(transaction1.toString());

            console.log("NFT minted successfully");

            return transaction1.toString();





            // updateMessage("");
        } catch (e) {
            console.log(e);
            alert("Upload error" + e);
        }
    }



    const viewNFT = async (id) => {
        navigate("/ProductWarranty", { state: { id: id } });
    }

    const uploadProductDataToIpfs = async (id, item) => {

        let uploadJson = {};
        let date = new Date();
        uploadJson['timestamp'] = date.toUTCString();
        uploadJson['customer'] = data.customer_name;

        uploadJson = {
            ...uploadJson,
            ...item
        }

        console.log("uploading...", uploadJson);
        const ipfsResponse = await uploadJSONToIPFS(uploadJson);
        if (ipfsResponse.success) {

            return ipfsResponse.pinataURL;
        } else {
            console.log(ipfsResponse.message);

            return null;
        }

    }


    const processOrder = async (id, data) => {

        const docRef = doc(db, "warranty", data.doc_id, id, "NFTs");
        await setDoc(docRef, {
            tokendIds: []
        });


        await data.Items.forEach(async (product) => {

            const ipfsURL = await uploadProductDataToIpfs(id, product);
            // const ipfsURL = "klfajf";
            if (ipfsURL) {

                const tokenId = await listNFT(ipfsURL);
                // const tokenId = 14;
                const docRef = doc(db, "warranty", data.doc_id, id, "NFTs");
                await updateDoc(docRef, {
                    tokendIds: arrayUnion(tokenId)
                });

                const orderRef = doc(db, 'neworder', data.doc_id, "myorders", id)
                await updateDoc(orderRef, {
                    OrderStatus: "Approved"
                });

                updateStatus(outer_item, data, false, true);



            }
            else {
                console.log("Failed to upload product data to ipfs");
            }



        })



        // If IPFS upload is successful, save the product information to the database using addDoc()

    }



    const mintNFT = async (id, data) => {


        if (data.OrderStatus === "Pending") {

            updateStatus(outer_item, data, true, false);

            await processOrder(id, data);




        }
        else if (data.OrderStatus === "Approved") {

            viewNFT(id);
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
                    <td><button className='mint__btn' onClick={() => { mintNFT(outer_item, data) }}>{data.OrderStatus === "Approved" ? "View NFT" : "Mint NFT"}</button></td>
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
//         <td>₹{item.price}</td>
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