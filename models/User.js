const mongoose = require("mongoose")
const userSchema = new mongoose.Schema({
    username: {
        type: String,
        require: true,
    },
    password: {
        type: String,
        require: true,
    },
    roles: [{
        type: String,
        default: "Employee"
    }],
    active: {
        type: Booleam,
        default: true
    }
})

/* This user Schmea file or bluePrint of a user
-> User have four properties - name, pass, role, state
-> roles - is a array because a user can have multiple roles.
*/

module.exports = mongoose.model('User', userSchema)