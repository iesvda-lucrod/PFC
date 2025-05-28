export default class Section {
    room_id;
    id;
    name;
    description;
    color;
    constructor({room_id, name, id = null, description = ''}) {
        this.room_id = room_id;
        this.name = name;
        this.id = id;
        this.description = description;
    }
}