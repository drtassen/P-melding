const SHEET_ID = '1z5SysUHb9qkvStxO7g1mmRZT_4RYYZrKFIWM7qkGzCg';
// ← BYTT UT MED DIN EKSKE SHEET-ID (den fra Google Sheets-URLen, ikke script-URLen!)

function doGet(e) {
  return ContentService.createTextOutput(JSON.stringify(getDeltakere()))
    .setMimeType(ContentService.MimeType.JSON);
}

function doPost(e) {
  let data = {};
    
  if (e && e.postData && e.postData.getDataAsString) {
    try {
      data = JSON.parse(e.postData.getDataAsString());
    } catch (err) {
      data = {};
    }
  }

  // Admin-funksjoner
  if (data.action === 'delete') {
    return slettDeltaker(data.row);
  }
  if (data.action === 'clear') {
    return tømHeleListen();
  }

  // Normal påmelding
  const ss = SpreadsheetApp.openById(SHEET_ID);
  let sheet = ss.getSheetByName('Påmeldinger');
  
  if (!sheet) {
    sheet = ss.insertSheet('Påmeldinger');
    sheet.appendRow(['Navn', 'ForelderNavn', 'ForelderTelefon', 'Tidspunkt']);
  }

  sheet.appendRow([data.navn, data.forelderNavn, data.forelderTelefon, new Date()]);

  return ContentService.createTextOutput(JSON.stringify({success: true}))
    .setMimeType(ContentService.MimeType.JSON);
}

function getDeltakere() {
  const ss = SpreadsheetApp.openById(SHEET_ID);
  const sheet = ss.getSheetByName('Påmeldinger');
  if (!sheet) return [];

  const values = sheet.getDataRange().getValues();
  const deltakere = [];

  for (let i = 1; i < values.length; i++) {
    deltakere.push({
      navn: values[i][0] || '',
      forelderNavn: values[i][1] || '',
      forelderTelefon: values[i][2] || '',
      tid: values[i][3] ? new Date(values[i][3]).toLocaleString('no-NO') : '',
      row: i + 1
    });
  }
  
  return deltakere; // eldste øverst → nyeste nederst (som du ville ha)
}

function slettDeltaker(row) {
  try {
    const ss = SpreadsheetApp.openById(SHEET_ID);
    const sheet = ss.getSheetByName('Påmeldinger');
    if (sheet) sheet.deleteRow(row);
    return ContentService.createTextOutput(JSON.stringify({success: true}))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({success: false, message: err.message}))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function tømHeleListen() {
  try {
    const ss = SpreadsheetApp.openById(SHEET_ID);
    const sheet = ss.getSheetByName('Påmeldinger');
    if (sheet) {
      sheet.clearContents();
      sheet.appendRow(['Navn', 'ForelderNavn', 'ForelderTelefon', 'Tidspunkt']);
    }
    return ContentService.createTextOutput(JSON.stringify({success: true}))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({success: false, message: err.message}))
      .setMimeType(ContentService.MimeType.JSON);
  }
}