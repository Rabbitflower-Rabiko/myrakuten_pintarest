//==================================
// IFTTT (Pinterest用)
//==================================

function postToIFTTT_(data) {

  requireConfigValue_("IFTTT_EVENT_NAME");
  requireConfigValue_("IFTTT_KEY");

  const url =
    "https://maker.ifttt.com/trigger/" +
    CONFIG.IFTTT_EVENT_NAME +
    "/with/key/" +
    CONFIG.IFTTT_KEY;

  Logger.log("========== IFTTT ==========");
  Logger.log("Title : " + data.pinTitle);
  Logger.log("Image : " + data.imageUrl);
  Logger.log("Link  : " + data.link);

  // 1. タイトルと説明文を合体させる
  const rawTitle = (data.pinTitle || "").trim();
  const rawDesc = (data.description || "").trim();

  // タイトルがある場合は「タイトル ＋ 改行2つ ＋ 説明文」にする
  let combinedTitleAndDesc = rawTitle;
  if (rawDesc) {
    combinedTitleAndDesc = rawTitle ? (rawTitle + "\n\n" + rawDesc) : rawDesc;
  }

  // PinterestのDescription上限（500文字前後）を考慮して safe カット
  if (combinedTitleAndDesc.length > 480) {
    combinedTitleAndDesc = combinedTitleAndDesc.substring(0, 475) + "...";
  }

  // 2. リンクURLの余計な空行をトリム
  const cleanLink = (data.link || "").trim();

  const response = retry_(function () {

    return UrlFetchApp.fetch(url, {

      method: "post",

      contentType: "application/json",

      payload: JSON.stringify({
        value1: combinedTitleAndDesc, // ① タイトル ＋ 説明文
        value2: data.imageUrl,        // ② 画像URL
        value3: cleanLink             // ③ アフィリエイトURL（単体）
      }),

      muteHttpExceptions: true

    });

  });

  const code = response.getResponseCode();

  Logger.log("Response Code : " + code);
  Logger.log("Response Body : " + response.getContentText());

  if (code < 200 || code >= 300) {

    throw new Error(
      "IFTTT Error : " +
      response.getContentText()
    );

  }

  Logger.log("IFTTT Post Success");
  Logger.log("===========================");

}
