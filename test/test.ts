import { expect } from 'chai';
import { ethers, network } from 'hardhat';
import { Signer, Contract } from 'ethers';
import { parseUnits } from 'ethers/lib/utils';

let owner: Signer, user1: Signer, user2: Signer;
let owner_Ad: string, user1_Ad: string, user2_Ad: string;
let nftGameContract: Contract;

describe('NftGame:', () => {
  beforeEach(async () => {
    [owner, user1, user2] = await ethers.getSigners();
    owner_Ad = await owner.getAddress();
    user1_Ad = await user1.getAddress();
    user2_Ad = await user2.getAddress();
    //deploy token Contract
    const nftGameContractFactory = await ethers.getContractFactory(
      'MyEpicGame'
    );
    nftGameContract = await nftGameContractFactory.deploy(
      ['Red', 'Blue', 'Black'], //name
      [
        'https://i.imgur.com/J3jhN7R.jpg',
        'https://i.imgur.com/28GNKt2.jpg',
        'https://i.imgur.com/PJrZvRJ.jpg',
      ], //imageURL
      [1000, 1000, 1000], //hp
      [100, 100, 100], //attackDamage
      'Boss!!!!!',
      'https://i.imgur.com/jwZXn9g.jpg',
      2000,
      500
    );
    await nftGameContract.deployed();
  });
  // it('tokenIdToOwner mapping:', async () => {
  //   await nftGameContract.mint(1);
  //   expect(await nftGameContract.tokenIdToOwner(1)).to.equal(owner_Ad);
  //   await nftGameContract.connect(user1).mint(1);
  //   expect(await nftGameContract.tokenIdToOwner(2)).to.equal(user1_Ad);
  // });
  // it('tokenCountOfOwner mapping:', async () => {
  //   await nftGameContract.mint(1);
  //   await nftGameContract.mint(2);
  //   expect(await nftGameContract.tokenCountOfOwner(owner_Ad)).to.equal(2);
  // });
  it('should return tokenIds that owner has:', async () => {
    expect(await nftGameContract._tokenIds()).to.equal(1);
    await nftGameContract.mint(1);
    expect(await nftGameContract._tokenIds()).to.equal(2);
    await nftGameContract.connect(user1).mint(1);
    expect(await nftGameContract._tokenIds()).to.equal(3);
    await nftGameContract.mint(2);
    expect(await nftGameContract._tokenIds()).to.equal(4);
    const rawTokenIds = await nftGameContract.getTokenIds(owner_Ad);
    const tokenIds = rawTokenIds.map((tokenId:any) => tokenId.toNumber());
    console.log('🚀 -> file: test.ts -> line 57 -> it -> tokenIds', tokenIds);
    // expect([...tokenIds]).to.equal([1,3]);
    // expect(await nftGameContract.connect(user1).getTokenIds(owner_Ad)).to.equal(
    //   [2]
    // );
  });
});
