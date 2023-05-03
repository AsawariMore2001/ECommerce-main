import React from "react";
import { motion } from "framer-motion";
import { Col } from "reactstrap";
import { Link } from "react-router-dom";

import { useDispatch } from "react-redux";
import { cartActions } from "../../redux/slices/cartSlice";

import "../../styles/product-card.css";
import { useSelector } from "react-redux";
import { ToastContainer, toast } from "react-toastify";
import { collection, addDoc, setDoc } from "firebase/firestore";
import { db, storage } from "../../firebase.config";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { doc, getDoc, getDocs } from 'firebase/firestore';
import useAuth from '../../custom-hooks/useAuth';
// import productImg from '../../assets/images/arm-chair-01.jpg'

const ProductCard = ({ item }) => {
  const dispatch = useDispatch();
  const { currentUser } = useAuth()
  const addToCart = async () => {
    dispatch(
      cartActions.addItem({
        id: item.id,
        productName: item.productName,
        price: item.price,
        imgUrl: item.imgUrl,
      })
    );
    await addToFirebaseCart(item);

    toast.success("Product Added Successfully");
  };

  // add item to firebase cart 
  const addToFirebaseCart = async () => {
    try {
      console.log(currentUser.uid, item.id, "add item");
      await setDoc(doc(collection(db, "users", currentUser.uid, "cart"), item.id), {
        id: item.id,
        productName: item.productName,
        price: item.price,
        imgUrl: item.imgUrl,
      });
    }
    catch (err) {
      console.log("failed to add item", err);
    }
  }

  return (
    <Col lg="3" md="4" className="mb-2">
      <div className="product__item">
        <div className="product__img">
          <motion.img
            whileHover={{ scale: 0.9 }}
            src={item.imgUrl}
            width={450}
            height={250}
            alt=""
          />
        </div>
        <div className="p-2 product__info">
          <h3 className="product__name">
            <Link to={`/shop/₹{item.id}`}>{item.productName}</Link>
          </h3>
          <span>{item.category}</span>
        </div>

        <div className="product__card-bottom d-flex align-items-center justify-content-between p-2">
          <span className="price">{`₹${item.price}`}</span>
          <motion.span whileTap={{ scale: 1.2 }} onClick={addToCart}>
            <i className="ri-add-line"></i>
          </motion.span>
        </div>
      </div>
    </Col>
  );
};

export default ProductCard;
