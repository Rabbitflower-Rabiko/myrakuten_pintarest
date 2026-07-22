//==================================
// Template Map
//==================================

const TEMPLATE_MAP = {

  "牧草": [
    "rabbit_base01"
  ],

  "ペレット": [
    "rabbit_base02"
  ],

  "おやつ": [
    "rabbit_base03"
  ],

  "ケージ": [
    "rabbit_base04"
  ],

  "その他": [
    "rabbit_base05"
  ]

};

//==================================
// CLOUDINARY
//==================================

function getPinterestImage_(rowValues, product) {

  const imageUrl =
    String(
      rowValues[COL.PINTEREST_IMAGE_URL - 1] || ""
    ).trim();

  // キャッシュ利用
  if (

    CONFIG.USE_IMAGE_CACHE &&

    imageUrl

  ) {

    logInfo_("Use cached Pinterest image.");

    return imageUrl;

  }

  logInfo_("Generate Pinterest image.");

  return buildPinterestImageUrl_(

    product.imageUrl,

    product.productName

  );

}

//==================================

function buildPinterestImageUrl_(

  productImageUrl,

  productName

) {

  requireConfigValue_("CLOUD_NAME");

  const templateId =
    getTemplateIdByProduct_(productName);

  const fetchedImage =
    base64UrlSafe_(productImageUrl);

  return (

    "https://res.cloudinary.com/" +

    CONFIG.CLOUD_NAME +

    "/image/upload/" +

    // 商品画像

    "l_fetch:" +

    fetchedImage +

    ",c_fit,w_" +

    CONFIG.PRODUCT_IMAGE_WIDTH +

    ",h_" +

    CONFIG.PRODUCT_IMAGE_HEIGHT +

    ",g_center/" +

    // 背景

    templateId +

    ".jpg"

  );

}

//==================================

function getTemplateIdByProduct_(productName) {

  const category =
    detectProductCategory_(productName);

  const templates =
    TEMPLATE_MAP[category] ||
    TEMPLATE_MAP["その他"];

  return templates[
    Math.floor(
      Math.random() * templates.length
    )
  ];

}

//==================================

function detectProductCategory_(productName) {

  const name =
    String(productName || "").toLowerCase();

  if (

    name.includes("牧草") ||

    name.includes("チモシー") ||

    name.includes("hay")

  ) {

    return "牧草";

  }

  if (

    name.includes("ペレット") ||

    name.includes("pellet")

  ) {

    return "ペレット";

  }

  if (

    name.includes("おやつ") ||

    name.includes("ビスケット") ||

    name.includes("クッキー")

  ) {

    return "おやつ";

  }

  if (

    name.includes("ケージ") ||

    name.includes("サークル")

  ) {

    return "ケージ";

  }

  return "その他";

}
