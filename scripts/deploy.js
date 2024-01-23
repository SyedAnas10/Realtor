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
  const [deployer, seller, buyer, approver] = await ethers.getSigners()
  
  
  // Deploy Property Contract
  const PropertyContract = await ethers.getContractFactory('PropertyContract')
  const _propertyContract = await PropertyContract.deploy()
  await _propertyContract.deployed()
  console.log(`Property Contract deployed at : ${_propertyContract.address}`)

  // Deploy new Escrow Contract
  const EscrowContract = await ethers.getContractFactory('EscrowContract')
  const _escrowContract = await EscrowContract.deploy(_propertyContract.address)
  await _escrowContract.deployed()
  console.log(`New Escrow Contract deployed at : ${_escrowContract.address} \n`)

  // Minting Properties
  // let transaction = await _propertyContract.connect(seller).mint('Home', '25 Kenwyn Drive', 400, 2010, 2, 1, tokens(30))
  // await transaction.wait()
  // console.log(`Property Listed Successfully`)
  // let propertyOwner = await _propertyContract.ownerOf(1)
  // console.log(`Owner of property is ${propertyOwner}  \n`)

  // // Approve Sales
  // transaction = await _propertyContract.connect(seller).approve(buyer.address, 1)
  // await transaction.wait()


  // // Initiating Property Transfer
  // transaction = await _escrowContract.connect(buyer).createEscrow(seller.address, approver.address, 1, tokens(30), { value: tokens(15), gasLimit: 3e7 })
  // await transaction.wait()
  // console.log(`Escrow contract created successfully`)

  // let escrowDetails = await _escrowContract.getEscrowDetails(1);
  // console.log(`Escrow Details are as follows \n ${ JSON.stringify(escrowDetails)}\n`)

  // // Approving Transfer 
  // transaction = await _escrowContract.connect(approver).approveEscrow(1)
  // await transaction.wait()
  // console.log(`Escrow Approved`)

  // // Checking Balance
  // let buyerBalance = await buyer.getBalance();
  // let sellerBalance = await seller.getBalance();
  // let deployerBalance = await deployer.getBalance();
  // let approverBalance = await approver.getBalance();
  // console.log(`Balance before transaction for accounts are \n  
  // Seller : ${sellerBalance} \n 
  // Buyer : ${buyerBalance} \n
  // Approver: ${approverBalance} \n
  // Deployer: ${deployerBalance} \n
  // `);

  // // Completing Transfer
  // transaction = await _propertyContract.connect(seller).approve(seller.address, 1)
  // await transaction.wait()
  // transaction = await _escrowContract.connect(seller).completeEscrow(1,  {gasLimit: 3e7})
  // await transaction.wait()
  // console.log(`Property Transfer Completed. \n`)

  // // Verify Balance
  // buyerBalance = await buyer.getBalance();
  // sellerBalance = await seller.getBalance();
  // deployerBalance = await deployer.getBalance();
  // approverBalance = await approver.getBalance();
  // console.log(`Balance after transaction for accounts are \n  
  // Seller : ${sellerBalance} \n 
  // Buyer : ${buyerBalance} \n
  // Approver: ${approverBalance} \n
  // Deployer: ${deployerBalance} \n
  // `);

  
  
  console.log(`Finished.`)
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});