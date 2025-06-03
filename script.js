const contractAddress = "0xA7011E842Ae2dD14C61DE899B56FE45dA584faa2";

const contractABI = [
  {
    "inputs": [
      { "internalType": "string", "name": "_fullName", "type": "string" },
      { "internalType": "string", "name": "_hustleType", "type": "string" },
      { "internalType": "string", "name": "_description", "type": "string" }
    ],
    "name": "submitHustle",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "getHustles",
    "outputs": [
      {
        "components": [
          { "internalType": "string", "name": "fullName", "type": "string" },
          { "internalType": "string", "name": "hustleType", "type": "string" },
          { "internalType": "string", "name": "description", "type": "string" },
          { "internalType": "address", "name": "submitter", "type": "address" }
        ],
        "internalType": "struct ProofOfHustle.Hustle[]",
        "name": "",
        "type": "tuple[]"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  }
];

let provider;
let signer;
let hustleContract;

async function connectWallet() {
  if (window.ethereum) {
    try {
      // Request account access
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      alert("Wallet connected: " + accounts[0]);

      // Setup provider & signer
      provider = new ethers.providers.Web3Provider(window.ethereum);
      signer = provider.getSigner();

      // Get network info
      const network = await provider.getNetwork();
      if (network.chainId !== 43113) {
        try {
          // Try switching to Fuji
          await window.ethereum.request({
            method: 'wallet_switchEthereumChain',
            params: [{ chainId: '0xa869' }], // Fuji chainId in hex
          });
        } catch (switchError) {
          // If Fuji isn't added to MetaMask, try adding it
          if (switchError.code === 4902) {
            try {
              await window.ethereum.request({
                method: 'wallet_addEthereumChain',
                params: [{
                  chainId: '0xa869',
                  chainName: 'Avalanche Fuji C-Chain',
                  nativeCurrency: {
                    name: 'AVAX',
                    symbol: 'AVAX',
                    decimals: 18
                  },
                  rpcUrls: ['https://api.avax-test.network/ext/bc/C/rpc'],
                  blockExplorerUrls: ['https://testnet.snowtrace.io/']
                }]
              });
            } catch (addError) {
              console.error("Failed to add Fuji:", addError);
              alert("Could not add Fuji Testnet to MetaMask.");
              return;
            }
          } else {
            console.error("Failed to switch to Fuji:", switchError);
            alert("Please switch your MetaMask network to Avalanche Fuji Testnet (43113).");
            return;
          }
        }
      }

      // Connect the contract
      hustleContract = new ethers.Contract(contractAddress, contractABI, signer);
      window.hustleContract = hustleContract;

      // Redirect to form
      window.location.href = "form.html";
    } catch (error) {
      console.error("Connection error:", error);
      alert("Wallet connection failed. Check console.");
    }
  } else {
    alert("MetaMask not detected. Please install it.");
  }
}
