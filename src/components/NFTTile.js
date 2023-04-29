function NFTTile(data) {
  return (
    <div className="nft-tile">
      <img src={data.data.image} alt="NFT Image" className="nft-image" />
      <div className="nft-details">
        <h2>{data.data.name}</h2>
        <p>description : {data.data.description}</p>
        <p>Warranty Period : {data.data.warranty} year</p>
        <p>Price : $ {data.data.price}</p>
      </div>
    </div>
  );
}

export default NFTTile;
