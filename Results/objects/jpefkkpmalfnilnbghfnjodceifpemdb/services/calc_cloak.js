function draw_stats(el) {
if (el.value>0) $("span[id*=_"+el.id+"]").show();
else $("span[id*=_"+el.id+"]").hide();
$("#s_"+el.id).text("+"+(+el.value));
$("#c_"+el.id).text("+"+(+el.value));
}
function draw_mods(el) {
if (el.value>0) $("span[id*=_"+el.id+"]").show();
else $("span[id*=_"+el.id+"]").hide();
$("#s_"+el.id).text("+"+el.value*15+"%");
$("#c_"+el.id).text("+"+el.value*15+"%");
}
function onchange() {
if (this.value>200) this.value=200;
switch (this.id) {
case "sila": draw_stats(this); break
case "lovka":	draw_stats(this); break
case "inta": draw_stats(this); break
case "mudra": draw_stats(this); break
case "intell": draw_stats(this); break
case "zdorovka": draw_stats(this); break
case "sokra": draw_mods(this); break
case "stoika": draw_mods(this); break
case "tochka": draw_mods(this); break
case "uvert": draw_mods(this); break
}
var vsego = 0;
var dostupno = 2000;
var c_lvl = 0;
var p_lvl = '';
var suarr = 0;
var umelka = 0;
$("input","#main").each(function(index,val) {vsego+=+val.value} )
switch (true) {
case suarr==200: c_lvl=18; umelka=70; p_lvl='XVIII'; break
case suarr>=181: c_lvl=17; umelka=65; p_lvl='XVII'; break
case suarr>=161: c_lvl=16; umelka=60; p_lvl='XVI'; break
case suarr>=141: c_lvl=15; umelka=55; p_lvl='XV'; break
case suarr>=121: c_lvl=14; umelka=50; p_lvl='XIV'; break
case suarr>=101: c_lvl=13; umelka=45; p_lvl='XIII'; break
case suarr>=91: c_lvl=12; umelka=40; p_lvl='XII'; break
case suarr>=81: c_lvl=11; umelka=36; p_lvl='XI'; break
case suarr>=71: c_lvl=10; umelka=32; p_lvl='X'; break
case suarr>=61: c_lvl=9; umelka=29; p_lvl='IX'; break
case suarr>=51: c_lvl=8; umelka=26; p_lvl='VIII'; break
case suarr>=41: c_lvl=7; umelka=23; p_lvl='VII'; break
case suarr>=31: c_lvl=6; umelka=20; p_lvl='VI'; break
case suarr>=21: c_lvl=5; umelka=17; p_lvl='V'; break
case suarr>=16: c_lvl=4; umelka=14; p_lvl='IV'; break
case suarr>=11: c_lvl=3; umelka=11; p_lvl='III'; break
case suarr>=6: c_lvl=2; umelka=8; p_lvl='II'; break
case suarr>=1: c_lvl=1; umelka=5; p_lvl='I'; break
case suarr==0: c_lvl=0; umelka=0; p_lvl=''; break
}
lvl = +$("#lvl").val();
switch (true) {
case lvl>19: dostupno=2000; break
case lvl==19: dostupno=1500; break
case lvl==18: dostupno=1100; break
case lvl==17: dostupno=800; break
case lvl==16: dostupno=550; break
case lvl==15: dostupno=300; break
case lvl==14: dostupno=200; break
case lvl==13: dostupno=160; break
case lvl==12: dostupno=130; break
case lvl==11: dostupno=100; break
case lvl==10: dostupno=80; break
case lvl==9: dostupno=70; break
case lvl==8: dostupno=50; break
case lvl==7: dostupno=40; break
case lvl==6: dostupno=20; break
case lvl==5: dostupno=10; break
}
let arr = [];
arr[0] = c_sila;
arr[1] = c_lovka;
arr[2] = c_inta;
arr[3] = s_mudra;
arr[4] = s_intell;
arr[5] = s_zdorovka;
arr[6] = s_sokra;
arr[7] = s_stoika;
arr[8] = s_tochka;
arr[9] = s_uvert;

for (let elem of arr) {
	console.log(elem); // выведет 1, undefined, undefined, undefined, 5
}
if (c_lvl>0) {
$("#p_umelka").show();
$("#s_umelka").show();
}
else {
$("#p_umelka").hide();
$("#s_umelka").hide();
}
$("#s_umelka").text("+"+parseInt(umelka)+"%");
$("#c_umelka").text("+"+parseInt(umelka)+"%");
$("#s_vsego").text(""+vsego+"/"+dostupno);
$("#cl_lvl").text(p_lvl);
if (vsego>dostupno) $("#s_vsego").css("color","red");
else $("#s_vsego").css("color","black");
var summa = 0;
$("input","#main").each(function(index,val) {summa+=(600+300*(+val.value-1))/2*(+val.value)} )
$("#summa").text(summa);
lvl_pic = (c_lvl>8) ? "10": "0"+(c_lvl+1);
if ($("#clo_img").attr("src")!="https://img.ereality.ru/70x-/w/cloak2/"+lvl_pic+".png")
$("#clo_img").attr("src","https://img.ereality.ru/70x-/w/cloak2/"+lvl_pic+".png");
}
$(document).ready(function() {
$("span[id^=p_]").hide();
$("input","#main").val("");
$("input").on("change",onchange);
$("a").on("click",function() {this.previousSibling.value='';$("#"+this.previousSibling.id).trigger("change")});
onchange();
})