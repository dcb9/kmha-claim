import { getContracts } from '@keymesh/contracts'
import { providers, Wallet, utils as etherUtils } from 'ethers'
import { Handler, Context, Callback } from 'aws-lambda'

const network = providers.networks[process.env.NETWORK!]
const wallet = new Wallet(process.env.PRIVATE_KEY!)
wallet.provider = new providers.InfuraProvider(network, process.env.TOKEN!)

async function airdropClaim(
  receiver: string,
  id: string,
  username: string,
  verified: boolean,
  amount: string,
  inviterId: string,
  inviteAward: string,
  sig: string,
) {
  id = etherUtils.hexlify(etherUtils.toUtf8Bytes(id)).padEnd(32, '0')
  inviterId = etherUtils.hexlify(etherUtils.toUtf8Bytes(inviterId)).padEnd(32, '0')

  const { airdrop } = await getContracts(wallet)

  return await airdrop.claim(receiver, id, username, verified, amount, inviterId, inviteAward, sig)

  /*
  const hash = await airdrop.getProveHash(receiver, id, username, verified, amount, inviterId, inviteAward)
  console.log("hash: ", hash)

  const result = await airdrop.getMsgSigner(hash,sig)
  console.log("msgSigner", result)
  */
}

const claim: Handler = async (e: any, context: Context, callback: Callback) => {
  try {
    console.log("event: ", e)
    const receipt = await airdropClaim(
      e.receiver,
      e.id,
      e.username,
      e.verified,
      e.amount,
      e.inviterId,
      e.inviteAward,
      e.sig,
    )
    console.log("receipt: ", receipt)
    callback(undefined, receipt)
  } catch (exception) {
    callback(exception)
  }
}

export { claim }
