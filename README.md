# KMH airdrop claim

### Environment variables:

- TOKEN               infura.io token
- PRIVATE_KEY         wallet private key to sign and send transactions
- NETWORK             mainnet, rinkeby, kovan etc. see: https://github.com/ethers-io/ethers.js/blob/master/providers/networks.json

- ENV=production      // if you need to run on AWS Lambda

### Test

```
yarn
yarn build
node main.js
```
### Deployment

```
yarn deploy YOUR_FUNCTION_NAME
```
