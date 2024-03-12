$(document).ready(function() {
for (var i=1;i<1297;i++) {
if ((i<347 || i>702) && (i<704 || i>=705) && (i<706 || i>781) && (i<1030 || i>=1031) && (i<1102 || i>=1103) && (i<1120 || i>=1121) && (i<1148 || i>=1149) && (i<1217 || i>=1218))  
{
		$("body").append($("<img>", {src: "https://img.ereality.ru/smile/p/"+i+".gif"}));
}
}
});