import _ from 'lodash';
import { fromBase64, fromUtf8, toBase64, toUtf8 } from '@cosmjs/encoding';
import { TextProposal } from 'cosmjs-types/cosmos/gov/v1beta1/gov';
import { MsgSubmitProposal } from 'cosmjs-types/cosmos/gov/v1beta1/tx';
import { MsgExecLegacyContent, MsgSubmitProposal as MsgSubmitProposalV1 } from 'cosmjs-types/cosmos/gov/v1/tx';
import { CommunityPoolSpendProposal } from 'cosmjs-types/cosmos/distribution/v1beta1/distribution';
import { ParameterChangeProposal } from 'cosmjs-types/cosmos/params/v1beta1/params';
import { CancelSoftwareUpgradeProposal, SoftwareUpgradeProposal } from 'cosmjs-types/cosmos/upgrade/v1beta1/upgrade';
import { MsgCancelUpgrade, MsgSoftwareUpgrade } from 'cosmjs-types/cosmos/upgrade/v1beta1/tx';
import { MsgCommunityPoolSpend } from 'cosmjs-types/cosmos/distribution/v1beta1/tx';
import { isUint8Array } from '@/utils';
import { MsgUpdateParamsMapper } from '@/types';

export function parseEncodedMessage(base64String?: string, asString: boolean = false) {
  if (!base64String) return undefined;

  const jsonMessage = fromUtf8(fromBase64(base64String));

  if (!asString) return jsonMessage ? JSON.parse(jsonMessage) : '';

  return jsonMessage;
}

export const encodeMessageAsBase64 = (message: any) => toBase64(toUtf8(JSON.stringify(message)));

export const parseObjectWithEncodedMessages = (input: unknown): any => {
  if (_.isArray(input)) {
    return input.map(parseObjectWithEncodedMessages);
  } else if (!_.isObject(input)) {
    return input;
  }

  // Try to decode as a specific Cosmos message if it has { typeUrl, value } structure
  const value = input as Record<string, any>;
  const typeUrl = value.type_url || value.typeUrl;
  if (Object.keys(value).length === 2 && typeof typeUrl === 'string' && (typeof value.value === 'string' || isUint8Array(value.value))) {
    const byteArray = typeof value.value === 'string' ? fromBase64(value.value) : value.value;

    switch (typeUrl) {
      case '/cosmos.gov.v1beta1.MsgSubmitProposal':
        return parseObjectWithEncodedMessages({
          ...value,
          value: MsgSubmitProposal.decode(byteArray),
        });
      case '/cosmos.gov.v1.MsgSubmitProposal':
        return parseObjectWithEncodedMessages({
          ...value,
          value: MsgSubmitProposalV1.decode(byteArray),
        });
      case '/cosmos.gov.v1.MsgExecLegacyContent':
        return parseObjectWithEncodedMessages({
          ...value,
          value: MsgExecLegacyContent.decode(byteArray),
        });
      case '/cosmos.gov.v1beta1.TextProposal':
        return parseObjectWithEncodedMessages({
          ...value,
          value: TextProposal.decode(byteArray),
        });
      case '/cosmos.distribution.v1beta1.CommunityPoolSpendProposal':
        return parseObjectWithEncodedMessages({
          ...value,
          value: CommunityPoolSpendProposal.decode(byteArray),
        });
      case '/cosmos.distribution.v1beta1.MsgCommunityPoolSpend':
        return parseObjectWithEncodedMessages({
          ...value,
          value: MsgCommunityPoolSpend.decode(byteArray),
        });
      case '/cosmos.params.v1beta1.ParameterChangeProposal':
        return parseObjectWithEncodedMessages({
          ...value,
          value: ParameterChangeProposal.decode(byteArray),
        });
      case '/cosmos.upgrade.v1beta1.SoftwareUpgradeProposal':
        return parseObjectWithEncodedMessages({
          ...value,
          value: SoftwareUpgradeProposal.decode(byteArray),
        });
      case '/cosmos.upgrade.v1beta1.MsgSoftwareUpgrade':
        return parseObjectWithEncodedMessages({
          ...value,
          value: MsgSoftwareUpgrade.decode(byteArray),
        });
      case '/cosmos.upgrade.v1beta1.CancelSoftwareUpgradeProposal':
        return parseObjectWithEncodedMessages({
          ...value,
          value: CancelSoftwareUpgradeProposal.decode(byteArray),
        });
      case '/cosmos.upgrade.v1beta1.MsgCancelUpgrade':
        return parseObjectWithEncodedMessages({
          ...value,
          value: MsgCancelUpgrade.decode(byteArray),
        });
      default:
        // try MsgUpdateParams types
        const MsgUpdateParams = Object.values(MsgUpdateParamsMapper).find(config => config.typeUrl === typeUrl)?.MsgUpdateParams;
        if (MsgUpdateParams) {
          return parseObjectWithEncodedMessages({
            ...value,
            value: MsgUpdateParams.decode(byteArray),
          });
        }
    }
  }

  // If has a different structure or there's no suitable cosmos typeUrl, go field by field
  const result: Record<string, any> = {};
  for (const [key, value] of Object.entries(input)) {
    if (key === 'msg') {
      try {
        const decodedJSON = parseEncodedMessage(value);
        result[key] = parseObjectWithEncodedMessages(decodedJSON);
      } catch {
        result[key] = value;
      }
    } else {
      result[key] = parseObjectWithEncodedMessages(value);
    }
  }

  return result;
};
