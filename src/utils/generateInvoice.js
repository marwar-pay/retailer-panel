import { PDFDocument, StandardFonts, rgb } from 'pdf-lib';

export async function generateAndDownloadInvoice({ amount, bankrrn, transactionId, status, date }) {
    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage([600, 400]);
    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const memberId = localStorage.getItem("memberId")
    const name = localStorage.getItem("fullName")
    const drawText = (text, y) => {
        page.drawText(text, { x: 50, y, size: 14, font, color: rgb(0, 0, 0) });
    };

    drawText("INVOICE", 350);
    drawText(`User: ${name}`, 310)
    drawText(`MemberId: ${memberId}`, 280)
    drawText(`Transaction ID: ${transactionId}`, 250);
    drawText(`Bank RR No.: ${bankrrn}`, 220);
    drawText(`Amount: Rs. ${amount}`, 190);
    drawText(`Status: ${status}`, 160);
    drawText(`Date: ${date}`, 130);

    const pdfBytes = await pdfDoc.save();
    const blob = new Blob([pdfBytes], { type: 'application/pdf' });

    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `Invoice_${transactionId}.pdf`;
    link.click();
}
