export default class AccountVotingConfiguration {
  constructor(
    public passingThresholdMajority: boolean,
    public passingThreshold: number,
    public quorumEnabled: boolean,
    public quorumThresholdMajority: boolean,
    public quorumThreshold: number,
    public votingDuration: number,
    public allowRevoting: boolean
  ) {}

  static make(attributes: any) {
    const { threshold, max_voting_period, allow_revoting } = attributes;

    const quorumEnabled = !!threshold?.threshold_quorum;
    const passingThresholdMajority = Object.keys(threshold?.threshold_quorum?.threshold).includes('majority');
    const passingThreshold = threshold?.threshold_quorum?.threshold?.percent * 100 || 50;
    const quorumThresholdMajority = Object.keys(threshold?.threshold_quorum?.quorum).includes('majority');
    const quorumThreshold = threshold?.threshold_quorum?.quorum?.percent * 100 || 20;

    return new AccountVotingConfiguration(
      passingThresholdMajority,
      passingThreshold,
      quorumEnabled,
      quorumThresholdMajority,
      quorumThreshold,
      max_voting_period?.time || 60 * 60 * 6,
      !!allow_revoting
    );
  }
}
