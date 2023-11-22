
const fs = require('fs');
const pdf = require('html-pdf');
const archiver = require('archiver');
const fetch = require('node-fetch');

// exports.handler = async (event) => {
//   let body = event.body;
//   console.log("body", body);
//   const itemsPerPage = 5000;
//   const zipPath = './voterSlips.zip';
//   const output = fs.createWriteStream(zipPath);
//   const archive = archiver('zip', { zlib: { level: 9 } });

//   output.on('close', () => {
//     console.log(archive.pointer() + ' total bytes');
//     console.log('archiver has been finalized, and the output file descriptor has closed.');
//   });

//   archive.on('error', (err) => {
//     throw err;
//   });

//   archive.pipe(output);

//   let nextPage = 'https://test-api.itoconnect.online/sms/voterslip/?page=1';

//   // Fetch all voters from the API
//   while (nextPage) {
//     nextPage = nextPage.replace('http://', 'https://');
//     console.log("next Page", nextPage);

//     const response = await fetch(nextPage, {
//       method: 'GET',
//       headers: {
//         'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNzAwMTMxNDU1LCJpYXQiOjE3MDAwNTAzMzAsImp0aSI6ImM2MDkwYzlhNjg4ZDRjM2ZiNzEzYzc3ZGUzODU1YmI3IiwidXNlcl9pZCI6ImxibmFnYXJAaXRjLmNvbSJ9.eyqq8mvBMbE86AOYJR4BUHAtjHxguRL1iNOuyqWlq6Y',
//       },
//     });

//     if (!response.ok) {
//       console.error(`Error: ${response.status} - ${response.statusText}`);
//       throw new Error(`Failed to fetch data from the API`);
//     }

//     const data = await response.json();
//     const currentVoters = data.voters.slice(0, itemsPerPage);
//     console.log("Current Page Voters", currentVoters);

//     const htmlContent = generateHtmlContent(currentVoters);
//     const pdfBuffer = await new Promise<Buffer>((resolve, reject) => {
//       pdf.create(htmlContent, { timeout: 300000 }).toBuffer((err, buffer) => {
//         if (err) {
//           reject(err);
//         } else {
//           resolve(buffer);
//         }
//       });
//     });

//     const pdfPath = `voterSlip-${archive.pointer() / itemsPerPage + 1}.pdf`;
//     archive.append(pdfBuffer, { name: pdfPath });
//     archive.finalize();

//     nextPage = data.next; // Update the next page link
//     console.log("nextPage updated", nextPage);
//   }

//   // Finalize the ZIP file

//   return {
//     statusCode: 200,
//     headers: {
//       'Content-Type': 'application/zip',
//       'Content-Disposition': `attachment; filename=${zipPath}`,
//     },
//     body: fs.createReadStream(zipPath),
//   };
// };

exports.handler = async (event) => {
  let body = event.body;
  console.log("body", body);
  const itemsPerPage = 5000;

  let nextPage = 'https://test-api.itoconnect.online/sms/voterslip/?page=1';
  let batchNumber = 1; // Variable to track the batch number

  const zipPath = (batchNumber) => `./voterSlips_batch${batchNumber}.zip`;
  const output = fs.createWriteStream(zipPath(batchNumber));
  const archive = archiver('zip', { zlib: { level: 9 } });

  output.on('close', () => {
    console.log(archive.pointer() + ' total bytes');
    console.log('archiver has been finalized, and the output file descriptor has closed.');
  });

  archive.on('error', (err) => {
    throw err;
  });

  archive.pipe(output);

  // Fetch all voters from the API
  while (nextPage) {
    nextPage = nextPage.replace('http://', 'https://');
    console.log("next Page", nextPage);

    const response = await fetch(nextPage, {
      method: 'GET',
      headers: {
        'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNzAwMTM1MTEwLCJpYXQiOjE3MDAwNTAzMzAsImp0aSI6ImQ4MmYyYTYyMTlhODQyZDdhNzU4NTgwNzY1YTQ2ZWU3IiwidXNlcl9pZCI6ImxibmFnYXJAaXRjLmNvbSJ9.qq_KUr5Pz9-UVFHlqlkI8m28jq55huU97XGOPOfEqc4',
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

    const pdfPath = `voterSlip-${archive.pointer() / itemsPerPage + 1}.pdf`;
    archive.append(pdfBuffer, { name: pdfPath });

    nextPage = data.next; // Update the next page link
    console.log("nextPage updated", nextPage);

    // If next page is available, create a new ZIP file for the next batch
    if (nextPage) {
      batchNumber += 1; // Increment the batch number
      // Create a new ZIP file for the next batch
      const newOutput = fs.createWriteStream(zipPath(batchNumber));
      archive.pipe(newOutput);
    }
  }

  // Finalize the last ZIP file after the loop completes
  archive.finalize();

  // Return the zip file path for the first batch
  return {
    statusCode: 200,
    headers: {
      'Content-Type': 'application/zip',
      'Content-Disposition': `attachment; filename=${zipPath(1)}`,
    },
    body: fs.createReadStream(zipPath(1)),
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
          }
          table {
            width: 100%;
            height: 226px;
            border-collapse: collapse;
          }
          td {
            vertical-align: top;
            border: 1px dotted #000;
            padding: 5px;
          }
          .image-container img {
            max-width: 100%;
            height: auto;
            display: block;
            margin: 0 auto;
          }
          td.data-cell {
            border-right: 2px dotted #000;
            line-height: 1.7;
            padding: 12px;
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
                  <img style="max-width:90%" src="https://createmystore.online/voterCamp.png" alt="not visible" />
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

