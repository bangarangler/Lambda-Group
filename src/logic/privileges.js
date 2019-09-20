class Enumeration {
    constructor(obj) {
        for (const key in obj) {
            this[key] = obj[key]
        }
        return Object.freeze(this)
    }
    has = (key) => {
        return this.hasOwnProperty(key)
    }
}

const privileges = new Enumeration({
    student: 'STUDENT',
    admin: 'ADMIN',
    overloard: 'OVERLOARD'
})

console.log(privileges.admin)
privileges.student = 'admin'
console.log(privileges.student)
privileges.new = "TEST"
console.log(privileges.new)

module.exports = privileges;

//PROOF OF CONCEPT
