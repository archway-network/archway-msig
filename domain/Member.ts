export default class Member {
  constructor(public addr: string, public weight: number) {}

  static make(attributes: any) {
    const { addr, weight } = attributes;

    return new Member(addr, weight | 0);
  }
}
