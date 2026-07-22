//==================================
// CONFIG
//==================================

const CONFIG = {

  //==================================
  // Spreadsheet
  //==================================

  SPREADSHEET_NAME: "楽天Pinterest",

  SHEET_NAME: "投稿",

  MAX_ROWS_PER_RUN: 1,

  //==================================
  // Gemini
  //==================================

  GEMINI_API_KEY: "",

  GEMINI_MODEL: "gemini-2.5-flash",

  //==================================
  // Cloudinary
  //==================================

  CLOUD_NAME: "",

  CLOUDINARY_API_KEY: "",

  CLOUDINARY_API_SECRET: "",

  CLOUDINARY_TEMPLATE_IDS: [

    "rabbit_base01",
    "rabbit_base02",
    "rabbit_base03",
    "rabbit_base04",
    "rabbit_base05"

  ],

  PIN_WIDTH: 1000,

  PIN_HEIGHT: 1500,

  PRODUCT_IMAGE_WIDTH: 820,

  PRODUCT_IMAGE_HEIGHT: 820,

  //==================================
  // IFTTT
  //==================================

  IFTTT_EVENT_NAME: "",

  IFTTT_KEY: "",

  //==================================
  // Retry
  //==================================

  RETRY_COUNT: 3,

  RETRY_WAIT_MS: 10000,

  //==================================
  // Cache
  //==================================

  USE_PRODUCT_CACHE: true,

  USE_GEMINI_CACHE: true,

  USE_IMAGE_CACHE: true,

  //==================================
  // Posting
  //==================================

  RESET_POSTED_WHEN_FINISHED: true,

  CLEAR_ERROR_WHEN_SUCCESS: true

};
