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

    expect(await cg.ownerOf(1)).to.equal(user1.address);
    expect(await cg.getGradientTokenId("32F1FA")).to.equal(1);
  });

  it("Shouldn't be able to mint duplicate gradient", async function () {
    const CG = await ethers.getContractFactory("CryptoGradients");
    const cg = await CG.deploy();
    await cg.deployed();

    const [user1] = await ethers.getSigners();

    await cg.connect(user1).mintGradient("3A21F2", "1BF9AF", {
      value: ethers.utils.parseEther("0.01"),
    });

    expect(await cg.ownerOf(1)).to.equal(user1.address);
    expect(await cg.getGradientTokenId("32F1FA")).to.equal(1);

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

    expect(await cg.ownerOf(1)).to.equal(user1.address);
    expect(await cg.getGradientTokenId("32F1FA")).to.equal(1);

    await expect(
      cg.connect(user1).mintGradient("3D22F9", "1FF1AB", {
        value: ethers.utils.parseEther("0.01"),
      })
    ).to.be.revertedWith("This gradient already exists");
  });
});
