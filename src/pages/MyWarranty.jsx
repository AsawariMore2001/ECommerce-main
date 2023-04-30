import { useParams } from "react-router-dom";
import MarketplaceJSON from "../Marketplace.json";
import axios from "axios";
import { useState, useEffect } from "react";
import NFTTile from "../components/NFTTile";

export default function MyWarranty() {
  const [data, updateData] = useState([]);
  const [dataFetched, updateFetched] = useState(false);
  const [address, updateAddress] = useState("0x");
  const [msg, setMsg] = useState("Loding...");

  useEffect(() => {
    const checkConnection = async () => {
      try {
        if (window.ethereum) {
          const chainId = await window.ethereum.request({
            method: "eth_chainId",
          });
          if (chainId !== "0xaa36a7") {
            await window.ethereum.request({
              method: "wallet_switchEthereumChain",
              params: [{ chainId: "0xaa36a7" }],
            });
          }
          const accounts = await window.ethereum.request({
            method: "eth_requestAccounts",
          });
          if (accounts.length > 0) {
            updateAddress(accounts[0]);
          }
        }
      } catch (err) {
        console.log(err);
      }
    };
    checkConnection();
    window.ethereum.on("accountsChanged", (accounts) => {
      updateAddress(accounts[0]);
      getNFTData();
    });
  }, []);

  async function getNFTData() {
    const ethers = require("ethers");

    //After adding your Hardhat network to your metamask, this code will get providers and signers
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const addr = await signer.getAddress();

    //Pull the deployed contract instance
    let contract = new ethers.Contract(
      MarketplaceJSON.address,
      MarketplaceJSON.abi,
      signer
    );

    //create an NFT Token
    let transaction = await contract.getMyNFTs();

    /*
     * Below function takes the metadata from tokenURI and the data returned by getMyNFTs() contract function
     * and creates an object of information that is to be displayed
     */

    const items = await Promise.all(
      transaction.map(async (i) => {
        const tokenURI = await contract.tokenURI(i.tokenId);
        // console.log(tokenURI);
        try {
          let meta = await axios.get(tokenURI);
          meta = meta.data;
          // console.log(meta);

          let item = {
            tokenId: i.tokenId.toNumber(),
            seller: i.seller,
            owner: i.owner,
            image: meta.imgUrl,
            name: meta.productName,
            description: meta.description,
            warranty: meta.warranty,
            price: meta.price,
          };
          return item;
        } catch (error) {
          console.log(error);
          return [];
        }
      })
    );

    updateFetched(true);
    updateAddress(addr);

    if (items.length == 0) {
      setMsg("Oops, No NFT data to display (Are you logged in?)");
      updateData(items);
      return null;
    }

    for (var l = 0, m = 0; l < items.length; l++) {
      if (items[l].length == 0) {
        setMsg("May be facing network issue from server! Try after some time!");
        updateData([]);
        return null;
      }
    }

    updateData(items);
  }

  if (!dataFetched) getNFTData();

  const styleObj = {
    fontSize: 14,
    color: "#000000",
    textAlign: "center",
    paddingTop: "30px",
    paddingBottom: "30px",
  };

  return (
    <div className="flex flex-col text-center items-center mt-11 text-white">
      <p style={styleObj} className="font-bold">
        Wallet Address : {address}
      </p>
      <div className="flex justify-center flex-wrap max-w-screen-xl">
        {data.map((value, index) => {
          return <NFTTile data={value} key={index}></NFTTile>;
        })}
      </div>
      <div style={styleObj} className="mt-10 text-xl">
        {data.length === 0 ? msg : ""}
      </div>
    </div>
  );
}
