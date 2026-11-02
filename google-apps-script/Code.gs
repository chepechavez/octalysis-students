/**
 * ============================================================================
 * OCTALYSIS STUDENTS — BACKEND MULTI-SALA EN GOOGLE APPS SCRIPT
 * ============================================================================
 * Este script convierte cualquier hoja de cálculo de Google (Google Sheet) en
 * un servidor gratuito y sin caducidad para Octalysis Students.
 *
 * Sirve tanto como:
 *   1. Hoja maestra para el modo rápido (múltiples salas aisladas por código).
 *   2. Hoja personal de un docente que prefiera guardar los datos en su Drive.
 *
 * INSTRUCCIONES DE DESPLIEGUE (1 MINUTO):
 *   1. Crea una hoja de cálculo nueva en Google Sheets.
 *   2. Ve al menú Extensiones > Apps Script.
 *   3. Borra el contenido de Código.gs y pega todo este archivo.
 *   4. Haz clic en "Implementar" (arriba a la derecha) > "Nueva implementación".
 *   5. En tipo, elige "Aplicación web".
 *   6. En "Ejecutar como", selecciona "Yo".
 *   7. En "Quién tiene acceso", selecciona "Cualquier persona".
 *   8. Haz clic en "Implementar", autoriza los permisos y copia la URL (/exec).
 * ============================================================================
 */

const SHEET_ROOMS = 'Salas';
const SHEET_SUBMISSIONS = 'Respuestas';

/**
 * Inicializa las pestañas "Salas" y "Respuestas" si aún no existen.
 */
function ensureSheets_() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();

  let roomsSheet = ss.getSheetByName(SHEET_ROOMS);
  if (!roomsSheet) {
    roomsSheet = ss.insertSheet(SHEET_ROOMS);
    roomsSheet.appendRow([
      'codigo_sala',
      'nombre_curso',
      'pin_hash',
      'requiere_cedula',
      'requiere_correo',
      'creada_en',
      'actualizada_en'
    ]);
    roomsSheet.getRange(1, 1, 1, 7).setFontWeight('bold');
    roomsSheet.setFrozenRows(1);
  }

  let subsSheet = ss.getSheetByName(SHEET_SUBMISSIONS);
  if (!subsSheet) {
    subsSheet = ss.insertSheet(SHEET_SUBMISSIONS);
    subsSheet.appendRow([
      'id_respuesta',
      'fecha_hora',
      'codigo_sala',
      'estudiante',
      'cedula',
      'correo',
      'prioridad_1',
      'prioridad_2',
      'prioridad_3',
      'mecanicas_elegidas',
      'CD1',
      'CD2',
      'CD3',
      'CD4',
      'CD5',
      'CD6',
      'CD7',
      'CD8',
      'pct_sombrero_blanco',
      'pct_sombrero_negro',
      'pct_intrinseca',
      'pct_extrinseca',
      'arquetipo',
      'payload_json'
    ]);
    subsSheet.getRange(1, 1, 1, 24).setFontWeight('bold');
    subsSheet.setFrozenRows(1);
  }

  return { roomsSheet, subsSheet };
}

/**
 * Construye una respuesta JSON compatible con CORS.
 */
function jsonResponse_(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}

/**
 * Atiende consultas GET:
 *   - ?action=ping
 *   - ?action=getRoom&roomId=OCTA-123
 */
function doGet(e) {
  try {
    const params = (e && e.parameter) ? e.parameter : {};
    const action = params.action || 'getRoom';

    if (action === 'ping') {
      return jsonResponse_({
        ok: true,
        service: 'Octalysis Students Backend',
        version: '2.1.0'
      });
    }

    const roomId = String(params.roomId || params.sala || '').trim().toUpperCase();
    if (!roomId) {
      return jsonResponse_({ ok: false, error: 'Falta el parámetro roomId.' });
    }

    const { roomsSheet, subsSheet } = ensureSheets_();

    // 1. Buscar configuración de la sala
    let roomConfig = null;
    const roomRows = roomsSheet.getDataRange().getValues();
    for (let i = 1; i < roomRows.length; i++) {
      if (String(roomRows[i][0]).trim().toUpperCase() === roomId) {
        roomConfig = {
          code: roomId,
          name: String(roomRows[i][1] || ''),
          pinHash: String(roomRows[i][2] || ''),
          requireCedula: roomRows[i][3] === true || String(roomRows[i][3]).toLowerCase() === 'true',
          requireEmail: roomRows[i][4] === true || String(roomRows[i][4]).toLowerCase() === 'true',
          createdAt: String(roomRows[i][5] || ''),
          updatedAt: String(roomRows[i][6] || '')
        };
        break;
      }
    }

    // 2. Buscar respuestas asociadas únicamente a esta sala
    const submissions = [];
    const subRows = subsSheet.getDataRange().getValues();
    for (let j = 1; j < subRows.length; j++) {
      if (String(subRows[j][2]).trim().toUpperCase() === roomId) {
        const rawJson = subRows[j][23];
        if (rawJson) {
          try {
            submissions.push(JSON.parse(rawJson));
            continue;
          } catch (parseErr) {
            // Reconstruir desde columnas si el JSON fue editado manualmente
          }
        }
        submissions.push({
          id: String(subRows[j][0]),
          timestamp: String(subRows[j][1]),
          roomId: roomId,
          studentName: String(subRows[j][3]),
          cedula: String(subRows[j][4] || 'N/A'),
          email: String(subRows[j][5] || 'N/A'),
          priority1: subRows[j][6] ? { id: 0, name: String(subRows[j][6]), cd: 1 } : null,
          priority2: subRows[j][7] ? { id: 0, name: String(subRows[j][7]), cd: 1 } : null,
          priority3: subRows[j][8] ? { id: 0, name: String(subRows[j][8]), cd: 1 } : null,
          selectedMechanics: String(subRows[j][9] || '')
            .split(' | ')
            .filter(Boolean)
            .map(function(n) { return { id: 0, name: n, cd: 1 }; }),
          cdTotals: {
            1: Number(subRows[j][10]) || 0,
            2: Number(subRows[j][11]) || 0,
            3: Number(subRows[j][12]) || 0,
            4: Number(subRows[j][13]) || 0,
            5: Number(subRows[j][14]) || 0,
            6: Number(subRows[j][15]) || 0,
            7: Number(subRows[j][16]) || 0,
            8: Number(subRows[j][17]) || 0
          },
          pctWhite: Number(subRows[j][18]) || 50,
          pctBlack: Number(subRows[j][19]) || 50,
          pctIntrinsic: Number(subRows[j][20]) || 50,
          pctExtrinsic: Number(subRows[j][21]) || 50,
          archetype: String(subRows[j][22] || '')
        });
      }
    }

    return jsonResponse_({
      ok: true,
      room: roomConfig,
      submissions: submissions
    });
  } catch (err) {
    return jsonResponse_({ ok: false, error: String(err) });
  }
}

/**
 * Atiende peticiones POST:
 *   - action: 'saveRoom'
 *   - action: 'submitSurvey'
 *   - action: 'deleteRoom'
 */
function doPost(e) {
  const lock = LockService.getScriptLock();
  lock.waitLock(15000);

  try {
    const rawBody = (e && e.postData && e.postData.contents) ? e.postData.contents : '{}';
    const body = JSON.parse(rawBody);
    const action = body.action || 'submitSurvey';
    const { roomsSheet, subsSheet } = ensureSheets_();
    const nowIso = new Date().toISOString();

    // 1. CREAR O ACTUALIZAR CONFIGURACIÓN DE SALA
    if (action === 'saveRoom') {
      const room = body.room || {};
      const code = String(room.code || '').trim().toUpperCase();
      if (!code) {
        return jsonResponse_({ ok: false, error: 'Código de sala inválido.' });
      }

      const rows = roomsSheet.getDataRange().getValues();
      let foundRowIdx = -1;
      let existingHash = '';

      for (let i = 1; i < rows.length; i++) {
        if (String(rows[i][0]).trim().toUpperCase() === code) {
          foundRowIdx = i + 1;
          existingHash = String(rows[i][2] || '');
          break;
        }
      }

      if (foundRowIdx > 0) {
        // Verificar autorización si ya tenía un pinHash registrado
        const authHash = String(body.authPinHash || room.pinHash || '');
        if (existingHash && existingHash !== authHash) {
          return jsonResponse_({ ok: false, error: 'No autorizado para modificar esta sala.' });
        }
        roomsSheet.getRange(foundRowIdx, 2, 1, 6).setValues([[
          String(room.name || ''),
          String(room.pinHash || existingHash),
          Boolean(room.requireCedula),
          Boolean(room.requireEmail),
          String(room.createdAt || nowIso),
          nowIso
        ]]);
      } else {
        roomsSheet.appendRow([
          code,
          String(room.name || ''),
          String(room.pinHash || ''),
          Boolean(room.requireCedula),
          Boolean(room.requireEmail),
          String(room.createdAt || nowIso),
          nowIso
        ]);
      }

      return jsonResponse_({ ok: true, code: code });
    }

    // 2. ELIMINAR / VACIAR DATOS DE UNA SALA (SOLICITADO POR SU DOCENTE)
    if (action === 'deleteRoom') {
      const code = String(body.roomId || '').trim().toUpperCase();
      const authHash = String(body.authPinHash || '');
      const deleteConfigToo = Boolean(body.deleteConfig);

      if (!code || !authHash) {
        return jsonResponse_({ ok: false, error: 'Faltan credenciales de la sala.' });
      }

      const roomRows = roomsSheet.getDataRange().getValues();
      let roomRowIdx = -1;
      for (let i = 1; i < roomRows.length; i++) {
        if (String(roomRows[i][0]).trim().toUpperCase() === code) {
          if (String(roomRows[i][2] || '') !== authHash) {
            return jsonResponse_({ ok: false, error: 'PIN no válido para eliminar esta sala.' });
          }
          roomRowIdx = i + 1;
          break;
        }
      }

      // Borrar respuestas de abajo hacia arriba para no desplazar índices
      const subRows = subsSheet.getDataRange().getValues();
      let deletedCount = 0;
      for (let j = subRows.length - 1; j >= 1; j--) {
        if (String(subRows[j][2]).trim().toUpperCase() === code) {
          subsSheet.deleteRow(j + 1);
          deletedCount++;
        }
      }

      if (deleteConfigToo && roomRowIdx > 0) {
        roomsSheet.deleteRow(roomRowIdx);
      }

      return jsonResponse_({ ok: true, deletedSubmissions: deletedCount });
    }

    // 3. REGISTRAR RESPUESTA DE ESTUDIANTE (submitSurvey o payload directo)
    const sub = body.submission || body;
    const roomId = String(sub.roomId || '').trim().toUpperCase();
    if (!roomId) {
      return jsonResponse_({ ok: false, error: 'Falta roomId en la respuesta.' });
    }

    const cd = sub.cdTotals || {};
    const mechNames = Array.isArray(sub.selectedMechanics)
      ? sub.selectedMechanics.map(function(m) { return m.name || m; }).join(' | ')
      : '';

    const rowValues = [
      String(sub.id || ('sub_' + new Date().getTime())),
      String(sub.timestamp || nowIso),
      roomId,
      String(sub.studentName || 'Estudiante'),
      String(sub.cedula || 'N/A'),
      String(sub.email || 'N/A'),
      sub.priority1 ? String(sub.priority1.name || '') : '',
      sub.priority2 ? String(sub.priority2.name || '') : '',
      sub.priority3 ? String(sub.priority3.name || '') : '',
      mechNames,
      Number(cd[1]) || 0,
      Number(cd[2]) || 0,
      Number(cd[3]) || 0,
      Number(cd[4]) || 0,
      Number(cd[5]) || 0,
      Number(cd[6]) || 0,
      Number(cd[7]) || 0,
      Number(cd[8]) || 0,
      Number(sub.pctWhite) || 50,
      Number(sub.pctBlack) || 50,
      Number(sub.pctIntrinsic) || 50,
      Number(sub.pctExtrinsic) || 50,
      String(sub.archetype || ''),
      JSON.stringify(sub)
    ];

    // Desduplicar si el mismo estudiante (por sessionToken o cédula o nombre exacto en la misma sala) reenvía
    const subRows = subsSheet.getDataRange().getValues();
    let existingSubRow = -1;
    const subKey = (sub.cedula && sub.cedula !== 'N/A')
      ? ('ced:' + String(sub.cedula).trim().toLowerCase())
      : ('nick:' + String(sub.studentName || '').trim().toLowerCase());

    for (let k = 1; k < subRows.length; k++) {
      if (String(subRows[k][2]).trim().toUpperCase() === roomId) {
        const rowCed = String(subRows[k][4] || '').trim().toLowerCase();
        const rowNick = String(subRows[k][3] || '').trim().toLowerCase();
        const rowKey = (rowCed && rowCed !== 'n/a') ? ('ced:' + rowCed) : ('nick:' + rowNick);
        if (String(subRows[k][0]) === String(sub.id) || (subKey && rowKey === subKey)) {
          existingSubRow = k + 1;
          break;
        }
      }
    }

    if (existingSubRow > 0) {
      subsSheet.getRange(existingSubRow, 1, 1, rowValues.length).setValues([rowValues]);
    } else {
      subsSheet.appendRow(rowValues);
    }

    return jsonResponse_({ ok: true, id: rowValues[0] });
  } catch (err) {
    return jsonResponse_({ ok: false, error: String(err) });
  } finally {
    lock.releaseLock();
  }
}
