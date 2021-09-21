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

    expect(await cg.tokenURI(0)).to.equal(
      "data:text/plain;charset=utf-8,%7B%22title%22%3A%20%22CryptoGradient%20%230%22%2C%20%22description%22%3A%20%2210k%20unique%20on-chain%20gradients%22%2C%20%22image%22%3A%20%22data%3Aimage%2Fsvg%2Bxml%2C%253Csvg%20width%3D%271024%27%20height%3D%271024%27%20viewBox%3D%270%200%201024%201024%27%20fill%3D%27none%27%20xmlns%3D%27http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%27%253E%253Crect%20width%3D%271024%27%20height%3D%271024%27%20fill%3D%27white%27%2F%253E%253Crect%20width%3D%271024%27%20height%3D%271024%27%20fill%3D%27url%28%2523paint0_linear%29%27%2F%253E%253Cdefs%253E%253ClinearGradient%20id%3D%27paint0_linear%27%20x1%3D%270%27%20y1%3D%270%27%20x2%3D%271017.54%27%20y2%3D%271017.57%27%20gradientUnits%3D%27userSpaceOnUse%27%253E%253Cstop%20stop-color%3D%27%25239DE0FB%27%2F%253E%253Cstop%20offset%3D%271%27%20stop-color%3D%27%25233FC1F8%27%2F%253E%253C%2FlinearGradient%253E%253C%2Fdefs%253E%253C%2Fsvg%253E%250A%22%7D"
    );
  });
});
