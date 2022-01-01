import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { expect } from "chai";
import { ethers, network } from "hardhat";
import { VoteSystem, VoteSystem__factory } from "../typechain";

let voteContract: VoteSystem;
let accounts: SignerWithAddress[];

beforeEach("", async function () {
  accounts = await ethers.getSigners();
  const factory: VoteSystem__factory = (await ethers.getContractFactory(
    "VoteSystem"
  )) as VoteSystem__factory;

  voteContract = await factory.deploy();
});

describe("Test Vote system", async function () {
  it("Create a voting", async function () {
    expect(
      await voteContract.createVote(
        "DOG",
        "CAT",
        "Which pet is your favorite?",
        3600
      )
    )
      .emit(voteContract, "CreateVote")
      .withArgs("DOG", "CAT");

    let res = await voteContract.votes(1);
    expect(res.position0).eq("DOG");
    expect(res.position1).eq("CAT");
    expect(res.description).eq("Which pet is your favorite?");

    expect(await voteContract.connect(accounts[0]).vote(1, 0));
    expect(await voteContract.connect(accounts[1]).vote(1, 0));
    expect(await voteContract.connect(accounts[2]).vote(1, 0));
    expect(await voteContract.connect(accounts[3]).vote(1, 1));
    expect(await voteContract.connect(accounts[4]).vote(1, 1));
    res = await voteContract.votes(1);
    expect(res.counterPosition0).eq(3);
    expect(res.counterPosition1).eq(2);

    network.provider.send("evm_increaseTime", [3600]);
    network.provider.send("evm_mine");

    await expect(voteContract.connect(accounts[5]).vote(1, 1)).revertedWith(
      "The vote is finished"
    );
  });
});
