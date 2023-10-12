import { decode, encode } from 'js-base64';

class Storage {
  static get(key: string, encoded = false): any {
    if (!process.client) return;
    const value = localStorage.getItem(key);
    if (encoded && value) return decode(value);
    return value;
  }

  static set(key: string, value: any, encoded = false) {
    if (!process.client) return;
    localStorage.setItem(key, encoded ? encode(value) : value);
  }

  static remove(key: string) {
    if (!process.client) return;
    localStorage.removeItem(key);
  }
}

export default Storage;
