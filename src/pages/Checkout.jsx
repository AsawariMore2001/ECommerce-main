import React from "react";
import { Container, Row, Col, Form, FormGroup } from "reactstrap";
import Helmet from "../components/Helmet/Helmet";
import CommonSection from "../components/UI/CommonSection";
import "../styles/checkout.css";
import { ethers } from "ethers";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { useLocation } from "react-router";

const Checkout = () => {
  const totalQty = useSelector((state) => state.cart.totalQuantity);
  const totalAmount = useSelector((state) => state.cart.totalAmount);

  const location = useLocation();
  const [currAddress, updateAddress] = useState("");
  const [connected, toggleConnect] = useState(false);
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
      <section>
        <Container>
          <Row>
            <Col lg="8">
              <h6 className="mb-4 fw-bold">Billing Information</h6>
              <Form className="billing__form">
                <FormGroup className="from__group">
                  <input type="text" placeholder="Enter Your Name" />
                </FormGroup>

                <FormGroup className="from__group">
                  <input type="email" placeholder="Enter Your Email" />
                </FormGroup>

                <FormGroup className="from__group">
                  <input type="number" placeholder="Phone number" />
                </FormGroup>

                <FormGroup className="from__group">
                  <input type="text" placeholder="Street address" />
                </FormGroup>

                <FormGroup className="from__group">
                  <input type="text" placeholder="City" />
                </FormGroup>

                <FormGroup className="from__group">
                  <input type="text" placeholder="Postal Code" />
                </FormGroup>

                <FormGroup className="from__group">
                  <input type="text" placeholder="Country" />
                </FormGroup>
              </Form>
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
                onClick={connectWebsite}
              >
                {connected ? "Order Placed" : "Place Order"}
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
      </section>
    </Helmet>
  );
};

export default Checkout;
