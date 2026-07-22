//==================================
// RAKUTEN
//==================================

function getProductData_(rowValues) {

  const imageUrl =
    String(rowValues[COL.IMAGE_URL - 1] || "").trim();

  const productName =
    String(rowValues[COL.PRODUCT_NAME - 1] || "").trim();

  const productDescription =
    String(rowValues[COL.PRODUCT_DESCRIPTION - 1] || "").trim();

  // キャッシュ利用
  if (
    CONFIG.USE_PRODUCT_CACHE &&
    imageUrl &&
    productName &&
    productDescription
  ) {

    logInfo_("Use cached Rakuten product.");

    return {

      imageUrl,

      productName,

      productDescription

    };

  }

  logInfo_("Scrape Rakuten.");

  return scrapeRakutenProduct_(

    String(
      rowValues[COL.RAKUTEN_URL - 1]
    ).trim()

  );

}

//==================================

function scrapeRakutenProduct_(rakutenUrl) {

  rakutenUrl =
    normalizeRakutenUrl_(rakutenUrl);

  logInfo_("Open : " + rakutenUrl);

  const response = retry_(function () {

    return UrlFetchApp.fetch(

      rakutenUrl,

      {

        followRedirects: true,

        muteHttpExceptions: true,

        headers: {

          "User-Agent":
            "Mozilla/5.0"

        }

      }

    );

  });

  if (

    response.getResponseCode() >= 400

  ) {

    throw new Error(

      "楽天ページ取得失敗"

    );

  }

  const html =
    response
      .getBlob()
      .getDataAsString("EUC-JP");

  const productName =
    getProductName_(html);

  const productDescription =
    getProductDescription_(html);

  const imageUrl =
    getRakutenImageUrl_(html);

  if (!imageUrl) {

    throw new Error(

      "商品画像取得失敗"

    );

  }

  return {

    productName:
      truncateText_(productName,120),

    productDescription:
      truncateText_(productDescription,500),

    imageUrl:
      imageUrl

  };

}

//==================================

function normalizeRakutenUrl_(url) {

  const m =
    url.match(/[?&]pc=([^&]+)/);

  if (m) {

    return decodeURIComponent(m[1]);

  }

  return url;

}

//==================================

function getProductName_(html){

  return getMetaContent_(html,[

    /property=["']og:title["'][^>]+content=["']([^"]+)["']/i,

    /name=["']title["'][^>]+content=["']([^"]+)["']/i,

    /itemprop=["']name["'][^>]+content=["']([^"]+)["']/i,

    /<title>([\s\S]*?)<\/title>/i

  ]);

}

//==================================

function getProductDescription_(html){

  return getMetaContent_(html,[

    /name=["']description["'][^>]+content=["']([^"]+)["']/i,

    /property=["']og:description["'][^>]+content=["']([^"]+)["']/i,

    /itemprop=["']description["'][^>]+content=["']([^"]+)["']/i

  ]);

}

//==================================

function getRakutenImageUrl_(html){

  const patterns=[

    /property=["']og:image["'][^>]+content=["']([^"]+)["']/i,

    /https?:\/\/thumbnail\.image\.rakuten\.co\.jp\/[^"' ]+/i,

    /https?:\/\/shop\.r10s\.jp\/[^"' ]+/i,

    /https?:\/\/image\.rakuten\.co\.jp\/[^"' ]+/i,

    /https?:\/\/hbb\.afs\.img\.rakuten\.co\.jp\/[^"' ]+/i

  ];

  for (

    let i=0;

    i<patterns.length;

    i++

  ){

    const m =
      html.match(patterns[i]);

    if(m){

      return (m[1]||m[0])

        .replace(/\\\//g,"/")

        .replace(/&amp;/g,"&");

    }

  }

  return "";

}
