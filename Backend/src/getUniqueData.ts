import * as xlsx from 'xlsx';
import * as fs from 'fs';

export const handler = async (): Promise<any> => {
  try {
    const localFilePath = 'D:\\ForexSignals\\trading-app\\Backend\\telangana.xlsx';
    console.log(localFilePath);

    // Read the local Excel file
    const excelData = readLocalExcelFile(localFilePath);

    // Process the Excel data to remove duplicates
    const deduplicatedData = removeDuplicates(excelData);

    // Log the deduplicated data
    console.log('Deduplicated Data:', deduplicatedData);

    return { statusCode: 200, body: 'Process completed successfully.' };
  } catch (error) {
    console.error('Error:', error);
    return { statusCode: 500, body: 'Internal Server Error' };
  }
};

function readLocalExcelFile(localFilePath: string): any[][] {
  const fileContent = fs.readFileSync(localFilePath);
  const workbook = xlsx.read(fileContent, { type: 'buffer' });
  const sheetName = workbook.SheetNames[0];
  const sheetData:any = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName], { header: 1 });
  console.log("sheetName",sheetName);

  console.log("sheetData",sheetData);

  return sheetData;
}

function removeDuplicates(data: any[][]): any[][] {
  // Your deduplication logic here
  const deduplicatedData = data.filter((row, index, self) => {
    const firstOccurrence = self.findIndex((r) => JSON.stringify(r) === JSON.stringify(row));
    return index === firstOccurrence;
  });

  return deduplicatedData;
}

