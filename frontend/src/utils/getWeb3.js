import Web3 from 'web3';

const getWeb3 = () => {
  return new Promise((resolve, reject) => {
    window.addEventListener('load', async () => {
      if (window.ethereum) {
        const web3 = new Web3(window.ethereum);
        try {
          await window.ethereum.enable();
          resolve(web3);
        } catch (error) {
          reject(error);
        }
      } else if (window.web3) {
        const web3 = window.web3;
        resolve(web3);
      } else {
        const network = process.env.REACT_APP_BLOCKCHAIN_NETWORK || 'localhost';
        let provider;
        if (network === 'sepolia') {
          provider = new Web3.providers.HttpProvider(`https://eth-sepolia.g.alchemy.com/v2/${process.env.REACT_APP_ALCHEMY_API_KEY || ''}`);
        } else {
          provider = new Web3.providers.HttpProvider('http://127.0.0.1:7545');
        }
        const web3 = new Web3(provider);
        resolve(web3);
      }
    });
  });
};

export default getWeb3;