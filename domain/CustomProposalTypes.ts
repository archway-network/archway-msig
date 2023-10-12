import { CustomProposalTypes as CustomProposalTypesType, GovernanceProposalType } from '@/types';

const customProposalTypes = {
  [CustomProposalTypesType.TreasurySpend]: {
    description: 'Spend native or CW20 tokens from the treasury.',
    children: [],
  },
  [CustomProposalTypesType.VotingConfig]: {
    description: 'Update the voting parameters for your multisig account.',
    children: [],
  },
  [CustomProposalTypesType.Governance]: {
    description: "Participate in the blockchain's governance.",
    children: [
      GovernanceProposalType.PARAMETER_CHANGE,
      GovernanceProposalType.COMMUNITY_POOL_SPEND,
      GovernanceProposalType.SOFTWARE_UPGRADE,
      GovernanceProposalType.CANCEL_SOFTWARE_UPGRADE,
      GovernanceProposalType.TEXT,
    ],
  },
  [CustomProposalTypesType.ExecuteContract]: {
    description: 'Execute smart contracts.',
    children: [],
  },
  [CustomProposalTypesType.CreateVestingContract]: {
    description: 'Create a vesting contract from your multisig account.',
    children: [],
  },
  [CustomProposalTypesType.VestingClawback]: {
    description: 'Clawback vesting contracts from your multisig account.',
    children: [],
  },
  [CustomProposalTypesType.Custom]: {
    description: 'Execute custom actions.',
    children: [],
  },
};

const customProposalSubTypes = {
  [GovernanceProposalType.PARAMETER_CHANGE]: {
    description:
      'These proposals aim to modify the parameters that govern the behavior of the blockchain, such as block time, transaction fees, or voting periods. Parameter change proposals require community voting to be implemented.',
  },
  [GovernanceProposalType.COMMUNITY_POOL_SPEND]: {
    description:
      "These proposals suggest the allocation of blockchain resources or funds for specific projects, development, marketing, or any other initiatives that benefit the ecosystem. They typically involve the transfer of funds from the blockchain's treasury and require community voting for approval.",
  },
  [GovernanceProposalType.SOFTWARE_UPGRADE]: {
    description:
      'These proposals focus on upgrading the base software of the blockchain. They involve changes to the underlying protocol, consensus mechanism, or other core functionalities. Software upgrade proposals require community voting to be implemented.',
  },
  [GovernanceProposalType.CANCEL_SOFTWARE_UPGRADE]: {
    description:
      'These proposals aim to cancel the planned software upgrade before the upgrade height is reached. The software upgrade does not have to be specified, as this will cancel the currently active software upgrade proposal.',
  },
  [GovernanceProposalType.TEXT]: {
    description:
      "These proposals are used to suggest and discuss non-binding changes, improvements, or ideas related to the blockchain's governance, parameters, or policies. They are primarily used as a means of initiating community discussions.",
  },
};

export default class CustomProposalTypes {
  constructor(protected features: { VESTING_CONTRACTS: boolean }) {}

  allIds() {
    return [
      CustomProposalTypesType.TreasurySpend,
      CustomProposalTypesType.VotingConfig,
      CustomProposalTypesType.Governance,
      CustomProposalTypesType.ExecuteContract,
      CustomProposalTypesType.CreateVestingContract,
      CustomProposalTypesType.VestingClawback,
      CustomProposalTypesType.Custom,
    ];
  }

  all() {
    return this.allIds()
      .filter(
        (type: CustomProposalTypesType) =>
          this.features.VESTING_CONTRACTS ||
          ![CustomProposalTypesType.CreateVestingContract, CustomProposalTypesType.VestingClawback].includes(type)
      )
      .map((type: CustomProposalTypesType) => ({ id: type, label: type, ...customProposalTypes[type] }));
  }

  allSubTypesFor(type: CustomProposalTypesType) {
    return customProposalTypes[type].children.map(subType => ({ id: subType, label: subType, ...customProposalSubTypes[subType] }));
  }

  descriptionFor(id: any) {
    if (this.allIds().includes(id)) {
      return customProposalTypes[id as CustomProposalTypesType].description;
    }

    return customProposalSubTypes[id as GovernanceProposalType].description;
  }
}
