const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");

const TokenModule = buildModule("HelloTokenModule", (m) => {
    const token = m.contract("HelloToken");

    return { token };
});

module.exports = TokenModule;