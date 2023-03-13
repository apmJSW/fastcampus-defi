//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.9;

import "hardhat/console.sol";

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract Exchange is ERC20 {
    IERC20 token;

  constructor (address _token) ERC20("Gray uniswap V2", "GUNI-V2") {
    token = IERC20(_token);
  }
  
  function addLiquidity(uint256 _maxTokens) public payable {
    uint256 totalLiquidity = totalSupply();
    if (totalLiquidity > 0) {
      uint256 ethReserve = address(this).balance - msg.value;
      uint256 tokenReserve = token.balanceOf(address(this));

      uint256 tokenAmount = msg.value * tokenReserve / ethReserve;
      require(_maxTokens >= tokenAmount);
      uint256 liquidityMinted = totalLiquidity * msg.value / ethReserve;

      _mint(msg.sender, liquidityMinted);
      token.transferFrom(msg.sender, address(this), tokenAmount);
    } else {
      uint256 tokenAmount = _maxTokens;
      uint256 initialLiquidity = address(this).balance;

      _mint(msg.sender, initialLiquidity);
      token.transferFrom(msg.sender, address(this), tokenAmount);
    }
  }

  function removeLiquidity(uint256 _lpTokenAmount) public {
    uint256 totalLiquidity = totalSupply();
    uint256 ethAmount = address(this).balance * _lpTokenAmount / totalLiquidity;
    uint256 tokenAmount = token.balanceOf(address(this)) * _lpTokenAmount / totalLiquidity;

    _burn(msg.sender, _lpTokenAmount);

    payable(msg.sender).transfer(ethAmount);
    token.transfer(msg.sender, tokenAmount);
  }

  // ETH -> ERC20
  function ethToTokenSwap(uint256 _minTokens) public payable {
    // calculate amount out (zero fee)
    uint256 outputAmount = getOutputAmountWithFee(msg.value, address(this).balance - msg.value, token.balanceOf(address(this)));

    require(outputAmount >= _minTokens, "insufficient outputAmount");

    //transfer token out
    token.transfer(msg.sender, outputAmount);
  }

  // ERC20 -> ETH
  function tokenToEthSwap(uint256 _tokenSold, uint256 _minEth) public payable {
    // calculate amount out (zero fee)
    uint256 outputAmount = getOutputAmountWithFee(_tokenSold, token.balanceOf(address(this)), address(this).balance );

    require(outputAmount >= _minEth, "insufficient outputAmount");

    //transfer token out
    token.transferFrom(msg.sender, address(this), _tokenSold);
    payable(msg.sender).transfer(outputAmount);
  }

  function getPrice(uint256 inputReserve, uint256 outputReserve) public pure returns (uint256) {
    uint256 numerator = inputReserve;
    uint256 denominator = outputReserve;
    return numerator / denominator;
  }
  
  function getOutputAmountWithFee(uint256 inputAmount, uint256 inputReserve, uint256 outputReserve) public pure returns (uint256) {
    uint256 inputAmountWithFee = inputAmount * 99;
    uint256 numerator = (inputAmountWithFee * outputReserve);
    uint256 denominator = (inputReserve * 100 + inputAmountWithFee);
    return numerator / denominator;
  }

}

