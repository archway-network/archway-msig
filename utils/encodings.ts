import _ from 'lodash';
import { fromBase64, fromUtf8, toBase64, toUtf8 } from '@cosmjs/encoding';
import { TextProposal } from 'cosmjs-types/cosmos/gov/v1beta1/gov.js';
import { MsgSubmitProposal } from 'cosmjs-types/cosmos/gov/v1beta1/tx.js';
import { CommunityPoolSpendProposal } from 'cosmjs-types/cosmos/distribution/v1beta1/distribution.js';
import { ParameterChangeProposal } from 'cosmjs-types/cosmos/params/v1beta1/params.js';
import { CancelSoftwareUpgradeProposal, SoftwareUpgradeProposal } from 'cosmjs-types/cosmos/upgrade/v1beta1/upgrade.js';

export function parseEncodedMessage(base64String?: string, asString: boolean = false) {
  if (!base64String) return undefined;

  const jsonMessage = fromUtf8(fromBase64(base64String));

  if (!asString) return jsonMessage ? JSON.parse(jsonMessage) : '';

  return jsonMessage;
}

export const encodeMessageAsBase64 = (message: any) => toBase64(toUtf8(JSON.stringify(message)));

export const parseObjectWithEncodedMessages = (input: any): any => {
  if (_.isArray(input)) {
    return input.map(parseObjectWithEncodedMessages);
  } else if (!_.isObject(input)) {
    return input;
  }

  const result: Record<string, any> = {};

  for (const [key, value] of Object.entries(input)) {
    if (_.isPlainObject(value)) {
      if (
        Object.keys(value).length === 2 &&
        (typeof value.type_url === 'string' || typeof value.typeUrl === 'string') &&
        (typeof value.value === 'string' || value.value instanceof Object.getPrototypeOf(Uint8Array))
      ) {
        const byteArray = typeof value.value === 'string' ? fromBase64(value.value) : value.value;

        switch (value.type_url || value.typeUrl) {
          case '/cosmos.gov.v1beta1.MsgSubmitProposal':
            result[key] = parseObjectWithEncodedMessages({
              ...value,
              value: MsgSubmitProposal.decode(byteArray),
            });
            break;
          case '/cosmos.gov.v1beta1.TextProposal':
            result[key] = parseObjectWithEncodedMessages({
              ...value,
              value: TextProposal.decode(byteArray),
            });
            break;
          case '/cosmos.distribution.v1beta1.CommunityPoolSpendProposal':
            result[key] = parseObjectWithEncodedMessages({
              ...value,
              value: CommunityPoolSpendProposal.decode(byteArray),
            });
            break;
          case '/cosmos.params.v1beta1.ParameterChangeProposal':
            result[key] = parseObjectWithEncodedMessages({
              ...value,
              value: ParameterChangeProposal.decode(byteArray),
            });
            break;
          case '/cosmos.upgrade.v1beta1.SoftwareUpgradeProposal':
            result[key] = parseObjectWithEncodedMessages({
              ...value,
              value: SoftwareUpgradeProposal.decode(byteArray),
            });
            break;
          case '/cosmos.upgrade.v1beta1.CancelSoftwareUpgradeProposal':
            result[key] = parseObjectWithEncodedMessages({
              ...value,
              value: CancelSoftwareUpgradeProposal.decode(byteArray),
            });
            break;
          default:
            result[key] = parseObjectWithEncodedMessages(value);
            break;
        }
      } else {
        result[key] = parseObjectWithEncodedMessages(value);
      }
    } else if (key === 'msg') {
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
