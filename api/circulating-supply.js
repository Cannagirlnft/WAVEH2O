import { ethers } from "ethers";

export default async function handler(req, res) {
  try {
    const TOKEN_ADDRESS = "0xA03D12dfBC895fD1ba3504EB22B3F89Be819d82A";
    const ABI = [
      "function totalSupply() view returns (uint256)",
      "function balanceOf(address) view returns (uint256)"
    ];
    const provider = new ethers.JsonRpcProvider("https://rpc.ankr.com/polygon");
    const contract = new ethers.Contract(TOKEN_ADDRESS, ABI, provider);

    const burnAddresses = [
      "0x000000000000000000000000000000000000dEaD",
      "0x0000000000000000000000000000000000000000"
    ];

    const totalSupply = await contract.totalSupply();
    let burned = ethers.toBigInt(0);
    for (let addr of burnAddresses) {
      const bal = await contract.balanceOf(addr);
      burned += bal;
    }

    const circulating = totalSupply - burned;

    res.status(200).json({
      circulating_supply: Number(ethers.formatUnits(circulating, 18))
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Unable to fetch circulating supply" });
  }
}
