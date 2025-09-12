const { createPublicClient, http } = require('viem');
const { hardhat } = require('viem/chains');

async function verifyDebugSetup() {
  console.log('🔍 Verifying debug setup...\n');

  try {
    // Create a client to connect to local Hardhat node
    const client = createPublicClient({
      chain: hardhat,
      transport: http('http://127.0.0.1:8545'),
    });

    // Test connection
    console.log('1. Testing connection to local blockchain...');
    const blockNumber = await client.getBlockNumber();
    console.log(`   ✅ Connected! Current block: ${blockNumber}`);

    // Check if contracts are deployed
    console.log('\n2. Checking deployed contracts...');
    
    // Check SE2NFT contract
    try {
      const se2NftCode = await client.getCode('0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0');
      if (se2NftCode && se2NftCode !== '0x') {
        console.log('   ✅ SE2NFT contract found');
      } else {
        console.log('   ❌ SE2NFT contract not found - run "yarn deploy" first');
      }
    } catch (error) {
      console.log('   ❌ Error checking SE2NFT contract:', error.message);
    }

    // Check EventTicketNFT contract
    try {
      const eventTicketCode = await client.getCode('0xCf7Ed3AccA5a467e9e704C703E8D87F634fB0Fc9');
      if (eventTicketCode && eventTicketCode !== '0x') {
        console.log('   ✅ EventTicketNFT contract found');
      } else {
        console.log('   ❌ EventTicketNFT contract not found - run "yarn deploy" first');
      }
    } catch (error) {
      console.log('   ❌ Error checking EventTicketNFT contract:', error.message);
    }

    console.log('\n🎉 Debug setup verification complete!');
    console.log('   Visit http://localhost:3000/debug to interact with your contracts');

  } catch (error) {
    console.log('❌ Error:', error.message);
    console.log('\n💡 Make sure to:');
    console.log('   1. Start the local blockchain: yarn chain');
    console.log('   2. Deploy contracts: yarn deploy');
    console.log('   3. Start the frontend: yarn dev');
  }
}

verifyDebugSetup();
