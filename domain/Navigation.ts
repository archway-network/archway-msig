import { GovernanceIcon, PageIcon, StakingIcon, UsersIcon } from '@/components/Ui';
import type { AccountConfig, MenuItem } from '@/types';

export enum NavigationLabels {
  Accounts = 'Accounts',
  Proposals = 'Proposals',
  Governance = 'Governance',
  Staking = 'Staking',
  Members = 'Members',
}

class Navigation {
  static items(accountId: AccountConfig.AccountId): MenuItem[] {
    return [
      { label: NavigationLabels.Proposals, url: `/accounts/${accountId}/proposals`, icon: PageIcon },
      { label: NavigationLabels.Staking, url: `/accounts/${accountId}/staking`, icon: StakingIcon },
      { label: NavigationLabels.Governance, url: `/accounts/${accountId}/governance`, icon: GovernanceIcon },
      { label: NavigationLabels.Members, url: `/accounts/${accountId}/members`, icon: UsersIcon },
    ];
  }
}

export default Navigation;
