export default class Section {
    id;
    name;
    color;
    constructor(name, id = null, color = '') {
        this.name = name;
        this.id = id;
        this.color = color;
    }
}