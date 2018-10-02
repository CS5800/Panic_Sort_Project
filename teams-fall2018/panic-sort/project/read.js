const bag = [
    'homework',
    'hw',
    'assignment',
    'project',
    'program',
    'test',
    'quiz',
    'midterm',
    'exam',
    'final',
    'paper',
    'essay',
    'report',
    'extra credit'
];
let flags = [];
let tags = [];
let goodTags = [];
let parsedGoods = [];
let goodLine = [];
let goodSentences = [];
let goodDates = [];


const chrono = require('chrono-node');

let p = chrono.parse('');

const fs = require('fs');

//const filePath = './1537998986.43syllabus.pdf.txt';
let data;
let arrayOfData;
module.exports = {
    prune: function pruneFile(filePath) {
         flags = [];
 tags = [];
 goodTags = [];
 parsedGoods = [];
 goodLine = [];
 goodSentences = [];
 goodDates = [];
         
        data = fs.readFileSync(filePath).toString();
        arrayOfData = data.split('\n');
       // console.log(arrayOfData[12]);
        flagLines();
        tagLines();
        filterGoodLines();
        parseGoodLines();
        //printGoodLines();
        console.log({ 'line': goodSentences, 'tags': goodTags, 'dates':goodDates });
        return send();
    }
}





// p= chrono.parse('Project 0: 5%');



function parseGoodLines(calback) {
  
    for (let i = 0; i < goodLine.length; i++) {
        p = chrono.parse(arrayOfData[goodLine[i]]);
        parsedGoods.push(p);
        goodDates.push([p[0].start.knownValues.month,p[0].start.knownValues.day]);
        goodSentences.push(arrayOfData[goodLine[i]]);
    }
   
}
function printParsedGoodLines() {
    for (let i = 0; i < goodLine.length; i++) {
        console.log(parsedGoods[i]);
    }
}
function flagLines() {
    for (let i = 0; i < arrayOfData.length; i++) {
        if (flag(arrayOfData[i])) {
            flags.push(i);
        }
    }
}
function flag(line) {
    if (line.toLowerCase().includes(bag[0])) {
        return true;
    } else if (line.toLowerCase().includes(bag[1])) {
        return true;
    } else if (line.toLowerCase().includes(bag[2])) {
        return true;
    } else if (line.toLowerCase().includes(bag[3])) {
        return true;
    } else if (line.toLowerCase().includes(bag[4])) {
        return true;
    } else if (line.toLowerCase().includes(bag[5])) {
        return true;
    } else if (line.toLowerCase().includes(bag[6])) {
        return true;
    } else if (line.toLowerCase().includes(bag[7])) {
        return true;
    } else if (line.toLowerCase().includes(bag[8])) {
        return true;
    } else if (line.toLowerCase().includes(bag[9])) {
        return true;
    } else if (line.toLowerCase().includes(bag[10])) {
        return true;
    } else if (line.toLowerCase().includes(bag[11])) {
        return true;
    } else if (line.toLowerCase().includes(bag[12])) {
        return true;
    } else {
        return false;
    }
}
function tagLine(line) {
    var tg = [];
    if (line.toLowerCase().includes(bag[0])) {
        tg.push(bag[0]);
    }
    if (line.toLowerCase().includes(bag[1])) {
        tg.push(bag[1]);
    }
    if (line.toLowerCase().includes(bag[2])) {
        tg.push(bag[2]);
    }
    if (line.toLowerCase().includes(bag[3])) {
        tg.push(bag[3]);
    }
    if (line.toLowerCase().includes(bag[4])) {
        tg.push(bag[4]);
    }
    if (line.toLowerCase().includes(bag[5])) {
        tg.push(bag[5]);
    }
    if (line.toLowerCase().includes(bag[6])) {
        tg.push(bag[6]);
    }
    if (line.toLowerCase().includes(bag[7])) {
        tg.push(bag[7]);
    }
    if (line.toLowerCase().includes(bag[8])) {
        tg.push(bag[8]);
    }
    if (line.toLowerCase().includes(bag[9])) {
        tg.push(bag[9]);
    }
    if (line.toLowerCase().includes(bag[10])) {
        tg.push(bag[10]);
    }
    if (line.toLowerCase().includes(bag[11])) {
        tg.push(bag[11]);
    }
    if (line.toLowerCase().includes(bag[12])) {
        tg.push(bag[12]);
    }


    return tg;
}
function tagLines() {
    for (let i = 0; i < flags.length; i++) {
        tags.push(tagLine(arrayOfData[flags[i]]));
    }
  
}
function filterGoodLines() {
    console.log('filterGoodLines ' + flags.length);

    for (var i = 0; i < flags.length; i++) {
        p = chrono.parse(arrayOfData[flags[i]]);
       // console.log(arrayOfData[flags[i]]);
        if (p.length > 0 && !(p[0].start.knownValues.month === undefined) && !(p[0].start.knownValues.day === undefined)) {
         //   console.log('filter: ' + flags[i]+ ' '+tags[i]);
            goodLine.push(flags[i]);
            goodTags.push(tags[i]);
        }
    }

}
function printGoodLines() {
    console.log('printGoodLines ' + goodLine.length);
    for (let i = 0; i < goodLine.length; i++) {
        console.log(arrayOfData[goodLine[i]]);
    }
    
    console.log(goodSentences);

    console.log(goodTags);

    console.log(goodDates);

}
function send(){
    return { 'line': goodSentences, 'tags': goodTags, 'dates':goodDates }; 
}
// console.log(p[0].start.knownValues.month);
// console.log(p[0].start.knownValues.day);
// console.log(tags);

// p = chrono.parse('This schedule lists important dates (exams, project release and due dates, etc.). The white-background items show the');
// console.log(p);
// console.log(p.length);// if length is zero, no date is found
