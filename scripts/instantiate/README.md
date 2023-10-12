# Instantiating DAODAO multisig contracts to use with the philabs-multisig-hub UI

## Requirements
- The [Archway CLI](https://github.com/archway-network/archway-cli)
- An account created/imported to the [Archway CLI](https://github.com/archway-network/archway-cli) with enough balance to instantiate the contracts

## Steps
1. Edit the `multisig_params.json` file to set the parameters for the new multisig.
  ```json
  {
    "sender_account": "archway1......", // Account that will sign the transaction, it has to be an existing account in the Archway CLI 
    "name": "My Multisig", // Name of the Multisig
    "description": "A multisig instance", // Description of the multisig
    "image_url": "", // Image url for the multisig
    "max_voting_period_in_seconds": 86400, // Voting period, expressed in seconds
    "members": [ // The members of the multisig, their addresses and vote weight.
      {
        "addr": "archway1......",
        "weight": 1
      },
      {
        "addr": "archway1......",
        "weight": 1
      }
    ]
  }
```

2. Run the following command to instantiate the contracts on Constantine:
  ```
  bash multisig_contracts_result.json
  ```

  To instantiate them on Archway mainnet, add the `--mainnet` flag, like this:
  ```
  bash multisig_contracts_result.json --mainnet
  ```

3. If successful, the transaction hash, and the result contract addresses will be displayed.
Also a file named `multisig_contracts_result.json` will be created, containing the contract addresses.

4. Then these addresses can be added copied into the root project's `.env` file, as a `DAODAO_CONTRACTS` environment variable, in order to make the multisig available on the UI.
