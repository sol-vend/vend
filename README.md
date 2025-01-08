# Solana Vending Machine Frontend

This project is the frontend implementation of a Solana-based vending machine application. It allows users to interact with a Solana smart contract to purchase items from a virtual vending machine. The frontend is built using **React** and integrates with the **Solana blockchain** for transactions.

## Features

- **Solana Blockchain Integration**: Allows interaction with Solana smart contracts.
- **Wallet Connection**: Users can connect their Solana wallets (such as Phantom) to interact with the app.
- **Item Listings**: Displays a list of vending machine items, including their prices and details.
- **Purchase Flow**: Users can purchase items directly using SOL tokens.
- **Responsive Design**: Optimized for both desktop and mobile devices.
- **Error Handling**: Displays user-friendly messages if anything goes wrong, such as wallet connection issues or transaction failures.

## Tech Stack

- **Frontend**: React.js, JavaScript, CSS
- **Solana Blockchain**: Solana Web3.js
- **Wallet Integration**: Phantom Wallet Adapter (using `@solana/wallet-adapter-react`)
- **Smart Contracts**: Interacts with Solana smart contracts (written in Rust or other supported languages)
- **Transaction Handling**: Sends transactions via the Solana blockchain to process purchases

## Prerequisites

Before setting up the project, ensure you have the following installed:

- **Solana Wallet** (e.g., Phantom) to interact with the Solana blockchain.
- **Node.js** (version 14 or higher).
- A Solana **network endpoint** (Devnet, Testnet, or Mainnet) to interact with the Solana blockchain.

## Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/yourusername/solana-vending-machine-frontend.git
