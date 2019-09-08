import utils from '@aztec/dev-utils';

const aztec = require('aztec.js');
const dotenv = require('dotenv');
dotenv.config();
const secp256k1 = require('@aztec/secp256k1');


const ZkAssetMintable = artifacts.require('ZkAssetMintable');
const Bidding = artifacts.require('Bidding');
const ACE = artifacts.require('ACE');
const PublicRangeValidator = artifacts.require('PublicRange');

const {
  proofs: {
    PUBLIC_RANGE_PROOF,
  },
  constants,
} = utils;




const { JoinSplitProof, MintProof, PublicRangeProof } = aztec;

contract('Private payment', accounts => {

  const bob = secp256k1.accountFromPrivateKey(process.env.GANACHE_TESTING_ACCOUNT_0);
  const sally = secp256k1.accountFromPrivateKey(process.env.GANACHE_TESTING_ACCOUNT_1);
  let privatePaymentContract;

 // beforeEach(async () => {
 //   privatePaymentContract = await ZkAssetMintable.deployed();
 // });
  before(async () => {
    const ace = await ACE.new();
    await ace.setCommonReferenceString(constants.CRS);
    const publicRangeValidator = await PublicRangeValidator.new();
    await ace.setProof(PUBLIC_RANGE_PROOF, publicRangeValidator.address);
    privatePaymentContract = await Bidding.new(ace.address);
  });
  it('Bob should be able to deposit 100 then pay sally 25 by splitting notes he owns', async() => {

    console.log('Bob wants to deposit 100');
    const bobNote1 = await aztec.note.create(bob.publicKey, 100);
    console.log('1');

    const newBidNote = await aztec.note.create(bob.publicKey, 100);
    console.log('1.1', newBidNote);
    const topBid = await privatePaymentContract.TopBid();
    console.log('1.2', topBid);
    const sender = secp256k1.accountFromPrivateKey(process.env.GANACHE_TESTING_ACCOUNT_0);
    console.log('1.3', sender);
    const isGreaterOrEqual = true;
    console.log('1.4', isGreaterOrEqual);
    const utilityNote = await aztec.note.create(bob.publicKey, 100)
    console.log('2', utilityNote);

    const publicRangeProof = new PublicRangeProof(
        newBidNote,
        topBid.bidAmount,
        accounts[0],
        isGreaterOrEqual,
        utilityNote,
    );
    console.log('3');

    console.log(publicRangeProof)
    console.log('4');

    const prData = publicRangeProof.encodeABI(privatePaymentContract.address);
    console.log('5');
    console.log(prData)
    console.log('6','66563');
    await privatePaymentContract.submitProof(PUBLIC_RANGE_PROOF, accounts[0], prData);
    console.log('7');

  })
});
