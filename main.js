const fs = require('fs');
const inq = require('inquirer');

const jsonLocation = fs.readdirSync('./json-storage/original')
inq.prompt([
    {
        type: "list",
        message: "Which json file do we check out?",
        choices: jsonLocation,
        name: "jsonFile"
    },
    {
        type: "list",
        message: "Which do you want to search?",
        choices: ["user", "section", "course"],
        name: "type"
    },
    {
        type: "list",
        message: "What info do you have?",
        choices: ["id", "full_name"],
        name: "idType"
    },
    {
        type: "input",
        message: "Please provide:",
        name: "id"
    },
])
    .then(inqRes => {

        const filelocation = `./json-storage/original/${inqRes.jsonFile}`
        fs.readFile(filelocation, (err, data) => {
            const convertJson = JSON.parse(data.toString())

            switch (type) {
                case "user":
                    userInfo(inqRes.idType, inqRes.id, convertJson)
                    break;
                case "section":

                    break;
                case "course":

                    break;

                default:
                    break;
            }
        })
    })

function userInfoID(idType, id, data) {
    let results;
    let sectionIdEnrollments = [];
    if (idType = "id") {
        data.users.forEach(user => {
            if (user.user_id === id) {
                results.push(user);
            }
        });
    } else {
        data.users.forEach(user => {
            if ((`${user.first_name} ${user.last_name}`).includes(id)) {
                results.push(user);
            }
        });
        if (id) {
            id = user.user_id;
        }
    }
    data.enrollments.forEach(enrollment => {
        if (enrollment.user_id === id) {
            sectionIdEnrollments.push(enrollment);
        }
    });
    data.sections.forEach(section => {
        // run through sectionIdEnrollments if section aligned
        sectionIdEnrollments.forEach(enrolled => {
            if (section.section_id = enrolled.section_id) {
                results.push(section);
            }
        })
    })
    
}