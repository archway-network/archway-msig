import BigNumber from 'bignumber.js';
import { toBase64 } from '@cosmjs/encoding';
import { Any } from 'cosmjs-types/google/protobuf/any';
import { MsgSubmitProposal } from 'cosmjs-types/cosmos/gov/v1/tx';
import { MsgSoftwareUpgrade, MsgCancelUpgrade } from 'cosmjs-types/cosmos/upgrade/v1beta1/tx';
import { MsgCommunityPoolSpend } from 'cosmjs-types/cosmos/distribution/v1beta1/tx';

import TokenAmount from './TokenAmount';
import Member from './Member';
import { encodeMessageAsBase64, toArray } from '@/utils';

import {
  type BulkDelegationBlock,
  type GovernanceProposalId,
  GovernanceProposalType,
  type GovernanceProposalVoteOption,
  type ModuleUpdate,
  MsgUpdateParamsMapper,
  type TreasurySpendBlock,
} from '@/types';

class TransactionMessages {
  static makeProposal(title: string, description: string, msgs: any) {
    return {
      propose: {
        msg: {
          propose: {
            title,
            description,
            msgs: toArray(msgs),
          },
        },
      },
    };
  }

  static makeExecuteContractProposal(contractAddress: string, title: string, description: string, msg: any) {
    const msgs = {
      wasm: {
        execute: {
          contract_addr: contractAddress,
          funds: [],
          msg: encodeMessageAsBase64(msg),
        },
      },
    };

    return TransactionMessages.makeProposal(title, description, msgs);
  }

  static treasurySpendProposal(title: string, description: string, spend: TreasurySpendBlock[]) {
    const msgs = spend.map(s => ({
      bank: {
        send: {
          amount: [
            {
              amount: s.amount.amount.toString(),
              denom: s.amount.denom.coinMinimalDenom,
            },
          ],
          to_address: s.address,
        },
      },
    }));

    return TransactionMessages.makeProposal(title, description, msgs);
  }

  static manageMembersProposal(membersContractAddress: string, title: string, description: string, members: Member[]) {
    const msgs = {
      wasm: {
        execute: {
          contract_addr: membersContractAddress,
          funds: [],
          msg: encodeMessageAsBase64({
            update_members: { add: members, remove: [] },
          }),
        },
      },
    };

    return TransactionMessages.makeProposal(title, description, msgs);
  }

  static removeMemberProposal(membersContractAddress: string, title: string, description: string, member: string) {
    const msgs = {
      wasm: {
        execute: {
          contract_addr: membersContractAddress,
          funds: [],
          msg: encodeMessageAsBase64({
            update_members: { add: [], remove: [member] },
          }),
        },
      },
    };

    return TransactionMessages.makeProposal(title, description, msgs);
  }

  static stakeProposal(title: string, description: string, amount: TokenAmount, validator: string) {
    const msgs = {
      staking: {
        delegate: {
          amount: {
            amount: amount.amount.toString(),
            denom: amount.denom.coinMinimalDenom,
          },
          validator,
        },
      },
    };

    return TransactionMessages.makeProposal(title, description, msgs);
  }

  static unstakeProposal(title: string, description: string, amount: TokenAmount, validator: string) {
    const msgs = {
      staking: {
        undelegate: {
          amount: {
            amount: amount.amount.toString(),
            denom: amount.denom.coinMinimalDenom,
          },
          validator,
        },
      },
    };

    return TransactionMessages.makeProposal(title, description, msgs);
  }

  static redelegateProposal(
    title: string,
    description: string,
    amount: TokenAmount,
    fromValidatorAddress: string,
    toValidatorAddress: string
  ) {
    const msgs = {
      staking: {
        redelegate: {
          amount: {
            amount: amount.amount.toString(),
            denom: amount.denom.coinMinimalDenom,
          },
          src_validator: fromValidatorAddress,
          dst_validator: toValidatorAddress,
        },
      },
    };

    return TransactionMessages.makeProposal(title, description, msgs);
  }

  static bulkStakingProposal(title: string, description: string, delegations: BulkDelegationBlock[], undelegations: BulkDelegationBlock[]) {
    const delegationsMsgs = delegations.map(delegation => ({
      staking: {
        delegate: {
          amount: {
            amount: delegation.amount.amount.toString(),
            denom: delegation.amount.denom.coinMinimalDenom,
          },
          validator: delegation.validator.id,
        },
      },
    }));
    const undelegationsMsgs = undelegations.map(delegation => ({
      staking: {
        undelegate: {
          amount: {
            amount: delegation.amount.amount.toString(),
            denom: delegation.amount.denom.coinMinimalDenom,
          },
          validator: delegation.validator.id,
        },
      },
    }));

    return TransactionMessages.makeProposal(title, description, [...delegationsMsgs, ...undelegationsMsgs]);
  }

  static claimRewardsProposal(title: string, description: string, delegations: string[]) {
    const msgs = delegations.map(addr => ({
      distribution: {
        withdraw_delegator_reward: { validator: addr },
      },
    }));

    return TransactionMessages.makeProposal(title, description, msgs);
  }

  static governanceProposal(
    proposer: string,
    title: string,
    description: string,
    deposit: TokenAmount,
    type: GovernanceProposalType,
    spend?: TreasurySpendBlock[],
    parameterChanges?: ModuleUpdate[],
    upgradePlan?: Record<string, unknown>,
    authority?: string
  ) {
    const wrapMessage = (innerMessage: any = []) => ({
      stargate: {
        type_url: '/cosmos.gov.v1.MsgSubmitProposal',
        value: toBase64(
          Uint8Array.from(
            MsgSubmitProposal.encode(
              MsgSubmitProposal.fromPartial({
                title,
                summary: description,
                metadata: getSHA256Hash(
                  JSON.stringify({
                    title,
                    summary: description,
                  })
                ),
                messages: toArray(innerMessage).map(m => Any.fromPartial(m)),
                initialDeposit: [
                  {
                    amount: deposit.amount.toString(),
                    denom: deposit.denom.coinMinimalDenom,
                  },
                ],
                proposer,
              })
            ).finish()
          )
        ),
      },
    });

    let msgs;

    switch (type) {
      case GovernanceProposalType.TEXT:
        msgs = wrapMessage();
        break;
      case GovernanceProposalType.COMMUNITY_POOL_SPEND:
        msgs = wrapMessage(
          spend?.map(item => ({
            typeUrl: '/cosmos.distribution.v1beta1.MsgCommunityPoolSpend',
            value: Uint8Array.from(
              MsgCommunityPoolSpend.encode(
                MsgCommunityPoolSpend.fromPartial({
                  amount: [
                    {
                      amount: item.amount.amount.toString(),
                      denom: item.amount.denom.coinMinimalDenom,
                    },
                  ],
                  recipient: item.address,
                  authority,
                })
              ).finish()
            ),
          }))
        );
        break;
      case GovernanceProposalType.PARAMETER_CHANGE:
        msgs = wrapMessage(
          parameterChanges?.map(update => {
            const { MsgUpdateParams, fromPartial, typeUrl } = MsgUpdateParamsMapper[update.moduleName];
            return {
              typeUrl,
              value: MsgUpdateParams.encode(
                fromPartial({
                  authority,
                  params: update.params,
                })
              ).finish(),
            };
          })
        );
        break;
      case GovernanceProposalType.SOFTWARE_UPGRADE:
        msgs = wrapMessage({
          typeUrl: '/cosmos.upgrade.v1beta1.MsgSoftwareUpgrade',
          value: Uint8Array.from(
            MsgSoftwareUpgrade.encode(
              MsgSoftwareUpgrade.fromPartial({
                plan: upgradePlan,
                authority,
              })
            ).finish()
          ),
        });
        break;
      case GovernanceProposalType.CANCEL_SOFTWARE_UPGRADE:
        msgs = wrapMessage({
          typeUrl: '/cosmos.upgrade.v1beta1.MsgCancelUpgrade',
          value: Uint8Array.from(
            MsgCancelUpgrade.encode(
              MsgCancelUpgrade.fromPartial({
                authority,
              })
            ).finish()
          ),
        });
        break;
    }

    return TransactionMessages.makeProposal(title, description, msgs);
  }

  static governanceVoteProposal(title: string, description: string, proposalId: GovernanceProposalId, vote: GovernanceProposalVoteOption) {
    const msgs = {
      gov: {
        vote: {
          proposal_id: parseInt(proposalId.toString()),
          vote,
        },
      },
    };

    return TransactionMessages.makeProposal(title, description, msgs);
  }

  static makeCreateVestingContractProposal(
    contractAddress: string,
    title: string,
    description: string,
    {
      receiverAddress,
      clawbackAddress,
      amount,
      totalVestingDuration,
      cliffDuration,
      cliffPercentage,
      canStake,
      liquidStaking,
      vestingCodeId,
    }: {
      receiverAddress: string;
      clawbackAddress?: string;
      amount: TokenAmount;
      totalVestingDuration: number;
      cliffDuration: number;
      cliffPercentage: number;
      canStake: boolean;
      liquidStaking: boolean;
      vestingCodeId: number;
    }
  ) {
    const DEFAULT_VESTING_QUORUM = '0.51';
    const msg = {
      wasm: {
        execute: {
          contract_addr: contractAddress,
          funds: [
            {
              amount: amount.amount.toString(),
              denom: amount.denom.coinMinimalDenom,
            },
          ],
          msg: encodeMessageAsBase64({
            deploy: {
              contract_code_id: vestingCodeId,
              owners: clawbackAddress ? [receiverAddress, clawbackAddress] : [receiverAddress],
              quorum: DEFAULT_VESTING_QUORUM,
              msg: encodeMessageAsBase64({
                benefactor: clawbackAddress,
                beneficiary: receiverAddress,
                vesting_duration: {
                  secs: totalVestingDuration,
                  nanos: 0,
                },
                cliff_duration: {
                  secs: cliffDuration,
                  nanos: 0,
                },
                cliff_unlock_ratio: BigNumber(cliffPercentage).div(100).toString(),
                staking_blocked: !canStake,
                rewards_liquid: liquidStaking,
              }),
              label: `vesting_${receiverAddress}`,
            },
          }),
        },
      },
    };

    return TransactionMessages.makeProposal(title, description, msg);
  }

  static vestingClawbackProposal(contractAddress: string, title: string, description: string, shouldWithdrawClawback: boolean) {
    const msg = shouldWithdrawClawback ? { clawback_withdraw: {} } : { clawback: {} };

    return TransactionMessages.makeExecuteContractProposal(contractAddress, title, description, msg);
  }

  static vestingClaimRewardsProposal(contractAddress: string) {
    const msg = { collect_staking_rewards: {} };

    const title = 'Claim rewards proposal';
    const description = 'Claim vesting account rewards';

    return TransactionMessages.makeExecuteContractProposal(contractAddress, title, description, msg);
  }

  static vestingWithdrawRewardsProposal(contractAddress: string) {
    const msg = { withdraw_staking_rewards: {} };

    const title = 'Withdraw rewards proposal';
    const description = 'Withdraw vesting account rewards';

    return TransactionMessages.makeExecuteContractProposal(contractAddress, title, description, msg);
  }

  static vestingWithdrawTokensProposal(contractAddress: string) {
    const msg = { withdraw_vested_coins: {} };

    const title = 'Withdraw tokens proposal';
    const description = 'Withdraw vesting account vested tokens';

    return TransactionMessages.makeExecuteContractProposal(contractAddress, title, description, msg);
  }

  static updateAccountVotingConfigurationProposal(
    proposalsContractAddress: string,
    mainContractAddress: string,
    title: string,
    description: string,
    passingThresholdMajority: boolean,
    passingThreshold: string,
    quorumEnabled: boolean,
    quorumThresholdMajority: boolean,
    quorumThreshold: string,
    votingDuration: number,
    allowRevoting: boolean
  ) {
    const passingThresholdWhenMajority = {
      threshold: {
        majority: {},
      },
    };

    const quorumThresholdWhenMajority = {
      quorum: {
        majority: {},
      },
    };

    const passingThresholdWhenNotMajority = {
      threshold: {
        percent: BigNumber(passingThreshold).dividedBy(100).toString(),
      },
    };

    const quorumThresholdWhenNotMajority = {
      quorum: {
        percent: BigNumber(quorumThreshold).dividedBy(100).toString(),
      },
    };

    const thresholdWhenQuorumIsNotEnabled = {
      absolute_percentage: {
        percentage: passingThresholdMajority ? { majority: {} } : { percent: BigNumber(passingThreshold).dividedBy(100).toString() },
      },
    };

    const thresholdWhenQuorumIsEnabled = {
      threshold_quorum: Object.assign(
        passingThresholdMajority ? passingThresholdWhenMajority : passingThresholdWhenNotMajority,
        quorumThresholdMajority ? quorumThresholdWhenMajority : quorumThresholdWhenNotMajority
      ),
    };

    const threshold = quorumEnabled ? thresholdWhenQuorumIsEnabled : thresholdWhenQuorumIsNotEnabled;

    const msg = {
      update_config: {
        dao: mainContractAddress,
        only_members_execute: true,
        close_proposal_on_execution_failure: false,
        min_voting_period: null,
        max_voting_period: { time: votingDuration | 0 },
        allow_revoting: allowRevoting,
        threshold: threshold,
      },
    };

    const msgs = {
      wasm: {
        execute: {
          contract_addr: proposalsContractAddress,
          funds: [],
          msg: encodeMessageAsBase64(msg),
        },
      },
    };

    return TransactionMessages.makeProposal(title, description, msgs);
  }
}

export default TransactionMessages;
