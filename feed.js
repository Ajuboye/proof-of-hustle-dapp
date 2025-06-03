const contractAddress = "0xA7011E842Ae2dD14C61DE899B56FE45dA584faa2";

const contractABI = [
  {
    "inputs": [],
    "name": "getHustles",
    "outputs": [
      {
        "components": [
          { "internalType": "string", "name": "name", "type": "string" },
          { "internalType": "string", "name": "project", "type": "string" },
          { "internalType": "string", "name": "link", "type": "string" },
          { "internalType": "uint256", "name": "timestamp", "type": "uint256" }
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

async function loadHustles() {
  try {
    // Connect to MetaMask
    await window.ethereum.request({ method: "eth_requestAccounts" });
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const contract = new ethers.Contract(contractAddress, contractABI, signer);

    // Call getHustles
    const hustles = await contract.getHustles();

    // 🚨 Add this debug line:
    console.log("📦 Hustles fetched:", hustles);

    // Display each hustle
    const listDiv = document.getElementById("hustle-list");
    listDiv.innerHTML = ""; // clear any existing
    hustles.forEach(h => {
      const el = document.createElement("div");
      el.className = "hustle-card";
      el.innerHTML = `
        <h3>${h.name}</h3>
        <p><strong>Project:</strong> ${h.project}</p>
        <p><strong>Link:</strong> <a href="${h.link}" target="_blank">${h.link}</a></p>
        <p><small>⏰ ${new Date(h.timestamp * 1000).toLocaleString()}</small></p>
      `;
      listDiv.appendChild(el);
    });
  } catch (err) {
    console.error("❌ Failed to load hustles: ", err);
    alert("❌ Failed to load feed. Please reconnect your wallet.");
  }
}

// Load hustles when the page loads
window.addEventListener("load", loadHustles);
