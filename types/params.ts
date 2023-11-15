import { parseAmount } from '@/utils';
import { Arguments } from '@/utils/typing';
import { MsgUpdateParams as GovMsgUpdateParams } from 'cosmjs-types/cosmos/gov/v1/tx';
import { MsgUpdateParams as StakingMsgUpdateParams } from 'cosmjs-types/cosmos/staking/v1beta1/tx';
import { MsgUpdateParams as BankMsgUpdateParams } from 'cosmjs-types/cosmos/bank/v1beta1/tx';
import { MsgUpdateParams as SlashingMsgUpdateParams } from 'cosmjs-types/cosmos/slashing/v1beta1/tx';
import { MsgUpdateParams as AuthMsgUpdateParams } from 'cosmjs-types/cosmos/auth/v1beta1/tx';
import { MsgUpdateParams as ConsensusMsgUpdateParams } from 'cosmjs-types/cosmos/consensus/v1/tx';
import { MsgUpdateParams as CrisisMsgUpdateParams } from 'cosmjs-types/cosmos/crisis/v1beta1/tx';
import { MsgUpdateParams as MintMsgUpdateParams } from 'cosmjs-types/cosmos/mint/v1beta1/tx';

// @ts-ignore
import { MsgUpdateParams as RewardsMsgUpdateParams } from '@archwayhq/arch3-proto/archway/rewards/v1/tx';

export enum UpdatableModule {
  GOV = 'gov',
  STAKING = 'staking',
  BANK = 'bank',
  SLASHING = 'slashing',
  AUTH = 'auth',
  MINT = 'mint',
  CONSENSUS = 'consensus',
  CRISIS = 'crisis',
  REWARDS = 'rewards',
}

export const updatableModules = Object.values(UpdatableModule);

type FromPartial = (input: { authority?: string; params?: Record<string, any> }) => any & { authority: string };

const consensusFromPartial = ((input: {
  authority?: string;
  params?: Arguments<(typeof ConsensusMsgUpdateParams)['fromPartial']>[0] & { authority: never };
}) => {
  return ConsensusMsgUpdateParams.fromPartial({
    ...input.params,
    authority: input.authority,
  });
}) as FromPartial;

const crisisFromPartial = ((input: {
  authority?: string;
  params?: Arguments<(typeof CrisisMsgUpdateParams)['fromPartial']>[0] & { authority: never };
}) => {
  return CrisisMsgUpdateParams.fromPartial({
    ...input.params,
    authority: input.authority,
  });
}) as FromPartial;

export const MsgUpdateParamsMapper = {
  [UpdatableModule.GOV]: {
    typeUrl: '/cosmos.gov.v1.MsgUpdateParams',
    MsgUpdateParams: GovMsgUpdateParams,
    preview: GovMsgUpdateParams.fromPartial as FromPartial,
    fromPartial: GovMsgUpdateParams.fromPartial as FromPartial,
    docs: true,
  },
  [UpdatableModule.STAKING]: {
    typeUrl: '/cosmos.staking.v1beta1.MsgUpdateParams',
    MsgUpdateParams: StakingMsgUpdateParams,
    preview: StakingMsgUpdateParams.fromPartial as FromPartial,
    fromPartial: StakingMsgUpdateParams.fromPartial as FromPartial,
    docs: true,
  },
  [UpdatableModule.BANK]: {
    typeUrl: '/cosmos.bank.v1beta1.MsgUpdateParams',
    MsgUpdateParams: BankMsgUpdateParams,
    preview: BankMsgUpdateParams.fromPartial as FromPartial,
    fromPartial: BankMsgUpdateParams.fromPartial as FromPartial,
    docs: true,
  },
  [UpdatableModule.SLASHING]: {
    typeUrl: '/cosmos.slashing.v1beta1.MsgUpdateParams',
    MsgUpdateParams: SlashingMsgUpdateParams,
    preview: SlashingMsgUpdateParams.fromPartial as FromPartial,
    fromPartial: SlashingMsgUpdateParams.fromPartial as FromPartial,
    docs: true,
  },
  [UpdatableModule.AUTH]: {
    typeUrl: '/cosmos.auth.v1beta1.MsgUpdateParams',
    MsgUpdateParams: AuthMsgUpdateParams,
    preview: AuthMsgUpdateParams.fromPartial as FromPartial,
    fromPartial: AuthMsgUpdateParams.fromPartial as FromPartial,
    docs: true,
  },
  [UpdatableModule.MINT]: {
    typeUrl: '/cosmos.mint.v1beta1.MsgUpdateParams',
    MsgUpdateParams: MintMsgUpdateParams,
    preview: MintMsgUpdateParams.fromPartial as FromPartial,
    fromPartial: MintMsgUpdateParams.fromPartial as FromPartial,
    docs: true,
  },
  [UpdatableModule.REWARDS]: {
    typeUrl: '/archway.rewards.v1.MsgUpdateParams',
    MsgUpdateParams: RewardsMsgUpdateParams,
    preview: RewardsMsgUpdateParams.fromPartial as FromPartial,
    fromPartial: ((input: {
      authority?: string;
      params?: Arguments<(typeof RewardsMsgUpdateParams)['fromPartial']>[0] & { authority: never };
    }) => {
      /**
       * Transform decimals
       * TODO: Workaround to be able to send decimals values through the SDK
       * @see https://github.com/cosmos/cosmos-sdk/issues/10863
       */
      if (input.params) {
        input.params = {
          ...input.params,
          inflationRewardsRatio: parseAmount(input.params.inflationRewardsRatio).toString(),
          txFeeRebateRatio: parseAmount(input.params.txFeeRebateRatio).toString(),
          minPriceOfGas: {
            ...(input.params.minPriceOfGas ?? {}),
            amount: parseAmount(input.params.minPriceOfGas.amount).toString(),
          },
        };
      }

      return RewardsMsgUpdateParams.fromPartial(input);
    }) as FromPartial,
    docs: false,
  },

  // Some funky stuff for these two, as MsgUpdateParams.fromPartial methods
  // of these modules accept not the standard { authority, params } structure
  // but { authority, ...params }, with *actual* params being flatten up
  // to the same level as the authority.
  [UpdatableModule.CONSENSUS]: {
    typeUrl: '/cosmos.consensus.v1.MsgUpdateParams',
    MsgUpdateParams: ConsensusMsgUpdateParams,
    preview: consensusFromPartial,
    fromPartial: consensusFromPartial,
    docs: false,
  },
  [UpdatableModule.CRISIS]: {
    typeUrl: '/cosmos.crisis.v1beta1.MsgUpdateParams',
    MsgUpdateParams: CrisisMsgUpdateParams,
    preview: crisisFromPartial,
    fromPartial: crisisFromPartial,
    docs: true,
  },
} as const;

export type ModuleUpdate = {
  moduleName: UpdatableModule;
  params: Record<string, any>;
};
