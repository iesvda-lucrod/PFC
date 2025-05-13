export default class Section {
    room_id;
    id;
    name;
    color;
    constructor({room_id, name, id = null, tasks = []}) {
        this.room_id = room_id;
        this.name = name;
        this.id = id;
    }
}