import { useEffect, useState } from "react";
import { ethers } from "ethers";

// Components
import Navigation from "./components/Navigation";
import Search from "./components/Search";
import Home from "./components/Home";

// ABIs
import RealEstate from "./abis/RealEstate.json";
import Escrow from "./abis/EscrowContract.json";
import PropertyContract from "./abis/PropertyContract.json";

// Config
import config from "./config.json";
import PropertyListForm from "./components/PropertyListForm";
import { Route, Routes } from "react-router-dom";
import PropertyList from "./components/PropertyList";

function App() {
  const [provider, setProvider] = useState(null);
  const [escrow, setEscrow] = useState(null);
  const [propertyContract, setPropertyContract] = useState(null);

  const [account, setAccount] = useState(null);


  const loadBlockchainData = async () => {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    setProvider(provider);
    const network = await provider.getNetwork();

    // REAL ESTATE CONTRACT
    // const realEstate = new ethers.Contract(
    //   config[network.chainId].realEstate.address,
    //   RealEstate,
    //   provider
    // );


    // ESCROW CONTRACT
    const escrow = new ethers.Contract(
      config[network.chainId].EscrowContract.address,
      Escrow,
      provider
    );
    setEscrow(escrow);

    // PROPERTY CONTRACT
    const propertyContract = new ethers.Contract(
        config[network.chainId].PropertyContract.address,
        PropertyContract,
        provider
    );
    setPropertyContract(propertyContract)

    window.ethereum.on("accountsChanged", async () => {
      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });
      const account = ethers.utils.getAddress(accounts[0]);
      setAccount(account);
    });
  };

  useEffect(() => {
    loadBlockchainData();
  }, [account]);

//   const togglePop = (home) => {
//     setHome(home);
//     toggle ? setToggle(false) : setToggle(true);
//   };


  return (
    <div>
      <Navigation account={account} setAccount={setAccount} />
      <Search />

        {provider && propertyContract && escrow && (
            <Routes>
                <Route path="/" element={ <PropertyList propertyContract={propertyContract} provider={provider} escrow={escrow} account={account} /> } />
                <Route path="/list" element={ <PropertyListForm propertyContract={propertyContract} provider={provider}/>}  />
            </Routes>
        )}
      
    </div>
  );
}

export default App;
