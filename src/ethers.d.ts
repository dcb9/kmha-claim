declare module 'ethers' {

  class Wallet {
    public constructor(privateKey: SigningKey | string, provider?: providers.Provider)

    static createRandom(options?: any): Wallet
    static verifyMessage(message: string, signature: string): string
    static parseTransaction(rawTransaction: any): Transaction
    static isEncryptedWallet(json: JSON): boolean
    static fromEncryptedWallet(json: JSON, password: string, progressCallback?: Function): Promise<Wallet>
    static fromMnemonic(mnemonic: string, path: string): Wallet
    static fromBrainWallet(username: string, password: string, progressCallback?: Function): Promise<Wallet>

    readonly privateKey: string
    readonly address: string

    provider?: providers.Provider
    defaultGasLimit: number

    sign(transaction: CompletedTransaction): utils.RLP
    signMessage(message: string): string
    encrypt(password: string, options: any, progressCallback?: Function): Promise<any>

    getAddress(): string
    getBalance(blockTag: string): Promise<number>
    getTransactionCount(blockTag: string): Promise<number>
    estimateGas(transaction: Transaction): Promise<number>
    sendTransaction(transaction: Transaction): Promise<Transaction>
    send(addressOrENSName: string, amountWei: utils.BigNumber, options?: any): Promise<Transaction>
  }

  class SigningKey {
    public constructor(privateKey: any)
    static recover(digest: any, r: string, s: string, recoveryParam: any): SigningKey
    static getPublicKey(value: any, compressed?: boolean): string
    static publicKeyToAddress(publicKey: any): string

    readonly privateKey: string
    readonly publicKey: string
    readonly address: string

    signDigest(digest: any): any
  }

  class Contract {
    public constructor(addressOrENSName: string, contractInterface: string | object | Interface, signerOrProvider: providers.Provider | Wallet | CustomSigner)
    static getDeployTransaction(bytecode: string, contractInterface: string, ...constructorArguments: Array<any>): Transaction

    readonly address: string
    readonly contractInterface: Interface
    readonly signer: any
    readonly provider: providers.JsonRpcProvider
    readonly estimate: any
    readonly functions: any
    readonly events: any

    connect(signerOrProvider: any): Contract

    [key: string]: any
  }

  class Interface {
    public constructor(abi: any)

    static encodeParams(names: any[], types: any[], values: any[]): string
    static decodeParams(names: any[], types: any[], values: any[]): any

    readonly abi: Abi
    readonly functions: any
    readonly events: {
      [EventName: string]: () => InterfaceEventInfo
    }
    readonly deployFunction: Function
  }

  export interface InterfaceEventInfo {
    inputs: AbiEventParameter
    name: string
    signature: string
    topics: string[]
    parse: InterfaceEventParse
  }

  export interface InterfaceEventParse {
    (data: string): parsedLog
    (topics: string[], data: string): parsedLog
  }

  export interface parsedLog {
    [index: number]: any,
    [namedParam: string]: any,
    length: number,
  }

  namespace providers {

    export type Network = {
      chainId: number
      ensAddress: string
      name: string
    }

    export type Networks = {[index: string]: Network}

    export type Web3CurrentProvider = {
      sendAsync(request: any, callback: (err: Error, result: any) => void): Promise<any>
    }

    const networks: Networks

    function getDefaultProvider(network?: Network): JsonRpcProvider

    class Provider {
      public constructor(network: Network | string)

      static fetchJSON(url: string, json: JSON, processFunc?: Function): Promise<any>
      static networks: Networks

      chainId: number
      ensAddress: string
      name: string

      waitForTransaction(transactionHash: string, timeout: number): Promise<Transaction>
      getBlockNumber(): Promise<number>
      getGasPrice(): Promise<utils.BigNumber>
      getBalance(addressOrENSName: string, blockTag: string): Promise<utils.BigNumber>
      getTransactionCount(addressOrENSName: string, blockTag: string): Promise<number>
      getCode(addressOrENSName: string, blockTag: string): Promise<string>
      getStorageAt(addressOrENSName: string, position: string, blockTag: string): Promise<string>
      sendTransaction(signedTransaction: string): Promise<string>
      call(transaction: Transaction): Promise<string>
      estimateGas(transaction: Transaction): Promise<utils.BigNumber>
      getBlock(blockHashOrBlockTagOrBlockNum: string | number): Promise<any>
      getTransaction(transactionHash: string): Promise<Transaction>
      getTransactionReceipt(transactionHash: string): Promise<TransactionReceipt>
      getLogs(filter: any): Promise<Log[]>
      getEtherPrice(): Promise<number>
      resolveName(name: string): Promise<string>
      lookupAddress(address: string): Promise<string>
      on(eventName: string, listener: EventListener): void
      once(eventName: string, listener: EventListener): void
      emit(eventName: string): void
      listenerCount(eventName: string): number
      listeners(eventName: string): Promise<EventListener[]>
      removeAllListeners(eventName: string): void
      removeListener(eventName: string, listener: EventListener): void
      resetEventsBlock(blockNumber: number): void
      polling(value?: number): void
    }

    class EtherscanProvider extends Provider {
      public constructor(network: Network, apiKey: string)
      perform(method: string, params: string[]): Promise<string>
      getHistory(addressOrENSName: string, startBlock: number, endBlock: number): Promise<any[]>
    }

    class FallbackProvider extends Provider {
      public constructor(providers: Provider[])
      perform(method: string, params: string[]): Promise<string>
    }

    class JsonRpcProvider extends Provider {
      public constructor(url: string, network?: Network | string)
      send(method: string, params: string[]): Promise<string>
      perform(method: string, params: string[]): Promise<string>
    }

    class InfuraProvider extends JsonRpcProvider {
      public constructor(network: Network, apiAccessToken: string)
    }

    class Web3Provider extends JsonRpcProvider {
      public constructor(web3provider: Web3CurrentProvider, network?: Network | string)
      getSigner(address?: string): Web3Signer
      listAccounts(): Promise<string[]>
    }

    class Web3Signer extends CustomSigner {
      private constructor(provider: Web3Provider, address?: string)

      getAddress(): Promise<string>
      getBalance(blockTag: string): Promise<utils.BigNumber>
      getTransactionCount(blockTag: string): Promise<number>
      sendTransaction(transaction: Transaction): Promise<Transaction>
      signMessage(message: string): Promise<string>
      unlock(password: string): Promise<string>
    }

  }

  class CustomSigner {
    provider: providers.Provider

    getAddress(): string | Promise<string>
    estimateGas?(transaction: Transaction): Promise<utils.BigNumber>
    sendTransaction?(transaction: Transaction): Promise<Transaction>
    sign?(transaction: CompletedTransaction): utils.RLP | Promise<utils.RLP>
  }

  export interface Log {
    removed: boolean,
    logIndex?: number,
    transactionIndex?: number,
    transactionHash?: string,
    blockHash?: string,
    blockNumber?: number,
    address: string,
    data: string,
    topics: string[],
  }

  export interface Transaction {
    chainId?: number
    hash?: string
    from: string
    to?: string
    data?: any
    nonce: utils.BigNumber
    gasPrice?: utils.BigNumber
    gasLimit: utils.BigNumber
    value?: utils.BigNumber
  }

  export interface CompletedTransaction extends Transaction {
    networkId: number
    hash: string
    to: string
    data: any
    gasPrice: utils.BigNumber
    value: utils.BigNumber
  }

  export interface TransactionReceipt {
    transactionHash: string
    blockHash: string
    blockNumber: number
    transactionIndex: number
    contractAddress: string | null
    cumulativeGasUsed: utils.BigNumber
    gasUsed: utils.BigNumber
    logs: any
    logsBloom: string
    byzantium: false
    // Pre-byzantium blocks will have a state root:
    root?: string,
    // Post-byzantium blocks will have a status (0 indicated failure during execution)
    status?: TRANSITION_STATUS
  }

  enum TRANSITION_STATUS {
    FAILED,
    SUCCESS
  }

  export type Primitive = 'uint8' | 'uint64' | 'uint256' | 'bool' | 'string' | 'address' | 'bytes20' | 'bytes32' | 'bytes' | 'int256' | 'address[]' | 'uint256[]' | 'bytes32[]'

  export interface AbiParameter {
    name: string
    type: Primitive
  }

  export interface AbiEventParameter extends AbiParameter {
    indexed: boolean
  }

  export interface AbiFunction {
    name: string
    type: 'function' | 'constructor' | 'fallback'
    stateMutability: 'pure' | 'view' | 'payable' | 'nonpayable'
    constant: boolean
    payable: boolean
    inputs: Array<AbiParameter>
    outputs: Array<AbiParameter>
  }

  export interface AbiEvent {
    name: string
    type: 'event'
    inputs: Array<AbiEventParameter>
    anonymous: boolean
  }

  export type Abi = Array<AbiFunction | AbiEvent>

  namespace utils {
    type RLP = string

    const etherSymbol: string

    function arrayify(hex: string, name?: string): Uint8Array

    function concat(objects: any[]): Uint8Array
    function padZeros(value: any, length: number): Uint8Array
    function stripZeros(value: any): Uint8Array

    function bigNumberify(value: any): BigNumber

    function hexlify(value: any): string

    function toUtf8Bytes(text: string): Uint8Array
    function toUtf8String(hexStringOrArrayish: Uint8Array | string): string

    function namehash(name: string, depth: number): string
    function id(text: string): string

    function getAddress(address: string, generateIcap?: boolean): string
    function getContractAddress(transaction: any): string

    function formatEther(wei: BigNumber, options: any): string
    function parseEther(ether: string): BigNumber

    function keccak256(value: any): string
    function sha256(value: any): string

    function randomBytes(length: number): Uint8Array

    function solidityPack(types: string[], values: any[]): string
    function solidityKeccak256(types: string[], values: any[]): string
    function soliditySha256(types: string[], values: any[]): string

    class BigNumber {
      public constructor(value: any)

      static constantNegativeOne: BigNumber
      static constantZero: BigNumber
      static constantOne: BigNumber
      static constantTwo: BigNumber
      static constantWeiPerEther: BigNumber

      fromTwos(value: any): BigNumber
      toTwos(value: any): BigNumber
      add(other: any): BigNumber
      sub(other: any): BigNumber
      div(other: any): BigNumber
      mul(other: any): BigNumber
      mod(other: any): BigNumber
      pow(other: any): BigNumber
      maskn(value: any): BigNumber
      eq(other: any): boolean
      lt(other: any): boolean
      lte(other: any): boolean
      gt(other: any): boolean
      gte(other: any): boolean
      isZero(): boolean
      toNumber(base?: number): number
      toString(): string
      toHexString(): string
    }

    namespace RLP {
      function encode(object: any): string
      function decode(data: any): any
    }
  }
}
