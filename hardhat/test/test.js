const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("CryptoGradients", function () {
  it("Should correctly determine color validity", async function () {
    const CG = await ethers.getContractFactory("CryptoGradients");
    const cg = await CG.deploy();
    await cg.deployed();

    expect(await cg.isValidColor("2D75C6")).to.equal(true);
    expect(await cg.isValidColor("1A9937")).to.equal(true);
    expect(await cg.isValidColor("/A9937")).to.equal(false);
    expect(await cg.isValidColor("1A9:37")).to.equal(false);
    expect(await cg.isValidColor("1A993@")).to.equal(false);
    expect(await cg.isValidColor("1A993G")).to.equal(false);
  });

  it("Should generate gradient hash correctly", async function () {
    const CG = await ethers.getContractFactory("CryptoGradients");
    const cg = await CG.deploy();
    await cg.deployed();

    expect(await cg.generateGradientHash("3A21F2", "1BF9AF")).to.equal(
      "32F1FA"
    );
  });

  it("Should mint gradient correctly", async function () {
    const CG = await ethers.getContractFactory("CryptoGradients");
    const cg = await CG.deploy();
    await cg.deployed();

    const [user1] = await ethers.getSigners();

    await cg.connect(user1).mintGradient("3A21F2", "1BF9AF", {
      value: ethers.utils.parseEther("0.01"),
    });

    expect(await cg.ownerOf(0)).to.equal(user1.address);
    expect(await cg.getTokenForGradientHash("32F1FA"))
      .property("tokenId")
      .to.equal(0);
  });

  it("Shouldn't be able to mint duplicate gradient", async function () {
    const CG = await ethers.getContractFactory("CryptoGradients");
    const cg = await CG.deploy();
    await cg.deployed();

    const [user1] = await ethers.getSigners();

    await cg.connect(user1).mintGradient("3A21F2", "1BF9AF", {
      value: ethers.utils.parseEther("0.01"),
    });

    expect(await cg.ownerOf(0)).to.equal(user1.address);
    expect(await cg.getTokenForGradientHash("32F1FA"))
      .property("tokenId")
      .to.equal(0);

    await expect(
      cg.connect(user1).mintGradient("3A21F2", "1BF9AF", {
        value: ethers.utils.parseEther("0.01"),
      })
    ).to.be.revertedWith("This gradient already exists");
  });

  it("Shouldn't be able to mint similar gradient", async function () {
    const CG = await ethers.getContractFactory("CryptoGradients");
    const cg = await CG.deploy();
    await cg.deployed();

    const [user1] = await ethers.getSigners();

    await cg.connect(user1).mintGradient("3A21F2", "1BF9AF", {
      value: ethers.utils.parseEther("0.01"),
    });

    expect(await cg.ownerOf(0)).to.equal(user1.address);
    expect(await cg.getTokenForGradientHash("32F1FA"))
      .property("tokenId")
      .to.equal(0);

    await expect(
      cg.connect(user1).mintGradient("3D22F9", "1FF1AB", {
        value: ethers.utils.parseEther("0.01"),
      })
    ).to.be.revertedWith("This gradient already exists");
  });

  it("Should render gradient correctly", async function () {
    const CG = await ethers.getContractFactory("CryptoGradients");
    const cg = await CG.deploy();
    await cg.deployed();

    const [user1] = await ethers.getSigners();

    await cg.connect(user1).mintGradient("9DE0FB", "3FC1F8", {
      value: ethers.utils.parseEther("0.01"),
    });

    expect(await cg.ownerOf(0)).to.equal(user1.address);
    const tokenUri = await cg.tokenURI(0);
    console.log(tokenUri);

    const encodedPayload = tokenUri.split(",").pop();
    const buff = new Buffer.from(encodedPayload, "base64");
    const payload = buff.toString();

    expect(payload).to.equal(
      '{"name":"CryptoGradient #0", "description": "10k on-chain gradients", "image": "data:image/svg+xml,%3Csvg width="1024" height="1024" viewBox="0 0 1024 1024" fill="none" xmlns="http://www.w3.org/2000/svg"%3E%3Crect width="1024" height="1024" fill="white"/%3E%3Crect width="1024" height="1024" fill="url(%23paint0_linear)"/%3E%3Cdefs%3E%3ClinearGradient id="paint0_linear" x1="0" y1="0" x2="1024" y2="1024" gradientUnits="userSpaceOnUse"%3E%3Cstop stop-color="%239DE0FB"/%3E%3Cstop offset="1" stop-color="%233FC1F8"/%3E%3C/linearGradient%3E%3C/defs%3E%3C/svg%3E"}'
    );
  });
});
