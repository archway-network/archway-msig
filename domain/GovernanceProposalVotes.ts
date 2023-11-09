import TokenAmount from './TokenAmount';

import { TokenDenom } from '@/types';

type GovernanceProposalVotesFormattedAttributes = {
  total: string;
  percentages: { yes: string; noWithoutVeto: string; noWithVeto: string; allNo: string; abstain: string };
};

export default class GovernanceProposalVotes {
  public percentages: { yes: Number; noWithoutVeto: Number; noWithVeto: Number; allNo: Number; abstain: Number };
  public formatted: GovernanceProposalVotesFormattedAttributes;

  constructor(public yes: TokenAmount, public noWithoutVeto: TokenAmount, public noWithVeto: TokenAmount, public abstain: TokenAmount) {
    const total = this.total();
    this.percentages = {
      yes: total.amount.gt(0) ? this.yes.amount.div(total.amount).multipliedBy(100).toNumber() : 0,
      noWithoutVeto: total.amount.gt(0) ? this.noWithoutVeto.amount.div(total.amount).multipliedBy(100).toNumber() : 0,
      noWithVeto: total.amount.gt(0) ? this.noWithVeto.amount.div(total.amount).multipliedBy(100).toNumber() : 0,
      allNo: total.amount.gt(0) ? noWithoutVeto.amount.plus(noWithVeto.amount).div(total.amount).multipliedBy(100).toNumber() : 0,
      abstain: total.amount.gt(0) ? this.abstain.amount.div(total.amount).multipliedBy(100).toNumber() : 0,
    };

    this.formatted = this.formatAttributes();
  }

  static make(attributes: any, tokenDenom: TokenDenom) {
    const yes = TokenAmount.makeFromAmount(attributes?.yes_count, tokenDenom);
    const noWithoutVeto = TokenAmount.makeFromAmount(attributes?.no_count, tokenDenom);
    const noWithVeto = TokenAmount.makeFromAmount(attributes?.no_with_veto_count, tokenDenom);
    const abstain = TokenAmount.makeFromAmount(attributes?.abstain_count, tokenDenom);

    return new GovernanceProposalVotes(yes, noWithoutVeto, noWithVeto, abstain);
  }

  total(): TokenAmount {
    const total = this.yes.amount.plus(this.noWithoutVeto.amount).plus(this.noWithVeto.amount).plus(this.abstain.amount);
    return TokenAmount.makeFromAmount(total.toString(), this.yes.denom);
  }

  formatAttributes() {
    return {
      total: this.total().formatWithCoin(),
      percentages: {
        yes: this.percentages.yes.toFixed(2),
        noWithoutVeto: this.percentages.noWithoutVeto.toFixed(2),
        noWithVeto: this.percentages.noWithVeto.toFixed(2),
        allNo: this.percentages.allNo.toFixed(2),
        abstain: this.percentages.abstain.toFixed(2),
      },
    };
  }
}
