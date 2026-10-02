document.addEventListener("DOMContentLoaded", () => {
  const CHAIN_NAMES = { "1":"Etherscan", "56":"BscScan", "137":"PolygonScan", "42161":"Arbiscan", "8453":"BaseScan", "10":"Optimism", "43114":"Snowtrace" };
  const EXPLORERS = { "1":"https://etherscan.io/tx/", "56":"https://bscscan.com/tx/", "137":"https://polygonscan.com/tx/", "42161":"https://arbiscan.io/tx/", "8453":"https://basescan.org/tx/", "10":"https://optimistic.etherscan.io/tx/", "43114":"https://snowtrace.io/tx/" };
  const STABLES = ["USDT","USDC","DAI","BUSD","FRAX","TUSD"];
  let results = [];

  const ENDPOINTS = {
    "1": [
      { url: "https://api.etherscan.io/v2/api?chainid=1", needKey: true, label: "V2 Unified" },
      { url: "https://api.etherscan.io/api", needKey: true, label: "V1 Fallback" }
    ],
    "56": [
      { url: "https://api.etherscan.io/v2/api?chainid=56", needKey: true, label: "V2 Unified" },
      { url: "https://api.bscscan.com/api", needKey: true, label: "V1 Fallback" },
      { url: "https://bnb.blockscout.com/api", needKey: false, label: "FREE" },
      { url: "https://api.routescan.io/v2/network/mainnet/evm/56/etherscan/api", needKey: false, label: "FREE" }
    ],
    "137": [
      { url: "https://api.etherscan.io/v2/api?chainid=137", needKey: true, label: "V2 Unified" },
      { url: "https://api.polygonscan.com/api", needKey: true, label: "V1 Fallback" }
    ],
    "42161": [
      { url: "https://api.etherscan.io/v2/api?chainid=42161", needKey: true, label: "V2 Unified" },
      { url: "https://api.arbiscan.io/api", needKey: true, label: "V1 Fallback" }
    ],
    "8453": [
      { url: "https://api.etherscan.io/v2/api?chainid=8453", needKey: true, label: "V2 Unified" },
      { url: "https://api.basescan.org/api", needKey: true, label: "V1 Fallback" },
      { url: "https://base.blockscout.com/api", needKey: false, label: "FREE" },
      { url: "https://api.routescan.io/v2/network/mainnet/evm/8453/etherscan/api", needKey: false, label: "FREE" }
    ],
    "10": [
      { url: "https://api.etherscan.io/v2/api?chainid=10", needKey: true, label: "V2 Unified" },
      { url: "https://api-optimistic.etherscan.io/api", needKey: true, label: "V1 Fallback" },
      { url: "https://optimism.blockscout.com/api", needKey: false, label: "FREE" },
      { url: "https://api.routescan.io/v2/network/mainnet/evm/10/etherscan/api", needKey: false, label: "FREE" }
    ],
    "43114": [
      { url: "https://api.etherscan.io/v2/api?chainid=43114", needKey: true, label: "V2 Unified" },
      { url: "https://api.snowtrace.io/api", needKey: true, label: "V1 Fallback" }
    ]
  };

  const chainSelect = document.getElementById("chain");
  const apiTitle = document.getElementById("apiTitle");
  const apiText = document.getElementById("apiText");
  const walletText = document.getElementById("walletText");
  const badge = document.getElementById("endpointBadge");
  const info = document.getElementById("activeEndpointInfo");

  function updateApiTitle(){
    const chainName = CHAIN_NAMES[chainSelect.value] || "Etherscan";
    apiTitle.textContent = "2. " + chainName + " V2 API Key - BYOK";
    updateBadgePreview();
  }

  function updateBadgePreview(){
    const chainId = chainSelect.value;
    const ep = ENDPOINTS[chainId][0];
    const host = new URL(ep.url).hostname;
    badge.style.display = "inline-block";
    badge.textContent = "READY: " + ep.label;
    badge.className = "badge";
    info.textContent = "Will use: " + host + (ep.needKey ? " (uses API Key)" : " (FREE)") + " • will fallback automatically if it fails";
  }

  function setActiveEndpoint(url, needKey, label){
    const host = new URL(url).hostname;
    badge.style.display = "inline-block";
    if(label === "FREE"){
      badge.textContent = "ACTIVE: FREE - No Key";
      badge.className = "badge green";
    } else if(label === "V1 Fallback"){
      badge.textContent = "ACTIVE: V1 Fallback";
      badge.className = "badge dark";
    } else {
      badge.textContent = "ACTIVE: V2 Unified";
      badge.className = "badge green";
    }
    info.textContent = "✓ Endpoint succeeded: " + host + (needKey ? " (uses API Key)" : " (FREE)");
  }

  chainSelect.addEventListener("change", updateApiTitle);
  updateApiTitle();

  document.getElementById("eyeBtn").onclick = () => {
    apiText.type = apiText.type === "password" ? "text" : "password";
  };

  function parseApiKeys(){
    const raw = apiText.value.trim();
    if(!raw) return [];
    return raw.split(/[\n,]+/).map(s=>s.trim()).filter(s=>s.length >= 10);
  }
  function parseWallets(){
    const raw = walletText.value.trim();
    if(!raw) return [];
    return raw.split(/[\n,\s,]+/).map(s=>s.trim()).filter(a=> /^0x[a-fA-F0-9]{40}$/.test(a));
  }
  function updateCounts(){
    document.getElementById("apiCount").textContent = parseApiKeys().length + " API Keys detected";
    document.getElementById("walletCount").textContent = parseWallets().length + " valid wallets detected";
  }
  apiText.addEventListener("input", updateCounts);
  walletText.addEventListener("input", updateCounts);

  document.getElementById("apiFile").addEventListener("change", e=>{
    const f=e.target.files[0]; if(!f) return;
    const r=new FileReader(); r.onload=ev=>{ apiText.value=ev.target.result; updateCounts(); }; r.readAsText(f);
  });
  document.getElementById("walletFile").addEventListener("change", e=>{
    const f=e.target.files[0]; if(!f) return;
    const r=new FileReader(); r.onload=ev=>{ walletText.value=ev.target.result; updateCounts(); }; r.readAsText(f);
  });

  if(localStorage.getItem("byok_api")){ apiText.value=localStorage.getItem("byok_api"); document.getElementById("remember").checked=true; updateCounts();}
  document.getElementById("remember").addEventListener("change", e=>{
    if(e.target.checked) localStorage.setItem("byok_api", apiText.value);
    else localStorage.removeItem("byok_api");
  });
  apiText.addEventListener("input", ()=>{
    if(document.getElementById("remember").checked) localStorage.setItem("byok_api", apiText.value);
  });

  async function fetchSingleSource(wallet, apiKey, chainId, action){
    const bases = ENDPOINTS[chainId];
    for(let ep of bases){
      try{
        const sep = ep.url.includes("?") ? "&" : "?";
        let url = `${ep.url}${sep}module=account&action=${action}&address=${wallet}&sort=desc`;
        if(ep.needKey) url += `&apikey=${apiKey}`;
        
        const res = await fetch(url).then(r=>r.json());
        
        if(res.status === "1" && Array.isArray(res.result)) {
          setActiveEndpoint(ep.url, ep.needKey, ep.label);
          return res;
        }
        if(res.message && res.message.toLowerCase().includes("no transactions found")) {
          setActiveEndpoint(ep.url, ep.needKey, ep.label);
          return res;
        }
        throw new Error(res.message || res.result || "fallback");
      }catch(err){
        console.warn(`Failed at ${ep.url} action=${action}: ${err.message}, trying fallback...`);
        continue;
      }
    }
    return { status:"0", result: [] };
  }

  document.getElementById("btnScan").addEventListener("click", async ()=>{
    const apis = parseApiKeys();
    const wallets = parseWallets();
    const chainId = chainSelect.value;
    if(apis.length===0) return alert("Enter 1 API Key first in Option A");
    if(wallets.length===0) return alert("Invalid wallet! Must be 0x + 40 characters");
    results=[]; document.getElementById("tbody").innerHTML="";
    const btn=document.getElementById("btnScan"); btn.disabled=true; btn.textContent="SCANNING...";
    let stable=0,native=0;

    for(let i=0;i<wallets.length;i++){
      const wallet=wallets[i].toLowerCase();
      const apiKey=apis[i % apis.length];
      document.getElementById("progressText").textContent=(i+1)+" / "+wallets.length;
      document.getElementById("progress").style.width=((i+1)/wallets.length*100)+"%";

      try{
        const [resT,resN]=await Promise.all([
          fetchSingleSource(wallet, apiKey, chainId, "tokentx"),
          fetchSingleSource(wallet, apiKey, chainId, "txlist")
        ]);

        let txs=[]; 
        if(resT.status==="1" && Array.isArray(resT.result)) txs=txs.concat(resT.result); 
        if(resN.status==="1" && Array.isArray(resN.result)) txs=txs.concat(resN.result);
        
        let receives=txs.filter(tx=>tx.to && tx.to.toLowerCase()===wallet);
        if(document.getElementById("hideSpam").checked) receives=receives.filter(tx=> !(tx.value==0 && !tx.tokenSymbol) );
        
        receives.slice(0,20).forEach(tx=>{
          const isNative=!tx.tokenSymbol;
          const symbol=tx.tokenSymbol || (chainId=="56"?"BNB":chainId=="137"?"POL":chainId=="8453"?"ETH":chainId=="10"?"ETH":chainId=="43114"?"AVAX":"ETH");
          const amount=Number(tx.value)/(10**(Number(tx.tokenDecimal)||18));
          if(isNative) native++; else if(STABLES.includes(symbol.toUpperCase())) stable++;
          results.push({wallet:wallets[i],time:new Date(tx.timeStamp*1000).toLocaleString("id-ID"),token:symbol,amount:amount.toLocaleString("en-US",{maximumFractionDigits:6}),hash:tx.hash,isNative});
          const r=results[results.length-1];
          const tr=document.createElement("tr");
          const explorer = EXPLORERS[chainId] || "https://etherscan.io/tx/";
          tr.innerHTML="<td>"+r.wallet.slice(0,6)+"..."+r.wallet.slice(-4)+"</td><td>"+r.time+"</td><td><b>"+r.token+"</b></td><td>"+r.amount+"</td><td><span class=\"badge "+(r.isNative?"green":"")+"\">"+(r.isNative?"Native":"Token")+"</span></td><td><a href=\""+explorer+r.hash+"\" target=\"_blank\" style=\"color:#6C5CFF\">"+r.hash.slice(0,6)+"...</a></td>";
          document.getElementById("tbody").appendChild(tr);
        });
      }catch(err){ console.error(err); }
      await new Promise(r=>setTimeout(r,300));
    }
    document.getElementById("countTotal").textContent="Total: "+results.length;
    document.getElementById("countStable").textContent="Stable: "+stable;
    document.getElementById("countNative").textContent="Native: "+native;
    btn.disabled=false; btn.textContent="SCAN MASS RECEIVE";
    if(results.length===0) alert("Scan complete - no RECEIVE found on chain "+ CHAIN_NAMES[chainId]);
  });

  document.getElementById("btnClear").onclick = ()=>{
    walletText.value=""; document.getElementById("tbody").innerHTML=""; document.getElementById("progress").style.width="0%"; document.getElementById("progressText").textContent="0 / 0"; results=[]; updateCounts();
    updateBadgePreview();
  };
  document.getElementById("btnExport").onclick = ()=>{
    if(!results.length) return alert("No data yet");
    let csv="Wallet,Time,Token,Amount,Hash\n";
    results.forEach(r=>{
      csv += r.wallet + "," + r.time + "," + r.token + "," + r.amount + "," + r.hash + "\n";
    });
    const a=document.createElement("a");
    a.href=URL.createObjectURL(new Blob([csv],{type:"text/csv"}));
    a.download="scan_"+Date.now()+".csv";
    a.click();
  };
  updateCounts();
});
