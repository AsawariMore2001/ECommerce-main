import React from "react";
import { Container, Row, Col } from "reactstrap";
import Marketplace from "../Marketplace.json";
import { useState } from "react";

const ApproveOrders = () => {

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

            let add = "0x517CbE9762a4C53e6923B33FdFC7F1Dc2771941f";
            let metadataURL =
                "https://gateway.pinata.cloud/ipfs/QmevmzmhwxcSaLrcwxMcCXohfq5enCQV7qsFc7dWoWV9h1";
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
        <section >
            <Container>
                <Row>
                    <Col lg='16'>
                        <div className="text-center">
                            <button
                                onClick={listNFT}
                                className="font-bold mt-10 w-full bg-purple-500 rounded p-2 shadow-lg mt-4"
                                style={{ color: "black" }}
                            >
                                List NFT
                            </button>
                        </div>
                    </Col>
                </Row>
            </Container>
        </section>

    )
}

export default ApproveOrders
