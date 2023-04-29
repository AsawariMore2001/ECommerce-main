import { useParams } from "react-router-dom";
import MarketplaceJSON from "../Marketplace.json";
import axios from "axios";
import { useState } from "react";
import NFTTile from "../components/NFTTile";

export default function MyWarranty() {
  const [data, updateData] = useState([]);
  const [dataFetched, updateFetched] = useState(false);
  const [address, updateAddress] = useState("0x");

  async function getNFTData(tokenId) {
    const ethers = require("ethers");

    //After adding your Hardhat network to your metamask, this code will get providers and signers
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const addr = await signer.getAddress();
    console.log(addr);
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
        console.log(tokenURI);
        let meta = await axios.get(tokenURI);
        meta = meta.data;
        console.log(meta);

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
      })
    );

    updateData(items);
    updateFetched(true);
    updateAddress(addr);
  }

  const params = useParams();
  const tokenId = params.tokenId;
  if (!dataFetched) getNFTData(tokenId);

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
          console.log(data);
          return <NFTTile data={value} key={index}></NFTTile>;
        })}
      </div>
      <div className="mt-10 text-xl">
        {data.length === 0
          ? "Oops, No NFT data to display (Are you logged in?)"
          : ""}
      </div>
    </div>
  );
}
