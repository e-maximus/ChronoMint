import ABIModel from './lib/ABIModel'
import BlockExecModel from './lib/BlockExecModel'
import CredentialsModel from './lib/CredentialsModel'
import DeviceStatus from './lib/DeviceStatus'
import RawTransacation from './lib/RawTransacation'
import SignerDeviceModel from './lib/SignerDeviceModel'
import SignerMemoryModel from './lib/SignerMemoryModel'
import TxEntryModel from './lib/TxEntryModel'
import TxHistoryModel from './lib/TxHistoryModel'
import WalletEntryModel from './lib/WalletEntryModel'
import WalletModel from './lib/WalletModel'
import Web3AccountModel from './lib/Web3AccountModel'

export default {
  ABIModel: ABIModel.model,
  BlockExecModel: BlockExecModel.model,
  CredentialsModel: CredentialsModel.model,
  DeviceStatus: DeviceStatus.model,
  RawTransacation: RawTransacation.model,
  SignerDeviceModel: SignerDeviceModel,
  SignerMemoryModel: SignerMemoryModel,
  TxEntryModel: TxEntryModel.model,
  TxHistoryModel: TxHistoryModel.model,
  WalletEntryModel: WalletEntryModel.model,
  WalletModel: WalletModel.model,
  Web3AccountModel: Web3AccountModel.model,
}
