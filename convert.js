var single = ["nulla" /* never used */, ["egy", ""], ["kettő", "két"], "három", "négy", "öt", "hat", "hét", "nyolc", "kilenc"]; //0 -> 9
var tens = ["tíz", "tizen", "húsz", "huszon", "harminc", "harminc", "negyven", "negyven", "ötven", "ötven",
 "hatvan", "hatvan", "hetven", "hetven", "nyolcvan", "nyolcvan", "kilencven", "kilencven"]; //10, 10+x -> 90, 90+x
var hundred = "száz";
var more = ["ezer", "millió", "milliárd"]; //1000; 1,000,000; 1,000,000,000 -> 10^(index*3 + 3)

function addToAll(arr, what) {
	if (typeof what === 'string') {
		for (var i = 0; i < arr.length; i ++) {
			arr[i] += what;
		}
		return arr;
	}
	else { //Cross-product
		var newArr = [];
		for (var i = 0; i < arr.length; i ++) {
			for (var j = 0; j < what.length; j ++) {
				newArr.push(arr[i] + what[j]);
			}
		}
		return newArr;
	}
}

function underThousand(num, notLast) { //notLast - not last digits
	var res = [''], tmp, toAdd;
	if (num >= 100) { //Hundreds
		tmp = parseInt(num / 100);
		if (tmp > 1) res = addToAll(res, single[tmp]);
		res = addToAll(res, hundred); //Add all options
	}
	tmp = num % 100;
	if (tmp >= 10) { //Tens
		res = addToAll(res, tens[(parseInt(tmp/10) - 1)*2 + (tmp % 10 ? 1 : 0)]);
	}
	tmp = num % 10;
	if (tmp) { //Last digit
		toAdd = single[tmp];
		if (typeof toAdd === 'string') {
			res = addToAll(res, toAdd);
		}
		else {
			if (notLast) res = addToAll(res, toAdd); //Add all options (egyezer + ezer)
			else res = addToAll(res, toAdd[0]); //Only add first option (egy)
		}
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
	
	var result = [''], newres, magnitude = -1, subres = [''], addDash = (num % 100000) > 2000;
	while (num) {
		subres = underThousand(num % 1000, magnitude >= 0);
		if (subres[0].length) {
			subres = addToAll(subres, (magnitude >= 0 ? more[magnitude] : "") +  //Magnitude of current number
				(magnitude == -1 || (magnitude == 0 && !addDash) ? "" : "-")); //Dash after these numbers
			result = addToAll(subres, result);
		}
		magnitude ++;
		num = parseInt(num / 1000);
	}
	
	//Strip slashes from beginning and end
	return trimSlash(result);
}

function trimSlash(str) {
	if (typeof str === 'string') {
		return str.replace(/^-*|-*$/g, "");
	}
	else {
		for (var i = 0; i < str.length; i ++) {
			str[i] = trimSlash(str[i]);
		}
		return str;
	}
}
