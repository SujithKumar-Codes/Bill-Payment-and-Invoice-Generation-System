const fs = require('fs');
const path = require('path');
const { Parser } = require('json2csv');

const logFilePath = './logs/dailyLog.json';

exports.logTransaction = (transaction) => {
    let logs = [];
    if (fs.existsSync(logFilePath)) {
        logs = JSON.parse(fs.readFileSync(logFilePath));
    }

    logs.push(transaction);
    fs.writeFileSync(logFilePath, JSON.stringify(logs, null, 2));
};

// Generate CSV log
exports.generateCSVLog = () => {
    const logs = JSON.parse(fs.readFileSync(logFilePath, 'utf8'));
    const parser = new Parser();
    const csv = parser.parse(logs);

    const csvFilePath = path.join(__dirname, '../../logs/dailyLog.csv');
    fs.writeFileSync(csvFilePath, csv);
    return csvFilePath;
};
