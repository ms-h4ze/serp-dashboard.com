# serp-dashboard.com
Once a day, the script takes a "snapshot" of the search results for chosen keywords and collect it into /public/reports/ directory like daily .csv reports.

You will see mine reports here: [https://serp-dashboard.com/reports/](https://serp-dashboard.com/reports/)

Later you can use this reports in data analytics and find top winners and losers websites by weeks.

SERP parsing by [serpapi.com](https://serpapi.com/).

## Install
1. Clone repository to your machine
2. Run `npm install` inside project directory
3. Create .env file with this content parameter "serp_api_key" (example file - /.env-example)
4. Run script
   1. `npm run server` - start development server, using default.json config (default port - 3001)
   2. `npm run start` - start production server, using production.json config (default port - 8080)

## Parsing parameters
Now script parsing this data and collect it in csv reports:
- date (today date using format dd-mm-yyy)
- location (country, example: Japan)
- search_engine (example: google)
- search_engine_domain (example: google.co.jp)
- country (ISO 3166-1 alpha-2)
- language (ISO 639-1)
- device (desktop / mobile)
- keyword_type (custom keyword lable)
- keyword
- keyword_volume (ahrefs volume)
- domain (extracting from link)
- link
- position
- title
- description (not exact website description, it's snippet from serp)