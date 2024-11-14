const express = require('express');
const bodyParser = require('body-parser');
const billingController = require('./src/controllers/billingController');
const transactionController = require('./src/controllers/transactionController');

const app = express();
const PORT = 3000;

app.use(bodyParser.json());

// Billing routes
app.post('/createBill', billingController.createBill);
app.get('/viewHistory', billingController.viewHistory);
app.post('/undoLastTransaction', billingController.undoLastTransaction);

// Logging route to generate CSV log
app.get('/generateCSVLog', (req, res) => {
    const filePath = transactionController.generateCSVLog();
    res.download(filePath);
});

// Root route for testing
app.get('/', (req, res) => {
    res.send('Welcome to the Utility Bill Payment System');
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
