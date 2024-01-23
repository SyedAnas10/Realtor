// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract EscrowContract is Ownable {
    using Counters for Counters.Counter;
    Counters.Counter private _escrowCount;

    enum EscrowStatus { Open, Completed, Cancelled }

    address public propertyContractAddress;

    struct Escrow {
        address buyer;
        address seller;
        address approver;
        uint256 tokenId;
        uint256 price;
        bool isApproved;
        EscrowStatus status;
    }

    mapping(uint256 => Escrow) public escrows;

    event EscrowCreated(uint256 escrowId, address indexed buyer, address indexed seller, uint256 tokenId, uint256 price);
    event EscrowCompleted(uint256 escrowId);
    event EscrowCancelled(uint256 escrowId);

    constructor(address contractAddress) {
        propertyContractAddress = contractAddress;
    }

    modifier onlySeller(uint256 _escrowId) {
        require(msg.sender == escrows[_escrowId].seller, "Not the Seller");
        _;
    }

    modifier onlyApprover(uint256 _escrowId) {
        require(msg.sender == escrows[_escrowId].approver, "Not the Approver");
        _;
    }

    modifier escrowOpen(uint256 _escrowId) {
        require(escrows[_escrowId].status == EscrowStatus.Open, "Escrow not open");
        _;
    }

    function createEscrow(
        address _seller,
        address _approver,
        uint256 _tokenId,
        uint256 _price
    ) external payable {
        require(msg.value == _price / 2, "Incorrect escrow amount");

        _escrowCount.increment();
        uint256 escrowId = _escrowCount.current();

        escrows[escrowId] = Escrow({
            buyer: msg.sender,
            seller: _seller,
            approver: _approver,
            tokenId: _tokenId,
            price: _price,
            isApproved: false,
            status: EscrowStatus.Open
        });
        emit EscrowCreated(escrowId, msg.sender, _seller, _tokenId, _price);
    }

    function approveEscrow(uint256 _escrowId)
        external
        escrowOpen(_escrowId)
    {
        Escrow storage escrow = escrows[_escrowId];
        escrow.isApproved = true;
    }

    function completeEscrow(uint256 _escrowId)
        external
        payable
        onlySeller(_escrowId)
        escrowOpen(_escrowId)
    {
        require(escrows[_escrowId].isApproved == true);

        Escrow storage escrow = escrows[_escrowId];
        escrow.status = EscrowStatus.Completed;

        IERC721(propertyContractAddress).transferFrom(escrow.seller, escrow.buyer, escrow.tokenId);

        payable(escrow.seller).transfer(escrow.price / 2); // Send the remaining funds to the seller

        emit EscrowCompleted(_escrowId);
    }

    function cancelEscrow(uint256 _escrowId) external onlyOwner escrowOpen(_escrowId) {
        Escrow storage escrow = escrows[_escrowId];
        escrow.status = EscrowStatus.Cancelled;

        payable(escrow.buyer).transfer(escrow.price / 2); // Return funds to the buyer

        emit EscrowCancelled(_escrowId);
    }

    function getEscrowDetails(uint256 _escrowId) external view returns (Escrow memory) {
        return escrows[_escrowId];
    }

    function getEscrowCount() external view returns (uint256) {
        return _escrowCount.current();
    }
}
