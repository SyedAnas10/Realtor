// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// You can also run a script with `npx hardhat run <script>`. If you do that, Hardhat
// will compile your contracts, add the Hardhat Runtime Environment's members to the
// global scope, and execute the script.
const { ethers } = require('hardhat');

const tokens = (n) => {
  return ethers.utils.parseUnits(n.toString(), 'ether')
}

async function main() {
  // Setup accounts
  const [buyer, seller, inspector, lender] = await ethers.getSigners()

  // Deploy Real Estate
  const RealEstate = await ethers.getContractFactory('RealEstate')
  const realEstate = await RealEstate.deploy()
  await realEstate.deployed()

  console.log(`Deployed Real Estate Contract at: ${realEstate.address}`)
  console.log(`Minting 3 properties...\n`)

  // for (let i = 0; i < 3; i++) {
  //   const transaction = await realEstate.connect(seller).mint(`https://ipfs.io/ipfs/QmQVcpsjrA6cr1iJjZAodYwmPekYgbnXGo4DFubJiLc2EB/${i + 1}.json`)
  //   await transaction.wait()
  // }

  // Deploy Escrow
  const Escrow = await ethers.getContractFactory('Escrow')
  const escrow = await Escrow.deploy(
    realEstate.address,
    seller.address,
    inspector.address,
    lender.address
  )
  await escrow.deployed()

  console.log(`Deployed Escrow Contract at: ${escrow.address}`)
  console.log(`Listing 3 properties...\n`)

  // for (let i = 0; i < 3; i++) {
  //   // Approve properties...
  //   let transaction = await realEstate.connect(seller).approve(escrow.address, i + 1)
  //   await transaction.wait()
  // }

  
  // Listing properties...
  // let transaction = await escrow.connect(seller).list(1, buyer.address, tokens(20), tokens(10))
  // await transaction.wait()
  
  // transaction = await escrow.connect(seller).list(2, buyer.address, tokens(15), tokens(5))
  // await transaction.wait()
  
  // transaction = await escrow.connect(seller).list(3, buyer.address, tokens(10), tokens(5))
  // await transaction.wait()
  
  // Deploy Property Contract
  const PropertyContract = await ethers.getContractFactory('PropertyContract')
  const _propertyContract = await PropertyContract.deploy()
  await _propertyContract.deployed()

  console.log(`Property Contract deployed at : ${_propertyContract.address}`)

  // Minting and Listing Properties
  let transaction = await _propertyContract.connect(seller).mint('Home', '25 Kenwyn Drive', 400, 2010, 2, 1, 1000)
  await transaction.wait()
  console.log(`Property Listed`)
  console.log(`Owner of property is ${JSON.stringify(_propertyContract.ownerOf(1))} \n`)

  // Deploy new Escrow Contract
  const EscrowContract = await ethers.getContractFactory('EscrowContract')
  const escrowContract = await EscrowContract.deploy()
  await escrowContract.deployed()

  console.log(`New Escrow Contract deployed at : ${escrowContract.address}`)

  // Transferring Property
  transaction = await escrowContract.createEscrow(seller.address, 1, 1000, {value: 500, gasLimit: 3e7})
  await transaction.wait()
    console.log(`Escrow Contract created ${ JSON.stringify(escrowContract.getEscrowDetails(1))}\n\n`)
  let _newTransaction = await escrowContract.connect(seller).completeEscrow(1, {gasLimit: 3e7})
  await _newTransaction.wait()

  console.log(`Owner of property is ${_propertyContract.ownerOf(1)} \n`)



  
  
  console.log(`Finished.`)
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});