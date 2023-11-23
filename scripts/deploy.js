const main = async () => {
  const contractFactory = await hre.ethers.getContractFactory("MyEpicGame");
  const contract = await contractFactory.deploy(
    ["Red", "Blue", "Black"], //name
    [
      "https://i.imgur.com/J3jhN7R.jpg",
      "https://i.imgur.com/28GNKt2.jpg",
      "https://i.imgur.com/PJrZvRJ.jpg",
    ], //imageURL
    [1000, 1000, 1000], //hp
    [100, 100, 100], //attackDamage
    "Boss!!!!!",
    "https://i.imgur.com/jwZXn9g.jpg",
    2000,
    500
  );
  await contract.deployed();
  console.log("contract wsa deployed to : ", contract.address);

  //

  // let txn = await contract.mint(0);
  // await txn.wait();
  // console.log("Minted NFT #1");

  // txn = await contract.mint(1);
  // await txn.wait();
  // console.log("Minted NFT #2");

  // txn = await contract.mint(2);
  // await txn.wait();
  // console.log("Minted NFT #3");

  //  let attack = await contract.attack(1);
  //  await attack.wait();

  //const URI = "ipfs://QmQGdAXB41mEgTP9ESjNhC9GUZk3PEZFyWzNHyf2wHmUgz";
  // let setTokenURITxn = await contract.setTokenURI(1, URI);
  // await setTokenURITxn.wait();
  // console.log("setTokenURI");

  // setTokenURITxn = await contract.setTokenURI(2, URI);
  // await setTokenURITxn.wait();
  // console.log("setTokenURI");

  // setTokenURITxn = await contract.setTokenURI(3, URI);
  // await setTokenURITxn.wait();
  // console.log("setTokenURI");
};

const runMain = async () => {
  try {
    await main();
    process.exit(0);
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

runMain();


//npx hardhat run scripts/deploy.js --network sepolia