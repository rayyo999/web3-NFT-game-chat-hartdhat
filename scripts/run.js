const main = async () => {
  const [, people1] = await hre.ethers.getSigners();
  const contractFactory = await hre.ethers.getContractFactory("MyEpicGame");
  const contract = await contractFactory.deploy(
    ["Red", "Blue", "Black"], //name
    ["Url1", "Url2", "Url3"], //imageURL
    [1000, 1000, 1000], //hp
    [100, 100, 100], //attackDamage
    "Boss!!!!!",
    "https://i.imgur.com/jwZXn9g.jpg",
    200,
    200
  );
  await contract.deployed();

  console.log("deploy contract to : ", contract.address);

  let txn = await contract.mint(0);
  await txn.wait();
  console.log(txn);
  txn = await contract.connect(people1).mint(0);
  await txn.wait();
  txn = await contract.mint(0);
  await txn.wait();

   let attack = await contract.attack(1);
   await attack.wait();



  attack = await contract.getPenFromUser();
  console.log(attack)
  // let pen1 = await contract.penOfTokenId(1);
  // console.log("pen1", pen1);
  // let boss = await contract.boss();
  // console.log("boss", boss);
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
