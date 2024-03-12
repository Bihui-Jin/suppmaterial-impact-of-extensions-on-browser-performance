"use strict";
const modal = document.querySelector(".modal"),
	overlay = document.querySelector(".overlay"),
	closeModalBtn = document.querySelector(".close-modal"),
	donateBtn = document.getElementById("unlockAll");

function modalIncluder() {
	modal.classList.remove("hidden"), overlay.classList.remove("hidden")
}

function modalRemover() {
	modal.classList.add("hidden"), overlay.classList.add("hidden")
}

function decider() {
	chrome.runtime.sendMessage({
		message: "from-popup"
	}, (e => {
		console.log(e), "success" === e.appStatus ? modalRemover() : modalIncluder()
	}))
}

function patternCallback() {
	var e = globStringToRegex($("#patternInput").val());
	$("#listTable td.url").each((function (t, n) {
		$(n).attr("title").match(e) && $(n).parent().find("input.checkbox").prop("checked", !0).change()
	}))
}

function selectCallback() {
	$("#listTable tr.link.selected").find("input.checkbox").prop("checked", !0).change()
}

function deselectCallback() {
	$("#listTable tr.link.selected").find("input.checkbox").prop("checked", !1).change()
}
closeModalBtn.addEventListener("click", modalRemover), overlay.addEventListener("click", modalRemover), donateBtn.addEventListener("click", (function () {
	window.open("https://www.paypal.com/donate/?hosted_button_id=AAP8TQX2786PY")
})), $(document).ready((function () {
	chrome.tabs.query({
		active: !0,
		currentWindow: !0
	}, (function (e) {
		var t = e[0];
		chrome.tabs.sendMessage(t.id, {
			message: "getLinks"
		})
	})), chrome.runtime.sendMessage({
		message: "getStats"
	}), $("#selectButton").click((function () {
		decider(), chrome.storage.local.get("active", (e => {
			e.active && selectCallback()
		}))
	})), $("#deselectButton").click((function () {
		decider(), chrome.storage.local.get("active", (e => {
			e.active && deselectCallback()
		}))
	})), $("#startButton").click((function () {
		var e = [];
		$("#listTable input.checkbox:checked").parent().parent().find("td.url").each((function (t, n) {
			e.push($(n).attr("title"))
		})), chrome.runtime.sendMessage({
			message: "addToQueue",
			urls: e
		})
	})), $("#patternButton").click((function () {
		console.log("called"), decider(), chrome.storage.local.get("active", (e => {
			e.active && patternCallback()
		}))
	})), $("#clearDownloads").click((function () {
		chrome.runtime.sendMessage({
			message: "clearDownloads"
		})
	}))
})), chrome.runtime.onMessage.addListener((function (e, t, n) {
	"stats" == e.message && ($("#numDownloading").text() != e.numDownloading && ($("#numDownloading").removeClass("statsNumberAnimated"), setTimeout((function () {
		$("#numDownloading").addClass("statsNumberAnimated")
	}), 0)), $("#numQueued").text() != e.numQueued && ($("#numQueued").removeClass("statsNumberAnimated"), setTimeout((function () {
		$("#numQueued").addClass("statsNumberAnimated")
	}), 0)), $("#numFinished").text() != e.numFinished && ($("#numFinished").removeClass("statsNumberAnimated"), setTimeout((function () {
		$("#numFinished").addClass("statsNumberAnimated")
	}), 0)), $("#numDownloading").text(e.numDownloading), $("#numQueued").text(e.numQueued), $("#numFinished").text(e.numFinished)), "links" == e.message && ($("#listTable").html(""), e.links.length > 0 ? $(e.links).each((function (e, t) {
		var n, a = $('<tr class="link"><td class="checkbox"><input type="checkbox" class="checkbox"></td><td class="url"><span class="part1"></span><span class="part2"></span><span class="part3"></span></td><td class="description"></td></tr>');
		a.find("td.description").text(t.description), (n = t.url.match(/^(.*\/)?([^\/\?]+)(\?.*)$/)) ? (a.find("td.url span.part2").text(n[2]), a.find("td.url span.part3").text(n[3])) : (n = t.url.match(/^(.*\/)?([^\/\?]+)$/)) ? a.find("td.url span.part2").text(n[2]) : a.find("td.url span.part1").text(t.url), a.find("td.url").attr("title", t.url), $("#listTable").append(a)
	})) : $("#listTable").html('<tr><td class="checkbox"></td><td class="url"><span class="part3">No links found on the page.</span></span></td><td class="Description"></td></tr>'), $("#listTable input.checkbox").change((function () {
		$(this).is(":checked") ? $(this).parent().parent().addClass("green") : $(this).parent().parent().removeClass("green");
		var e = $("#listTable input.checkbox:checked").length;
		$("#startButton").text("Start download (" + e + " file" + (1 == e ? "" : "s") + ")"), e > 0 ? $("#startButton").prop("disabled", !1) : $("#startButton").prop("disabled", !0)
	})), $("#listTable tr.link").mousedown((function () {
		shift ? selectEnd = $(this).index() : (selectStart = $(this).index(), selectEnd = selectStart), selecting = !0, drawSelection()
	})), $("#listTable tr.link").mouseover((function () {
		selecting && (selectEnd = $(this).index(), drawSelection())
	})), $(document).mouseup((function () {
		selecting = !1, drawSelection()
	})), drawSelection())
}));
var selecting = !1,
	selectStart = 0,
	selectEnd = 0;

function drawSelection() {
	$("#listTable tr.link").each((function (e, t) {
		e >= Math.min(selectStart, selectEnd) && e <= Math.max(selectStart, selectEnd) ? $(t).addClass("selected") : $(t).removeClass("selected")
	}))
}
var shift = !1;

function globStringToRegex(e) {
	return new RegExp(preg_quote(e).replace(/\\\*/g, ".*").replace(/\\\?/g, "."), "g")
}

function preg_quote(e, t) {
	return (e + "").replace(new RegExp("[.\\\\+*?\\[\\^\\]$(){}=!<>|:\\" + (t || "") + "-]", "g"), "\\$&")
}
$(document).on("keyup keydown", (function (e) {
	shift = e.shiftKey
})), $(document).keypress((function (e) {
	if (32 == e.keyCode) {
		var t = !0;
		return $("#listTable tr.link.selected").find("input.checkbox").each((function (e, n) {
			$(n).is(":checked") || (t = !1)
		})), $("#listTable tr.link.selected").find("input.checkbox").prop("checked", !t).change(), !1
	}
}));