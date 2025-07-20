import html2pdf from 'html2pdf.js';

/**
 * Generates a PDF from an HTML element
 * @param {HTMLElement} element - The HTML element to convert to PDF
 * @param {string} filename - The filename for the PDF
 * @param {boolean} returnBlob - Whether to return a Blob instead of downloading
 * @returns {Promise<Blob|void>} A promise that resolves to a Blob if returnBlob is true
 */
export const generatePDF = async (element, filename = 'invoice', returnBlob = false) => {
  if (!element) {
    console.error('PDF Generation Error: Element not found');
    throw new Error('Could not find invoice content to generate PDF. Please try again.');
  }

  try {
    // Clone the element to avoid modifying the original
    const clone = element.cloneNode(true);
    
    // Add print-specific styling
    const style = document.createElement('style');
    style.textContent = `
      @page {
        margin: 1cm;
        size: A4;
      }
      body {
        font-family: 'Inter', sans-serif;
        color: #000 !important;
        margin: 0;
        padding: 0;
        background: white !important;
      }
      .invoice-preview {
        padding: 20px;
        background: white !important;
      }
      * {
        -webkit-print-color-adjust: exact !important;
        color-adjust: exact !important;
      }
    `;
    clone.appendChild(style);

    // Configure html2pdf options
    const opt = {
      margin: [10, 10, 10, 10],
      filename: `${filename}.pdf`,
      image: { 
        type: 'jpeg', 
        quality: 0.98 
      },
      html2canvas: { 
        scale: 2,
        useCORS: true,
        letterRendering: true,
        allowTaint: true,
        backgroundColor: '#ffffff'
      },
      jsPDF: { 
        unit: 'mm', 
        format: 'a4', 
        orientation: 'portrait',
        compress: true
      }
    };

    if (returnBlob) {
      // Return the PDF as a Blob
      const pdf = await html2pdf().set(opt).from(clone).output('blob');
      return pdf;
    } else {
      // Download the PDF
      await html2pdf().set(opt).from(clone).save();
    }
  } catch (error) {
    console.error('PDF Generation Error:', error);
    throw new Error(`Failed to generate PDF: ${error.message}. Please try again or contact support.`);
  }
};
