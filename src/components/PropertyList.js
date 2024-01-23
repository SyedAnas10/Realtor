import React, { useEffect, useState } from "react";
import Home from "./Home";

const PropertyList = ({
  propertyContract,
  provider,
  escrow,
  account,
  approver,
}) => {
  const isApprover = account === approver ? true : false;

  const [homes, setHomes] = useState([]);
  const [ownedProperties, setOwnedProperties] = useState([]);
  const [escrows, setEscrows] = useState([]);

  const [home, setHome] = useState({});
  const [homeIndex, setHomeIndex] = useState(null);
  const [toggle, setToggle] = useState(false);

  const loadProperties = async () => {
    const signer = provider.getSigner();
    console.log(signer);
    const propertiesCount = await propertyContract.getPropertyCount();
    const properties = [];
    const owned = [];

    for (var i = 1; i <= propertiesCount; i++) {
      const metadata = await propertyContract.getPropertyDetails(i);
      (await propertyContract.connect(signer).isOwner(i))
        ? owned.push(metadata)
        : properties.push(metadata);
    }
    setHomes(properties);
    setOwnedProperties(owned);
  };

  const loadEscrows = async () => {
    const escrowCount = await escrow.getEscrowCount();
    const _escrows = [];

    for (var i = 1; i <= escrowCount; i++) {
      const metadata = await escrow.getEscrowDetails(i);
      if (!metadata.isApproved) {
        _escrows.push(metadata);
      }
    }
    console.log(_escrows)
    setEscrows(_escrows);
  };

  const togglePop = (home, index) => {
    setHome(home);
    setHomeIndex(index + 1);
    toggle ? setToggle(false) : setToggle(true);
  };

  const approveEscrow = async (index) => {
    const signer = provider.getSigner();
    console.log(signer);
    try {
      await escrow.connect(signer).approveEscrow(index+1);
      console.log("Approved Succesfully");
    } catch (error) {
      console.log(error)
    }

  }

  useEffect(() => {
    isApprover ? loadEscrows() : loadProperties();
  }, [account]);

  return (
    <div>
      {isApprover ? 
      (
        <div>
              <h2>
                This is Govt. controlled page. 
              </h2>
            <div className="cards_section">
              <div className="cards">
                {escrows.map((escrow, index) => (
                  <div className="card" key={index}>
                    <div className="card__info">
                      <h4>{`Transfer of Ownership #${index+1}`}</h4>
                      <p>
                        <strong>Seller Address : </strong> {escrow.seller.slice(0, 6) + '...' + escrow.seller.slice(38, 42)} <hr />
                        <strong>Buyer Address : </strong> {escrow.buyer.slice(0, 6) + '...' + escrow.buyer.slice(38, 42)} <hr />
                        <strong>Price : </strong> {escrow.price.toNumber()} ETH
                      </p>
                      <button className="card_button" onClick={() => approveEscrow(index)}> Approve </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
        </div>
      ) : (
        <div>
          <div className="cards__section">
            <h3>Homes For You</h3>
            <hr />
            <div className="cards">
              {homes.map((home, index) => (
                <div
                  className="card"
                  key={index}
                  onClick={() => togglePop(home, index)}
                >
                  <div className="card__image">
                    <img
                      src={
                        "https://ipfs.io/ipfs/QmQUozrHLAusXDxrvsESJ3PYB3rUeUuBAvVWw6nop2uu7c/3.png"
                      }
                      alt="Home"
                    />
                  </div>
                  <div className="card__info">
                    <h4>{home.price.toNumber()} ETH</h4>
                    <p>
                      <strong>{home.bedroom.toNumber()}</strong> bds |
                      <strong>{home.bathroom.toNumber()}</strong> ba |
                      <strong>{home.area.toNumber()}</strong> sqft
                    </p>
                    <p>{home.address}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="cards__section">
            <h3>Properties Owned By You</h3>
            <hr />
            <div className="cards">
              {ownedProperties.map((home, index) => (
                <div
                  className="card"
                  key={index}
                  onClick={() => togglePop(home, index)}
                >
                  <div className="card__image">
                    <img
                      src={
                        "https://ipfs.io/ipfs/QmQUozrHLAusXDxrvsESJ3PYB3rUeUuBAvVWw6nop2uu7c/3.png"
                      }
                      alt="Home"
                    />
                  </div>
                  <div className="card__info">
                    <h4>{home.price.toNumber()} ETH</h4>
                    <p>
                      <strong>{home.bedroom.toNumber()}</strong> bds |
                      <strong>{home.bathroom.toNumber()}</strong> ba |
                      <strong>{home.area.toNumber()}</strong> sqft
                    </p>
                    <p>{home.address}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {toggle && (
            <Home
              home={home}
              homeIndex={homeIndex}
              provider={provider}
              account={account}
              approver={approver}
              escrow={escrow}
              propertyContract={propertyContract}
              togglePop={togglePop}
            />
          )}
        </div>
      )}
    </div>
  );
};

export default PropertyList;
