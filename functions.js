(function($) {
	$.fn.password_strength = function(params) {
		params = $.extend({lowClass:"low_security", midClass:"middle_security", higClass:"high_security"}, params);
		
		var password = $(this).val();
		
		if (typeof password == "undefined") {
			return this;
		}
		
		// On calcule le nombre de caractères
		var length = password.length;
		
		this.each(function() {
			// Nombre de lettres en majuscule
			var temp = password.match(/[A-Z]+/g);
			var nbMaj = 0;
			if (temp != null) nbMaj = temp[0].length;
			
			// Nombre de lettres en minuscule
			temp = password.match(/[a-z]+/g);
			var nbMin = 0;
			if (temp != null) nbMin = temp[0].length;
			
			// Nombres de chiffres
			temp = password.match(/[0-9]+/g);
			var nbNum = 0;
			if (temp != null) nbNum = temp[0].length;
			
			// Nombre de caractères spéciaux
			var nbSpe = length - (nbMaj + nbMin + nbNum);
			
			var force = 100;
			
			if (length < 2) force -= 100;
			if (length >= 2 && length < 4) force -= 90;
			if (length >= 4 && length < 6) force -= 60;
			if (length >= 6 && length < 8) force -= 40;
			if (length >= 8 && length < 10) force -= 20;
	
			if (nbMaj == 0) force -= 16;
			if (nbMin == 0) force -= 16;
			if (nbNum == 0) force -= 16;
			if (nbSpe == 0) force -= 16;
			
			if ($("#" + params.item).length) {
				$("#" + params.item).removeClass(params.lowClass);
				$("#" + params.item).removeClass(params.midClass);
				$("#" + params.item).removeClass(params.higClass);
	
				if (force >= 66) $("#" + params.item).addClass(params.higClass); 						
				if (force >= 33 && force < 66) $("#" + params.item).addClass(params.midClass); 						
				if (force < 33) $("#" + params.item).addClass(params.lowClass);
			}
		});
		return this;
	};
})(jQuery);

$('document').ready( function(){
	// Init active menu current page
	//$('.'+current_page).addClass('active');

	// Languages
	$('.lang_en').click(function(){
		$.cookie("lang", "en", { path: "/" , domain: "."+cookie_url});
	});
	$('.lang_fr').click(function(){
		$.cookie("lang", "fr", { path: "/" , domain: "."+cookie_url});
	});
	
	// Sponsorship
	$('.signupForm .sponsorship_action').click(function(){
		$('.signupForm #sponsorship').show();
	});
	
	// Check password strength
	$(".signupForm input#password").password_strength({
			"lowClass": "btn-danger",
			"midClass": "btn-warning",
			"higClass": "btn-success",
			"item": "password_icon"
		});
	
	$(".signupForm input#password").bind("keyup", function() {
		$(this).password_strength({
			"lowClass": "btn-danger",
			"midClass": "btn-warning",
			"higClass": "btn-success",
			"item": "password_icon"
		});
	});

	$(".confirm_request input#password").password_strength({
			"lowClass": "btn-danger",
			"midClass": "btn-warning",
			"higClass": "btn-success",
			"item": "password_icon"
		});
	
	$(".confirm_request input#password").bind("keyup", function() {
		$(this).password_strength({
			"lowClass": "btn-danger",
			"midClass": "btn-warning",
			"higClass": "btn-success",
			"item": "password_icon"
		});
	});
	
	// Signup
	$('#resend_confirm_mail').on('click', function(){
		$.ajax({
			type:'post',
			url: racine_https + 'fr/resend_mail',
			data: {
				user_token: $(this).closest("div[data-user-tooken]").attr('data-user-tooken')
			},
			dataType: "json",
			success: function(data){
				if(data.error == 0){
					//mail envoyé
					$("#error").removeClass().addClass('bs-callout bs-callout-success').html("Email resent");
				}else{
					//mail pas envoyé
					$("#error").removeClass().addClass('bs-callout bs-callout-danger').html("Error: Email not resent");	
				}
			}
		});
	});
	
	$('#change_mail').on('click', function(){
		var mail = $(this).closest("div[data-user-mail]").attr('data-user-mail');
		
		var	content = '<div class="row">';
			content += '<div class="col-lg-6">';
			content += '<input type="text" value="'+mail+'" class="form-control" id="mail_to_change" name="mail" >';
			content += '</div>';
			content += '<div class="btn-group">';
			content += '<button class="btn btn-default"  id="cancel_change_mail" type="button">Cancel</button>';
			content += '<button class="btn btn-success"  id="confirm_change_mail"  type="button">Change and resend</button>';
			content += '</div>';
			content += '</div>';
		$('#user_mail').html(content);
		
		$('#cancel_change_mail').on('click', function(){
			$('#user_mail').html('<strong>'+mail+'</strong>');
		});
		
		$('#confirm_change_mail').on('click', function(){
			console.log($(this).closest("div[data-user-tooken]").attr('data-user-tooken'));
			$.ajax({
				type:'post',
				url: racine_https + 'fr/change_mail',
				data: {
					user_token: $(this).closest("div[data-user-tooken]").attr('data-user-tooken'),
					mail: $('#mail_to_change').val()
				},
				dataType: "json",
				success: function(data){
					if(data.error == 0){
						$('#error').removeClass().addClass('bs-callout bs-callout-success').html("Email changed and resent");
						$('#user_mail').html('<strong>'+data.mail+'</strong>');	
						$('#change_mail').closest("div[data-user-mail]").attr('data-user-mail', data.mail);
					}else{
						$('#error').removeClass().addClass('bs-callout bs-callout-danger').html("Error: Email not changed");	
					}
				}
			});
		});
	});

	// onScroll fix navbar article
	var navbar = $(".navbar");
	$(window).scroll(function() {    
		var scroll = $(window).scrollTop();
		if (scroll >= 380) {
			navbar.removeClass('navbar-static-top').addClass("navbar-fixed-top");
			$('.navbar-right .system').removeClass('hide');
			$('.navbar-right .dropdown').addClass('hide');
		} else {
			navbar.removeClass("navbar-fixed-top").addClass('navbar-static-top');
			$('.navbar-right .system').addClass('hide');
			$('.navbar-right .dropdown').removeClass('hide');
		}
	});

	// Home page - Click to scroll down smoothly
	$('a[href*=#]:not([href=#])').click(function() {
		if (location.pathname.replace(/^\//,'') == this.pathname.replace(/^\//,'') && location.hostname == this.hostname) {
			var target = $(this.hash);
			target = target.length ? target : $('[name=' + this.hash.slice(1) +']');
			if (target.length) {
				$('html,body').animate({
					scrollTop: target.offset().top
				}, 1000);
				return false;
			}
		}
	});
	// Home page - Getmore Hover to scroll down smoothly
	$('a.getmore[href*=#]:not([href=#])').click(function() {
		if (location.pathname.replace(/^\//,'') == this.pathname.replace(/^\//,'') && location.hostname == this.hostname) {
			var target = $(this.hash);
			target = target.length ? target : $('[name=' + this.hash.slice(1) +']');
			if (target.length) {
				$('html,body').animate({
					scrollTop: target.offset().top
				}, 1000);
				return false;
			}
		}
	});	
	/*
	* Async Sharing Buttons (G+, Facebook, Twitter)
	* http://www.narga.net/load-social-button-javascript-asynchronously/
	* Simple JavaScript function that loads the third-party scripts asynchronously and after the page loads to improve site performance.
	*/
	(function(doc, script) {
	    var js, fjs = doc.getElementsByTagName(script)[0],
	        frag = doc.createDocumentFragment(),
	        add = function(url, id) {
	            if (doc.getElementById(id)) {
	                return;
	            }
	            js = doc.createElement(script);
	            js.src = url;
	            id && (js.id = id);
	            frag.appendChild(js);
	        };
		// Google+ Page
		//add('https://apis.google.com/js/platform.js');
	    // Facebook SDK
	    //add('https://connect.facebook.net/en_US/all.js#xfbml=1&appId=200103733347528', 'facebook-jssdk');
	    // Twitter SDK
	    //add('https://platform.twitter.com/widgets.js');
	
	    fjs.parentNode.insertBefore(frag, fjs);
	}(document, 'script'));
});