/**
 * Google Apps Script — Pegar en el editor de Apps Script del Sheet
 * 
 * INSTRUCCIONES DE DESPLIEGUE:
 * 1. Abre el Google Sheet: https://docs.google.com/spreadsheets/d/1Ckd-msxGpSyAWcgkj4b40BJcgoCYdmKzsKX9MmcEUT4
 * 2. Ve a Extensiones → Apps Script
 * 3. Borra todo el contenido del editor y pega este código
 * 4. Haz clic en "Implementar" → "Nueva implementación"
 * 5. Tipo: "Aplicación web"
 * 6. Ejecutar como: "Yo" (tu cuenta)
 * 7. Quién tiene acceso: "Cualquier persona"
 * 8. Haz clic en "Implementar"
 * 9. Copia la URL que te da y pégala en script.js como SHEET_WEBHOOK_URL
 */

var SHEET_ID = '1Ckd-msxGpSyAWcgkj4b40BJcgoCYdmKzsKX9MmcEUT4';

function doPost(e) {
    try {
        var data = JSON.parse(e.postData.contents);

        var ss = SpreadsheetApp.openById(SHEET_ID);
        var sheet = ss.getSheets()[0]; // Primera hoja

        // Si la hoja está vacía, añadir encabezados
        if (sheet.getLastRow() === 0) {
            sheet.appendRow(['Fecha', 'Nombre', 'Email', 'Fuente']);
        }

        // Añadir fila con los datos del lead
        sheet.appendRow([
            data.timestamp || new Date().toISOString(),
            data.name || '',
            data.email || '',
            data.source || 'ebook_landing'
        ]);

        return ContentService
            .createTextOutput(JSON.stringify({ status: 'ok', message: 'Lead registrado' }))
            .setMimeType(ContentService.MimeType.JSON);

    } catch (error) {
        return ContentService
            .createTextOutput(JSON.stringify({ status: 'error', message: error.toString() }))
            .setMimeType(ContentService.MimeType.JSON);
    }
}

// Necesario para que funcione CORS desde el navegador
function doGet(e) {
    return ContentService
        .createTextOutput(JSON.stringify({ status: 'ok', message: 'Endpoint activo' }))
        .setMimeType(ContentService.MimeType.JSON);
}
