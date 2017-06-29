(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var checkAlarm;

function AlarmWatch(hour, minute){
	this.hour=hour;
	this.minute=minute;
	this.remainingSeconds = 0;
	this.alarmSOund = new Audio('./../../audio/analog-watch-alarm.wav');
}
function putAlarmChoices(){
	for(var i=1;i<=24;i++){
		$('select#hours').append('<option value='+i+'>'+i+'</option>');
	}
	for(var j=1;j<=60;j++){
		$('select#minutes').append('<option value='+j+'>'+j+'</option>');
	} 
}

function updateTime(){
	var today = new Date();
	var h = today.getHours();
	var m = today.getMinutes();
	var s = today.getSeconds();
	$('#hour p').text(h);
	$('#minute p').text(m);
	$('#second p').text(s);
}


AlarmWatch.prototype.countRemainingTime = function() {
	var today2 = new Date();
	this.hour-=today2.getHours();
	this.minute-=today2.getMinutes();
	if (this.hour<0){
		this.hour+=12;
	}
	if(this.minute<0){
		this.minute+=60;
	}
	this.remainingSeconds = (((this.hour*60)+this.minute)*60)-today2.getSeconds();
};

AlarmWatch.prototype.countDown = function(){
	if(this.remainingSeconds<1){
		clearInterval(checkAlarm);
		this.alarmSOund.play()
		this.alarmSOund.loop = true;
	}else{
		this.remainingSeconds-=1;
	}
}
AlarmWatch.prototype.clearAlarm =function (){
	this.alarmSOund.pause();
	this.alarmSOund.loop = false;
}

$(document).ready(function(){
	putAlarmChoices();

	$('form#alarm').submit(function(event){
		event.preventDefault();
		var setHour = parseInt($('select#hours').val());
		var setMinute = parseInt($('select#minutes').val());
		var newAlarm = new AlarmWatch(setHour,setMinute);
		
		newAlarm.countRemainingTime();

		checkAlarm = setInterval(function(){
			newAlarm.countDown();
		},1000);	

	});
	var changeTime= setInterval(updateTime,1000);

	$('div#clear-alarm').click(function(){
		newAlarm.clearAlarm();
	})

});
},{}]},{},[1]);
