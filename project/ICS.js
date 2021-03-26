const fs = require('fs');
const ics = require('ics');

let listOfJSONS = [];

module.exports = {

    createCal: function createCalendar(filePath, lineTagsDateJson) {
        listOfJSONS = [];


        let lines = lineTagsDateJson.lines;
        let tags = lineTagsDateJson.tags;
        let dates = lineTagsDateJson.dates;

        let tagString = '';
        let month = 0;
        let day = 0;
        let year = 0;

        for(let i = 0; i < lines.length; i++){
            month = dates[i][0];
            day = dates[i][1];
            year = dates[i][2];
            tagString = '';
            for(let j = 0; j < tags[i].length; j++){
                tagString += ' [' + tags[i][j] + '] ';
            }
            listOfJSONS.push({title: 'due', start: [year, month, day],description: lines[i] + '\n' + tagString , duration: {seconds: 1}});
        }


        const fs = require('fs');
        const ics = require('ics');

        ics.createEvents(listOfJSONS, (error, value) => {
            if (error) {
                console.log(error);
            }

            fs.writeFileSync(filePath + '.ics', value);
        });

    }
}
