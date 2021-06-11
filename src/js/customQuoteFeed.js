var customQuoteFeed = {}

customQuoteFeed.postAjax = function (url,req, cb) {
	console.log(url)
	console.log(req)
	console.log(cb)

	var server = new XMLHttpRequest();
	server.open("POST",url); 
	server.setRequestHeader("X-ENCRYPT",false);
	server.onload = function () {
		console.log("THIS RESPOSE TEXT : ",this.responseText)
		cb(this.status, this.responseText);
	};
	server.onerror = function () {
		cb(500);
	};
	server.send(JSON.stringify(req));
};

customQuoteFeed.url = "https://mdev-ws.sbicapsec.com/Markets/GetChart/1.0.3";

customQuoteFeed.fetchInitialData = function (symbol,suggestedStartDate,suggestedEndDate,params,cb) {	
// customQuoteFeed.fetchInitialData = function () {
	var req = {
		"request": {
			"data": {
			  "sym": {
				"asset": "Equity",
				"exc": "NSE",
				"expiry": "",
				"id": "STK_AXISBANK_EQ_NSE",
				"instrument": "STK",
				"lotSize": "",
				"multiplier": "",
				"optionType": "",
				"streamSym": "5900_NSE",
				"strike": "",
				"tickSize": ""
			  },
			  "startDate": suggestedStartDate,
			  "endDate": suggestedEndDate,
			"interval": "1m",
			"sessionID": "09c8f09fa4303edf57130e65ff8e0ee7"
			},
			"appID": "5b69646dfd6aaa2a8ed730d47cfb7f6e"
		  }
	}
		console.log("INSIDE INITIAL DATA FN" ,suggestedStartDate ,suggestedEndDate)
        customQuoteFeed.postAjax(customQuoteFeed.url,req, function (status, response) {
		if (status == 200) {
			var newQuotes = customQuoteFeed.formatChartData(response);
			cb({
				quotes: newQuotes,
				moreAvailable: true,
			}); 
		} else {
			cb({ error: response ? response : status });
		}
	});
};

// customQuoteFeed.fetchUpdateData = function (symbol, startDate, params, cb) {
// 	console.log("before update ajax call ")
// 	  customQuoteFeed.postAjax(customQuoteFeed.url, req , function (status, response) {
// 		if (status == 200) {
// 			// customQuoteFeed.formatChartData(response, symbol);
// 			// console.log("RESPONSE INSIDE UPDATE : ",response)
// 			var newQuotes = customQuoteFeed.formatChartData(response, symbol);
// 			cb({
// 				quotes: newQuotes,
// 				// moreAvailable: true,
// 				// attribution: { source: "simulator", exchange: "RANDOM" }
// 			}); 
// 		} else {
// 			// else error response from datafeed
// 			cb({ error: response ? response : status }); // specify error in callback
// 		}
// 	});
// };
customQuoteFeed.fetchPaginationData = function (symbol,suggestedStartDate,endDate,params,cb) {
	var req = {
		"request": {
			"data": {
			  "sym": {
				"asset": "Equity",
				"exc": "NSE",
				"expiry": "",
				"id": "STK_AXISBANK_EQ_NSE",
				"instrument": "STK",
				"lotSize": "",
				"multiplier": "",
				"optionType": "",
				"streamSym": "5900_NSE",
				"strike": "",
				"tickSize": ""
			  },
			  "startDate": suggestedStartDate,
			  "endDate": endDate,
			"interval": "1m",
			"sessionID": "09c8f09fa4303edf57130e65ff8e0ee7"
			},
			"appID": "5b69646dfd6aaa2a8ed730d47cfb7f6e"
		  }
	}
// customQuoteFeed.fetchPaginationData = function () {
	console.log("before pagination ajax call>>>> ")

		customQuoteFeed.postAjax(customQuoteFeed.url ,req , function (status, response) {
		if (status == 200) {
			var newQuotes = customQuoteFeed.formatChartData(response, symbol);
			console.log("new Wote inside pagination : ",newQuotes)
			cb({
				quotes: newQuotes,
				moreAvailable: false,
			}); 
		} else {
			cb({ error: response ? response : status }); 
		}
	});
};

var data = [];

customQuoteFeed.formatChartData = function (response, symbol) {
	console.log("INSIDE FUNCTION FORMAT -")
	var feeddata = JSON.parse(response);
	var newQuotes = []

	
		console.log("FEED DATA....>>>>>>>>>>>>>>>>>>>>>>>>>",feeddata.data)
		if(feeddata.data === 'undefined'){
			console.log("NO DATA AVAILABLE ...")
		}else{
			data = feeddata.response.data.dataPoints;
			console.log("Inside ELSE part ")
		for(var j =0 ; j< data.length ;j++){
			var string = data[j];
			var newObj={}
			newObj.DT = new Date(string[5])
			newObj.Open =string[1]
			newObj.High = string[2]
			newObj.Low = string[3]
			newObj.Close = string[0]
			newObj.Volume = string[4]
			console.log("New Quote Object : ",newObj);
			newQuotes.push(newObj);
			console.log("NEW QUOTE OBJECTS ARRAY..FORMAT. ",newQuotes);
		}
}
	return newQuotes
};

export default customQuoteFeed;
