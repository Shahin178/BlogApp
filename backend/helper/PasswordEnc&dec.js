const bcrypt = require("bcryptjs")

async function HashPassword(password) {
    const saltRounds = 12;
    return await bcrypt.hash(password, saltRounds);
}

async function comparePassword(passwordToCheck, hashedPassword) {
    return await bcrypt.compare(passwordToCheck, hashedPassword);
}

module.exports = {HashPassword,comparePassword}