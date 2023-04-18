import React from "react";
import { Container, Row, Col, Form, FormGroup } from "reactstrap";
import Helmet from "../components/Helmet/Helmet";
import CommonSection from "../components/UI/CommonSection";
import "../styles/checkout.css";
import { useDispatch } from "react-redux";
import { ethers } from "ethers";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { useLocation } from "react-router";
import { collection, addDoc, setDoc, doc, deleteDoc } from "firebase/firestore";
import { db, storage } from "../firebase.config";
import useAuth from '../custom-hooks/useAuth';
import { toast } from 'react-toastify'
import { cartActions } from "../redux/slices/cartSlice";
const Checkout = () => {
  const totalQty = useSelector((state) => state.cart.totalQuantity);
  const totalAmount = useSelector((state) => state.cart.totalAmount);
  const cartItem = useSelector((state) => state.cart.cartItems)

  const location = useLocation();
  const [loading, setLoading] = useState(false);
  const [currAddress, updateAddress] = useState("");
  const [connected, toggleConnect] = useState(false);
  const { currentUser } = useAuth()
  const dispatch = useDispatch();
  const [orderData, setOrderData] = useState({
    Name: "",
    Email: "",
    PhoneNo: "",
    Address: "",
  })

  function handleSubmit() {
    console.log("submit called");
    placeOrder();
    setOrderData((prev) => {
      return {
        Name: "",
        Email: "",
        PhoneNo: "",
        Address: "",

      }
    })
  }

  function handleChange(event) {
    event.preventDefault();
    const { name, value } = event.target;
    console.log(event);
    setOrderData((prev) => {
      return {
        ...prev,
        [name]: value
      }
    })

  }


  async function getAddress() {
    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const addr = await signer.getAddress();
      updateAddress(addr);
    } catch (err) {
      console.log(err);
    }
  }

  async function emptyCartFirebase() {
    cartItem.forEach(async (item) => {
      await deleteDoc(doc(collection(db, "users", currentUser.uid, "cart"), item.id));
    })
  }


  const placeOrder = async () => {
    setLoading(true);
    await addDoc(collection(db, "neworder", currentUser.uid, "myorders"), {
      ...orderData,
      Items: cartItem,
      TotalAmount: totalAmount,
      TotalQuantity: totalQty
    });

    await emptyCartFirebase();
    dispatch(cartActions.emptyCart({}));


    setLoading(false);
    toast.success('Order Placed Successfully')
  }
  async function connectWebsite() {
    try {
      const chainId = await window.ethereum.request({ method: "eth_chainId" });
      if (chainId !== "0x5") {
        await window.ethereum.request({
          method: "wallet_switchEthereumChain",
          params: [{ chainId: "0x5" }],
        });
      }
      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });
      if (accounts.length > 0) {
        updateAddress(accounts[0]);
        toggleConnect(true);
        window.location.replace(location.pathname);
      }
    } catch (err) {
      console.log(err);
    }
  }

  useEffect(() => {
    const checkConnection = async () => {
      try {
        if (window.ethereum) {
          const chainId = await window.ethereum.request({
            method: "eth_chainId",
          });
          if (chainId !== "0x5") {
            await window.ethereum.request({
              method: "wallet_switchEthereumChain",
              params: [{ chainId: "0x5" }],
            });
          }
          const accounts = await window.ethereum.request({
            method: "eth_requestAccounts",
          });
          if (accounts.length > 0) {
            updateAddress(accounts[0]);
            toggleConnect(true);
          }
        }
      } catch (err) {
        console.log(err);
      }
    };
    checkConnection();
    window.ethereum.on("accountsChanged", (accounts) => {
      updateAddress(accounts[0]);
    });
  }, []);

  // const [connected, toggleConnect] = useState(false);
  // const location = useLocation();
  // const [currAddress, updateAddress] = useState("0x");

  // async function getAddress() {
  //   const ethers = require("ethers");
  //   const provider = new ethers.providers.Web3Provider(window.ethereum);
  //   try {
  //     const signer = provider.getSigner();
  //     const addr = await signer.getAddress();
  //     updateAddress(addr);
  //   } catch (err) {
  //     console.log(err);
  //   }
  // }

  // async function connectWebsite() {
  //   const chainId = await window.ethereum.request({ method: "eth_chainId" });
  //   if (chainId !== "0x5") {
  //     //alert('Incorrect network! Switch your metamask network to Goerli');
  //     await window.ethereum.request({
  //       method: "wallet_switchEthereumChain",
  //       params: [{ chainId: "0x5" }],
  //     });
  //   }
  //   await window.ethereum
  //     .request({ method: "eth_requestAccounts" })
  //     .then(() => {
  //       console.log("Inside connect website");
  //       getAddress();
  //       // window.location.replace(location.pathname);
  //     });
  // }

  // useEffect(() => {
  //   let val = window.ethereum.isConnected();
  //   if (val) {
  //     console.log("Inside use effect")
  //     getAddress();
  //     toggleConnect(val);
  //   }

  //   window.ethereum.on("accountsChanged", function (accounts) {
  //     // window.location.replace(location.pathname);
  //   });
  // });

  return (
    <Helmet title="Checkout">
      <CommonSection title="Checkout" />
      <section>{
        loading ? <Col lg='12' className='text-center' ><h5 className='fw-bold'>Processing Order</h5></Col> :

          <Container>
            <button onClick={emptyCartFirebase}>check</button>
            <Row>
              <Col lg="8">
                <h6 className="mb-4 fw-bold">Billing Information</h6>
                <form className="billing__form" onSubmit={placeOrder}>

                  <input type="text" placeholder="Enter Your Name" value={orderData.Name} name="Name" onChange={(e) => handleChange(e)} />

                  <input type="email" placeholder="Enter Your Email" value={orderData.Email} name="Email" onChange={(e) => handleChange(e)} />

                  <input type="number" placeholder="Phone number" value={orderData.PhoneNo} name="PhoneNo" onChange={(e) => handleChange(e)} />

                  <input type="text" placeholder="Address" value={orderData.Address} name="Address" onChange={(e) => handleChange(e)} />

                </form>
              </Col>
              <Col lg="4">
                <div className="checkout__cart">
                  <h6>
                    Total Qty: <span>{totalQty} items</span>
                  </h6>
                  <h6>
                    Subtotal: <span>${totalAmount}</span>
                  </h6>
                  <h6>
                    <span>
                      Shipping:
                      <br />
                      Free shipping
                    </span>
                    <span>$0</span>
                  </h6>
                  <h4>
                    Total Cost: <span>${totalAmount}</span>
                  </h4>
                </div>
                <button
                  className="buy__btn auth__btn w-100"
                  onClick={handleSubmit}
                >
                  {connected ? "Order" : "Connect to wallet"}
                </button>
                <div className="w-64 mx-auto mt-4 p-4 rounded-md border-2 border-gray-300 text-center">
                  <p className="text-lg font-bold mb-2">Warranty Minting</p>
                  <p style={{ color: "#2d3748" }} className="mb-4">
                    Warranty will be minted for{" "}
                    <span className="font-medium text-sm">{currAddress}</span>
                  </p>
                </div>
              </Col>

            </Row>
          </Container>
      }
      </section>
    </Helmet>
  );
};

export default Checkout;
