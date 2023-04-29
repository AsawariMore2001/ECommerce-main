import React from "react";
import { useState } from "react";
import { Container, Row, Col } from "reactstrap";
import "../styles/dashboard.css";
import useGetData from "../custom-hooks/useGetData";
import Marketplace from "../Marketplace.json";

const Dashboard = () => {
  const { data: products } = useGetData("products");
  const { data: users } = useGetData("users");

  const ethers = require("ethers");
  const [message, updateMessage] = useState("");

  async function listNFT(e) {
    e.preventDefault();

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

      let add = "0xfb8d163B0B6307905aE1615917383Fa2AA191F74";
      let metadataURL =
        "https://gateway.pinata.cloud/ipfs/QmNQpSEU3yn1At5EfbGXRUvrpWE2pU6fWmDrkG7x7SNEnB";
      //actually create the NFT
      let transaction = await contract.createToken(add, metadataURL);
      await transaction.wait();

      alert("Successfully listed your NFT!");
      updateMessage("");
    } catch (e) {
      console.log(e);
      alert("Upload error" + e);
    }
  }

  return (
    <section>
      <Container>
        <Row>
          <Col className="lg-3">
            <div className="revenue__box">
              <h5>Total sales</h5>
              <span>$7890</span>
            </div>
          </Col>
          <Col className="lg-3">
            <div className="orders__box">
              <h5>orders</h5>
              <span>789</span>
            </div>
          </Col>
          <Col className="lg-3">
            <div className="products__box">
              <h5>Total products</h5>
              <span>{products.length}</span>
            </div>
          </Col>
          <Col className="lg-3">
            <div className="users__box">
              <h5>Total Users</h5>
              <span>{users.length}</span>
            </div>
          </Col>
        </Row>
      </Container>
      <div className="text-center">
        <button
          onClick={listNFT}
          className="font-bold mt-10 w-full bg-purple-500 rounded p-2 shadow-lg mt-4"
          style={{ color: "black" }}
        >
          List NFT
        </button>
      </div>
    </section>
  );
};

export default Dashboard;
