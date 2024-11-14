const fs = require('fs-extra');
const PDFDocument = require('pdfkit');
const Queue = require('../data/queue');
const Stack = require('../data/stack');

// Queues and Stack initialization
const requestQueue = new Queue();
const urgentQueue = new Queue(); // Priority Queue for urgent requests
const historyStack = new Stack();

function createInvoice(data) {
    const doc = new PDFDocument();
    const filePath = `./invoices/invoice_${Date.now()}.pdf`;

    doc.pipe(fs.createWriteStream(filePath));
    doc.text(`Invoice for Utility Bill`, { align: 'center' });
    doc.text(`Name: ${data.name}`);
    doc.text(`Amount: ${data.amount}`);
    doc.text(`Due Date: ${data.dueDate}`);
    doc.end();

    return filePath;
}

// API endpoint to create a bill
exports.createBill = (req, res) => {
    const billData = req.body;
    
    if (billData.isUrgent) {
        urgentQueue.enqueue(billData);
    } else {
        requestQueue.enqueue(billData);
    }
    
    const invoicePath = createInvoice(billData);
    historyStack.push(billData);

    res.json({ message: "Bill created successfully", invoice: invoicePath });
};

// Endpoint to view transaction history
exports.viewHistory = (req, res) => {
    res.json(historyStack.items);
};

// Undo last transaction
exports.undoLastTransaction = (req, res) => {
    if (!historyStack.isEmpty()) {
        const undoneTransaction = historyStack.pop();
        res.json({ message: "Last transaction undone", undoneTransaction });
    } else {
        res.status(400).json({ error: "No transactions to undo" });
    }
};
