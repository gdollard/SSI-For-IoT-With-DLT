// This is the hypothetical Service Provider. It will receive a request for a service and via a Token verification
// will determine if the request is to be granted.

var Web3 = require('web3');
const HDWalletProvider = require("truffle-hdwallet-provider");
var walletProvider =  new HDWalletProvider(process.env.MNEMONIC, "https://ropsten.infura.io/v3/" + process.env.INFURA_API_KEY);
var web3 = new Web3(walletProvider);
const didJWT = require('did-jwt');
const Resolver = require('did-resolver').Resolver;
const getResolver = require('ethr-did-resolver').getResolver;

//Ethereum DID Registery address (smart contract)
const ETHEREUM_DID_REGISTRY_ADDRESS = '0xdCa7EF03e98e0DC2B855bE647C39ABe984fcF21B'

//Registering Ethr Did To Resolver
const ethrDidResolver = getResolver({
    web3,
    registry: ETHEREUM_DID_REGISTRY_ADDRESS,
})
/**
 * create a DID resolver based on the ethr DID resolver, if using a different DID Method (uPort, nacl, https etc)
 * I would pass that specific resolver to the Resolver object.
 */
const didResolver = new Resolver(ethrDidResolver);


/**
 * This function will be called by Alice to request a service. She will present her
 * her JWT (token) and DID object. The provider will verify the token using the did-jwt
 * library. Part of the checks will include using the ethr-did-resolver to resolve the 
 * presented DID object against the ethr-did-registry on the ledger. If all checks come 
 * good then the request is authorised.
 * 
 */
const authoriseDataAccessClaim = async (jwt, didObject) => {
    let result = didJWT.verifyJWT(jwt, {resolver: didResolver, audience: didObject.did }).then((verifiedResponse) => {
        console.log("Service Provider: Alice's verified JWT ", verifiedResponse);
        return verifiedResponse;
        }).catch(error => {
            console.log("Sorry Alice, Service Provider says No! ", error.message);
        });
    return result;
 };


 /**
  * Is responsible taking the chunk of IOT data, encrypt it and invoke the smart contract to persist the data onto an IPFS node. 
  * It will then ensure the transaction is recorded in the ledger for future requests.
  * 
  * This will be called by the MQTT nodes to publish their data to the ledger.
  * 
  * @param {string} jwt 
  * @param {EthrDID} didObject 
  *  @param {Buffer} iotData 
  */
const processIOTData = async (jwt, didObject, iotData) => {

    // verify the JWT and the didObject

    // encrypt the data using the private key of this provider

    // add the encrypted chunk to IPFS

    // write the TXN with the txnHash of the IPFS call to the ledger
};


/**
 * Alice will call this to retrieve IOT data. The Service Provider will verify Alice's credentials and if she is authorised the
 * data is retrieved from IPFS using the txn hash from the ledger. The data will be encrypted at this point but the provider
 * will decrypt it for Alice and will return it to her in a Buffer or some other compatible form.
 * 
 * @param {string} jwt 
 * @param {EthrDID} didObject 
 */
const requestIOTData = async (jwt, didObject) => {
    
    // verify jwt and didObject

    // somehow find a way to identify the chunk of data that is required

    // call the smart contract to look up the txn hash. 

    // use IPFS api to grab it

    // decrypt it and send it to Alice
};

 module.exports = {authoriseDataAccessClaim};