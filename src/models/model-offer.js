
export class ModelOffer {
  constructor(data) {
    this.price = data.price;
    this.title = data.name;
  }

  static parseOffer(data) {
    return new ModelOffer(data);
  }

  static parseOffers(data, type) {
    return {type, offers: data.map(ModelOffer.parseOffer)};
  }

  static parseTypeOffers(data) {
    const res = data.map((el) => ModelOffer.parseOffers(el.offers, el.type));
    return res;
  }

}
