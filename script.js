async function fetchExchangeRate() {
  try {
    const res = await fetch('https://api.exchangerate.host/latest?base=USD&symbols=TWD');
    const data = await res.json();
    const rate = data.rates.TWD;
    document.getElementById("exchangeRate").value = rate.toFixed(2);
  } catch (err) {
    alert("無法載入匯率，請稍後再試");
    document.getElementById("exchangeRate").value = 30.3; // fallback 預設匯率
  }
}

fetchExchangeRate();

function calculate() {
  const usdPrice = parseFloat(document.getElementById("usdPrice").value);
  const exchangeRate = parseFloat(document.getElementById("exchangeRate").value);
  const shippingFee = 60;

  if (isNaN(usdPrice) || isNaN(exchangeRate)) {
    alert("請輸入正確的商品金額");
    return;
  }

  const stage1 = usdPrice * exchangeRate * 1.2;
  const total = stage1 + shippingFee;

  document.getElementById("stage1").innerText = Math.round(stage1).toLocaleString();
  document.getElementById("stage2").innerText = shippingFee.toLocaleString();
  document.getElementById("total").innerText = Math.round(total).toLocaleString();

  document.getElementById("result").style.display = "block";
}
