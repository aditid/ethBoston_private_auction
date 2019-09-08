import utils from '@aztec/dev-utils';

const aztec = require('aztec.js');
const dotenv = require('dotenv');
dotenv.config();
const secp256k1 = require('@aztec/secp256k1');

const Bidding = artifacts.require('Bidding');
const ACE = artifacts.require('ACE');
const PublicRangeValidator = artifacts.require('PublicRange');
const PrivateRangeValidator = artifacts.require('PrivateRange');

const {
  proofs: {
    PUBLIC_RANGE_PROOF,
    PRIVATE_RANGE_PROOF,
  },
  constants,
} = utils;



const { JoinSplitProof, MintProof, PublicRangeProof, PrivateRangeProof} = aztec;

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

    const privateRangeValidator = await PrivateRangeValidator.new();
    await ace.setProof(PRIVATE_RANGE_PROOF, privateRangeValidator.address);

    privatePaymentContract = await Bidding.new(ace.address);
  });
  it('Create a fake public bid note and then use private range to compare', async() => {

    console.log('Create public range note');
    console.log("Can't store note so store info for note");

    const minAmount = 100;
    console.log('Set note to topBid');
    await privatePaymentContract.setTopBidNote(bob.publicKey, minAmount);

    //await privatePaymentContract.setTopBid(minAmount, newBidNote);

    const topBidNote = await privatePaymentContract.TopBidNote();
    console.log('Create the comparison note from topBid');
    const comparisonNote  = await aztec.note.create(topBidNote.user, topBidNote.bidAmount);


    console.log('Set all information for new private range proof');

    const newAmount = 150;
    const privateBidNote = await aztec.note.create(sally.publicKey, newAmount);
    const utilityNote = await aztec.note.create(sally.publicKey, newAmount - topBidNote.bidAmount);
    const isGreaterOrEqual = true;

    console.log('Create private range comparison');

    const privateRangeProof = new PrivateRangeProof(
        privateBidNote,
        comparisonNote,
        utilityNote,
        accounts[1],
        isGreaterOrEqual,
    );



    console.log(privateRangeProof);

    //const prData = publicRangeProof.encodeABI(privatePaymentContract.address);
    //await privatePaymentContract.submitProof(PUBLIC_RANGE_PROOF, accounts[0], prData);
    console.log('encode private range proof');

    const prData = privateRangeProof.encodeABI(privatePaymentContract.address);
    await privatePaymentContract.submitProof(PRIVATE_RANGE_PROOF, accounts[1], prData);
    console.log("reached here");
  })
});
