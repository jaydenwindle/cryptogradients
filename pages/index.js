import React, { useState, useEffect } from "react";
import Head from "next/head";
import { HexColorPicker, HexColorInput } from "react-colorful";
import Web3Modal from "web3modal";
import { ethers } from "ethers";

import randomColor from "randomcolor";

import CryptoGradients from "../hardhat/artifacts/contracts/CryptoGradients.sol/CryptoGradients.json";

export default function Home() {
  const [provider, setProvider] = useState(undefined);
  const [color1, setColor1] = useState("#fff");
  const [color2, setColor2] = useState("#fff");

  useEffect(() => {
    setColor1(randomColor());
    setColor2(randomColor());
  }, []);

  const connect = async () => {
    const providerOptions = {
      // see https://github.com/Web3Modal/web3modal#provider-options
    };

    const web3Modal = new Web3Modal({
      cacheProvider: true,
      providerOptions,
    });

    const provider = await web3Modal.connect();

    const ethersProvider = new ethers.providers.Web3Provider(provider);

    setProvider(ethersProvider);
  };

  useEffect(() => {
    connect();
  }, []);

  return (
    <div
      className="flex flex-col items-center justify-center min-h-screen"
      style={{
        background: `linear-gradient(135deg, ${color1}, ${color2})`,
      }}
    >
      <Head>
        <title>CryptoGradients</title>
      </Head>

      <main className="flex flex-col items-center justify-center w-full flex-1 px-20 text-center">
        <div className="flex flex-col max-w-24">
          <h1 className="text-5xl font-bold mb-2 text-white">
            CryptoGradients
          </h1>
          <h2 className="text-xl font-medium mb-12 text-white">
            10k unique gradients, stored on-chain
          </h2>
          <div className="bg-white rounded-xl p-5 ">
            <div className="flex flex-row">
              <div className="flex flex-col">
                <HexColorPicker
                  color={color1}
                  onChange={setColor1}
                  className="mb-3"
                />
                <HexColorInput
                  prefixed
                  color={color1}
                  onChange={setColor1}
                  className="flex flex-1 focus:ring-indigo-500 focus:border-indigo-500 text-center rounded-md text-white py-2"
                  style={{ backgroundColor: color1 }}
                />
              </div>
              <div className="flex flex-col border-l-2 pl-5 ml-5">
                <HexColorPicker
                  color={color2}
                  onChange={setColor2}
                  className="mb-3"
                />
                <HexColorInput
                  prefixed
                  color={color2}
                  onChange={setColor2}
                  className="flex flex-1 focus:ring-indigo-500 focus:border-indigo-500 text-center rounded-md text-white py-2"
                  style={{ backgroundColor: color2 }}
                />
              </div>
            </div>
          </div>
          <div className="flex flex-1 flex-col bg-white rounded-xl p-5 mt-5">
            {provider !== undefined ? (
              <button
                type="button"
                class="w-full flex items-center justify-center text-center px-6 py-3 text-base font-medium rounded-md shadow-sm text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                style={{
                  background: `linear-gradient(135deg, ${color1}, ${color2})`,
                }}
                onClick={async () => {
                  const signer = await provider.getSigner();
                  const cg = new ethers.Contract(
                    process.env.NEXT_PUBLIC_CONTRACT_ADDRESS,
                    CryptoGradients.abi,
                    signer
                  );
                  console.log(cg);

                  const _color1 = color1.slice(1, 7).toUpperCase();
                  const _color2 = color2.slice(1, 7).toUpperCase();
                  console.log(_color1, _color2);

                  try {
                    const transaction = await cg.functions.mintGradient(
                      _color1,
                      _color2,
                      { value: ethers.utils.parseEther("0.01") }
                    );
                    const tx = await transaction.wait();

                    console.log(tx);
                    const [event] = tx.events;
                    const tokenId = event.args.tokenId.toNumber();
                    alert(`Success! Minted CryptoGradient #${tokenId}`);
                  } catch (error) {
                    if (error.data?.message?.includes("already exists")) {
                      alert("Gradient already exists");
                    } else {
                      console.log(error);
                      alert("Failed to mint");
                    }
                  }
                }}
              >
                mint this gradient
              </button>
            ) : (
              <button
                type="button"
                class="w-full flex items-center justify-center text-center px-6 py-3 text-base font-medium rounded-md shadow-sm text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                style={{
                  background: `linear-gradient(135deg, ${color1}, ${color2})`,
                }}
                onClick={connect}
              >
                connect wallet
              </button>
            )}
          </div>
          <div className="flex space-x-4 justify-center mt-8">
            <a
              href="#"
              className="text-white underline"
              onClick={() => alert("coming soon")}
            >
              combine
            </a>
            <a
              href="#"
              className="text-white underline"
              onClick={() => alert("coming soon...")}
            >
              faqs
            </a>
            <a
              href="#"
              className="text-white underline"
              onClick={() => alert("coming soon...")}
            >
              roadmap
            </a>
          </div>
        </div>
      </main>
    </div>
  );
}
