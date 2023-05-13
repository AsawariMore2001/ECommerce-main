import React, { useState, useRef, useEffect } from "react";
import { Container, Row, Col } from "reactstrap";
import { useParams, useLocation, Await, useNavigate } from "react-router-dom";
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
import { getAuth } from "firebase/auth";
import Marketplace from "../Marketplace.json";
import axios from "axios";

const ProductWarranty = () => {

    const loaction = useLocation();
    const [loading, setLoading] = useState(false);
    const [nftData, setNftData] = useState({});
    const ethers = require("ethers");
    let navigate = useNavigate();
    console.log(loaction.state.id);

    const check = async () => {
        // const tokenURI = await getNftMetadata(27);
        // console.log(tokenURI);
        // let meta = await axios.get(tokenURI);
        // meta = meta.data;
        // console.log(meta);
        console.log(nftData);
    }

    const showData = (displayItem) => {
        console.log("displayItem", displayItem);

        setNftData((prev) => {
            return {
                ...prev, [displayItem.id]: { ...displayItem }
            }
        })
    }


    const processNft = (meta) => {

        return {
            timestamp: meta.timestamp,
            customer: meta.customer,
            id: meta.id,
            quantity: meta.quantity,
            productName: meta.productName,
            price: meta.price,
            warranty: meta.warranty,
            imgUrl: meta.imgUrl
        };




    }

    const resolveNft = async (item) => {

        const tokenURI = await getNftMetadata(item);
        // return tokenURI;
        // console.log("resolveNft", tokenURI);

        try {
            const meta = await axios.get(tokenURI);
            return meta.data;
        }
        catch (err) {
            alert("NFT is minted! Soon it will appear here....");
            navigate("/MyOrders");

        }


        // meta = meta.data;
        // let displayItem = {
        //     timestamp: meta.timestamp,
        //     customer: meta.customer,
        //     id: meta.id,
        //     quantity: meta.quantity,
        //     productName: meta.productName,
        //     price: meta.price,
        //     warranty: meta.warranty,
        //     imgUrl: meta.imgUrl
        // };

        // return displayItem;


        // axios.get(tokenURI).then((meta) => {

        //     meta = meta.data;
        //     let displayItem = {
        //         timestamp: meta.timestamp,
        //         customer: meta.customer,
        //         id: meta.id,
        //         quantity: meta.quantity,
        //         productName: meta.productName,
        //         price: meta.price,
        //         warranty: meta.warranty,
        //         imgUrl: meta.imgUrl
        //     };

        //     setNftData((prev) => {
        //         return {
        //             ...prev, item: { ...displayItem }
        //         }
        //     })

        // setLoading(false);


        // }).catch((err) => {

        //     alert("NFT is minted! It will soon appear here, Please try again after some time");

        // })

    }


    const getNftMetadata = async (tokenId) => {

        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();

        //Pull the deployed contract instance
        let contract = new ethers.Contract(
            Marketplace.address,
            Marketplace.abi,
            signer
        );

        let add = "0x517CbE9762a4C53e6923B33FdFC7F1Dc2771941f";
        console.log(tokenId);
        let transaction = await contract.tokenURI(tokenId);
        return transaction;
    }
    useEffect(() => {

        const getData = async () => {

            setLoading(true)
            const auth = getAuth();

            try {

                const docRef = doc(db, "warranty", auth.currentUser.uid, loaction.state.id, "NFTs");
                const docSnap = await getDoc(docRef);
                if (docSnap.exists()) {
                    const data = docSnap.data();

                    const orderWarranty = await Promise.all(data["tokendIds"].map(resolveNft));
                    orderWarranty.map(processNft).map(showData);
                    setLoading(false);
                }
                else {
                    console.log("order not found");
                }

            } catch (error) {
                console.log(error)
            }


        }
        getData();

    }, [])


    return (
        <Helmet title="Product Warranty">
            <CommonSection title="Product Warranty" />
            {/* <button onClick={check}>check</button> */}
            <section className="pt-0>">{
                loading ? <Col lg='12' className='text-center' ><h5 className='fw-bold'>Loading...</h5></Col> :
                    <Container>
                        {/* <button onClick={check}>check</button> */}
                        {
                            Object.entries(nftData).map(([key, value]) => (
                                <Tr item={value} key={value.id} />
                            ))
                        }
                    </Container>}
            </section>


        </Helmet>

    );
};

const Tr = ({ item }) => {

    return <Row>
        <Col lg='3'>
            <img src={item.imgUrl} alt="" />
        </Col>

        <Col lg='6'>
            <div className="product__details">
                <h2>{item.productName}</h2>

                <div className="d-flex align-items-center gap-5 mb-3">
                    <span className="product__price"><br />Price: ₹{item.price}</span>

                </div>
                <h5>Warranty period:  {item.warranty} Year</h5>
            </div>
            <table>
                <tbody>
                    <br />
                    <tr>Product id: {item.id}</tr>
                    <br />
                    <tr><td> Issued On: {item.timestamp}</td>
                    </tr><br />
                </tbody>
            </table>

        </Col>
    </Row>


}

export default ProductWarranty;
