pragma solidity >=0.5.0 <0.6.0;

import "@aztec/protocol/contracts/ACE/ACE.sol";


contract Bidding
{
    ACE public ace;

    constructor(address _aceAddress) public {
        ace = ACE(_aceAddress);  //Aztec Cryptography Engine
    }

    // Bids will have a user and an amount
    struct Bid {
        address user;
        uint bidAmount;
    }

    // Bids will have a user and an amount
    struct BidNote {
        string user;
        uint bidAmount;
    }
    // Keeps track of the top bid
    Bid public TopBid;
    BidNote public TopBidNote;

    // UI will connect here to submit bid price
    function setTopBid(address user, uint bidAmount) public {
        TopBid.user = user;
        TopBid.bidAmount = bidAmount;
    }

    // UI will connect here to submit bid price
    function setTopBidNote(string memory user, uint bidAmount) public {
        TopBidNote.user = user;
        TopBidNote.bidAmount = bidAmount;
    }

    // UI will connect here to submit bid price
    function submitProof(uint24 _proof, address sender, bytes memory data) public returns (string memory result){

        bytes memory proofOutputs =  ace.validateProof(_proof, sender, data);
        result = 'Congratulations, you won! - Team Team';
        return result;
    }

    //Function to return top bid
    function getTopBid() public view returns (address, uint) {

        return (TopBid.user, TopBid.bidAmount);
    }

    //Function to return top bid
    function getTopBidNote() public view returns (string memory, uint) {

        return (TopBidNote.user, TopBidNote.bidAmount);
    }
}