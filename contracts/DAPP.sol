pragma solidity ^0.4.19;

import "./dapp/Core.sol";

contract DAPP is Core {
    function DAPP() public {
    founderAddress = msg.sender;

    _createCampaign(msg.sender, "Genesis Campaign", "");
    _createCertificate(0, 1, "Genesis Certificate", 0);
    _createToken(0, 0, 0, msg.sender, 0);
  }
}