export default class Task {
    section_id;
    id;
    title;
    description;
    constructor({sectionId, title, description = '', id = null}) {
        this.section_id = sectionId;
        this.id = id;
        this.title = title;
        this.description = description;
    }
}