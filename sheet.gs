//==================================
// SHEET
//==================================

function getSheet_() {

  const sheet =
    SpreadsheetApp
      .getActiveSpreadsheet()
      .getSheetByName(CONFIG.SHEET_NAME);

  if (!sheet) {

    throw new Error(
      'シート「' +
      CONFIG.SHEET_NAME +
      '」が見つかりません。'
    );

  }

  return sheet;

}

//==================================
// Column
//==================================

const COL = {

  RAKUTEN_URL: 1,

  IMAGE_URL: 2,

  PRODUCT_NAME: 3,

  PRODUCT_DESCRIPTION: 4,

  IMAGE_TITLE: 5,

  COPY: 6,

  PIN_TITLE: 7,

  DESCRIPTION: 8,

  TAGS: 9,

  PINTEREST_IMAGE_URL: 10,

  POSTED: 11,

  ERROR: 12,

  LAST_POSTED: 13,

  POST_COUNT: 14

};

//==================================
// Read
//==================================

function readWorkRows_() {

  const sheet = getSheet_();

  const lastRow = sheet.getLastRow();

  if (lastRow < 2) return [];

  const values = sheet.getRange(
    2,
    1,
    lastRow - 1,
    COL.POST_COUNT
  ).getValues();

  const rows = [];

  values.forEach(function(row, index) {

    const rakutenUrl =
      String(row[COL.RAKUTEN_URL - 1] || "").trim();

    const posted =
      String(row[COL.POSTED - 1] || "").trim();

    const error =
      String(row[COL.ERROR - 1] || "").trim();

    if (!rakutenUrl) return;

    if (posted) return;

    if (error) return;

    rows.push({

      rowNumber: index + 2,

      values: row

    });

  });

  return rows;

}

//==================================
// Write
//==================================

function writeRowValues_(rowNumber, data) {

  const sheet = getSheet_();

  Object.keys(data).forEach(function(column) {

    sheet
      .getRange(rowNumber, Number(column))
      .setValue(data[column]);

  });

}

function clearError_(rowNumber) {

  writeRowValues_(rowNumber, {

    [COL.ERROR]: ""

  });

}

function incrementPostCount_(rowNumber, currentCount) {

  writeRowValues_(rowNumber, {

    [COL.POST_COUNT]:
      Number(currentCount || 0) + 1,

    [COL.LAST_POSTED]:
      now_()

  });

}

//==================================
// Reset
//==================================

function resetPostedIfFinished_() {

  if (!CONFIG.RESET_POSTED_WHEN_FINISHED) {

    return;

  }

  const sheet = getSheet_();

  const lastRow = sheet.getLastRow();

  if (lastRow < 2) return;

  const values = sheet.getRange(
    2,
    COL.POSTED,
    lastRow - 1,
    2
  ).getValues();

  const hasWork = values.some(function(row) {

    const posted =
      String(row[0] || "").trim();

    const error =
      String(row[1] || "").trim();

    return !posted && !error;

  });

  if (hasWork) return;

  logInfo_("All products completed.");

  sheet.getRange(

    2,

    COL.POSTED,

    lastRow - 1,

    1

  ).clearContent();

}

//==================================
// Setup
//==================================

function setupSheet_() {

  const sheet = getSheet_();

  sheet.clear();

  sheet.getRange(1,1,1,14).setValues([[

    "楽天URL",

    "商品画像URL",

    "商品名",

    "商品説明",

    "画像タイトル",

    "キャッチコピー",

    "Pinterestタイトル",

    "Pinterest説明",

    "タグ",

    "Pinterest画像URL",

    "投稿済み",

    "エラー",

    "最終投稿日",

    "投稿回数"

  ]]);

  logInfo_("Sheet initialized.");

}
