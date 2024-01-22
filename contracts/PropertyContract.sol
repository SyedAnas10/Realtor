//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";

import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract PropertyContract is ERC721Enumerable {

    struct PropertyDetails {
        string name;
        string propertyAddress;
        uint256 area;
        uint256 year;
        uint256 bedroom;
        uint256 bathroom;
        uint256 price;
    }

    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;
    mapping(uint256 => PropertyDetails) public propertyDetails;

    constructor() ERC721("Property", "PROP") {}

    function mint(
        string memory _name,
        string memory _address,
        uint256 _area,
        uint256 _year,
        uint256 _bedroom,
        uint256 _bathroom,
        uint256 _price
    ) public returns (uint256) {
        _tokenIds.increment();
        uint256 newItemId = _tokenIds.current();

        _safeMint(msg.sender, newItemId);
        propertyDetails[newItemId] = PropertyDetails({
            name: _name,
            propertyAddress: _address,
            area: _area,
            year: _year,
            bedroom: _bedroom,
            bathroom: _bathroom,
            price: _price
        });
        
        return newItemId;
    }

    function getPropertyDetails(uint256 itemId) public view returns (PropertyDetails memory) {
        return propertyDetails[itemId];
    }

    function getPropertyCount() public view returns (uint256) {
        return _tokenIds.current();
    }

    function isOwner(uint256 tokenId) public view returns (bool) {
        return ownerOf(tokenId) == msg.sender;
    }
}