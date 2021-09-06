import { ethers } from "ethers";

import CryptoGradients from "../../../hardhat/artifacts/contracts/CryptoGradients.sol/CryptoGradients.json";

export default async (req, res) => {
  const { tokenId } = req.query;

  const provider = new ethers.providers.JsonRpcProvider(
    process.env.RPC_PROVIDER
  );
  const cg = new ethers.Contract(
    process.env.NEXT_PUBLIC_CONTRACT_ADDRESS,
    CryptoGradients.abi,
    provider
  );

  const gradient = await cg.getGradientForTokenId(1);

  res.setHeader(
    "Cache-Control",
    `public, immutable, no-transform, s-maxage=31536000, max-age=31536000`
  );

  const baseUrl = process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_URL}`
    : "http://localhost:3000";

  res.json({
    name: `Gradient #${tokenId}`,
    description: "CryptoGradients are 10k unique gradients stored on chain.",
    image: `${baseUrl}/api/image/${gradient}`,
  });
};
