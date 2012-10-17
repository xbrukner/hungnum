//Convert function
function convert() {
	$('#c-result').html( numToString($('#c-number').val()).join(" / ") );
	return false;
}

//Generate n numbers within limit
function generateRandom(num, limit) {
	if ((limit - 1) < num) {
		alert('Too many numbers to generate within small limit');
		return [];
	}
	var res = [];
	for (var i = 0; i < num; i ++) {
		var r;
		do {
			r = Math.floor(Math.random() * (limit - 1) + 1); //Limit 1000 -> 1-999
		} while (res.indexOf(r) > -1);
		res.push(r);
	}
	return res;
}

//Generate random numbers with answers
function generateData(num, limit) {
	if (typeof limit === 'number') {
		var rand = generateRandom(num, limit);
		var texts = [];
		for (var i = 0; i < rand.length; i ++) {
			texts.push(numToString(rand[i]));
		}
		return {
			numbers: rand,
			texts: texts
		};
	}
	else {
		var res = false;
		for (var i = 0; i < num; i ++) {
			var subRes = generateData(1, limit[Math.floor(Math.random() * limit.length)]);
			if (!res) res = subRes;
			else {
				res.numbers.push(subRes.numbers[0]);
				res.texts.push(subRes.texts[0]);
			}
		}
		return res;
	}
}

function generateLimit(id) {
	var selected = parseInt($("#" + id + " input:checked").attr('id').substr(id.length));
	if (!isNaN(selected)) { //Selected number limit
		return selected;
	}
	//Selected mix
	var all = $("#" + id + " input"), res = [];
	for (var i = 0; i < all.length; i ++) {
		var limit = parseInt($(all[i]).attr("id").substr(id.length));
		if (!isNaN(limit)) res.push(limit);
	}
	return res;
}

//Number to word
function nToW() {
	var num = 5;
	var limit = generateLimit("n-limit");
	
	var data = generateData(num, limit);
	generateHTML('n-', data.numbers, data.texts, true);	
}

//Word to number
function wToN() {
	var num = 5;
	var limit = generateLimit("w-limit");
	
	var data = generateData(num, limit);
	for (var i = 0; i < data.texts.length; i ++) {
		data.texts[i] = data.texts[i][Math.floor(Math.random() * data.texts[i].length)];
	}
	generateHTML('w-', data.texts, data.numbers, false);	
}

function addLetter(id, letter) {
	return function() { 
		$("#" + id).val( $("#" + id).val() + letter ).focus(); 
	} 
}

function generateToolbox(id) {
	var res = $('<div>').attr('id', id + '-toolbox').addClass('toolbox');
	letters = "áéóúöő".split('');
	for (var i = 0; i < letters.length; i ++) {
		res.append( $('<span>').addClass('letter')
			.text(letters[i]).click(addLetter(id, letters[i])) );
	}
	return res;
}

function showToolbox(id) {
	return function () {
		$('.toolbox').removeClass('toolbox-active');
		$("#" + id + "-toolbox").addClass('toolbox-active');
	};
}

function checkIcon() {
	return $('<span>').addClass('ui-icon ui-icon-check icon');
}
function wrongIcon() {
	return $('<span>').addClass('ui-icon ui-icon-alert icon');
}
function rightIcon() {
	return $('<span>').addClass('ui-icon ui-icon-info icon');
}

function addCorrect(answer) {
	return $('<div>').addClass('ui-state-alert ui-corner-all box').append(
		$('<div>').append( checkIcon() ).append(answer)
	);
}

function addWrong(answer, correct) {
	return $('<div>').addClass('ui-state-error ui-corner-all box').append (
		$('<div>').append( wrongIcon() ).append( (answer ? answer : '&nbsp;') )
	).after( $('<div>').addClass('ui-state-alert ui-corner-all box').append(
			$('<div>').append( rightIcon() ).append( 
				(typeof correct === 'object' ? correct.join(' / ') : correct)
			)
		)
	);
}

function generateHTML(prefix, questions, answers, toolbox) {
	$('#'+prefix+'form table').children().remove();
	$('#'+prefix+'form').off('submit');
	
	//Generate questions
	for (var i = 0; i < questions.length; i ++) {
		var id = prefix+'answer-'+i;
		$('#'+prefix+'form table').append(
			$('<tr>').append(
				$('<td>').text(questions[i])
			).append(
				$('<td>').append(
					$('<input>').attr('id', id).click( (toolbox ? showToolbox(id) : $.noop ) )
				).append( (toolbox ? generateToolbox(id) : "") )
			)
		);
	}
	
	//Check function in closure
	(function() {
		var check = function () {
			if (toolbox) $('.toolbox').removeClass('toolbox-active'); //Hide toolboxes
			for (var i = 0; i < answers.length; i ++) {
				var answer = $('#'+prefix+'answer-'+i).val();
				var correct = (typeof answers[i] === 'object' ? 
					answers[i].indexOf(answer) > -1 : answers[i] == answer);
				if (correct) {
					rep = addCorrect(answer);
				}
				else {
					rep = addWrong(answer, answers[i]);
				}
				$('#'+prefix+'answer-'+i).replaceWith(rep);
			}
			return false;
		}
		$('#'+prefix+'form').one('submit', check);
		$('#'+prefix+'form table').append(
			$('<tr>').append(
				$('<td>').append(
					$('<input type="submit">').val('Check!')
				)
			)
		);
	})();
}

//Init
$(function() {
	//Init tabs
	$("#tabs").tabs();
	
	//Init number to word
	$('#n-generate').click(nToW);
	$('#n-limit').buttonset();
	
	//Init word to number
	$('#w-generate').click(wToN);
	$('#w-limit').buttonset();
	
	//Convert init
	$('#c-form').submit(convert);
	$('#c-convert').click(convert);
	
});
