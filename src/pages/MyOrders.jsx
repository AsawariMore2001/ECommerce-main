import React, { useState, useEffect } from 'react'
import Helmet from '../components/Helmet/Helmet'
import { Container, Col } from 'reactstrap'
import { getAuth } from "firebase/auth";
import { db } from '../firebase.config';
import { Link } from "react-router-dom";
import { collection, getDocs } from 'firebase/firestore';
import '../styles/myorders.css'
import { motion } from "framer-motion";

const MyOrders = () => {

    const [ordersData, setOrdersData] = useState([]);
    const [loading, setLoading] = useState(false);   

    useEffect(() => {

        const getData = async (uid) => {

            setLoading(true)
            const auth = getAuth();

            try {

                const snapShot = await getDocs(collection(db, 'neworder', auth.currentUser.uid, "myorders"));
                
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
                                <th><center>Image</center></th>
                                <th><center>Product Name</center></th>
                                <th><center>Price</center></th>
                                <th><center>Qty</center></th>
                                <th><center>Warranty</center></th>
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
    </>
    );
};

const Trr = ({ item }) => {
    return (<tr>
        <td><center>
            <img src={item.imgUrl} alt="" />
        </center>
        </td>
        <td><center>{item.productName}</center></td>
        <td><center>₹{item.price}</center></td>
        <td><center>{item.quantity} </center></td>
        <motion.td whileHover={{ scale: 1.2 }}><center>
            <Link to="/ProductWarranty">
                <motion.i
                    whileTap={{ scale: 1.2 }}
                    className="ri-shield-flash-line"
                ></motion.i>{" "}
            </Link>
        </center>
        </motion.td>

    </tr>)
}


export default MyOrders;