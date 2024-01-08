//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";

import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract PropertyContract is ERC721Enumerable, Ownable {

    struct PropertyDetails {
        string name;
        string propertyAddress;
        uint area;
        uint year;
        uint bedroom;
        uint bathroom;
        uint price;
    }

    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;
    mapping(uint => PropertyDetails) public propertyDetails;

    constructor() ERC721("Property", "PROP") {}

    function mint(
        string memory _name,
        string memory _address,
        uint _area,
        uint _year,
        uint _bedroom,
        uint _bathroom,
        uint _price
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

    function getPropertyDetails(uint itemId) public view returns (PropertyDetails memory) {
        return propertyDetails[itemId];
    }
}