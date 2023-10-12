import { AccountConfig } from '@/types';

export default class Account {
  constructor(public id: AccountConfig.AccountId, public title: string, public description: string) {}

  static make(id: AccountConfig.AccountId, attributes: any) {
    const { name, description } = attributes;

    return new Account(id, name, description);
  }
}
