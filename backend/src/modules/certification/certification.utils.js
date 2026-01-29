const PDFDocument = require("pdfkit");
const fs = require("fs");
const path = require("path");

exports.generateCertificatePDF = ({ userName, courseTitle, certificateId }) => {
  return new Promise((resolve, reject) => {
    try {
      // Ensure certificates folder exists
      const certDir = path.join(__dirname, "../../../uploads/certificates");
      if (!fs.existsSync(certDir)) {
        fs.mkdirSync(certDir, { recursive: true });
      }

      const fileName = `certificate_${certificateId}.pdf`;
      const filePath = path.join(certDir, fileName);

      const doc = new PDFDocument({ size: "A4", layout: "landscape" });
      const stream = fs.createWriteStream(filePath);

      doc.pipe(stream);

      // Background
      doc.rect(0, 0, doc.page.width, doc.page.height).fill("#f8f9fa");

      // Border
      doc
        .lineWidth(5)
        .rect(20, 20, doc.page.width - 40, doc.page.height - 40)
        .stroke("#2c3e50");

      // Title
      doc
        .fillColor("#2c3e50")
        .fontSize(32)
        .text("Certificate of Completion", {
          align: "center",
          valign: "center"
        });

      doc.moveDown(2);

      // Content
      doc
        .fontSize(18)
        .fillColor("#000")
        .text("This is to certify that", { align: "center" });

      doc.moveDown(1);

      doc
        .fontSize(26)
        .fillColor("#1e90ff")
        .text(userName, { align: "center" });

      doc.moveDown(1);

      doc
        .fontSize(18)
        .fillColor("#000")
        .text("has successfully completed the course", { align: "center" });

      doc.moveDown(1);

      doc
        .fontSize(22)
        .fillColor("#27ae60")
        .text(courseTitle, { align: "center" });

      doc.moveDown(2);

      doc
        .fontSize(14)
        .text(`Certificate ID: ${certificateId}`, { align: "center" });

      doc.end();

      stream.on("finish", () => resolve(fileName));
      stream.on("error", reject);

    } catch (err) {
      reject(err);
    }
  });
};