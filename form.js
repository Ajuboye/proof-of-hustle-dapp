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

async function loadContract() {
  if (typeof window.ethereum !== "undefined") {
    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      await provider.send("eth_requestAccounts", []);
      const network = await provider.getNetwork();

      // 🚨 Ensure we're on Fuji
      if (network.chainId !== 43113) {
        try {
          await window.ethereum.request({
            method: "wallet_switchEthereumChain",
            params: [{ chainId: "0xa869" }],
          });
        } catch (switchError) {
          alert("Please switch your wallet to Avalanche Fuji (chainId 43113) and try again.");
          throw switchError;
        }
      }

      const signer = provider.getSigner();
      window.hustleContract = new ethers.Contract(contractAddress, contractABI, signer);
      console.log("✅ Contract loaded successfully on Fuji");
    } catch (err) {
      console.error("❌ Failed to load contract:", err);
      alert("Failed to load smart contract: " + (err.data?.message || err.message || err));
    }
  } else {
    alert("MetaMask not detected. Please install it.");
  }
}

window.addEventListener("DOMContentLoaded", async () => {
  await loadContract();

  document.getElementById("hustleForm").addEventListener("submit", async function (event) {
    event.preventDefault();

    const fullName = document.querySelector('input[placeholder="Your Name"]').value;
    const hustleType = document.querySelector('input[placeholder="What are you building?"]').value;
    const description = document.querySelector('input[placeholder="Link to demo / GitHub"]').value;

    if (!window.hustleContract) {
      alert("Smart contract not loaded.");
      return;
    }

    try {
      const tx = await window.hustleContract.submitHustle(fullName, hustleType, description);
      alert("⛏️ Submitting your hustle...");

      await tx.wait();
      alert("✅ Hustle submitted on-chain!");

      window.location.href = "feed.html";
    } catch (error) {
      console.error("❌ Error submitting:", error);
      alert("Error: " + (error.data?.message || error.message || error));
    }
  });
});