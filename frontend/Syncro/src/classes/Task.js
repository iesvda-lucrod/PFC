export default class Task {
    sectionId;
    id;
    title;
    description;
    constructor(sectionId, title, description = '', id = null) {
        this.sectionId = sectionId;
        this.id = id;
        this.title = title;
        this.description = description;
    }
}