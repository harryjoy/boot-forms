(function($){
	var about = {
		"name": "Boot Forms",
		"description": "Bootstrap form generator plugin.",
		"keywords": ["bootstrap", "feedback-form", "contact-form", "form", "jQuery"],
        "version": "1.0",
        "author": {
        	"name": "Harsh Raval"
        },
        "created on": "28 Feb 2014",
        "licenses": ["MIT"],
        "homepage": "https://github.com/harryjoy/boot-forms",
        "issues": "https://github.com/harryjoy/boot-forms/issues",
        "wiki": "https://github.com/harryjoy/boot-forms/wiki",
        "dependencies": ["jquery", "bootstrap"]
	};
	jQuery.fn.extend({
		bootforms : function(formtype, options) {
			try {
				if (!validateFormType(formtype)) {throw new InvalidOptionsException("Form type is not valid.");}
				if (typeof options === "object" || !options) {
					validateOptions(options);
					setPropertiesToElem(this);
					var defaults = {};
					if (formtype === 'contact') {
						defaults = {
							form_elems : [ {
								'name' : 'forms-name',
								'type' : 'text',
								'id' : 'forms-name',
								'placeholder' : 'Name'
							}, {
								'name' : 'forms-email',
								'type' : 'email',
								'id' : 'forms-email',
								'placeholder' : 'Email'
							}, {
								'name' : 'forms-message',
								'type' : 'textarea',
								'id' : 'forms-message',
								'placeholder' : 'Message'
							} ]
						};
					} else if (formtype === 'followme') {
						defaults = {
							form_elems : [ {
								'name' : 'forms-email',
								'type' : 'email',
								'id' : 'forms-email',
								'placeholder' : 'Email'
							} ]
						};
					} else if (formtype === 'login') {
						defaults = {
							form_elems : [ {
								'name' : 'forms-name',
								'type' : 'text',
								'id' : 'forms-name',
								'placeholder' : 'Name',
								'class': 'bootform-element-username'
							}, {
								'name' : 'forms-password',
								'type' : 'password',
								'id' : 'forms-password',
								'placeholder' : 'Password',
								'class': 'bootform-element-password'
							} ]
						};
					} else if (formtype === 'search') {
						defaults = {
							form_elems : [ {
								'name' : 'forms-search',
								'type' : 'text',
								'id' : 'forms-search',
								'placeholder' : 'Search',
								'class': 'bootform-element-search'
							} ]
						};
					} else if (formtype === 'social') {
						defaults = {
							form_elems : []
						};
					}
					options = $.extend(true, defaults, options);
					return startPreview(this, options, formtype);
				} else {
					return about;
				}
			} catch (e) {
				var errorBox = new FormErrorBox("<b>Error:</b> " + e.message);
				$(this).append(errorBox.get());
			}
		}
	});
	var VALID_FORM_TYPES = ['contact', 'login', 'followme', 'search', 'social'];
	var VALID_TYPES = ['text', 'password', 'textarea', 'checkbox', 'radio', 'select'];
	var VALID_POSITIONS = ['top-left', 'top-right', 'top-center', 'bottom-left', 'bottom-right', 'bottom-center'];
	var DISPLAY_TYPE_OPEN = 'open';
	var DISPLAY_TYPE_CLOSE = 'close';
	var validateOptions = function (options) {
	};
	var validateElementType = function (type) {
		return $.inArray(type, VALID_TYPES) > -1;
	};
	var validatePosition = function (type) {
		return $.inArray(type, VALID_POSITIONS) > -1;
	};
	var validateFormType = function (type) {
		return $.inArray(type, VALID_FORM_TYPES) > -1;
	};
	/**
	 * Check and set required properties to element.
	 */
	var setPropertiesToElem = function (elem) {
		$(elem).addClass("boot-form-main");
	};
	/**
	 * Start building and previewing the things.
	 */
	var startPreview = function (elem, options, formtype) {
		var defaults = { 
			text: {
				open: '',
				close: '',
				heading: '',
				tagline: ''
			},
			form: {},
			attach: true,
			cancel : true,
			form_elems : [],
			social: {
				facebook: "images/social/facebook.png",
				twitter: "images/social/twitter.png",
				gplus: "images/social/google-plus.png",
				pinterest: "images/social/pinterest.png",
				rss: "images/social/rss-feeds.png",
				mail: "images/social/email.png",
				links: {
					facebook: "#",
					twitter: "#",
					gplus: "#",
					pinterest: "#",
					rss: "#",
					mail: "#"
				},
				titles: {
					facebook: "Facebook",
					twitter: "Twiiter",
					gplus: "Google Plus",
					pinterest: "Pinterest",
					rss: "RSS",
					mail: "EMail"
				}
			}
		};
 		options = $.extend(true, defaults, options);
		var mainElem = $(elem);
		mainElem.html("");
		var mainElemId = mainElem.attr('id');

		var bootform = new FormContainer(options);
		var form = new FormMain(options);
		var mainForm = form.get();

		var heading = new FormHeadingWrapper(options, 'boot-form-id', mainElemId, formtype);
		mainForm.append(heading.get());

		var elems = options.form_elems;
		if (elems && elems !== undefined && elems.length > 0) {
			for (var i = 0; i < elems.length; i++){
				var formElem = new FormElementWrapper(options, 'boot-form-id', elems[i]);
				mainForm.append(formElem.get());
			}
		}

		var formCancelButton = undefined;
		var socialElem = undefined;
		if (formtype !== "social") {
			var formSubmitButton = new FormSubmitButton(options);
			var formButtonContainer = new FormButtonContainer();
			formButtonContainer.get().append(formSubmitButton.get());
			formCancelButton = new FormCancelButton(options, mainElemId);
			formButtonContainer.get().append(formCancelButton.get());
			mainForm.append(formButtonContainer.get());
		} else {
			socialElem = new FormSocialContainer(options, mainElemId);
			mainForm.append(socialElem.get());
		}
		
		var attach = options.attach;
		if (attach) {
			var toggleElem = new FormToggleWrapper(options, 'boot-form-id', mainElemId, formtype);
			mainElem.after(toggleElem.get());
			if (formCancelButton && formCancelButton !== undefined)
				formCancelButton.setToggleElement(toggleElem);
			if (socialElem && socialElem !== undefined)
				socialElem.setToggleElement(toggleElem);
		} else {
			
		}

		var formBottomClear = new FormBottomClear();
		mainElem.append(bootform.get().append(mainForm).append(formBottomClear.get()));
		return this;
	};
	/**
	 * Boot form container reference.
	 * @param options
	 */
	FormContainer = function (options) {
		this.formContainer = undefined;
		this.options = options;
		this.setOptions = function () {
		};
		this.draw = function () {
			this.formContainer = $("<div></div>").addClass("boot-form-container");
			this.setOptions();
		};
		this.get = function () {
			if (this.formContainer && this.formContainer !== undefined){
			} else {this.draw();}
			return this.formContainer;
		};
		this.getOptions = function () {
			return this.options;
		};
	};
	/**
	 * Form container reference.
	 * @param options
	 */
	FormMain = function (options) {
		this.form = undefined;
		this.options = options;
		this.setOptions = function () {
		};
		this.draw = function () {
			this.form = $("<form></form>").attr('id', 'boot-form-id').addClass("boot-form");
			var opts = this.options.form;
			if (opts !== undefined) {
				var self = this;
				$.each(opts, function (key, value){
					self.form.attr(key, value);
				});
			}
			this.setOptions();
		};
		this.get = function () {
			if (this.form && this.form !== undefined){
			} else {this.draw();}
			return this.form;
		};
		this.getOptions = function () {
			return this.options;
		};
	};
	/**
	 * Form bottom clear reference.
	 * @param options
	 */
	FormBottomClear = function () {
		this.form = undefined;
		this.draw = function () {
			this.form = $("<div></div>").addClass("boot-form-clear");
		};
		this.get = function () {
			if (this.form && this.form !== undefined){
			} else {this.draw();}
			return this.form;
		};
	};
	/**
	 * Form bottom clear reference.
	 * @param options
	 */
	FormErrorBox = function (message) {
		this.form = undefined;
		this.message = message;
		this.draw = function () {
			this.form = $("<div></div>").addClass("boot-form-error-box alert alert-danger").html(this.message);
		};
		this.get = function () {
			if (this.form && this.form !== undefined){
			} else {this.draw();}
			return this.form;
		};
	};
	/**
	 * Form bottom clear reference.
	 * @param options
	 */
	FormSocialContainer = function (options, mainElemId) {
		this.form = undefined;
		this.toggleElement = undefined;
		this.options = options;
		this.mainElemId = mainElemId;
		this.draw = function () {
			this.form = $("<div></div>").addClass("boot-form-social-container").addClass("row");
			this.initiateSocialButtons();
			this.initiateCloseButton();
		};
		this.initiateCloseButton = function () {
			var closeBtn = $("<div></div>").addClass("boot-form-social-close").text("X");
			this.form.append(closeBtn);
			var self = this;
			closeBtn.bind('click', function() {
				if (self.options.attach && self.toggleElement !== undefined) {
					$("#" + self.mainElemId).slideUp("slow");
					self.toggleElement.toggleLinks();
				} else {
					$("#" + self.mainElemId).hide();
				}
			});
		};
		this.initiateSocialButtons = function () {
			var fbContainer = $("<div></div>").addClass("col-md-2");
			var fbLink = $("<a></a>").addClass("boot-form-social-img-link")
					.attr("href", "" + this.options.social.links.facebook)
					.attr("title", "" + this.options.social.titles.facebook);
			var fb = $("<img/>").addClass("boot-form-social-img").attr("src", "" + this.options.social.facebook);
			fbLink.append(fb);
			fbContainer.append(fbLink);
			this.form.append(fbContainer);

			var twContainer = $("<div></div>").addClass("col-md-2");
			var twLink = $("<a></a>").addClass("boot-form-social-img-link")
					.attr("href", "" + this.options.social.links.twitter)
					.attr("title", "" + this.options.social.titles.twitter);
			var tw = $("<img/>").addClass("boot-form-social-img").attr("src", "" + this.options.social.twitter);
			twLink.append(tw);
			twContainer.append(twLink);
			this.form.append(twContainer);
			
			var gmContainer = $("<div></div>").addClass("col-md-2");
			var gmLink = $("<a></a>").addClass("boot-form-social-img-link")
					.attr("href", "" + this.options.social.links.gplus)
					.attr("title", "" + this.options.social.titles.gplus);
			var gm = $("<img/>").addClass("boot-form-social-img").attr("src", "" + this.options.social.gplus);
			gmLink.append(gm);
			gmContainer.append(gmLink);
			this.form.append(gmContainer);
			
			var pinContainer = $("<div></div>").addClass("col-md-2");
			var pinLink = $("<a></a>").addClass("boot-form-social-img-link")
					.attr("href", "" + this.options.social.links.pinterest)
					.attr("title", "" + this.options.social.titles.pinterest);
			var pin = $("<img/>").addClass("boot-form-social-img").attr("src", "" + this.options.social.pinterest);
			pinLink.append(pin);
			pinContainer.append(pinLink);
			this.form.append(pinContainer);
			
			var mailContainer = $("<div></div>").addClass("col-md-2");
			var mailLink = $("<a></a>").addClass("boot-form-social-img-link")
					.attr("href", "" + this.options.social.links.mail)
					.attr("title", "" + this.options.social.titles.mail);
			var mail = $("<img/>").addClass("boot-form-social-img").attr("src", "" + this.options.social.mail);
			mailLink.append(mail);
			mailContainer.append(mailLink);
			this.form.append(mailContainer);
			
			var rssContainer = $("<div></div>").addClass("col-md-2");
			var rssLink = $("<a></a>").addClass("boot-form-social-img-link")
					.attr("href", "" + this.options.social.links.rss)
					.attr("title", "" + this.options.social.titles.rss);
			var rss = $("<img/>").addClass("boot-form-social-img").attr("src", "" + this.options.social.rss);
			rssLink.append(rss);
			rssContainer.append(rssLink);
			this.form.append(rssContainer);
		};
		this.get = function () {
			if (this.form && this.form !== undefined){
			} else {this.draw();}
			return this.form;
		};
		this.setToggleElement = function (toggleElement) {
			this.toggleElement = toggleElement;
		};
	};
	/**
	 * Form bottom clear reference.
	 * @param options
	 */
	FormButtonContainer = function () {
		this.form = undefined;
		this.draw = function () {
			this.form = $("<div></div>").addClass("boot-form-button-container");
		};
		this.get = function () {
			if (this.form && this.form !== undefined){
			} else {this.draw();}
			return this.form;
		};
	};
	/**
	 * Form submit button reference.
	 * @param options
	 */
	FormSubmitButton = function (options) {
		this.btn = undefined;
		this.options = options;
		this.setOptions = function () {
		};
		this.draw = function () {
			this.btn = $("<input>").attr('type', 'submit').val("Submit").text("Submit")
					.addClass("boot-form-button btn btn-success bootform-element-btn-submit");
			this.setOptions();
		};
		this.get = function () {
			if (this.btn && this.btn !== undefined){
			} else {this.draw();}
			return this.btn;
		};
		this.getOptions = function () {
			return this.options;
		};
	};
	/**
	 * Form cancel button reference.
	 * @param options
	 */
	FormCancelButton = function (options, mainElemId) {
		this.btn = undefined;
		this.options = options;
		this.mainElemId = mainElemId;
		this.toggleElement = undefined;
		this.setOptions = function () {
		};
		this.draw = function () {
			this.btn = $("<button></button>").val("Cancel").text("Cancel")
					.attr('type', 'button').addClass("boot-form-button btn btn-danger bootform-element-btn-cancel");
			var self = this;
			this.btn.click(function(){
		        if (self.options.attach && self.toggleElement !== undefined) {
		        	$("#" + self.mainElemId).slideUp("slow");
		        	self.toggleElement.toggleLinks();
		        } else {
		        	$("#" + self.mainElemId).hide();
		        }
		    });
			this.setOptions();
		};
		this.get = function () {
			if (this.btn && this.btn !== undefined){
			} else {this.draw();}
			return this.btn;
		};
		this.getOptions = function () {
			return this.options;
		};
		this.setToggleElement = function (toggleElement) {
			return this.toggleElement = toggleElement;
		};
		this.getToggleElement = function () {
			return this.toggleElement;
		};
	};
	/**
	 * Form heading wrapper reference.
	 * @param options
	 */
	FormHeadingWrapper = function (options, formId, mainElemId, formtype) {
		this.elem = undefined;
		this.formId = formId;
		this.options = options;
		this.mainElemId = mainElemId;
		this.formtype = formtype;
		this.setOptions = function () {
		};
		this.draw = function () {
			this.elem = $("<div></div>").addClass("boot-form-header-wrapper");
			var headingElem = new FormHeading(this.options, this.formId, this.mainElemId, this.formtype);
			this.elem.append(headingElem.get());
			var tagline = new FormTagline(this.options, this.formtype);
			this.elem.append(tagline.get());
			this.setOptions();
		};
		this.get = function () {
			if (this.elem && this.elem !== undefined){
			} else {this.draw();}
			return this.elem;
		};
		this.getOptions = function () {
			return this.options;
		};
		this.getFormId = function () {
			return this.formId;
		};
		this.getElem = function () {
			return this.elem;
		};
		this.getMainElemId = function () {
			return this.mainElemId;
		};
		this.getFormtype = function () {
			return this.formtype;
		};
	};
	/**
	 * Form tagline reference.
	 * @param options
	 */
	FormTagline = function (options, formtype) {
		this.elem = undefined;
		this.options = options;
		this.formtype = formtype;
		this.setOptions = function () {
			var headText = this.options.text.tagline;
			if (headText === undefined || headText.length === 0) {
				headText = getTaglineText(this.formtype);
			}
			this.elem.html(headText);
		};
		this.draw = function () {
			this.elem = $("<div></div>").addClass("boot-form-tagline");
			this.setOptions();
		};
		this.get = function () {
			if (this.elem && this.elem !== undefined){
			} else {this.draw();}
			return this.elem;
		};
		this.getOptions = function () {
			return this.options;
		};
		this.getElem = function () {
			return this.elem;
		};
		this.getFormtype = function () {
			return this.formtype;
		};
	};
	/**
	 * Form heading reference.
	 * @param options
	 */
	FormHeading = function (options, formId, mainElemId, formtype) {
		this.elem = undefined;
		this.formId = formId;
		this.options = options;
		this.mainElemId = mainElemId;
		this.formtype = formtype;
		this.setOptions = function () {
			var headText = this.options.text.heading;
			if (headText === undefined || headText.length === 0) {
				headText = getHeadingText(this.formtype);
			}
			this.elem.html(headText);
		};
		this.draw = function () {
			this.elem = $("<h2></h2>").addClass("boot-form-header");
			this.setOptions();
		};
		this.get = function () {
			if (this.elem && this.elem !== undefined){
			} else {this.draw();}
			return this.elem;
		};
		this.getOptions = function () {
			return this.options;
		};
		this.getFormId = function () {
			return this.formId;
		};
		this.getElemName = function () {
			return this.elemName;
		};
		this.getElemType = function () {
			return this.elemType;
		};
		this.getElem = function () {
			return this.elem;
		};
		this.getMainElemId = function () {
			return this.mainElemId;
		};
		this.getFormtype = function () {
			return this.formtype;
		};
	};
	/**
	 * Form element wrapper reference.
	 * @param options
	 */
	FormElementWrapper = function (options, formId, element) {
		this.elem = undefined;
		this.formId = formId;
		this.options = options;
		this.elemName = element.name;
		this.elemType = element.type;
		this.element = element;
		this.setOptions = function () {
		};
		this.draw = function () {
			this.elem = $("<div></div>").addClass("boot-form-element-wrapper");
			var formElem = new FormElement(this.options, this.formId, this.element);
			this.elem.append(formElem.get());
			this.setOptions();
		};
		this.get = function () {
			if (this.elem && this.elem !== undefined){
			} else {this.draw();}
			return this.elem;
		};
		this.getOptions = function () {
			return this.options;
		};
		this.getFormId = function () {
			return this.formId;
		};
		this.getElemName = function () {
			return this.elemName;
		};
		this.getElemType = function () {
			return this.elemType;
		};
		this.getElement = function () {
			return this.element;
		};
	};
	/**
	 * Form toggle element wrapper reference.
	 * @param options
	 */
	FormToggleWrapper = function (options, formId, mainElemId, formtype) {
		this.elem = undefined;
		this.formId = formId;
		this.options = options;
		this.openLink = undefined;
		this.closeLink = undefined;
		this.mainElemId = mainElemId;
		this.formtype = formtype;
		this.setOptions = function () {
		};
		this.draw = function () {
			this.elem = $("<div></div>").addClass("boot-form-toggle-element-wrapper");
			this.openLink = new FormToggleElement(this.options, this.formId, DISPLAY_TYPE_OPEN, this, this.mainElemId, this.formtype);
			this.elem.append(this.openLink.get());
			this.closeLink = new FormToggleElement(this.options, this.formId, DISPLAY_TYPE_CLOSE, this, this.mainElemId, this.formtype);
			this.elem.append(this.closeLink.get());
			this.setOptions();
		};
		this.get = function () {
			if (this.elem && this.elem !== undefined){
			} else {this.draw();}
			return this.elem;
		};
		this.getOptions = function () {
			return this.options;
		};
		this.getFormId = function () {
			return this.formId;
		};
		this.getCloseLink = function () {
			return this.closeLink;
		};
		this.getOpenLink = function () {
			return this.openLink;
		};
		this.getMainElemId = function () {
			return this.mainElemId;
		};
		this.getFormtype = function () {
			return this.formtype;
		}
		this.toggleLinks = function () {
			//this.closeLink.get().slideToggle();
			this.openLink.get().slideToggle();
		};
	};
	/**
	 * Form toggle element reference.
	 * @param options
	 */
	FormToggleElement = function (options, formId, displayType, parent, mainElemId, formtype) {
		this.elem = undefined;
		this.formId = formId;
		this.options = options;
		this.displayType = displayType;
		this.parent = parent;
		this.mainElemId = mainElemId;
		this.formtype = formtype;
		this.setOptions = function () {
			var self = this;
			if (self.displayType === DISPLAY_TYPE_OPEN) {
				if (formtype !== "social") {
					var openText = self.options.text.open;
					if (openText === undefined || openText.length === 0) {
						openText = getHeadingText(self.formtype);
					}
					self.elem.html(openText);
				} else {
					self.elem.html("<span class='glyphicon glyphicon-share'></span>");
				}
				self.elem.click(function(){
					$("#" + self.mainElemId).slideDown("slow", function() {
						self.parent.getCloseLink().get().css('bottom', $("#" + self.mainElemId).css('height'));
					});
					self.parent.toggleLinks();
				});
			} else if (self.displayType === DISPLAY_TYPE_CLOSE) {
				self.elem.html(this.options.text.close);
				self.elem.click(function(){
					$("#" + self.mainElemId).slideUp("slow");
					self.parent.toggleLinks();
				});
			}
		};
		this.draw = function () {
			this.elem = $("<a></a>").attr('id', this.formId + "-" + this.displayType)
				.attr('href', 'javascript:;').addClass("boot-form-toogle-element");
			this.elem.addClass("boot-form-toogle-element-" + this.displayType);
			this.setOptions();
		};
		this.get = function () {
			if (this.elem && this.elem !== undefined){
			} else {this.draw();}
			return this.elem;
		};
		this.getMainElemId = function () {
			return this.mainElemId;
		};
		this.getOptions = function () {
			return this.options;
		};
		this.getFormId = function () {
			return this.formId;
		};
		this.getParent = function () {
			return this.parent;
		};
	};
	/**
	 * Form element reference.
	 * @param options
	 */
	FormElement = function (options, formId, element) {
		this.elem = undefined;
		this.formId = formId;
		this.options = options;
		this.elemName = element.name;
		this.elemType = element.type;
		this.element = element;
		this.setOptions = function () {
		};
		this.draw = function () {
			if (this.elemType !== 'textarea') {
				this.elem = $("<input/>").attr('type', this.elemType)
					.attr('name', this.elemName).addClass("boot-form-element form-control");
			} else {
				this.elem = $("<textarea/>").attr('name', this.elemName).addClass("boot-form-element form-control boot-form-element-area");
				this.elem.css('height', '100px');
			}
			this.setCustomAttributes();
			this.setOptions();
		};
		this.setCustomAttributes = function () {
			var self = this;
			$.each(this.element, function (key, value){
				 if (key === "attr") { 
					 var attrs = value;
					 if (attrs && attrs !== undefined && attrs.length > 0) {
						 $.each(attrs, function (k, v) {
							 $.each(v, function (ky, val) {
								 self.elem.attr(ky, val);
							 });
						 });
					 }
				 } else if (key === "class"){
					 self.elem.addClass(value);
				 } else {
					 self.elem.attr(key, value);
				 }
			});
		};
		this.get = function () {
			if (this.elem && this.elem !== undefined){
			} else {this.draw();}
			return this.elem;
		};
		this.getOptions = function () {
			return this.options;
		};
		this.getFormId = function () {
			return this.formId;
		};
		this.getElemName = function () {
			return this.elemName;
		};
		this.getElemType = function () {
			return this.elemType;
		};
		this.getElement = function () {
			return this.element;
		};
	};
	/**
	 * Function for custom exception for invalid shape.
	 * @param message
	 * @returns
	 */
	function InvalidOptionsException(message) {
		this.message = message;
	}
	/**
	 * Get heading text based on form type.
	 */
	function getHeadingText(formtype) {
		if (formtype === 'contact') {
			return "Contact us";
		} else if (formtype === 'followme') {
			return "Follow Me";
		} else if (formtype === 'login') {
			return "Login";
		} else if (formtype === 'search') {
			return "Search";
		}
		return "";
	}
	/**
	 * Get tagline text based on form type.
	 */
	function getTaglineText(formtype) {
		if (formtype === 'contact') {
			return "Drop us a line.";
		} else if (formtype === 'followme') {
			return "Follow me to get latest updates.";
		} else if (formtype === 'login') {
			return "Enter valid username and password to login.";
		} else if (formtype === 'search') {
			return "Search anything on this site.";
		}
		return "";
	}
})(jQuery);