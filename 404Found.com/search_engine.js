
function search_engine_fn(){

  var choi = document.getElementById("search_engine");
  var query_search=document.getElementById("search_query").value;

  if(choi.options[choi.selectedIndex].value == "Google"){
    var str=query_search.replace(" ","%20")
    var final_url= "https://www.google.com/search?q="+str;
    window.open(final_url);
  }
 else if(choi.options[choi.selectedIndex].value == "Bing"){
  var str=query_search.replace(" ","%20")
  var final_url= "https://www.bing.com/search?q="+str;
  window.open(final_url);
  }
  else if(choi.options[choi.selectedIndex].value == "Yandex"){
   var str=query_search.replace(" ","%20")
   var final_url= "https://yandex.com/search/?text="+str;
   window.open(final_url);
 }
 else if(choi.options[choi.selectedIndex].value == "DuckDuckGo"){
  var str=query_search.replace(" ","+")
  var final_url= "https://duckduckgo.com/?q="+str;
  window.open(final_url);
}
  else if(choi.options[choi.selectedIndex].value == "StartPage"){
 var str=query_search.replace(" ","%20")
 var final_url= "https://www.startpage.com/do/search?query="+str;
 window.open(final_url);
}
  else if(choi.options[choi.selectedIndex].value == "Infinity"){
 var str=query_search.replace(" ","%20")
 var final_url= "https://infinitysearch.co/results?q="+str;
 window.open(final_url);
}
  else if(choi.options[choi.selectedIndex].value == "SearX"){
 var str=query_search.replace(" ","%20")
 var final_url= "https://searx.olymp.to/?q="+str;
 window.open(final_url);
}
  else if(choi.options[choi.selectedIndex].value == "Spot"){
 var str=query_search.replace(" ","%20")
 var final_url= "https://spot.ecloud.global/?q="+str;
 window.open(final_url);
}
  else if(choi.options[choi.selectedIndex].value == "Qwant"){
 var str=query_search.replace(" ","%20")
 var final_url= "https://www.qwant.com/?q="+str;
 window.open(final_url);
}
  else if(choi.options[choi.selectedIndex].value == "SearchEncrypt"){
 var str=query_search.replace(" ","%20")
 var final_url= "https://www.searchencrypt.com/search?q="+str;
 window.open(final_url);
}
  else if(choi.options[choi.selectedIndex].value == "Invidious"){
var str=query_search.replace(" ","%20")
var final_url= "https://invidious.tube/search?q="+str;
window.open(final_url);
}
  else if(choi.options[choi.selectedIndex].value == "TorrentZ"){
var str=query_search.replace(" ","%20")
var final_url= "https://torrentz2.is/search?f="+str;
window.open(final_url);
}
  else if(choi.options[choi.selectedIndex].value == "Alternative"){
var str=query_search.replace(" ","%20")
var final_url= "https://alternativeto.net/browse/search?q="+str;
window.open(final_url);
}
  else if(choi.options[choi.selectedIndex].value == "Bullmask"){
var str=query_search.replace(" ","%20")
var final_url= "https://www.bullmask.com/web/?q="+str;
window.open(final_url);
}
  else if(choi.options[choi.selectedIndex].value == "MamontFTP"){
var str=query_search.replace(" ","%20")
var final_url= "https://www.mmnt.ru/int/get?st="+str;
window.open(final_url);
}
}
