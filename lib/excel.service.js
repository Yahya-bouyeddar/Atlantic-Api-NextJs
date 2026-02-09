const xlsx = require("xlsx");

// exports.validateHeaders = (fileBuffer) => {
//   try {
//     const REQUIRED_HEADERS = ["Etage", "Reference", "Date"];
    
//     const workbook = xlsx.read(fileBuffer, { type: "buffer" });
//     const sheetName = workbook.SheetNames[0];
//     const worksheet = workbook.Sheets[sheetName];
    
//     const jsonData = xlsx.utils.sheet_to_json(worksheet, { 
//       header: 1,
//       blankrows: false 
//     });

//     if (jsonData.length === 0) {
//       return {
//         valid: false,
//         error: "Le fichier Excel est vide"
//       };
//     }

//     const headers = jsonData[0];
    
//     // Vérifier que tous les headers requis sont présents
//     const missingHeaders = REQUIRED_HEADERS.filter(
//       required => !headers.includes(required)
//     );

//     if (missingHeaders.length > 0) {
//       return {
//         valid: false,
//         error: `Colonnes manquantes: ${missingHeaders.join(', ')}. Colonnes requises: ${REQUIRED_HEADERS.join(', ')}`
//       };
//     }

//     return {
//       valid: true,
//       headers: headers
//     };
//   } catch (error) {
//     return {
//       valid: false,
//       error: "Erreur lors de la validation des colonnes: " + error.message
//     };
//   }
// };
exports.validateHeaders = (fileBuffer) => {
  try {
    const REQUIRED_HEADERS = ["Etage", "Reference", "Date"];
    
    const workbook = xlsx.read(fileBuffer, { type: "buffer" });
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    
    const jsonData = xlsx.utils.sheet_to_json(worksheet, { 
      header: 1,
      blankrows: false 
    });

    if (jsonData.length === 0) {
      return {
        valid: false,
        error: "Le fichier Excel est vide"
      };
    }

    const headers = jsonData[0];
    
    // Vérifier que tous les headers requis sont présents
    const missingHeaders = REQUIRED_HEADERS.filter(
      required => !headers.includes(required)
    );

    if (missingHeaders.length > 0) {
      return {
        valid: false,
        error: `Colonnes manquantes: ${missingHeaders.join(', ')}. Colonnes requises: ${REQUIRED_HEADERS.join(', ')}`
      };
    }

    return {
      valid: true,
      headers: headers
    };
  } catch (error) {
    return {
      valid: false,
      error: "Erreur lors de la validation des colonnes: " + error.message
    };
  }
};
// exports.validateRowData = (row, rowIndex) => {
//   const errors = [];

//   // Vérifier Etage
//   if (!row.rowLabel || row.rowLabel.trim() === '') {
//     errors.push(`Ligne ${rowIndex}: Colonne 'Etage' vide`);
//   }

//   // Vérifier Reference
//   if (!row.reference || String(row.reference).trim() === '') {
//     errors.push(`Ligne ${rowIndex}: Colonne 'Reference' vide`);
//   }

//   // Vérifier Date
//   if (!row.rawDate) {
//     errors.push(`Ligne ${rowIndex}: Colonne 'Date' vide`);
//   } else {
//     const dateValue = row.rawDate;
    
//     // Si c'est un string, vérifier le format
//     if (typeof dateValue === 'string') {
//       const datePattern = /^\d{1,2}[-\/]\d{1,2}[-\/]\d{4}$/;
      
//       if (!datePattern.test(dateValue)) {
//         errors.push(
//           `Ligne ${rowIndex}: Format de date invalide "${dateValue}". ` +
//           `Utilisez: JJ-MM-AAAA ou JJ/MM/AAAA`
//         );
//       }
//     } 
//     // Si c'est un nombre, vérifier qu'il est dans la plage Excel valide
//     else if (typeof dateValue === 'number') {
//       if (dateValue < 1 || dateValue > 2958465) {
//         errors.push(`Ligne ${rowIndex}: Date Excel invalide (${dateValue})`);
//       }
//     } 
//     // Si c'est autre chose (objet, etc.)
//     else {
//       errors.push(
//         `Ligne ${rowIndex}: Type de donnée invalide dans 'Date'. ` +
//         `Attendu: date ou texte (ex: 15-11-2025)`
//       );
//     }
//   }

//   return {
//     valid: errors.length === 0,
//     errors: errors
//   };
// };
exports.validateRowData = (row, rowIndex) => {
  const errors = [];

  // Vérifier Etage
  if (!row.rowLabel || row.rowLabel.trim() === '') {
    errors.push(`Ligne ${rowIndex}: Colonne 'Etage' vide`);
  }

  // Vérifier Reference
  if (!row.reference || String(row.reference).trim() === '') {
    errors.push(`Ligne ${rowIndex}: Colonne 'Reference' vide`);
  }

  // Vérifier Date
  if (!row.rawDate) {
    errors.push(`Ligne ${rowIndex}: Colonne 'Date' vide`);
  } else {
    const dateValue = row.rawDate;
    
    // Si c'est un string, vérifier le format
    if (typeof dateValue === 'string') {
      const datePattern = /^\d{1,2}[-\/]\d{1,2}[-\/]\d{4}$/;
      
      if (!datePattern.test(dateValue)) {
        errors.push(
          `Ligne ${rowIndex}: Format de date invalide "${dateValue}". ` +
          `Utilisez: JJ-MM-AAAA ou JJ/MM/AAAA`
        );
      }
    } 
    // Si c'est un nombre, vérifier qu'il est dans la plage Excel valide
    else if (typeof dateValue === 'number') {
      if (dateValue < 1 || dateValue > 2958465) {
        errors.push(`Ligne ${rowIndex}: Date Excel invalide (${dateValue})`);
      }
    } 
    // Si c'est autre chose (objet, etc.)
    else {
      errors.push(
        `Ligne ${rowIndex}: Type de donnée invalide dans 'Date'. ` +
        `Attendu: date ou texte (ex: 15-11-2025)`
      );
    }
  }

  return {
    valid: errors.length === 0,
    errors: errors
  };
};
/**
 * Parse Excel file and extract data rows
 * @param {Buffer} fileBuffer - Excel file buffer
 * @returns {Array} Array of data rows
 */
// exports.newParseExcelFile = (fileBuffer) => {
//   try {
//     const HEADER_INDEX = 0;
//     const HEADER_ELEMENTS = ["Etage", "Reference", "Date"];
//     // Read the workbook from buffer
//     const workbook = xlsx.read(fileBuffer, { type: "buffer" });

//     // Get the first sheet
//     const sheetName = workbook.SheetNames[0];
//     const worksheet = workbook.Sheets[sheetName];

//     // Convert to JSON
//     const jsonData = xlsx.utils.sheet_to_json(worksheet, { header: 1,blankrows: false   });

//     const firstRow = jsonData[HEADER_INDEX];
//     if (
//       !firstRow ||
//       firstRow.length == 0 ||
//       !HEADER_ELEMENTS.every((hd) => firstRow.includes(hd)) // TODO improve to handle column order
//     ) {
//       throw new Error("Header row not found in Excel file");
//     }

//     // Extract data rows after header
//     const dataRows = [];
//     for (let i = HEADER_INDEX + 1; i < jsonData.length; i++) {
//       const row = jsonData[i];

//       // Skip empty rows or header containing '318/24'
//       if (!row || row.length < 3) {
//         continue;
//       }

//       // Extract row data
//       const rowLabel = String(row[0] || "").trim();
//       const reference = row[1];
//       const dateValue = row[2];

//       // Skip if no label or date
//       if (!rowLabel || !reference || !dateValue) {
//         continue;
//       }
//       if (!rowLabel || !reference || !dateValue) {
//         // On continue quand même pour que la validation puisse signaler l'erreur
//         dataRows.push({
//           rowLabel: rowLabel || '',
//           reference: reference || '',
//           etage: rowLabel ? exports.mapRowToEtage(rowLabel) : '',
//           date: '',
//           rawDate: dateValue || null,
//           _hasError: true
//         });
//         continue;
//       }

//       // Parse the date
//       let parsedDate;
//       if (typeof dateValue === "number") {
//         // Excel date number
//         parsedDate = exports.excelDateToJSDate(dateValue);
//       } else {
//         // String date
//         parsedDate = exports.parseDate(String(dateValue));
//       }

//       if (!parsedDate) {
//         // Garder la ligne avec erreur pour validation
//         dataRows.push({
//           rowLabel,
//           reference,
//           etage: exports.mapRowToEtage(rowLabel),
//           date: '',
//           rawDate: dateValue,
//           _hasError: true
//         });
//         continue;
//       }

//       // Map row label to etage type
//       const etage = exports.mapRowToEtage(rowLabel);

//       dataRows.push({
//         rowLabel,
//         reference,
//         etage,
//         date: exports.formatDate(parsedDate),
//         rawDate: dateValue,
//       });
//     }

//     return dataRows;
//   } catch (error) {
//     console.error("Excel parsing error:", error);
//     throw new Error("Error parsing Excel file: " + error.message);
//   }
// };


// exports.newParseExcelFile = (fileBuffer) => {
//   try {
//     const HEADER_INDEX = 0;
//     const HEADER_ELEMENTS = ["Etage", "Reference", "Date"];
    
//     // Read the workbook from buffer
//     const workbook = xlsx.read(fileBuffer, { type: "buffer" });

//     // Get the first sheet
//     const sheetName = workbook.SheetNames[0];
//     const worksheet = workbook.Sheets[sheetName];

//     // Convert to JSON
//     // const jsonData = xlsx.utils.sheet_to_json(worksheet, { header: 1 });
//     const jsonData = xlsx.utils.sheet_to_json(worksheet, { 
//       header: 1,
//       blankrows: false  // ← CECI IGNORE LES LIGNES VIDES !
//     });
//     console.log('📊 Total rows in Excel:', jsonData.length);
//     console.log('📋 Raw Excel data:', JSON.stringify(jsonData, null, 2));

//     const firstRow = jsonData[HEADER_INDEX];
//     if (
//       !firstRow ||
//       firstRow.length == 0 ||
//       !HEADER_ELEMENTS.every((hd) => firstRow.includes(hd))
//     ) {
//       throw new Error("Header row not found in Excel file");
//     }

//     // Extract data rows after header
//     const dataRows = [];
//     for (let i = HEADER_INDEX + 1; i < jsonData.length; i++) {
//       const row = jsonData[i];

//       console.log(`🔍 Processing row ${i}:`, row);

//       // CORRECTION 1: Vérifier si la ligne existe (pas juste sa longueur)
//       if (!row || row.length === 0) {
//         console.log(`⚠️ Row ${i}: Empty row, skipping`);
//         continue;
//       }

//       // CORRECTION 2: Vérifier chaque champ individuellement plutôt que row.length
//       const etageValue = row[0];
//       const reference = row[1];
//       const dateValue = row[2];

//       console.log(`   Etage: "${etageValue}", Reference: "${reference}", Date: "${dateValue}"`);

//       // Extract row data avec gestion des undefined/null
//       const rowLabel = String(etageValue || "").trim();

//       // CORRECTION 3: Accepter les lignes même si un champ est vide
//       // Vous pouvez ajuster cette logique selon vos besoins
//       if (!rowLabel && !reference && !dateValue) {
//         console.log(`⚠️ Row ${i}: All fields empty, skipping`);
//         continue;
//       }

//       // Si au moins un champ requis manque, on log mais on peut décider de garder ou pas
//       if (!rowLabel) {
//         console.log(`⚠️ Row ${i}: Missing Etage label`);
//       }
//       if (!reference) {
//         console.log(`⚠️ Row ${i}: Missing Reference`);
//       }
//       if (!dateValue) {
//         console.log(`⚠️ Row ${i}: Missing Date`);
//       }

//       // OPTION A: Skip si un champ requis manque (comportement actuel)
//       if (!rowLabel || !reference || !dateValue) {
//         console.log(`❌ Row ${i}: Skipping due to missing required fields`);
//         continue;
//       }

//       // Parse the date
//       let parsedDate;
//       if (typeof dateValue === "number") {
//         // Excel date number
//         parsedDate = exports.excelDateToJSDate(dateValue);
//       } else {
//         // String date
//         parsedDate = exports.parseDate(String(dateValue));
//       }

//       if (!parsedDate) {
//         console.log(`❌ Row ${i}: Invalid date format`);
//         continue;
//       }

//       // Map row label to etage type
//       const etage = exports.mapRowToEtage(rowLabel);

//       const dataRow = {
//         rowLabel,
//         reference,
//         etage,
//         date: exports.formatDate(parsedDate),
//         rawDate: dateValue,
//       };

//       console.log(`✅ Row ${i}: Added`, dataRow);
//       dataRows.push(dataRow);
//     }

//     console.log(`📦 Final parsed rows: ${dataRows.length}`);
//     return dataRows;
//   } catch (error) {
//     console.error("❌ Excel parsing error:", error);
//     throw new Error("Error parsing Excel file: " + error.message);
//   }
// };
exports.newParseExcelFile = (fileBuffer) => {
  try {
    const HEADER_INDEX = 0;
    const HEADER_ELEMENTS = ["Etage", "Reference", "Date"];
    
    const workbook = xlsx.read(fileBuffer, { type: "buffer" });
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];

    const jsonData = xlsx.utils.sheet_to_json(worksheet, { 
      header: 1,
      blankrows: false 
    });

    const firstRow = jsonData[HEADER_INDEX];
    if (
      !firstRow ||
      firstRow.length == 0 ||
      !HEADER_ELEMENTS.every((hd) => firstRow.includes(hd))
    ) {
      throw new Error(
        "En-têtes manquants. Le fichier doit contenir: Etage, Reference, Date"
      );
    }

    const dataRows = [];
    for (let i = HEADER_INDEX + 1; i < jsonData.length; i++) {
      const row = jsonData[i];

      // ✅ Ignorer les lignes complètement vides
      if (!row || row.length === 0) {
        continue;
      }

      const etageValue = row[0];
      const reference = row[1];
      const dateValue = row[2];
      const rowLabel = String(etageValue || "").trim();

      // ✅ Ignorer si tous les champs sont vides
      if (!rowLabel && !reference && !dateValue) {
        continue;
      }

      // ✅ Si un champ requis manque, ajouter avec _hasError
      if (!rowLabel || !reference || !dateValue) {
        dataRows.push({
          rowLabel: rowLabel || '',
          reference: reference || '',
          etage: rowLabel ? exports.mapRowToEtage(rowLabel) : '',
          date: '',
          rawDate: dateValue || null,
          _hasError: true
        });
        continue;
      }

      // ✅ Parser la date
      let parsedDate;
      if (typeof dateValue === "number") {
        parsedDate = exports.excelDateToJSDate(dateValue);
      } else {
        parsedDate = exports.parseDate(String(dateValue));
      }

      if (!parsedDate) {
        // Garder la ligne avec erreur pour validation
        dataRows.push({
          rowLabel,
          reference,
          etage: exports.mapRowToEtage(rowLabel),
          date: '',
          rawDate: dateValue,
          _hasError: true
        });
        continue;
      }

      // ✅ Ligne valide
      const etage = exports.mapRowToEtage(rowLabel);

      dataRows.push({
        rowLabel,
        reference,
        etage,
        date: exports.formatDate(parsedDate),
        rawDate: dateValue,
      });
    }

    return dataRows;
  } catch (error) {
    console.error("Excel parsing error:", error);
    throw new Error("Erreur lors de la lecture du fichier: " + error.message);
  }
};
/**
 * Parse Excel file and extract data rows
 * @param {Buffer} fileBuffer - Excel file buffer
 * @returns {Array} Array of data rows
 */
exports.parseExcelFile = (fileBuffer) => {
  try {
    // Read the workbook from buffer
    const workbook = xlsx.read(fileBuffer, { type: "buffer" });

    // Get the first sheet
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];

    // Convert to JSON
    const jsonData = xlsx.utils.sheet_to_json(worksheet, { header: 1 });

    // Find the header row (looking for 'BA', 'fdts', etc.)
    let headerRowIndex = -1;
    for (let i = 0; i < jsonData.length; i++) {
      const row = jsonData[i];
      if (
        row &&
        row.length > 0 &&
        (String(row[0]).includes("BA") ||
          String(row[0]).toLowerCase().includes("fdts") ||
          String(row[0]).toLowerCase().includes("s/sol"))
      ) {
        headerRowIndex = i;
        break;
      }
    }

    if (headerRowIndex === -1) {
      throw new Error("Header row not found in Excel file");
    }

    // Extract data rows after header
    const dataRows = [];
    for (let i = headerRowIndex; i < jsonData.length; i++) {
      const row = jsonData[i];

      // Skip empty rows or header containing '318/24'
      if (!row || row.length < 2 || String(row[0]).includes("318/24")) {
        continue;
      }

      // Extract row data
      const rowLabel = String(row[0] || "").trim();
      const dateValue = row[1];

      // Skip if no label or date
      if (!rowLabel || !dateValue) {
        continue;
      }

      // Parse the date
      let parsedDate;
      if (typeof dateValue === "number") {
        parsedDate = exports.excelDateToJSDate(dateValue);
      } else {
        parsedDate = exports.parseDate(String(dateValue));
      }

      if (!parsedDate) {
        continue;
      }

      const etage = exports.mapRowToEtage(rowLabel);

      dataRows.push({
        rowLabel,
        etage,
        date: exports.formatDate(parsedDate),
        rawDate: dateValue,
      });
    }

    return dataRows;
  } catch (error) {
    console.error("Excel parsing error:", error);
    throw new Error("Error parsing Excel file: " + error.message);
  }
};

/**
 * Map row label to etage type
 * @param {string} label - Row label from Excel
 * @returns {string} Etage type
 */
exports.mapRowToEtage = (label) => {
  const labelLower = label.toLowerCase();

  if (labelLower.includes("fdts") || labelLower.includes("fondation")) {
    return "FONDATIONS";
  }
  if (labelLower.includes("Dalle") || labelLower.includes("dalle")) {
    return "DALLAGE";
  } else if (labelLower.includes("s/sol") || labelLower.includes("ssol")) {
    return "PL.HT. S/SOL";
  } else if (labelLower.includes("spte") || labelLower.includes("soupente")) {
    return "SOUPENTE";
  } else if (labelLower.includes("rdch") || labelLower.includes("r.d.ch")) {
    return "PL.HT. R.D.CH";
  } else if (labelLower.includes("1") && labelLower.includes("etg")) {
    return "PL.HT. 1° ETAGE";
  } else if (labelLower.includes("2") && labelLower.includes("etg")) {
    return "PL.HT. 2° ETAGE";
  } else if (labelLower.includes("3") && labelLower.includes("etg")) {
    return "PL.HT. 3° ETAGE";
  } else if (labelLower.includes("4") && labelLower.includes("etg")) {
    return "PL.HT. 4° ETAGE";
  } else if (labelLower.includes("5") && labelLower.includes("etg")) {
    return "PL.HT. 5° ETAGE";
  } else if (labelLower.includes("6") && labelLower.includes("etg")) {
    return "PL.HT. 6° ETAGE";
  }

  // Default fallback
  return label.toUpperCase();
};

/**
 * Convert Excel date number to JavaScript Date
 * @param {number} excelDate - Excel date number
 * @returns {Date} JavaScript Date object
 */
exports.excelDateToJSDate = (excelDate) => {
  // Excel dates start from 1899-12-30
  const excelEpoch = new Date(1899, 11, 30);
  const jsDate = new Date(excelEpoch.getTime() + excelDate * 86400000);
  return jsDate;
};

/**
 * Parse date string in various formats
 * @param {string} dateStr - Date string
 * @returns {Date|null} JavaScript Date object or null
 */
exports.parseDate = (dateStr) => {
  try {
    // Try DD/MM/YYYY format
    const parts = dateStr.split(/[-\/]/);
    if (parts.length === 3) {
      const day = parseInt(parts[0], 10);
      const month = parseInt(parts[1], 10) - 1; // JS months are 0-indexed
      const year = parseInt(parts[2], 10);

      if (!isNaN(day) && !isNaN(month) && !isNaN(year)) {
        return new Date(year, month, day);
      }
    }

    // Try as ISO date
    const date = new Date(dateStr);
    if (!isNaN(date.getTime())) {
      return date;
    }

    return null;
  } catch {
    return null;
  }
};

/**
 * Format date to DD/MM/YYYY
 * @param {Date} date - JavaScript Date object
 * @returns {string} Formatted date string
 */
exports.formatDate = (date) => {
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
};

/**
 * Validate Excel structure
 * @param {Buffer} fileBuffer - Excel file buffer
 * @returns {Object} Validation result
 */
// exports.validateExcelFile = (fileBuffer) => {
//   try {
//     const workbook = xlsx.read(fileBuffer, { type: "buffer" });

//     if (workbook.SheetNames.length === 0) {
//       return {
//         valid: false,
//         error: "Excel file has no sheets",
//       };
//     }
//     const headerValidation = this.validateHeaders(fileBuffer);
//     if (!headerValidation.valid) {
//       return headerValidation;
//     }

//     const rows = this.newParseExcelFile(fileBuffer);

//     if (rows.length === 0) {
//       return {
//         valid: false,
//         error: "No valid data rows found in Excel file",
//       };
//     }
//     const allErrors = [];
//     rows.forEach((row, index) => {
//       const validation = this.validateRowData(row, index + 2); // +2 car ligne 1 = header
//       if (!validation.valid) {
//         allErrors.push(...validation.errors);
//       }
//     });

//     if (allErrors.length > 0) {
//       return {
//         valid: false,
//         error: "Données invalides détectées",
//         details: allErrors.slice(0, 5).join('\n'), // Limiter à 5 erreurs
//         allErrors: allErrors
//       };
//     }
//     return {
//       valid: true,
//       rowCount: rows.length,
//       rows,
//     };
//   } catch (error) {
//     return {
//       valid: false,
//       error: error.message,
//     };
//   }
// };
exports.validateExcelFile = (fileBuffer) => {
  try {
    const workbook = xlsx.read(fileBuffer, { type: "buffer" });

    if (workbook.SheetNames.length === 0) {
      return {
        valid: false,
        error: "Le fichier Excel ne contient aucune feuille",
      };
    }

    // ✅ NOUVEAU : Validation des headers
    const headerValidation = exports.validateHeaders(fileBuffer);
    if (!headerValidation.valid) {
      return headerValidation;
    }

    // Parse les données
    const rows = exports.newParseExcelFile(fileBuffer);

    if (rows.length === 0) {
      return {
        valid: false,
        error: "Aucune donnée valide trouvée. Vérifiez que votre fichier contient des lignes avec Etage, Reference et Date.",
      };
    }

    // ✅ NOUVEAU : Validation de chaque ligne
    const allErrors = [];
    rows.forEach((row, index) => {
      const validation = exports.validateRowData(row, index + 2); // +2 car ligne 1 = header
      if (!validation.valid) {
        allErrors.push(...validation.errors);
      }
    });

    if (allErrors.length > 0) {
      return {
        valid: false,
        error: "Données invalides détectées",
        details: allErrors.slice(0, 5).join('\n'), // Limiter à 5 erreurs
        allErrors: allErrors
      };
    }

    return {
      valid: true,
      rowCount: rows.length,
      rows,
    };
  } catch (error) {
    console.error('❌ Validation error:', error);
    return {
      valid: false,
      error: error.message || "Erreur lors de la validation du fichier Excel",
    };
  }
};