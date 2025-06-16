// 方法一：使用政府開放資料平台的匯率API
async function fetchTaiwanBankRateAPI() {
  const exchangeInput = document.getElementById("exchangeRate");
  try {
    // 使用政府開放資料平台的每日外幣參考匯率
    const response = await fetch('https://openapi.taifex.com.tw/v1/DailyForeignExchangeRates');
    const data = await response.json();

    // 找到美元匯率
    const usdRate = data.find(item => item.Currency === 'USD');
    if (usdRate && usdRate.SellRate) {
      const rate = parseFloat(usdRate.SellRate);
      exchangeInput.value = rate.toFixed(2);
      console.log(`成功取得美元匯率: ${rate}`);
    } else {
      throw new Error("找不到美元匯率資料");
    }
  } catch (error) {
    console.error("政府開放資料匯率載入失敗：", error);
    // 如果政府API失敗，嘗試備用方法
    await fetchTaiwanBankRateHTML();
  }
}

// 方法二：修正的HTML解析方法
async function fetchTaiwanBankRateHTML() {
  const exchangeInput = document.getElementById("exchangeRate");
  try {
    // 使用不同的CORS代理
    const proxyUrls = [
      "https://api.allorigins.win/get?url=",
      "https://corsproxy.io/?",
      "https://api.codetabs.com/v1/proxy?quest="
    ];

    let response;
    let html;

    // 嘗試不同的代理服務
    for (const proxy of proxyUrls) {
      try {
        const url = proxy + encodeURIComponent("https://rate.bot.com.tw/xrt?Lang=zh-TW");
        response = await fetch(url);

        if (proxy.includes('allorigins')) {
          const data = await response.json();
          html = data.contents;
        } else {
          html = await response.text();
        }

        if (html && html.length > 1000) {
          break; // 成功獲取HTML
        }
      } catch (proxyError) {
        console.log(`代理 ${proxy} 失敗:`, proxyError);
        continue;
      }
    }

    if (!html) {
      throw new Error("所有代理都失敗");
    }

    const parser = new DOMParser();
    const doc = parser.parseFromString(html, "text/html");

    // 更強健的美元行查找
    let usdRow = null;
    const rows = doc.querySelectorAll("table tbody tr, .table tbody tr, table tr");

    for (const row of rows) {
      const cells = row.querySelectorAll("td");
      if (cells.length >= 3) {
        const firstCell = cells[0];
        const cellText = firstCell.textContent || firstCell.innerText || "";

        // 檢查是否包含美元相關文字
        if (cellText.includes("美元") || cellText.includes("USD") ||
          cellText.includes("美 元") || cellText.includes("Dollar")) {
          usdRow = row;
          break;
        }
      }
    }

    if (!usdRow) {
      throw new Error("找不到美元匯率行");
    }

    const cells = usdRow.querySelectorAll("td");
    if (cells.length < 3) {
      throw new Error("美元行格式不正確");
    }

    // 嘗試不同的欄位位置（現金賣出通常在第2或第3欄）
    let rateText = "";
    for (let i = 1; i < Math.min(cells.length, 5); i++) {
      const cellText = cells[i].textContent.trim();
      // 檢查是否為數字格式 (例: 32.50 或 32.500)
      if (/^\d+\.?\d*$/.test(cellText) && parseFloat(cellText) > 20 && parseFloat(cellText) < 50) {
        rateText = cellText;
        break;
      }
    }

    if (!rateText) {
      throw new Error("找不到有效的匯率數字");
    }

    const rate = parseFloat(rateText);
    if (isNaN(rate) || rate < 20 || rate > 50) {
      throw new Error(`匯率數值異常: ${rate}`);
    }

    exchangeInput.value = rate.toFixed(2);
    console.log(`成功取得美元匯率: ${rate}`);

  } catch (error) {
    console.error("台銀匯率載入失敗：", error);
    exchangeInput.value = "載入失敗";

    // 提供手動輸入的提示
    const userInput = prompt("無法自動取得匯率，請手動輸入美元現金賣出匯率（例如：32.50）：");
    if (userInput && !isNaN(parseFloat(userInput))) {
      exchangeInput.value = parseFloat(userInput).toFixed(2);
    } else {
      alert("無法取得台銀匯率，請稍後再試或手動輸入匯率");
    }
  }
}

// 主要的匯率獲取函數
async function fetchTaiwanBankRate() {
  console.log("開始獲取台銀匯率...");

  // 先嘗試API方法，失敗後自動嘗試HTML解析
  await fetchTaiwanBankRateAPI();
}

// 計算函數保持不變
function calculate() {
  const usdPrice = parseFloat(document.getElementById("usdPrice").value);
  const exchangeRate = parseFloat(document.getElementById("exchangeRate").value);
  const shippingFee = 60;

  if (isNaN(usdPrice) || isNaN(exchangeRate)) {
    alert("請輸入正確的商品金額或等待匯率載入完成");
    return;
  }

  const stage1 = usdPrice * exchangeRate * 1.2;
  const total = stage1 + shippingFee;

  document.getElementById("stage1").innerText = Math.round(stage1).toLocaleString();
  document.getElementById("stage2").innerText = shippingFee.toLocaleString();
  document.getElementById("total").innerText = Math.round(total).toLocaleString();
  document.getElementById("result").style.display = "block";
}

// 手動重新載入匯率的函數
function reloadExchangeRate() {
  document.getElementById("exchangeRate").value = "載入中...";
  fetchTaiwanBankRate();
}

// 初始化載入匯率

window.addEventListener("DOMContentLoaded", () => {
  fetchTaiwanBankRate();
});
