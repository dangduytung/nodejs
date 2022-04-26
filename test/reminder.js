class Reminder {

    constructor(name) {
        this.name = name;
    }

    getName() {
        return this.name;
    }

    setName(value) {
        this.name = value;
    }

    getDate() {
        return this.date;
    }

    setDate(value) {
        this.date = value;
    }
}

module.exports = Reminder;