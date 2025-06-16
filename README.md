# 🇺🇸 Lululemon US Proxy Purchase Estimator

This is a lightweight frontend tool to help estimate the **total cost of purchasing Lululemon products from the US** through a proxy (代購). It’s perfect for IG sellers, side hustlers, or anyone helping friends buy overseas.

## ✨ Features

- ✅ **Auto-loads live USD to TWD exchange rates**
  - Primary source: Taiwan government open data API
  - Fallback: Parses data from Bank of Taiwan’s website (via multiple CORS proxies)
- 💰 **Applies a 1.2x service fee** to item price
- 🚚 **Estimates 2nd-stage local shipping cost** (default: NT$60)
- 🔁 One-click to reload exchange rate
- ✍️ Exchange rate field can be edited manually (double-click to unlock)

## 🧮 Calculation Formula


> Note: The second-stage shipping fee is estimated at NT$60 per item. Actual cost may vary based on weight or packaging.

## 🧾 How to Use

1. Open `index.html` in any browser (no backend required)
2. Enter the USD price of the item
3. Wait for exchange rate to load (or enter it manually)
4. Click **Calculate Total**
5. View a breakdown of service fee and shipping

## 🌐 Exchange Rate Sources

- **Primary**: [Taiwan Futures Exchange Open API](https://openapi.taifex.com.tw/v1/DailyForeignExchangeRates)
- **Backup**: Scrapes [Bank of Taiwan Exchange Rate Page](https://rate.bot.com.tw/xrt?Lang=zh-TW) using CORS proxies:
  - `https://api.allorigins.win/`
  - `https://corsproxy.io/`
  - `https://api.codetabs.com/`

## 🛠️ Tech Stack

- Pure **HTML + JavaScript**
- No frameworks or build tools
- Built-in resilience: gracefully falls back if exchange rate sources fail
- DOM parsing to extract rates from fallback HTML when API is down

## 🖼 Preview

> ![alt text](image.png)

## 👩‍💻 Author

Created by @jiasyuanchu(Instagram)

This tool is designed for casual use and personal proxy buying. Feedback or suggestions are welcome via Instagram DM 💌

---

Feel free to fork or modify this project for your own proxy store or community use!
