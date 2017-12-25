import BigNumber from 'bignumber.js'
import TxModel from 'models/TxModel'
import BitcoinAbstractNode from './BitcoinAbstractNode'
import { DECIMALS } from './BitcoinEngine'

export default class BitcoinBlockexplorerNode extends BitcoinAbstractNode {
  async getTransactionInfo (txid) {
    try {
      const res = await this._api.get(`/tx/${txid}`)
      return res.data
    } catch (e) {
      this.trace(`getTransactionInfo ${txid} failed`, e)
      throw e
    }
  }

  async getFeeRate () {
    try {
      const res = await this._api.get(`/utils/estimatefee?nbBlocks=2`)
      const rate = res.data['2']
      return rate > 0
        ? DECIMALS * rate / 1024
        : 450 // default satoshis per byte for testnets
    } catch (e) {
      this.trace(`getFeeRate failed`, e)
      throw e
    }
  }

  async getAddressInfo (address) {
    try {
      const res = await this._api.get(`/addr/${address}?noTxList=1&noCache=1`)
      const { balance, unconfirmedBalance } = res.data
      return {
        balance0: new BigNumber(balance).plus(unconfirmedBalance),
        balance6: new BigNumber(balance),
      }
    } catch (e) {
      this.trace(`getAddressInfo ${address} failed`, e)
      throw e
    }
  }

  async getAddressUTXOS (address) {
    try {
      const res = await this._api.get(`/addr/${address}/utxo`)
      return res.data
    } catch (e) {
      this.trace(`getAddressInfo ${address} failed`, e)
      throw e
    }
  }

  async send (account, rawtx) {
    try {
      const params = new URLSearchParams()
      params.append('rawtx', rawtx)
      const res = await this._api.post('/tx/send', params)
      const tx = await this.getTransactionInfo(res.data.txid)
      const model = this._createTxModel(tx, account)
      setImmediate(() => {
        this.emit('tx', model)
      })
      return model
    } catch (e) {
      this.trace(`send transaction ${rawtx} failed`, e)
      throw e
    }
  }

  _createTxModel (tx, account): TxModel {
    const from = tx.isCoinBase ? 'coinbase' : tx.vin.map((input) => input.addr).join(',')
    const to = tx.vout.map((output) => output.scriptPubKey.addresses.filter((a) => a !== account).join(',')).join(',')

    let value = new BigNumber(0)
    for (const output of tx.vout) {
      if (output.scriptPubKey.addresses.indexOf(account) < 0) {
        value = value.add(new BigNumber(output.value))
      }
    }

    return new TxModel({
      txHash: tx.txid,
      // blockHash: tx.blockhash,
      // blockNumber: tx.blockheight,
      blockNumber: null,
      time: tx.time,
      from,
      to,
      value,
      fee: new BigNumber(tx.fees),
      credited: tx.isCoinBase || !tx.vin.filter((input) => input.addr === account).length,
    })
  }
}