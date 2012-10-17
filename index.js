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

//Number to word
function nToW() {
	var num = 5;
	var limit = 10000;
	
	var data = generateData(num, limit);
	generateHTML('n-', data.numbers, data.texts);	
}

//Word to number
function wToN() {
	var num = 5;
	var limit = 10000;
	
	var data = generateData(num, limit);
	for (var i = 0; i < data.texts.length; i ++) {
		data.texts[i] = data.texts[i][Math.floor(Math.random() * data.texts[i].length)];
	}
	generateHTML('w-', data.texts, data.numbers);	
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

function generateHTML(prefix, questions, answers) {
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
					$('<input>').attr('id', id).click(showToolbox(id))
				).append( generateToolbox(id) )
			)
		);
	}
	
	//Check function in closure
	(function() {
		var check = function () {
			$('.toolbox').removeClass('toolbox-active'); //Hide toolboxes
			for (var i = 0; i < answers.length; i ++) {
				var answer = $('#'+prefix+'answer-'+i).val();
				var correct = (typeof answers[i] === 'object' ? 
					answers[i].indexOf(answer) > -1 : answers[i] == answer);
				if (correct) {
						rep = $('<span>').addClass('correct').text(answer)
				}
				else {
					rep = $('<span>').addClass('wrong').html((answer ? answer : '&nbsp;') +'<br>');
					if (typeof answers[i] === 'object') {
						for (var j = 0; j < answers[i].length; j ++) {
							if (j) rep.after( $('<span>').text(' / ') );
							rep.after(
								$('<span>').addClass('correct').text(answers[i][j])
							);
						}
					}
					else {
						rep.after(
							$('<span>').addClass('correct').text(answers[i])
						);
					}
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
	
	//Init word to number
	$('#w-generate').click(wToN);
	
	//Convert init
	$('#c-form').submit(convert);
	$('#c-convert').click(convert);
	
});
