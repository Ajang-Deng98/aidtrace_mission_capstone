const getProvider = () => {
  const network = process.env.REACT_APP_BLOCKCHAIN_NETWORK || 'localhost';
  if (network === 'sepolia') {
    return `https://eth-sepolia.g.alchemy.com/v2/${process.env.REACT_APP_ALCHEMY_API_KEY || ''}`;
  }
  return 'http://127.0.0.1:7545';
};

export const BLOCKCHAIN_CONFIG = {
  provider: getProvider(),
  contractAddress: process.env.REACT_APP_CONTRACT_ADDRESS || '',
};
