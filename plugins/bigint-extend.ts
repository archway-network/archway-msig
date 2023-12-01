export default defineNuxtPlugin(() => {
  // Make JSON.stringify able to process BigInt values
  (BigInt.prototype as any).toJSON = function () {
    return this.toString();
  };
});
