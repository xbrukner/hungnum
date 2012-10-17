var single = ["nulla" /* never used */, "egy", "kettö", "három", "négy", "öt", "hat", "hét", "nyolc", "kilenc"]; //0 -> 9
var tens = ["tíz", "tizen", "húsz", "huszon", "harminc", "harminc", "negyven", "negyven", "ötven", "ötven",
 "hatvan", "hatvan", "hetven", "hetven", "nyolcvan", "nyolcvan", "kilencven", "kilencven"]; //10, 10+x -> 90, 90+x
var hundred = "száz";
var more = ["ezer", "millió", "milliárd"]; //1000; 1,000,000; 1,000,000,000 -> 10^(index*3 + 3)

function underThousand(num) {
	var res = '', tmp;
	if (num >= 100) {
		tmp = parseInt(num / 100);
		res += (tmp > 1) ? single[tmp] : "";
		res += hundred;
	}
	tmp = num % 100;
	if (tmp >= 10) {
		res += tens[(parseInt(tmp/10) - 1)*2 + (tmp % 10 ? 1 : 0)];
	}
	tmp = num % 10;
	if (tmp) {
		res += single[tmp];
	}
	return res;
}

function numToString(num) {
	num = parseInt(num, 10);
	if (isNaN(num)) {
		alert("Invalid number");
		return;
	}
	if (num >= Math.pow(10, (more.length)*3 + 3)) {
		alert(num + " is to high");
		return;
	}
	
	var suffix = '', magnitude = -1, subres = "";
	while (num) {
		subres = underThousand(num % 1000);
		if (subres) {
			suffix = (magnitude == -1 && (num % 100000) <= 2000 ? "" : "-")
				+ subres + (magnitude >= 0 ? more[magnitude] : "") + suffix;
		}
		magnitude ++;
		num = parseInt(num / 1000);
	}
	
	//Strip slashes from beginning and end
	return trimSlash(suffix);
}

function trimSlash(str) {
	return str.replace(/^-*|-*$/g, "");
}
