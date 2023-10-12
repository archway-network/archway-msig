#!/bin/bash
#
# Utils functions
#

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" &>/dev/null && pwd)"

RED='\033[0;31m'
GREEN='\033[0;32m'
NC='\033[0m' # No Color

function greenEcho() {
  echo -e "${GREEN}${1}${NC}"
}

function redEcho() {
  echo -e "${RED}${1}${NC}"
}

function scriptRelativePath() {
  echo "${SCRIPT_DIR}/${1}"
}

function error() {
  redEcho " 𝗑 Error: $1" >&2
  exit 1
}

function instantiate-multisig-contract() {
  local sender_account="${1:-}"
  local name="${2:-}"
  local description="${3:-}"
  local image_url="${4:-}"
  local max_voting_period_in_seconds="${5:-}"
  local members="${6:-}"
  local main_code_id="${7:-}"
  local voting_code_id="${8:-}"
  local proposal_code_id="${9:-}"
  local prepropose_code_id="${10:-}"
  local cw4_code_id="${11:-}"
  
  voting_instantiate_msg="$(
    jq --null-input \
      --arg cw4_code_id "${cw4_code_id}" \
      --argjson members "{\"members\":${members}}" \
      -c \
      '{
      "cw4_group_code_id": $cw4_code_id | tonumber,
      "initial_members": $members | .members
    }'
  )"

  encoded_voting_inst_msg="$(base64 <<< "${voting_instantiate_msg}")"

  prepropose_info='{"deposit_info":null,"extension":{},"open_proposal_submission":false}'
  encoded_prepropose_info="$(base64 <<< "${prepropose_info}")"


  proposal_instantiate_msg="$(
      jq --null-input \
        --arg name "${name}" \
        --arg prepropose_code_id "${prepropose_code_id}" \
        --arg max_voting_period_in_seconds "${max_voting_period_in_seconds}" \
        --arg encoded_prepropose_info "${encoded_prepropose_info}" \
        -c \
        '{
        "allow_revoting": false,
        "close_proposal_on_execution_failure": false,
        "max_voting_period": {
          "time": $max_voting_period_in_seconds | tonumber
        },
        "min_voting_period": null,
        "only_members_execute": true,
        "pre_propose_info": {
          "module_may_propose": {
            "info": {
              "admin": {
                "core_module": {}
              },
              "code_id": $prepropose_code_id | tonumber,
              "label": ("DAO_" + $name + "_pre-propose-DaoProposalSingle"),
              "msg": $encoded_prepropose_info
            }
          }
        },
        "threshold": {
          "threshold_quorum": {
            "quorum": {
              "majority": {}
            },
            "threshold": {
              "majority": {}
            }
          }
        }
      }'
    )"

  encoded_proposal_inst_msg="$(base64 <<< "${proposal_instantiate_msg}")"

  local instantiate_params
  instantiate_params="$(
      jq --null-input \
        --arg description "${description}" \
        --arg name "${name}" \
        --arg image_url "${image_url}" \
        --arg proposal_code_id "${proposal_code_id}" \
        --arg voting_code_id "${voting_code_id}" \
        --arg encoded_proposal_inst_msg "${encoded_proposal_inst_msg}" \
        --arg encoded_voting_inst_msg "${encoded_voting_inst_msg}" \
        -c \
        '{
        "admin": null,
        "automatically_add_cw20s": true,
        "automatically_add_cw721s": true,
        "description": $description,
        "image_url": $image_url,
        "name": $name,
        "proposal_modules_instantiate_info": [
          {
            "admin": {
              "core_module": {}
            },
            "code_id": $proposal_code_id | tonumber,
            "label": ("DAO_" + $name + "_DaoProposalSingle"),
            "msg": $encoded_proposal_inst_msg
          }
        ],
        "voting_module_instantiate_info": {
          "admin": {
            "core_module": {}
          },
          "code_id": $voting_code_id | tonumber,
          "label": ("DAO_" + $name + "_DaoVotingCw4"),
          "msg": $encoded_voting_inst_msg
        }
      }'
    )"

  tx_result="$(
    archway contracts instantiate \
      --from "${sender_account}" \
      --code "${main_code_id}" \
      --label "${description}" \
      --args "${instantiate_params}" \
      --json
  )"

  validate-tx "$tx_result" "failed to instantiate contract!"

  echo "$tx_result"
}

function validate-tx() {
  local tx_result="${1:-}"
  local error_message="${2:-}"
  if [[ -z "${tx_result}" ]]; then
    error "${error_message}"
  fi
}
