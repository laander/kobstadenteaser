$(document).ready(function() {
	$('.button').click(function() {
		var button = this;
		//$('header').fadeIn().removeClass('hidden');
		//$('#header-wrapper').animate({height: '150px'}, function() {
			changeContent($(button).attr('rel'));
		//});
	});
	$('header').click(function() {
		//$('header').fadeOut().addClass('hidden');		
		//$('#header-wrapper').animate({height: '50px'}, function() {
			
		//});

		changeContent('0');

	});
	function changeContent(id) {
		$('.content.visible').fadeOut(function() {
			$(this).removeClass('visible');
			$('.content[rel=' + id + ']').fadeIn().addClass('visible');
		});		
	}
});