var express = require('express');
var router = express.Router();
require('dotenv').config();
const SerpApi = require('google-search-results-nodejs');
const fs = require('fs');

/* GET home page. */
router.get('/', async function(req, res) {
  // brand keywords in format keyword, volume
  const brandKeywords = [
    ['ベラジョンカジノ', 207000],
    ['スポーツベットアイオー', 58000],
    ['カジノシークレット', 56000],
    ['ミスティーノ', 43000],
    ['エルドア カジノ', 39000],
    ['bet365', 33000],
    ['カジ旅', 30000],
    ['インターカジノ', 29000],
    ['コニベット', 28000],
    ['ビットカジノ', 24000],
    ['ボンズカジノ', 19000],
    ['ワンダーカジノ', 17000],
    ['オンラインカジノ netbet', 16000],
    ['クイーンカジノ', 15000],
    ['ユースカジノ', 12000],
    ['ラッキーニッキー', 12000],
    ['カジノミー', 10000],
    ['beebet', 9700],
    ['ライブカジノハウス', 9700],
    ['レオベガス', 8600],
    ['ギャンボラ', 8000],
    ['10bet', 7700],
    ['ウィリアムヒル', 6700],
    ['ピナクル', 6300],
    ['ジパングカジノ', 6100],
    ['188bet', 5900],
    ['チェリーカジノ', 5500],
    ['カスモカジノ', 4600],
    ['dora麻雀', 4000],
    ['アロハシャーク', 4000],
    ['カジノフライデー', 3900],
    ['ポーカースターズ', 3800],
    ['1xbet', 3800],
    ['コンクエスタドールカジノ', 3600],
    ['エンパイアカジノ', 3400],
    ['ビーベット', 3400],
    ['ベット365', 2900],
    ['ワイルドジャングルカジノ', 2700],
    ['ステークカジノ', 2200],
    ['ユニークカジノ', 2000],
    ['カジノデイズ', 1700],
    ['カジノエックス', 1600],
    ['スロッティベガス', 1400],
    ['betway', 1400],
    ['ロイヤルパンダ', 1300],
    ['ビットスターズ', 1300],
    ['dafabet', 1200],
    ['ジョイカジノ', 1200],
    ['ナショナル カジノ', 1100],
    ['カジノ イン', 1000],
    ['ワンバイベット', 1000],
    ['ロトランド', 1000],
    ['ビデオスロッツ', 800],
    ['22bet', 800],
    ['caxino', 700],
    ['バルカンベガス', 700],
    ['フトカジ', 600],
    ['リリベットカジノ', 600],
    ['ライブカジノアイオー', 600],
    ['ポケットカジノ', 600],
    ['ジャックポットシティ', 500],
    ['うみうみカジノ', 500],
    ['プレイアモ', 450],
    ['ワイルズ カジノ', 450],
    ['ベットティルト', 450],
    ['カジノゴッズ', 450],
    ['1xbit', 450],
    ['ミラクルカジノ', 450],
    ['シンプルカジノ', 400],
    ['ベットランク', 400],
    ['スピンアウェイカジノ', 350],
    ['ツインカジノ', 350],
    ['キングビリーカジノ', 300],
    ['ノーリミットカジノ', 300],
    ['ラッキーデイズカジノ', 300],
    ['ワンダリーノ', 300],
    ['21.com カジノ', 250],
    ['マラソンベット', 250],
    ['スプリーモカジノ', 250],
    ['バオカジノ', 250],
    ['ワザンバカジノ', 200],
    ['カリビアンカジノ', 200],
    ['ユニバーサルカジノ', 200],
    ['ピクセルベット', 200],
    ['エガオンカジノ', 200],
    ['manekichi', 200],
    ['スパカジ', 200],
    ['メタルカジノ', 200],
    ['cashmio', 150],
    ['インペリアルカジノ', 150],
    ['まね吉カジノ', 150],
    ['ホイールズカジノ', 150],
    ['ロキカジノ', 150],
    ['32red', 150],
    ['ニトロカジノ', 150],
    ['ハチスロカジノ', 150],
    ['ベガスプラス', 150],
    ['betwinner', 150],
    ['カジニア', 100],
    ['カシュミオ', 100],
    ['クラウドベット', 100],
    ['ロクカジノ', 100],
    ['ミスター ベガス', 100],
    ['ラッキー カジノ', 90],
    ['エムビットカジノ', 90],
    ['ワンバイビット', 80],
    ['マネキャッシュ閉鎖', 80],
    ['ビットキングスカジノ', 80],
    ['ベットレベルス', 60],
    ['スロッタムカジノ', 60],
    ['バスターバンクスカジノ', 50],
    ['supotsubet', 40],
    ['21ドットコム', 40],
    ['21nova', 40],
    ['ベットウィナー', 30],
    ['優雅 堂', 20],
    ['sbo bet', 20],
    ['モンカジ', 20],
    ['コインサガ', 10],
    ['リスクカジノ', 10],
    ['ロケットポット', 10],
    ['rocketpot', 10],
    ];

  // brand keywords with volume 10000+
  const testKeywords = brandKeywords.reduce((acc, rec) => {
    if (rec[1] >= 10000) {
      acc.push(rec);
    }
    return acc;
  }, []);

  const getSerpJSON = async (keyword) => {
    const search = new SerpApi.GoogleSearch(process.env.serp_api_key);

    const params = {
      engine: "google",
      q: keyword,
      location: "Japan",
      google_domain: "google.co.jp",
      gl: "jp",
      hl: "ja",
      num: "100"
    };

    const serpObject = new Promise((resolve) => {
      // Show result as JSON
      search.json(params, (data) => {
        resolve(data);
      });
    })

    return await serpObject;
  }

  // today report file name, example: 13072022
  const todayDate = new Date().toISOString().split('T')[0].split('-');
  const todayDateFileName = `${todayDate[2]}` + `${todayDate[1]}` + `${todayDate[0]}`
  const todayDateForReport = `${todayDate[2]}` + '-' + `${todayDate[1]}` + '-' + `${todayDate[0]}`
  const csvSeparator = ','
  
  // simple crud for reports
  const isTodayReportFileExists = () => {
    const fileNamesArray = fs.readdirSync('public/reports');
    return fileNamesArray.includes(todayDateFileName + '.csv');
  }

  const createTodayReportFile = () => {
    fs.writeFileSync('public/reports/' + todayDateFileName + '.csv', // `sep=${csvSeparator}\n` +
      'date' +
      csvSeparator +
      'location' +
      csvSeparator +
      'search engine' +
      csvSeparator +
      'search engine domain' +
      csvSeparator +
      'country' + // (ISO 3166-1 alpha-2)
      csvSeparator +
      'language' + // (ISO 639-1)
      csvSeparator +
      'device' + // (desktop / mobile)
      csvSeparator +
      'type of keyword' +
      csvSeparator +
      'keyword' +
      csvSeparator +
      'keyword volume' +
      csvSeparator +
      'domain' +
      csvSeparator +
      'exact link' +
      csvSeparator +
      'position' +
      csvSeparator +
      'title' +
      csvSeparator +
      'description');
    console.log('File ' + todayDateFileName + '.scv' + ' created');
  }

  const writeToTodayReportFile = (date, location, search_engine, search_engine_domain, country, language, device,
                                  keyword_type, keyword, keyword_volume, domain, link, position, title, description) =>
  {
    fs.appendFileSync('public/reports/' + todayDateFileName + '.csv', '\n'
      + date + csvSeparator
      + location + csvSeparator
      + search_engine + csvSeparator
      + search_engine_domain + csvSeparator
      + country + csvSeparator
      + language + csvSeparator
      + device + csvSeparator
      + keyword_type + csvSeparator
      + keyword.replaceAll(',', '，').replaceAll('"', '”') + csvSeparator
      + keyword_volume + csvSeparator
      + domain + csvSeparator
      + link.replaceAll(',', '，').replaceAll('"', '”') + csvSeparator
      + position + csvSeparator
      + title.replaceAll(',', '，').replaceAll('"', '”') + csvSeparator
      + description.replaceAll(',', '，').replaceAll('"', '”')
    );
  }


  if (!isTodayReportFileExists()) {
    createTodayReportFile();

    testKeywords.map(async ([keyword, volume]) => {
      console.log('working with keyword ' + keyword + ` (${volume})`);
      const serpJSON = await getSerpJSON(keyword);
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
          'gambling brand', // keyword_type
          keyword, // keyword
          volume, // keyword volume
          'domain', // domain
          result.link, // link
          result.position, // position
          result.title, // title
          result.snippet, // description
        );
      }
    });
    console.log('Report ' + todayDateFileName + '.csv' + ' created');
  } else {
    console.log('Report ' + todayDateFileName + '.csv' + ' exists')
  }

  res.render('index', { title: 'SERP Dashboard' });
});

module.exports = router;
