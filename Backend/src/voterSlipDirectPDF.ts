
export{}

const fs = require('fs');
const pdf = require('html-pdf');
const archiver = require('archiver');
const fetch = require('node-fetch');

exports.handler = async (event) => {
  let body = event.body;
  console.log("body", body);
  const itemsPerPage = 5000;

  let nextPage = 'https://test-api.itoconnect.online/sms/voterslip/?page=114';
  let pdfCount = 55; // Variable to track the PDF count

  // Fetch all voters from the API
  while (nextPage) {
    nextPage = nextPage.replace('http://', 'https://');
    console.log("next Page", nextPage);

    const response = await fetch(nextPage, {
      method: 'GET',
      headers: {
        'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNzAwMTUyODIzLCJpYXQiOjE3MDAxNDE5MzAsImp0aSI6IjkxYTAzNjQwNjAyMzQ3MTBiYTkxM2FmOGFiNGM0Y2MyIiwidXNlcl9pZCI6ImxibmFnYXJAaXRjLmNvbSJ9.-GtMbG_Qbtt-ezodPEq6NfrB4740rtz-ggOBtPTXhas',
      },
    });

    if (!response.ok) {
      console.error(`Error: ${response.status} - ${response.statusText}`);
      throw new Error(`Failed to fetch data from the API`);
    }

    const data = await response.json();
    const currentVoters = data.voters.slice(0, itemsPerPage);
    console.log("Current Page Voters", currentVoters);

    const htmlContent = generateHtmlContent(currentVoters);
    const pdfBuffer = await new Promise<Buffer>((resolve, reject) => {
      pdf.create(htmlContent, { timeout: 300000 }).toBuffer((err, buffer) => {
        if (err) {
          reject(err);
        } else {
          resolve(buffer);
        }
      });
    });

    const pdfPath = `voterSlip-${pdfCount}.pdf`;

    // Save the PDF file locally
    fs.writeFileSync(pdfPath, pdfBuffer);

    pdfCount += 1; // Increment the PDF count

    nextPage = data.next; // Update the next page link
    console.log("nextPage updated", nextPage);
  }

  // Return the number of PDF files generated
  return {
    statusCode: 200,
    body: `Generated ${pdfCount - 1} PDF files`,
  };
};

function generateHtmlContent(voters) {
  return `
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Voter Slips</title>
        <style>
          @page {
            size: 80mm 150mm;
            margin: 0;
          }
          body {
            font-size: 10pt;
            margin: 0;
            padding : 10px
          }
          table {
            width: 100%;
            height: 240px !important;
            border-collapse: collapse;
          }
          td {
            vertical-align: top;
            border: 1px dotted #000;
            padding: 5px;
          }
          .image-container img {
            max-width: 100%;
            // height: auto;
            // display: block;
            // margin: 0 auto;
          }
          td.data-cell {
            border-right: 2px dotted #000;
            line-height: 1.4 !important;
            padding: 15px;
            font-size :14px;
            width: 50%; /* Adjusted width for data cell */
          }
          td.image-cell {
            width: 50%; /* Adjusted width for image cell */
          }
        </style>
      </head>
      <body>
        ${voters.map((item) => `
          <table>
            <tr>
              <td class="image-cell">
                <span class="image-container">
                  <img style="max-width:100%" src="https://createmystore.online/voterCamp.png" alt="not visible" />
                </span>
              </td>
              <td class="data-cell">
                <span style="font-weight: 800; font-size: 22px; text-align: center !important;">${item.voter_id}</span><br>
                <div>Name: <b>${item.first_name}</b></div>
                <div>Assembly Constituency: <b>${item.constituency__mla_constituency_name}</b></div>
                <div>Parliament Constituency: <b>${item.constituency__mp_constituency_name}</b></div>
                <div>District: <b>Ranga Reddy</b></div>
                <div>Booth Number: <b>${item.polling_booth__polling_booth_no}</b></div>
                <div>Booth Name: <b>${item.polling_booth__polling_booth_name}</b></div>
                <div>Serial No: <b>${item.serial_no}</b></div>
                <div>Voting Date: <b>30-Nov-2023</b></div>
              </td>
            </tr>
          </table>
        `).join('')}
      </body>
    </html>
  `;
}

