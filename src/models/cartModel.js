const fs = require('fs');
const { v4: uuid } = require('uuid');

class Cart {
  constructor(archivo) {
    this.archivo = archivo;
    try {
      this.fileInfo = fs.readFileSync(this.archivo, 'utf-8');
      this.fileInfo = JSON.parse(this.fileInfo);
    } catch (error) {
      console.log(`no file available or empty, creating new one for ${this.archivo}`);
    }
  }

  async save(data) {
    const element = data;
    try {
      if (!this.fileInfo) {
        this.fileInfo = [];
      }
      element.id = uuid();
      element.timestamp = Date.now();
      this.fileInfo.push(element);
      await fs.promises.writeFile(this.archivo, JSON.stringify(this.fileInfo, null, 2));
      console.log('guardado');
    } catch (err) {
      console.log(err);
    }
  }

  getById(id) {
    const document = this.fileInfo.filter((doc) => doc.id === id);
    if (document) {
      return document;
    }
    return new Error('Not found');
  }

  getAll() {
    if (this.fileInfo) {
      return this.fileInfo;
    }
    return [];
  }

  async update(id, data) {
    const newElement = data;
    const objectPosition = this.fileInfo.findIndex((element) => element.id === id);
    if (objectPosition !== -1) {
      const element = this.fileInfo[objectPosition];
      newElement.id = element.id;
      this.fileInfo[objectPosition] = newElement;
      await fs.promises.writeFile(this.archivo, JSON.stringify(this.fileInfo, null, 2));
      return newElement;
    }
    throw new Error('Not found');
  }

  async deleteById(id) {
    const elementPosition = this.fileInfo.findIndex((element) => element.id === id);
    if (elementPosition !== -1) {
      const element = this.fileInfo[elementPosition];
      this.fileInfo.splice(elementPosition, 1);
      await fs.promises.writeFile(this.archivo, JSON.stringify(this.fileInfo, null, 2));
      return element;
    }
    throw new Error('element not found');
  }
}
module.exports = Cart;
