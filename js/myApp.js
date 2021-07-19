var app = angular.module("myApp", ['ngRoute', 'ngCookies','ngAnimate']); 

app.filter("statusfilter", function() {
	  return function(stat) {
		  if(stat == "200") {
		        return "Working";
		   } else {
		        return "Not Working, Error code: "+stat;
		  }
	  };
	});

app.filter("timefilter", function() {
	  return function(time) {
		  if(time == "short_term") {
		        return "of the last 4 weeks";
		   } else if (time == "medium_term"){
		        return "of the last 6 months";
		  } else if (time == "long_term"){
		        return "of all time";
		  }
	  };
});


app.filter("percentagefilter", function() {
		return function(number) {
			number+="";
			var percentage ="";
			if(number.startsWith("0.00")){
				return "0 %";
			}else if(number=="0"){
				return "0 %";
			}else if(number.startsWith("0.0") && number.length==4){
				percentage= number.substr(3,1);
			}else if(number.length==3){
				percentage= number.substr(2,1)+"0.0";
			}else if(number.length==4){
				percentage= number.substr(2,2)+".0";
			}else if(number.startsWith("0.0") && number.length>4){
				percentage= number.substr(3,1)+"."+number.substr(4,1);
			}else if(number=="1"){
					return "100 %";
			}else
				percentage= number.substr(2,2)+"."+number.substr(4,1);
			return percentage+" %";
			
			
	};
});

app.config(function($routeProvider) {
			//alert("hello in config");
		    $routeProvider
		    .when("/mytop", {
		        templateUrl : "partials/mytop.html",
		        controller: "myCtrl"
		    }).when("/myplaylists", {
		        templateUrl : "partials/myplaylists.html",
		        controller: "myCtrl"
		    }).when("/contact", {
		        templateUrl : "partials/contact.html",
		    }).when("/FAQ", {
		        templateUrl : "partials/FAQ.html",
		    }).otherwise({
		        redirectTo : '/mytop'
		    });
	
});

app.filter("millSecondsToTimeString", function() {
	  return function(millseconds) {
	    var oneSecond = 1000;
	    var oneMinute = oneSecond * 60;
	    var oneHour = oneMinute * 60;
	    var oneDay = oneHour * 24;

	    var seconds = Math.floor((millseconds % oneMinute) / oneSecond);
	    var minutes = Math.floor((millseconds % oneHour) / oneMinute);
	    var hours = Math.floor((millseconds % oneDay) / oneHour);
	    var days = Math.floor(millseconds / oneDay);

	    var timeString = '';
	    if (days !== 0) {
	        timeString += (days !== 1) ? (days + ' days ') : (days + ' day ');
	    }
	    if (hours !== 0) {
	        timeString += (hours !== 1) ? (hours + ' hours ') : (hours + ' hour ');
	    }
	    if (minutes !== 0) {
	        timeString += (minutes !== 1) ? (minutes + ' minutes ') : (minutes + ' minute ');
	    }
	    if (seconds !== 0 || millseconds < 1000) {
	        timeString += (seconds !== 1) ? (seconds + ' seconds ') : (seconds + ' second ');
	    }

	    return timeString;
	};
	});

app.filter("millSecondsToTimeString2", function() {
	  return function(millseconds) {
	    var oneSecond = 1000;
	    var oneMinute = oneSecond * 60;
	    var oneHour = oneMinute * 60;
	    var oneDay = oneHour * 24;

	    var seconds = Math.floor((millseconds % oneMinute) / oneSecond);
	    var minutes = Math.floor((millseconds % oneHour) / oneMinute);
	    var hours = Math.floor((millseconds % oneDay) / oneHour);
	    var days = Math.floor(millseconds / oneDay);

	    var timeString = '';
	    if (days !== 0) {
	        timeString += (days !== 1) ? (days + ' days ') : (days + ' day ');
	    }
	    if (hours !== 0) {
	        timeString += (hours !== 1) ? (hours + ':') : (hours + ':');
	    }
	    if (minutes !== 0) {
	        timeString += (minutes !== 1) ? (minutes + ':') : (minutes + ':');
	    }
	    if (seconds !== 0 || millseconds < 1000) {
	    		timeString += (seconds >= 10) ? (seconds) : ("0"+seconds);
	    	}else{
	    		timeString += "00";
	    	}

	    

	    return timeString;
	};
	});


app.filter("followersfilter", function() {
	  return function(followers) {
		  if(followers < 1000) {
		        return followers;
		   } else if (followers < 1000000){
		        return Math.round(followers/1000*100)/100+"k";
		  } else{
			  	return Math.round(followers/1000000*100)/100+"M";
		  }
	  };
});



