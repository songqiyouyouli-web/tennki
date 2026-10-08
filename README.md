# 天気予報アプリ

都市名または現在地から、気温・天気・湿度・降水確率を確認できる Web アプリです。
カレンダーで日付を選ぶと、OpenWeatherMap の5日間予報の中から該当日の予報に切り替わります。

## セットアップ

1. 依存パッケージをインストール

   ```bash
   npm install
   ```

2. OpenWeatherMap の無料 API キーを取得
   - https://openweathermap.org/ で Sign Up（無料、クレジットカード不要）
   - ログイン後「My API keys」で Key を発行
   - 発行直後は有効化まで最大数十分〜1時間ほどかかる場合があります

3. `.env.local` を作成し、取得したキーを設定

   ```bash
   cp .env.local.example .env.local
   ```

   `.env.local` の中身:

   ```
   OPENWEATHER_API_KEY=取得したAPIキー
   ```

   このキーはサーバー側（API Route）でのみ使用され、ブラウザには渡りません。
   `.env.local` は `.gitignore` 済みなので、Git にはコミットされません。

4. 開発サーバーを起動

   ```bash
   npm run dev
   ```

   http://localhost:3000 を開く

## 使っている API

- Geocoding API（都市名 → 緯度経度、無料）
- 5 Day / 3 Hour Forecast API（気温・天気・湿度・降水確率、無料・カード登録不要）

いずれも OpenWeatherMap の無料プランの範囲内で利用しています。

## デプロイ（Vercel）

1. GitHub にリポジトリを作成してプッシュ
2. https://vercel.com で GitHub リポジトリをインポート
3. Vercel の Project Settings → Environment Variables に `OPENWEATHER_API_KEY` を設定（ローカルの `.env.local` と同じ値）
4. Deploy
