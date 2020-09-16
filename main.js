const inq = require('inquirer');
const fs = require('fs');
const parseJson = require('parse-json');

const jsonLocation = fs.readdirSync('./json-storage/original')
inq.prompt([
    {
        type: "list",
        message: "Which json file do we check out?",
        choices: jsonLocation,
        name: "jsonFile"
    },
    {
        name: "type",
        type: "list",
        message: "Which do you want to search?",
        choices: ["user", "section"],
    },
    {
        name: "idType",
        type: "list",
        message: "What info do you have?",
        choices: ["id", "name"],
    },
    {
        name: "id",
        type: "input",
        message: "Please provide name/id:",
    },
    {
        name: "ultraLog",
        type: "confirm",
        message: "Ultra Log? (display _internal and _original)",
    },
])
    .then(inqRes => {

        const filelocation = `./json-storage/original/${inqRes.jsonFile}`
        fs.readFile(filelocation, (err, data) => {
            const convertJson = JSON.parse(data.toString())

            switch (inqRes.type) {
                case "user":
                    if (inqRes.ultraLog) {
                        ultraLog(userInfo(inqRes.idType, inqRes.id, convertJson), `user-${inqRes.id}`);
                    } else {
                        console.log(userInfo(inqRes.idType, inqRes.id, convertJson), `user-${inqRes.id}`);
                    }
                    break
                case "section":
                    if (inqRes.ultraLog) {
                        ultraLog(sectionInfo(inqRes.idType, inqRes.id, convertJson), `section-${inqRes.id}`);
                    } else {
                        console.log(sectionInfo(inqRes.idType, inqRes.id, convertJson), `section-${inqRes.id}`);
                    }
                    break;

                default:
                    break;
            }
        })
    })

function ultraLog(results, fname) {
    results.users.forEach(obj => {
        console.log(obj);
    });
    results.sections.forEach(obj => {
        console.log(obj);
    });
    let dataParsed = JSON.stringify(results);
    // let dataParsed = parseJson(results.toString());
    let filename = `./json-storage/log/${fname}.json`;
    fs.writeFile(filename, dataParsed, (err) => {
        if (err) throw err;
        console.log(`Created file here: ${filename}`);
    });
}

function userInfo(idType, id, data) {
    let results = {
        users: [],
        sections: []
    };
    let sectionIdEnrollments = [];
    let userId = [];
    let userObj = {
        id: '',
        name: ''
    };
    // Find a way to dig through multiple users
    if (idType === "id") {
        data.users.forEach(user => {
            if (user.user_id === id) {
                userObj.id = user.user_id;
                userObj.name = `${user.first_name} ${user.last_name}`;
                results.users.push(user);
            }
        });
    } else {
        data.users.forEach(user => {
            if (user.first_name || user.last_name) {
                if ((`${user.first_name} ${user.last_name}`).toLowerCase().includes(id.toLowerCase())) {
                    userObj.id = user.user_id;
                    userObj.name = `${user.first_name} ${user.last_name}`;
                    results.users.push(user);
                    userId.push(userObj);
                }
            }
        });
    }
    userId.forEach(currentID => {
        data.enrollments.forEach(enrollment => {
            if (enrollment.user_id === currentID.id) {
                sectionIdEnrollments.push(enrollment);
            }
        });
        data.sections.forEach(section => {
            // run through sectionIdEnrollments if section aligned
            sectionIdEnrollments.forEach(enrolled => {
                if (section.section_id === enrolled.section_id) {
                    results.sections.push(section);
                }
            })
        })
    })
    return results;
}

function sectionInfo(idType, id, data) {
    let results = {
        sections: [],
        users: [],
    }
    let sectionIdEnrollments = [];
    let sectionIds = [];
    // Find a way to dig through multiple users
    if (idType === "id") {
        data.sections.forEach(section => {
            if (section.section_id === id) {
                results.sections.push(section);
            }
        });
    } else {
        data.sections.forEach(section => {
            if (section.name) {
                if ((section.name.toLowerCase().includes(id.toLowerCase()))) {
                    results.sections.push(section);
                    sectionIds.push(section.section_id);
                }
            }
        });
    }
    sectionIds.forEach(sectionId => {
        data.enrollments.forEach(enrollment => {
            if (enrollment.section_id === sectionId) {
                sectionIdEnrollments.push(enrollment);
            }
        });
        data.users.forEach(user => {
            sectionIdEnrollments.forEach(enrolled => {
                if (user.user_id === enrolled.user_id) {
                    results.users.push(user);
                }
            })
        })
    })
    return results;
}
