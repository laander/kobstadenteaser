$(document).ready(function() {
	$('.button').click(function() {
		changeContent($(this).attr('rel'));
		$('header').fadeIn().removeClass('hidden');
		//$('#header-wrapper').animate({height: '150px'})
	});
	$('header').click(function() {
		changeContent('0');
		$('header').fadeOut().addClass('hidden');		
		//$('#header-wrapper').animate({height: '50px'})		
	});
	function changeContent(id) {
		$('.content.visible').fadeOut(function() {
			$(this).removeClass('visible');
			$('.content[rel=' + id + ']').fadeIn().addClass('visible');
		});		
	}
});