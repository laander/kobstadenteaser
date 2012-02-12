$(document).ready(function() {
	// Unsubscribed/removed from sign-up list
	$(window).load(function() {
		if (location.pathname == '/removed/') {
			signUpResponse('<span class="message"><img src="/static/images/icon-exclamation.gif" alt="Advarsel" />Du er er blevet slettet fra tilmeldingslisten.</span>');
			_gaq.push(['_trackEvent', 'Subscribers', 'Unsubscribe']);
		}		
	});
	// Navigation
	$('.button').click(function() {
		changeContent($(this).attr('rel'));
		$('.selected').removeClass('selected');
		$(this).addClass('selected');
	});
	// Change content when navigation is clicked
	function changeContent(id) {
		$('.content.visible').fadeOut(function() {
			$(this).removeClass('visible');
			$('.content[rel=' + id + ']').fadeIn().addClass('visible');
		});		
	}
	// Prepare sign up inputs
	$('form#signup input.input-email').focus(function() {
	  var input = $(this);
	  if (input.val() == input.attr('placeholder')) {
	    input.val('');
	    input.removeClass('placeholder');
	  }
	}).blur(function() {
	  var input = $(this);
	  if (input.val() == '' || input.val() == input.attr('placeholder')) {
	    input.addClass('placeholder');
	    input.val(input.attr('placeholder'));
	  }
	}).blur();
	// Sign up form submit
	$('#signup').submit(function() {
		var emailReg = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/;
		var emailInput = $("form#signup input.input-email").val();
		if(!emailReg.test(emailInput) || emailInput == "") {
			$('.validation-error').css('display', 'block');
		} else {
			$('.validation-error').hide();
			$('.input-submit').attr('disabled', 'disabled');
			var input = $('.input-submit');
			if (input.val() == input.attr('placeholder')) { input.val(''); }
			$.ajax({
			  type: 'POST',
			  url: '/signup/',
			  data: $("form#signup").serialize(),
			  success: function(data){
					if (data.message == "Success") {
						signUpResponse('<span class="message"><img src="/static/images/icon-checkmark.gif" alt="OK" />Tak for din tilmelding!</span>');
						_gaq.push(['_trackEvent', 'Subscribers', 'Quick Form']); // track sign-up in Google Analytics
					} else if (data.message == "Email already signed up") {
						signUpResponse('<span class="message"><img src="/static/images/icon-exclamation.gif" alt="Advarsel" />E-mailen er allerede tilmeldt.</span>');
					} else {
						signUpResponse('<span class="message"><img src="/static/images/icon-cross.gif" alt="Fejl" />Der gik noget galt, forsøg igen!</span>');
					}
				},
				error: function() {
					signUpResponse('<span class="message"><img src="/static/images/icon-cross.gif" alt="Fejl" />Der gik noget galt, forsøg igen!</span>');
				},
				dataType: 'json'
			});
		}		
		return false;		
	});
	// Sign up response
	function signUpResponse(message){
		$('form#signup').fadeOut(function() {
			$('form#signup').html(message);
			$('form#signup').fadeIn();
		});			
	}
});