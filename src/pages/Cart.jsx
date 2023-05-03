import React, { useEffect, useState } from "react";
import "../styles/cart.css";
import Helmet from "../components/Helmet/Helmet";
import CommonSection from "../components/UI/CommonSection";
import { Container, Row, Col, Toast } from "reactstrap";

import { motion } from "framer-motion";
import { cartActions } from "../redux/slices/cartSlice";
import { useSelector, useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";

import { db, storage } from "../firebase.config";
import { doc, getDoc, collection, deleteDoc, getDocs } from "firebase/firestore"
import useAuth from "../custom-hooks/useAuth"


const Cart = () => {
  const navigate = useNavigate()
  const cartItems = useSelector((state) => state.cart.cartItems);
  const totalAmount = useSelector((state) => state.cart.totalAmount);
  const [dynamicCart, setDynamicCart] = useState([]);
  const { currentUser } = useAuth();
  const dispatch = useDispatch();


  async function validate_checkout(){
    if(totalAmount===0){
      alert("No product to checkout!")
      return
    }
    navigate("/checkout")
  }

  return (
    <Helmet title="Cart">
      <CommonSection title="Shopping Cart" />
      <section>
        <Container>
          <Row>
            <Col lg="9">
              {cartItems.length === 0 ? (
                <h2 className="fs-4 text-center">No items added to the cart</h2>
              ) : (
                <table className="table bordered">
                  <thead>
                    <tr>
                      <th>Image</th>
                      <th>Title</th>
                      <th>Price</th>
                      <th>Qty</th>
                      <th>Delete</th>
                    </tr>
                  </thead>

                  <tbody>
                    {cartItems.map((item, index) => (
                      <Tr item={item} key={index} />
                    ))}
                  </tbody>
                </table>
              )}
            </Col>
            <Col lg="3">
              <div>
                <h6 className="d-flex align-items-center justify-content-betweeen">
                  Subtotal
                </h6>
                <span className="fs-4 fw-bold">₹{totalAmount}</span>
              </div>
              <p className="fs-6 mt-2">
                taxes and shipping will calculate in checkout
              </p>
              <div>
                <button onClick={validate_checkout} className="buy__btn w-100 ">
                  Checkout
                </button>

                <button className="buy__btn w-100 mt-3">
                  <Link to="/shop">Continue Shopping</Link>
                </button>
              </div>
            </Col>
          </Row>
        </Container>
      </section>
    </Helmet>
  );
};

const Tr = ({ item }) => {
  const dispatch = useDispatch();
  const { currentUser } = useAuth();

  const deleteProduct = () => {
    dispatch(cartActions.deleteItem(item.id));

    deleteProductFirebase().then(() => {
      console.log("item removed from cart");
    });
  };

  const deleteProductFirebase = async () => {

    await deleteDoc(doc(collection(db, "users", currentUser.uid, "cart"), item.id));
  }
  return (
    <tr>
      <td>
        <img src={item.imgUrl} alt="" />
      </td>
      <td>{item.productName}</td>
      <td>₹{item.price}</td>
      <td>{item.quantity}px</td>
      <td>
        <motion.i
          whileTap={{ scale: 1.2 }}
          onClick={deleteProduct}
          className="ri-delete-bin-5-line"
        ></motion.i>{" "}
      </td>
    </tr>
  );
};

export default Cart;
