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

      const pageWidth = doc.page.width;
      const pageHeight = doc.page.height;

      // Gradient-like background (layered rectangles for effect)
      doc.rect(0, 0, pageWidth, pageHeight).fill("#ffffff");
      
      // Decorative top accent
      doc.rect(0, 0, pageWidth, 80)
        .fill("#3b82f6");
      
      // Decorative bottom accent
      doc.rect(0, pageHeight - 60, pageWidth, 60)
        .fill("#3b82f6");

      // Main border - outer
      doc
        .lineWidth(8)
        .rect(30, 30, pageWidth - 60, pageHeight - 60)
        .stroke("#1e40af");

      // Inner decorative border
      doc
        .lineWidth(2)
        .rect(45, 45, pageWidth - 90, pageHeight - 90)
        .stroke("#60a5fa");

      // Certificate badge/seal (decorative circle)
      const centerX = pageWidth / 2;
      doc
        .circle(centerX, 120, 35)
        .lineWidth(3)
        .fillAndStroke("#fbbf24", "#f59e0b");
      
      // Star or checkmark symbol in badge (simplified star)
      doc
        .fontSize(24)
        .fillColor("#ffffff")
        .text("★", centerX - 10, 105, { width: 20, align: "center" });

      // Main title
      doc
        .fillColor("#1e293b")
        .fontSize(42)
        .font("Helvetica-Bold")
        .text("Certificate of Completion", 60, 180, {
          align: "center",
          width: pageWidth - 120
        });

      // Decorative line under title
      doc
        .moveTo(pageWidth / 2 - 100, 235)
        .lineTo(pageWidth / 2 + 100, 235)
        .lineWidth(2)
        .stroke("#3b82f6");

      // "This is to certify that" text
      doc
        .fontSize(16)
        .fillColor("#475569")
        .font("Helvetica")
        .text("This is to certify that", 60, 265, {
          align: "center",
          width: pageWidth - 120
        });

      // Recipient name (highlighted)
      doc
        .fontSize(32)
        .fillColor("#0f172a")
        .font("Helvetica-Bold")
        .text(userName, 60, 300, {
          align: "center",
          width: pageWidth - 120
        });

      // Decorative underline for name
      const nameWidth = doc.widthOfString(userName);
      const nameX = (pageWidth - nameWidth) / 2;
      doc
        .moveTo(nameX, 340)
        .lineTo(nameX + nameWidth, 340)
        .lineWidth(1)
        .stroke("#94a3b8");

      // "has successfully completed" text
      doc
        .fontSize(16)
        .fillColor("#475569")
        .font("Helvetica")
        .text("has successfully completed the course", 60, 360, {
          align: "center",
          width: pageWidth - 120
        });

      // Course title (highlighted)
      doc
        .fontSize(24)
        .fillColor("#0369a1")
        .font("Helvetica-Bold")
        .text(courseTitle, 60, 395, {
          align: "center",
          width: pageWidth - 120
        });

      // Issue date
      const issueDate = new Date().toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric"
      });

      doc
        .fontSize(14)
        .fillColor("#64748b")
        .font("Helvetica")
        .text(`Issued on ${issueDate}`, 60, 460, {
          align: "center",
          width: pageWidth - 120
        });

      // Certificate ID (bottom)
      doc
        .fontSize(10)
        .fillColor("#94a3b8")
        .text(`Certificate ID: ${certificateId}`, 60, pageHeight - 100, {
          align: "center",
          width: pageWidth - 120
        });

      // Signature line (left side)
      const sigY = pageHeight - 140;
      doc
        .moveTo(100, sigY)
        .lineTo(250, sigY)
        .lineWidth(1)
        .stroke("#cbd5e1");
      
      doc
        .fontSize(11)
        .fillColor("#64748b")
        .text("Authorized Signature", 100, sigY + 10, {
          width: 150,
          align: "center"
        });

      // Date line (right side)
      doc
        .moveTo(pageWidth - 250, sigY)
        .lineTo(pageWidth - 100, sigY)
        .lineWidth(1)
        .stroke("#cbd5e1");
      
      doc
        .fontSize(11)
        .fillColor("#64748b")
        .text("Date", pageWidth - 250, sigY + 10, {
          width: 150,
          align: "center"
        });

      doc.end();

      stream.on("finish", () => resolve(fileName));
      stream.on("error", reject);

    } catch (err) {
      reject(err);
    }
  });
};