export default class Room {
    id;
    name;
    constructor(name, members = [], id = null) {
        this.id = id;
        this.setName(name);
        this.members = members;
    }

    setName(name) {
        if (!(typeof name === 'string')) throw new Error("Invalid type: name must be a string");
        this.name = name 
    }

    setMembers(members) {
        if (!(members instanceof Array)) throw new Error("Invalid type: members must be an array"); //TODO array of members <--class?
    }

    addMember(member) {
        this.members.push(member);
    }
    removeMember(target) {
        this.members = this.members.filter((member) => {member != target});
    }
}