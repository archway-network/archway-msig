# Archway MultiSig Hub

Deploy your own smart contract-based multisig wallet to Archway. Instantiate and interact with your own smart contracts via a simple local (or hosted) UI.

## Requirements

- MacOS _or_ Linux
- node v16+ (known issue with v20.6.0)
- npm v10+

## Dependencies

Make sure to install the project dependencies:

```bash
# npm
npm install

# jq
sudo apt install jq (Linux)
/
brew install jq (MacOS with Homebrew)

# Archway CLI (v2 beta)
npm install -g @archwayhq/cli@pre
```

## Environment Setup

The Archway CLI is now installed and allows easy configurations to interact with the Archway blockchain. First of all decide which network you want to deploy to; Mainnet (`archway-1`) or Testnet (`constantine-3`).

Check that you have the correct `chain-id` configured:

```bash
# Check the chain-id currently setup on the config
archway config show
```

Change the chain-id config with the following command:

```bash
# For archway testnet the chain id should be 'constantine-3'
archway config chain-id constantine-3 --global

# For archway mainnet the chain id should be 'archway-1'
archway config chain-id archway-1 --global
```

Copy the `.env.example` into a new `env` file with the following command:

```bash
cp .env.example .env
```

Now edit the `.env` file to reflect your custom deployment of an instance of the multisig:

### RUNTIME_ENVIRONMENT
State whether the deployment will be on `mainnet` or `testnet`

### APP_NAME
Project, company or organisational name to be displayed on the landing page of the multisig, and on the browser tab name. Wrap in quotes, for example `"ACME Corp"`

### APP_LOGO
An square image to be displayed as the logo of the project on the header and throughout. The image should be placed inside the `public` folder and referenced here for example, `"/img/msig-logo.png"`

### APP_BRAND
Optional, an text-based image to accompany the logo on the header (usually containing the company/orgs name). The image should be placed inside the `public` folder and referenced here for example, `"/img/msig-text.png"`.

### DAODAO_CONTRACTS

Contains a JSON formatted array of multisig contracts to be displayed in the UI. We'll update this in a moment once the contracts are deployed on-chain.

#### Prepare Accounts

Using Archway CLI we need at least one account setup in the keyring to deploy the contracts and act as signer. You could also set up additional internal accounts at this stage if desired for additional signer addresses on the multisig deploy.

```bash
archway accounts new
```

Select an appropriate name label for the account and then take careful note of the resulting mnemonic recovery phrase as this is the only time you can access it (using this phrase you can easily import this new account into any web browser-based wallet extension).

You must then fund this account with some ARCH tokens for the deployment - it's recommended to send at least 5 ARCH to cover gas costs.

> When using a testnet, test CONST tokens can easily be accessed via the [Archway Discord](https://discord.gg/archwayhq) on the #testnet-faucet channel

#### Create a Multisig Contract On-chain

Edit the `scripts/instantiate/multisig_params.json` file to set the initial parameters for the new multisig.

  ```json
  {
    "sender_account": "archway1......", // Account that will sign the transaction, it must be an existing funded account in the Archway CLI keystore
    "name": "Multisig1", // Name of this multisig, it can help to give it an appropriate label if you plan to deploy multiple msigs within this project
    "description": "A test multisig", // Short text description of the multisig for reference
    "image_url": "", // Image url for the multisig to be displayed in the UI
    "max_voting_period_in_seconds": 86400, // Voting period for msig proposals, expressed in seconds
    "members": [ // The members of the multisig, their addresses and vote weight. Vote weight must be expressed in integers. Any number of addresses can be added here, but there must be at least 2 to begin with.
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

> ⚠️ Parameters like `max_voting_period_in_seconds` and `members` can be amended in perpetuity by the msig owners but the other fields are immutable from deployment

## Deploy On-Chain

After that, run the instantiation script
```bash
bash scripts/instantiate/instantiate_contracts.sh
```

If successful, the transaction hash, and the result contract addresses will be displayed.
Also a new file named `multisig_contracts_result.json` will be created, containing the resulting contract addresses.

Copy the JSON formatted contract addresses from this new file into the project's `.env` file, in the 'DAODAO_CONTRACTS' environment variable.

## Development Server

Start the development server on http://localhost:3000 to access the frontend UI

```bash
npm run dev
```

## Production

Build the application for production:

```bash
npm run build
```

Locally preview production build:

```bash
npm run preview
```

## Deploy to Firebase

If you don't have done it already, install the firebase functions globally, and login to your account

```bash
npm install -g firebase-tools@latest
firebase login
firebase init hosting
```

Modify the `.firebaserc` file to have your firebase project id as the default

```json
{
  "projects": {
    "default": "<your-firebase-project-id>"
  }
}
```


Then modify the `firebase.json` file to contain the following:

```json
{
  "functions": { "source": ".output/server" },
  "hosting": {
    "site": "<your-firebase-project-id>",
    "public": ".output/public",
    "cleanUrls": true,
    "rewrites": [{ "source": "**", "function": "server" }]
  }
}
```

Also install the firebase packages as local dependencies to be used during the build process:

```bash
npm install -D firebase-admin firebase-functions
```

And then you can build and deploy with the following commands:

```bash
NITRO_PRESET=firebase npm run build
npx firebase-tools deploy
```

## Deploy to Vercel

Import your Github project into Vercel, and it will automatically enable the correct settings for your deployment.

## Other deployments

Check out the [deployment documentation](https://nuxt.com/docs/getting-started/deployment) for more information.
