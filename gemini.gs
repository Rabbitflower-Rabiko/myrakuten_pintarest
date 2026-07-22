//==================================
// GEMINI
//==================================

function getPinterestContent_(rowValues, product) {

  const pinTitle =
    String(rowValues[COL.PIN_TITLE - 1] || "").trim();

  const description =
    String(rowValues[COL.DESCRIPTION - 1] || "").trim();

  const tags =
    String(rowValues[COL.TAGS - 1] || "").trim();

  if (

    CONFIG.USE_GEMINI_CACHE &&

    pinTitle &&

    description &&

    tags

  ) {

    logInfo_("Use cached Gemini.");

    return {

      pinTitle,

      description,

      tags

    };

  }

  logInfo_("Generate Gemini.");

  return generatePinterestContent_(product);

}

//==================================

function generatePinterestContent_(product) {

  requireConfigValue_("GEMINI_API_KEY");

  const prompt = buildGeminiPrompt_(product);

  const url =
    "https://generativelanguage.googleapis.com/v1beta/models/" +
    CONFIG.GEMINI_MODEL +
    ":generateContent?key=" +
    CONFIG.GEMINI_API_KEY;

  const payload = {

    contents: [

      {

        parts: [

          {

            text: prompt

          }

        ]

      }

    ]

  };

  const result = retry_(function(){

    return fetchJson_(url,{

      method:"post",

      contentType:"application/json",

      payload:JSON.stringify(payload)

    });

  });

  const text =
    result.candidates[0].content.parts[0].text;

  return parseGeminiPinterestJson_(text);

}

//==================================

function parseGeminiPinterestJson_(text){

  text =
    cleanGeminiResponse_(text);

  const data =
    JSON.parse(text);

  return {

    pinTitle:
      truncateText_(data.pinTitle,60),

    description:
      truncateText_(data.description,500),

    tags:
      truncateText_(data.tags,200)

  };

}

//==================================

function cleanGeminiResponse_(text){

  text = String(text);

  text =

    text

      .replace(/^```json/i,"")

      .replace(/^```/i,"")

      .replace(/```$/i,"")

      .trim();

  const first =
    text.indexOf("{");

  const last =
    text.lastIndexOf("}");

  if(

    first>=0 &&

    last>first

  ){

    text =
      text.substring(first,last+1);

  }

  return text;

}

//==================================

function buildGeminiPrompt_(product){

return [

"あなたはPinterestマーケティングとSEOの専門家です。",

"",

"JSONのみ返してください。",

"",

"商品名",

product.productName,

"",

"商品説明",

product.productDescription,

"",

"Pinterestタイトル",

"60文字以内",

"",

"説明文",

"250〜300文字",

"楽天で購入できることを書く",

"",

"タグ",

"Pinterest向け6個",

"",

"{",

'"pinTitle":"",',

'"description":"",',

'"tags":""',

"}"

].join("\n");

}
