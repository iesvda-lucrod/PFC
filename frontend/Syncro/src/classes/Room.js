export default class Room {
    id;
    name;
    constructor({name, description = '', members = [], id = null}) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.members = members;
    }
}