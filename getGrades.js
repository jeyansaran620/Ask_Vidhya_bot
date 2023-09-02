const { google } = require("googleapis");
const {GoogleAuth} = require('google-auth-library');
const fs = require('fs');


async function getGrades() {

    let Grades = {}

    const auth = new GoogleAuth({
        keyFile: "credentials.json",
        scopes: "https://www.googleapis.com/auth/spreadsheets",
        });
    
    const client = await auth.getClient();

    const googleSheets = google.sheets({ version: "v4", auth: client });

    const spreadsheetId = "1snaPvdqJYA9OZWUW8wMX9GevG8HlGeOlt7sxxjRy0tA";

    const getRows = await googleSheets.spreadsheets.values.get({
        auth,
        spreadsheetId,
        range: "Sheet1",
    });
    
    spreadSheetData = getRows.data.values

    spreadSheetData.shift()
    
    spreadSheetData.map((row) => {

        if(!(row[1] in Grades))
        {
            let grade = {}
            grade.gradeTitle = row[0]
            grade.gradeCode = row[1]
            grade.subjects= {}
            
            let subject = {}
            subject.subjectName = row[2]
            subject.subjectCode = row[3]
            subject.outcomes = {}

            let outcome = {}
            outcome.outcomeNo = row[4]
            outcome.value = row[5]
            outcome.resources = {}

            let resource = {}
            resource.resourceNo = row[6]
            resource.link = row[7]
            resource.purpose = row[8]
            resource.description = row[9]
            resource.type = row[10]

            outcome.resources[row[6]] = resource
            subject.outcomes[row[4]] = outcome
            grade.subjects[row[3]] = subject
            Grades[row[1]] = grade
        }
        else
        {
            if(!(row[3] in Grades[row[1]].subjects))
            {
                let subject = {}
                subject.subjectName = row[2]
                subject.subjectCode = row[3]
                subject.outcomes = {}

                let outcome = {}
                outcome.outcomeNo = row[4]
                outcome.value = row[5]
                outcome.resources = {}

                let resource = {}
                resource.resourceNo = row[6]
                resource.link = row[7]
                resource.purpose = row[8]
                resource.description = row[9]
                resource.type = row[10]

                outcome.resources[row[6]] = resource
                subject.outcomes[row[4]] = outcome
                Grades[row[1]].subjects[row[3]] = subject
            }

            else
            {
                if(!(row[4] in Grades[row[1]].subjects[row[3]].outcomes))
                {

                    let outcome = {}
                    outcome.outcomeNo = row[4]
                    outcome.value = row[5]
                    outcome.resources = {}
    
                    let resource = {}
                    resource.resourceNo = row[6]
                    resource.link = row[7]
                    resource.purpose = row[8]
                    resource.description = row[9]
                    resource.type = row[10]
    
                    outcome.resources[row[6]] = resource
                    Grades[row[1]].subjects[row[3]].outcomes[row[4]] = outcome
                }

                else
                {
                    let resource = {}
                    resource.resourceNo = row[6]
                    resource.link = row[7]
                    resource.purpose = row[8]
                    resource.description = row[9]
                    resource.type = row[10]

                    Grades[row[1]].subjects[row[3]].outcomes[row[4]].resources[row[6]] = resource
                }
            }
        }
    })
     
    let saveJson = JSON.stringify(Grades, null, 4)

        fs.writeFile('grades.json', saveJson, 'utf8', (err)=>{
        if(err){
            console.log(err)
        }
    })

    console.log(Grades)
}

var now = new Date();
var millisTill10 = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 10, 0, 0, 0) - now;
if (millisTill10 < 0) {
     millisTill10 += 86400000; 
}

console.log("timer started")
setTimeout( () => getGrades(), millisTill10);
