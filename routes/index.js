var express = require("express");
var router = express.Router();
require("dotenv").config();
const SerpApi = require("google-search-results-nodejs");
const fs = require("fs");
const config = require("config");
// const axios = require("axios");
const emojiRegex = require("emoji-regex");

let averageTitleLength;
let maxTitleLength = 0;
let averageDescriptionLength;
let maxDescriptionLength = 0;
let averageTitleLengthMobile;
let maxTitleLengthMobile = 0;
let averageDescriptionLengthMobile;
let maxDescriptionLengthMobile = 0;
let bonsSnapshotDate;
let bonsSnapshot;
let conquestadorSnapshot;
let titleEmojis = [];
let descriptionEmojis = [];

/* GET home page. */
router.get("/", async function (req, res) {
  // brand keywords in format keyword, volume
  const brandKeywords = [
    ["ベラジョンカジノ", 207000],
    ["スポーツベットアイオー", 58000],
    ["カジノシークレット", 56000],
    ["ミスティーノ", 43000],
    ["エルドア カジノ", 39000],
    ["bet365", 33000],
    ["カジ旅", 30000],
    ["インターカジノ", 29000],
    ["コニベット", 28000],
    ["ビットカジノ", 24000],
    ["ボンズカジノ", 19000],
    ["ワンダーカジノ", 17000],
    ["オンラインカジノ netbet", 16000],
    ["クイーンカジノ", 15000],
    ["ユースカジノ", 12000],
    ["ラッキーニッキー", 12000],
    ["カジノミー", 10000],
    ["beebet", 9700],
    ["ライブカジノハウス", 9700],
    ["レオベガス", 8600],
    ["ギャンボラ", 8000],
    ["10bet", 7700],
    ["ウィリアムヒル", 6700],
    ["ピナクル", 6300],
    ["ジパングカジノ", 6100],
    ["188bet", 5900],
    ["チェリーカジノ", 5500],
    ["カスモカジノ", 4600],
    ["dora麻雀", 4000],
    ["アロハシャーク", 4000],
    ["カジノフライデー", 3900],
    ["ポーカースターズ", 3800],
    ["1xbet", 3800],
    ["コンクエスタドールカジノ", 3600],
    ["エンパイアカジノ", 3400],
    ["ビーベット", 3400],
    ["ベット365", 2900],
    ["ワイルドジャングルカジノ", 2700],
    ["ステークカジノ", 2200],
    ["ユニークカジノ", 2000],
    ["カジノデイズ", 1700],
    ["カジノエックス", 1600],
    ["スロッティベガス", 1400],
    ["betway", 1400],
    ["ロイヤルパンダ", 1300],
    ["ビットスターズ", 1300],
    ["dafabet", 1200],
    ["ジョイカジノ", 1200],
    ["ナショナル カジノ", 1100],
    ["カジノ イン", 1000],
    ["ワンバイベット", 1000],
    ["ロトランド", 1000],
    ["ビデオスロッツ", 800],
    ["22bet", 800],
    ["caxino", 700],
    ["バルカンベガス", 700],
    ["フトカジ", 600],
    ["リリベットカジノ", 600],
    ["ライブカジノアイオー", 600],
    ["ポケットカジノ", 600],
    ["ジャックポットシティ", 500],
    ["うみうみカジノ", 500],
    ["プレイアモ", 450],
    ["ワイルズ カジノ", 450],
    ["ベットティルト", 450],
    ["カジノゴッズ", 450],
    ["1xbit", 450],
    ["ミラクルカジノ", 450],
    ["シンプルカジノ", 400],
    ["ベットランク", 400],
    ["スピンアウェイカジノ", 350],
    ["ツインカジノ", 350],
    ["キングビリーカジノ", 300],
    ["ノーリミットカジノ", 300],
    ["ラッキーデイズカジノ", 300],
    ["ワンダリーノ", 300],
    ["21.com カジノ", 250],
    ["マラソンベット", 250],
    ["スプリーモカジノ", 250],
    ["バオカジノ", 250],
    ["ワザンバカジノ", 200],
    ["カリビアンカジノ", 200],
    ["ユニバーサルカジノ", 200],
    ["ピクセルベット", 200],
    ["エガオンカジノ", 200],
    ["manekichi", 200],
    ["スパカジ", 200],
    ["メタルカジノ", 200],
    ["cashmio", 150],
    ["インペリアルカジノ", 150],
    ["まね吉カジノ", 150],
    ["ホイールズカジノ", 150],
    ["ロキカジノ", 150],
    ["32red", 150],
    ["ニトロカジノ", 150],
    ["ハチスロカジノ", 150],
    ["ベガスプラス", 150],
    ["betwinner", 150],
    ["カジニア", 100],
    ["カシュミオ", 100],
    ["クラウドベット", 100],
    ["ロクカジノ", 100],
    ["ミスター ベガス", 100],
    ["ラッキー カジノ", 90],
    ["エムビットカジノ", 90],
    ["ワンバイビット", 80],
    ["マネキャッシュ閉鎖", 80],
    ["ビットキングスカジノ", 80],
    ["ベットレベルス", 60],
    ["スロッタムカジノ", 60],
    ["バスターバンクスカジノ", 50],
    ["supotsubet", 40],
    ["21ドットコム", 40],
    ["21nova", 40],
    ["ベットウィナー", 30],
    ["優雅 堂", 20],
    ["sbo bet", 20],
    ["モンカジ", 20],
    ["コインサガ", 10],
    ["リスクカジノ", 10],
    ["ロケットポット", 10],
    ["rocketpot", 10],
  ];
  const minVolume = config.get("minVolume");
  // brand keywords with volume n+
  const testKeywords = brandKeywords.reduce((acc, rec) => {
    if (rec[1] >= minVolume) {
      acc.push(rec);
    }
    return acc;
  }, []);

  const getSerpJSON = async (keyword, device) => {
    const search = new SerpApi.GoogleSearch(process.env.serp_api_key);

    const params = {
      engine: "google",
      q: keyword,
      location: "Japan",
      google_domain: "google.co.jp",
      gl: "jp",
      hl: "ja",
      num: "100",
      device: device,
    };

    const serpObject = new Promise((resolve) => {
      // Show result as JSON
      search.json(params, (data) => {
        resolve(data);
      });
    });

    return await serpObject;
  };

  // today report file name, example: 13072022
  const todayDate = new Date().toISOString().split("T")[0].split("-");
  const todayDateFileName =
    `${todayDate[2]}` + `${todayDate[1]}` + `${todayDate[0]}`;
  const todayDateForReport =
    `${todayDate[2]}` + "-" + `${todayDate[1]}` + "-" + `${todayDate[0]}`;
  const csvSeparator = ",";

  // simple crud for reports
  const isTodayReportFileExists = () => {
    const fileNamesArray = fs.readdirSync("public/reports");
    return fileNamesArray.includes(todayDateFileName + ".csv");
  };

  const createTodayReportFile = () => {
    fs.writeFileSync(
      "public/reports/" + todayDateFileName + ".csv", // `sep=${csvSeparator}\n` +
      "date" +
        csvSeparator +
        "location" +
        csvSeparator +
        "search engine" +
        csvSeparator +
        "search engine domain" +
        csvSeparator +
        "country" + // (ISO 3166-1 alpha-2)
        csvSeparator +
        "language" + // (ISO 639-1)
        csvSeparator +
        "device" + // (desktop / mobile)
        csvSeparator +
        "type of keyword" +
        csvSeparator +
        "keyword" +
        csvSeparator +
        "keyword volume" +
        csvSeparator +
        "domain" +
        csvSeparator +
        "exact link" +
        csvSeparator +
        "position" +
        csvSeparator +
        "title" +
        csvSeparator +
        "description"
    );
    console.log("File " + todayDateFileName + ".scv" + " created");
  };

  const writeToTodayReportFile = (
    date,
    location,
    search_engine,
    search_engine_domain,
    country,
    language,
    device,
    keyword_type,
    keyword,
    keyword_volume,
    domain,
    link,
    position,
    title,
    description
  ) => {
    fs.appendFileSync(
      "public/reports/" + todayDateFileName + ".csv",
      "\n" +
        date +
        csvSeparator +
        location +
        csvSeparator +
        search_engine +
        csvSeparator +
        search_engine_domain +
        csvSeparator +
        country +
        csvSeparator +
        language +
        csvSeparator +
        device +
        csvSeparator +
        keyword_type +
        csvSeparator +
        keyword.replaceAll(",", "，").replaceAll('"', "”") +
        csvSeparator +
        keyword_volume +
        csvSeparator +
        domain +
        csvSeparator +
        link.replaceAll(",", "，").replaceAll('"', "”") +
        csvSeparator +
        position +
        csvSeparator +
        title.replaceAll(",", "，").replaceAll('"', "”") +
        csvSeparator +
        description.replaceAll(",", "，").replaceAll('"', "”")
    );
  };

  if (!isTodayReportFileExists()) {
    createTodayReportFile();

    // parse desktop SERP
    testKeywords.map(async ([keyword, volume]) => {
      console.log(
        "working with keyword " + keyword + ` (${volume}) (desktop serp)`
      );
      const serpJSON = await getSerpJSON(keyword, "desktop");
      const params = serpJSON.search_parameters;
      const organicResults = serpJSON.organic_results;

      for (const result of organicResults) {
        writeToTodayReportFile(
          todayDateForReport, // date
          params.location_used, // location
          params.engine, // search_engine
          params.google_domain, // search_engine_domain
          params.gl, // country (ISO 3166-1 alpha-2)
          params.hl, // language (ISO 639-1)
          params.device, // device (desktop / mobile)
          "gambling brand", // keyword_type
          keyword ?? "", // keyword
          volume, // keyword volume
          new URL(result.link).hostname ?? "", // domain
          result.link ?? "", // link
          result.position, // position
          result.title ?? "", // title
          result.snippet ?? "" // description
        );
      }
    });

    // parse mobile SERP
    testKeywords.map(async ([keyword, volume]) => {
      console.log(
        "working with keyword " + keyword + ` (${volume}) (mobile serp)`
      );
      const serpJSON = await getSerpJSON(keyword, "mobile");
      const params = serpJSON.search_parameters;
      const organicResults = serpJSON.organic_results;

      for (const result of organicResults) {
        writeToTodayReportFile(
          todayDateForReport, // date
          params.location_used, // location
          params.engine, // search_engine
          params.google_domain, // search_engine_domain
          params.gl, // country (ISO 3166-1 alpha-2)
          params.hl, // language (ISO 639-1)
          params.device, // device (desktop / mobile)
          "gambling brand", // keyword_type
          keyword ?? "", // keyword
          volume, // keyword volume
          new URL(result.link).hostname ?? "", // domain
          result.link ?? "", // link
          result.position, // position
          result.title ?? "", // title
          result.snippet ?? "" // description
        );
      }
    });
    console.log("Report " + todayDateFileName + ".csv" + " created");
  } else {
    console.log("Report " + todayDateFileName + ".csv" + " exists");
  }

  if (averageTitleLength === undefined) {
    console.log("parsing title desctiption average length");
    return res.redirect("/data/");
  }

  if (bonsSnapshot === undefined) {
    console.log("parsing snapshots");
    return res.redirect("/snapshot/");
  }

  res.render("index", {
    title: "SERP Dashboard",
    averageTitleLength,
    maxTitleLength,
    averageDescriptionLength,
    maxDescriptionLength,
    averageTitleLengthMobile,
    maxTitleLengthMobile,
    averageDescriptionLengthMobile,
    maxDescriptionLengthMobile,
    bonsSnapshot,
    conquestadorSnapshot,
    titleEmojis,
    descriptionEmojis,
  });
});

router.get("/data/", (req, res) => {
  const getLastReportFileName = () => {
    const files = fs.readdirSync("public/reports");
    return files.filter((el) => el !== "example-report.csv").reverse()[0];
  };

  const getMeta = (device) => {
    const youngestReportFileName = getLastReportFileName();
    const reportData = fs.readFileSync(
      "public/reports/" + youngestReportFileName,
      { encoding: "utf8", flag: "r" }
    );
    const strings = reportData.split("\n");
    return strings
      .filter((el) => {
        const deviceInTable = el.split(",")[6]; // device type in table
        if (device === deviceInTable) {
          return el;
        }
      })
      .reduce((acc, rec) => {
        const [title, description] = [rec.split(",")[13], rec.split(",")[14]];
        acc.push([title, description]);
        return acc;
      }, []);
  };

  const getAverageLength = (titleOrDescription, device) => {
    const meta = getMeta(device);

    const amountElements = meta.length;
    let sumLength = 0;

    meta.map((el) => {
      let exactElement;
      const regex = emojiRegex();

      if (titleOrDescription === "title") {
        exactElement = el[0].split(" ...")[0];
        if (device === "desktop") {
          if (maxTitleLength < exactElement.length) {
            maxTitleLength = exactElement.length;
          }
        } else if (device === "mobile") {
          if (maxTitleLengthMobile < exactElement.length) {
            maxTitleLengthMobile = exactElement.length;
          }
        }
        for (const match of exactElement.matchAll(regex)) {
          const emoji = match[0];
          console.log(
            `Matched sequence ${emoji} — code points: ${[...emoji].length}`
          );
          titleEmojis.push(emoji);
        }
      } else {
        exactElement = el[1].split(" ...")[0];
        if (device === "desktop") {
          if (maxDescriptionLength < exactElement.length) {
            maxDescriptionLength = exactElement.length;
          }
        } else if (device === "mobile") {
          if (maxDescriptionLengthMobile < exactElement.length) {
            maxDescriptionLengthMobile = exactElement.length;
          }
        }
        for (const match of exactElement.matchAll(regex)) {
          const emoji = match[0];
          // console.log(`Matched sequence ${ emoji } — code points: ${ [...emoji].length }`);
          descriptionEmojis.push(emoji);
        }
      }
      sumLength += exactElement.length;
    });

    return sumLength / amountElements;
  };

  averageTitleLength = getAverageLength("title", "desktop");
  averageDescriptionLength = getAverageLength("description", "desktop");
  averageTitleLengthMobile = getAverageLength("title", "mobile");
  averageDescriptionLengthMobile = getAverageLength("description", "mobile");
  titleEmojis = [...new Set(titleEmojis)]; // remove duplicates
  descriptionEmojis = [...new Set(descriptionEmojis)]; // remove duplicates
  // res.send([averageTitleLength, averageDescriptionLength, averageTitleLengthMobile, averageDescriptionLengthMobile])
  res.status(301).redirect("/");
});

router.get("/snapshot/", (req, res) => {
  const getLastReportFileName = () => {
    const files = fs.readdirSync("public/reports");
    return files.filter((el) => el !== "example-report.csv").reverse()[0];
  };

  const youngestReportFileName = getLastReportFileName();

  const getReportFileNameDayAgo = () => {
    const files = fs.readdirSync("public/reports");
    return files.filter((el) => el !== "example-report.csv").reverse()[1];
  };

  const getSnapshot = (keyword, device) => {
    const reportData = fs.readFileSync(
      "public/reports/" + youngestReportFileName,
      { encoding: "utf8", flag: "r" }
    );
    const reportDataDayAgo = fs.readFileSync(
      "public/reports/" + getReportFileNameDayAgo(),
      { encoding: "utf8", flag: "r" }
    );

    const strings = reportData.split("\n");
    const stringsDayAgo = reportDataDayAgo.split("\n");

    const getUrlPositionDayAgo = (keyword, device, url) => {
      const exactString = stringsDayAgo
        .filter((el) => {
          if (keyword === el.split(",")[8] && device === el.split(",")[6]) {
            return el;
          }
        })
        .filter((el) => {
          if (url === el.split(",")[11]) {
            return el;
          }
        });

      if (exactString.length > 0) {
        return exactString[0].split(",")[12];
      }
      return false;
    };

    return (
      strings
        // .filter((el) => {
        //   const deviceInTable = el.split(',')[6] // device type in table
        //   if (device === deviceInTable) {
        //     return el;
        //   }
        // })
        .filter((el) => {
          if (keyword === el.split(",")[8] && device === el.split(",")[6]) {
            return el;
          }
        })
        .reduce((acc, rec) => {
          const [url, position] = [rec.split(",")[11], rec.split(",")[12]];
          const positionDayAgo = getUrlPositionDayAgo(keyword, device, url);
          // console.log(`${position} - ${url} - ${positionDayAgo}`);
          // acc.push([keyword, url, position, positionDayAgo]);
          const urlWithoutProtocol = url.replace(/^https?:\/\//, "");
          // acc.push(urlWithoutProtocol);
          const positionDifference = positionDayAgo - position;
          acc.push([urlWithoutProtocol, positionDifference]);
          return acc;
        }, [])
    );
  };

  if (
    bonsSnapshotDate !== new Date().toJSON().slice(0, 10).replace(/-/g, "/") // today date
  ) {
    console.log("set bonsSnapshotDate");
    bonsSnapshot = getSnapshot("ボンズカジノ", "mobile");
    bonsSnapshotDate = new Date().toJSON().slice(0, 10).replace(/-/g, "/"); // today date
    conquestadorSnapshot = getSnapshot("コンクエスタドールカジノ", "mobile");
  }

  res.status(302).redirect("back");
});
module.exports = router;
