//==================================
// MAIN
//==================================

function processPinterestRow_(rowNumber, rowValues) {

  try {

    Logger.log("Processing row " + rowNumber);

    const rakutenUrl =
      String(rowValues[COL.RAKUTEN_URL - 1] || "").trim();

    if (!rakutenUrl) return;

    //==================================
    // 楽天商品取得（キャッシュ対応）
    //==================================

    const product =
      getProductData_(rowValues);

    writeRowValues_(rowNumber, {

      [COL.IMAGE_URL]:
        product.imageUrl,

      [COL.PRODUCT_NAME]:
        product.productName,

      [COL.PRODUCT_DESCRIPTION]:
        product.productDescription

    });

    rowValues[COL.IMAGE_URL - 1] = product.imageUrl;
    rowValues[COL.PRODUCT_NAME - 1] = product.productName;
    rowValues[COL.PRODUCT_DESCRIPTION - 1] = product.productDescription;

    //==================================
    // Gemini（キャッシュ対応）
    //==================================

    const content =
      getPinterestContent_(
        rowValues,
        product
      );

    writeRowValues_(rowNumber, {

      [COL.PIN_TITLE]:
        content.pinTitle,

      [COL.DESCRIPTION]:
        content.description,

      [COL.TAGS]:
        content.tags

    });

    rowValues[COL.PIN_TITLE - 1] = content.pinTitle;
    rowValues[COL.DESCRIPTION - 1] = content.description;
    rowValues[COL.TAGS - 1] = content.tags;

    //==================================
    // Cloudinary画像（キャッシュ対応）
    //==================================

    const imageUrl =
      getPinterestImage_(
        rowValues,
        product
      );

    writeRowValues_(rowNumber, {

      [COL.PINTEREST_IMAGE_URL]:
        imageUrl

    });

    rowValues[COL.PINTEREST_IMAGE_URL - 1] =
      imageUrl;

    //==================================
    // IFTTT送信
    //==================================

    postToIFTTT_({

  pinTitle: content.pinTitle,

  description:
    content.description +
    "\n\n" +
    "※本投稿には楽天アフィリエイトリンクが含まれています。" +
    "\n\n" +
    content.tags +
    "\n#pr" +
    "\n#affiliatelink" +
    "\n#楽天アフィリエイト",

  imageUrl: imageUrl,

  link: rakutenUrl


});

    //==================================
    // 投稿完了記録
    //==================================

    writeRowValues_(rowNumber, {

      [COL.POSTED]:
        Utilities.formatDate(
          new Date(),
          Session.getScriptTimeZone(),
          "yyyy-MM-dd HH:mm:ss"
        ),

      [COL.LAST_POSTED]:
        new Date(),

      [COL.POST_COUNT]:
        Number(
          rowValues[COL.POST_COUNT - 1] || 0
        ) + 1,

      [COL.ERROR]:
        ""

    });

    Logger.log(
      "Row " +
      rowNumber +
      " completed."
    );

  }

  catch (e) {

    Logger.log(
      "Row " +
      rowNumber +
      " failed : " +
      e.message
    );

    writeRowValues_(rowNumber, {

      [COL.ERROR]:
        e.message

    });

  }

}

//==================================
// 実行
//==================================

function runPinterestAutoPoster() {

  Logger.log(
    "Pinterest Auto Poster run started."
  );

  const rows =
    readWorkRows_();

  const limit =
    Math.min(
      rows.length,
      CONFIG.MAX_ROWS_PER_RUN
    );

  Logger.log(
    "Rows to process: " + limit
  );

  for (let i = 0; i < limit; i++) {

    processPinterestRow_(

      rows[i].rowNumber,

      rows[i].values

    );

  }

  // 全件投稿済みならPOSTED列だけリセット
  resetPostedIfFinished_();

  Logger.log(
    "Pinterest Auto Poster run finished."
  );

}
