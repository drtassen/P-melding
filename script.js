const SHEET_ID = '1z5SysUHb9qkvStxO7g1mmRZT_4RYYZrKFIWM7qkGzCg';
const ADMIN_PASSORD = "Hub123";
const MAKS_PLASSER = 20;

function doGet(e) {
  return HtmlService.createHtmlOutputFromFile('Index')
    .setTitle('RetroHub Kveldsgaming')
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}

function doPost(e) {
  let data = {};
  try {
    data = JSON.parse(e.postData.getDataAsString());
  } catch (err) {
    return jsonResponse({success: false, message: "Ugyldig JSON"});
  }

  // Admin handlinger
  if (data.action === 'delete' || data.action === 'clear') {
    if (data.passord !== ADMIN_PASSORD) {
      return jsonResponse({success: false, message: "Feil passord"});
    }
    if (data.action === 'delete') return slettDeltaker(data.row);
    if (data.action === 'clear') return tømHeleListen();
  }

  // Ny påmelding
  if (!data.navn || !data.forelderNavn || !data.forelderTelefon) {
    return jsonResponse({success: false, message: "Fyll inn navn, forelder og telefon"});
  }

  const ss = SpreadsheetApp.openById(SHEET_ID);
  let sheet = ss.getSheetByName('Påmeldinger');

  if (!sheet) {
    sheet = ss.insertSheet('Påmeldinger');
    sheet.appendRow(['Navn', 'ForelderNavn', 'ForelderTelefon', 'BAT', 'Tidspunkt']);
  }

  sheet.appendRow([
    data.navn.trim(),
    data.forelderNavn.trim(),
    data.forelderTelefon.trim(),
    data.bat ? data.bat.trim() : '',
    new Date()
  ]);

  return jsonResponse({success: true});
}

function jsonResponse(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}

function getDeltakere() {
  const ss = SpreadsheetApp.openById(SHEET_ID);
  const sheet = ss.getSheetByName('Påmeldinger');
  if (!sheet) return [];

  const values = sheet.getDataRange().getValues();
  const deltakere = [];

  for (let i = 1; i < values.length; i++) {
    const r = values[i];
    deltakere.push({
      navn: r[0] || '',
      forelderNavn: r[1] || '',
      forelderTelefon: r[2] || '',
      bat: r[3] || '',
      tid: r[4] ? new Date(r[4]).toLocaleString('no-NO') : '',
      row: i + 1
    });
  }
  return deltakere;
}

function slettDeltaker(row) {
  try {
    const ss = SpreadsheetApp.openById(SHEET_ID);
    const sheet = ss.getSheetByName('Påmeldinger');
    if (sheet) sheet.deleteRow(row);
    return jsonResponse({success: true});
  } catch (err) {
    return jsonResponse({success: false, message: err.message});
  }
}

function tømHeleListen() {
  try {
    const ss = SpreadsheetApp.openById(SHEET_ID);
    const sheet = ss.getSheetByName('Påmeldinger');
    if (sheet) {
      sheet.clearContents();
      sheet.appendRow(['Navn', 'ForelderNavn', 'ForelderTelefon', 'BAT', 'Tidspunkt']);
    }
    return jsonResponse({success: true});
  } catch (err) {
    return jsonResponse({success: false, message: err.message});
  }
}