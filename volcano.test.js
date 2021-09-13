const Volcano = artifacts.require("VolcanoToken");

contract("Volcano", accounts => {

    it("should mint 10000 VolcanoCoin", async () => {
    const instance = await Volcano.deployed();
    //console.log(instance);
    const totalSupply = await instance.totalSupply.call();
    assert.equal(
        totalSupply.toNumber(),
       10000,
        "Minting Failed",
        );            
    });
/* here is my test for checking zero balance of 0xcB7C09fEF1a308143D9bf328F2C33f33FaA46bC2" */
    it("should show zero balance", async () => {
        const instance = await Volcano.deployed();
        const balance = await instance.balanceOf.call("0xcB7C09fEF1a308143D9bf328F2C33f33FaA46bC2");
        assert.equal(
            balance.toNumber(),
            0,
            "Balance is not zero",
            );
    })
});
