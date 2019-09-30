export class ModelDestination {
  constructor(data) {
    this.description = data.description;
    this.name = data.name;
    this.pictures = data.pictures;
  }

  static parseDestination(data) {
    return new ModelDestination(data);
  }

  static parseDestinations(data) {
    return data.map(ModelDestination.parseDestination);
  }

}
