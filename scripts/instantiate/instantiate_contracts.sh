#!/bin/bash
#
# Instantiate the multisig contracts
#

set -euo pipefail

command -v archway >/dev/null 2>&1 || {
  echo >&2 "archway CLI is required but not installed. Aborting."
  exit 1
}

command -v jq >/dev/null 2>&1 || {
  echo >&2 "jq is required but not installed. Aborting."
  exit 1
}

function failed() {
  echo "❌ FAILED TO INSTANTIATE THE MULTISIG CONTRACT - Please check that the parameters in the json file are correct"
  exit 1
}

trap failed ERR

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" &>/dev/null && pwd)"
source "${SCRIPT_DIR}/utils.sh"
ENV_FILE="${SCRIPT_DIR}/../../.env"
test -f "$ENV_FILE" && source "$ENV_FILE"

case "${1-}" in
 -[h?] | --help)
    cat <<-____HALP
        Instantiates a multisig contract, please use the --mainnet flag if you want to instantiate on mainnet
____HALP
        exit 0;;
esac

archway version

if [ "${1-}" == '--mainnet' ] || [ "${RUNTIME_ENVIRONMENT:-}" == "mainnet" ]; then
  chain_id="archway-1"
  main_code_id=7
  voting_code_id=5
  proposal_code_id=4
  prepropose_code_id=6
  cw4_code_id=3
elif [ "${1-}" == '--devnet' ] || [ "${RUNTIME_ENVIRONMENT:-}" == "devnet" ]; then
curl -fsSL 'https://raw.githubusercontent.com/archway-network/networks/main/devnets/archwaydevnet/chain.json' | ARCHWAY_SKIP_VERSION_CHECK=true archway config chains import || true
  chain_id="titus-4"
  main_code_id=2
  voting_code_id=5
  proposal_code_id=4
  prepropose_code_id=3
  cw4_code_id=1
else
  chain_id="constantine-3"
  main_code_id=1
  voting_code_id=2
  proposal_code_id=3
  prepropose_code_id=4
  cw4_code_id=5
fi

ARCHWAY_SKIP_VERSION_CHECK=true archway config set chain-id ${chain_id}

params="$(jq -r '.' < "$(scriptRelativePath multisig_params.json)")"

sender_account="$(jq -r '.sender_account' <<< "${params}")"
name="$(jq -r '.name' <<< "${params}")"
description="$(jq -r '.description' <<< "${params}")"
image_url="$(jq -r '.image_url' <<< "${params}")"
max_voting_period_in_seconds="$(jq -r '.max_voting_period_in_seconds' <<< "${params}")"
members="$(jq -r '.members' <<< "${params}")"

instantiate_result="$(
    instantiate-multisig-contract \
      "${sender_account}" \
      "${name}" \
      "${description}" \
      "${image_url}" \
      "${max_voting_period_in_seconds}" \
      "${members}" \
      "${main_code_id}" \
      "${voting_code_id}" \
      "${proposal_code_id}" \
      "${prepropose_code_id}" \
      "${cw4_code_id}" \
  )"

echo "$instantiate_result"

main_address="$(jq -r 'first(.logs[].events[] | select(.type == "wasm") | .attributes[] | select(.key == "dao") | .value)' <<<"${instantiate_result}")"
pre_propose_address="$(jq -r 'first(.logs[].events[] | select(.type == "wasm") | .attributes[] | select(.key == "update_pre_propose_module") | .value)' <<<"${instantiate_result}")"
proposals_address="$(jq -r 'first(.logs[].events[] | select(.type == "wasm") | .attributes[] | select(.key == "proposal_module") | .value)' <<<"${instantiate_result}")"
members_address="$(jq -r 'first(.logs[].events[] | select(.type == "wasm") | .attributes[] | select(.key == "group_contract_address") | .value)' <<<"${instantiate_result}")"
tx_hash="$(jq -r '.transactionHash' <<<"${instantiate_result}")"

result_addresses="$(jq --null-input \
  --arg main_address "${main_address}" \
  --arg pre_propose_address "${pre_propose_address}" \
  --arg proposals_address "${proposals_address}" \
  --arg members_address "${members_address}" \
  '[
    {
      "mainAddress": $main_address,
      "preProposeAddress": $pre_propose_address,
      "proposalsAddress": $proposals_address,
      "membersAddress": $members_address
    }
  ]')"

echo ""
greenEcho "Transaction Successful!"
echo "$tx_hash"
echo ""

greenEcho "Multisig Contracts:"
echo "$result_addresses"

echo "$result_addresses" >> "$(scriptRelativePath multisig_contracts_result.json)"
