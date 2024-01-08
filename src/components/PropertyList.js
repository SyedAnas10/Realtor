import React, { useEffect, useState } from "react";

const PropertyList = ({propertyContract, provider}) => {
  const [homes, setHomes] = useState([]);
  const [home, setHome] = useState({});
  const [toggle, setToggle] = useState(false);

  const loadProperties = async () => {
    const signer = provider.getSigner();
    const propertiesCount = await propertyContract.getPropertyCount();
    const properties = [];

    for (var i = 1; i <= propertiesCount; i++) {
      const metadata = await propertyContract.getPropertyDetails(i);
      properties.push(metadata);
    }
    setHomes(properties);
  };

  const togglePop = (home) => {
    setHome(home);
    toggle ? setToggle(false) : setToggle(true);
  };

  useEffect( () => {
    loadProperties()
  }, [])

  return (
    <div>
      <div className="cards__section">
        <h3>Homes For You</h3>

        <hr />

        <div className="cards">
          {homes.map((home, index) => (
            <div className="card" key={index} onClick={() => togglePop(home)}>
              <div className="card__image">
                <img src={'https://ipfs.io/ipfs/QmQUozrHLAusXDxrvsESJ3PYB3rUeUuBAvVWw6nop2uu7c/3.png'} alt="Home" />
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
    </div>
  );
};

export default PropertyList;
