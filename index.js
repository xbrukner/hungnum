//Init
function convert() {
	$('#result').html(numToString($('#number').val()));
	return false;
}
$(function() {
	$('#form').submit(convert);
	$('#convert').click(convert);
});
