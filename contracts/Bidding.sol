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

    // Keeps track of the top bid
    Bid public TopBid;


    // UI will connect here to submit bid price
    function submitBid(uint _bidPrice) public {

        //Non-private checking of new bid
        require(_bidPrice > TopBid.bidAmount);

        //If new bid is higher, save old and replace
        //address old_user =  TopBid.user;
        TopBid = Bid(msg.sender, _bidPrice);
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
}