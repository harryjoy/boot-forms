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
		bootforms : function(options) {
			try {
				if (typeof options==="object" || !options) {
					validateOptions(options);
					setPropertiesToElem(this);
					return startPreview(this, options);
				} else{
					return about;
				}
			} catch (e) {
				var errorBox = new FormErrorBox("<b>Error:</b> " + e.message);
				$(this).append(errorBox.get());
			}
		}
	});
	var VALID_TYPES = ['text', 'password', 'textarea', 'checkbox', 'radio', 'select'];
	var validateOptions = function (options) {
		var elems = options.form_elems;
		if (elems && elems !== undefined && elems.length > 0) {
			for (var i = 0; i < elems.length; i++){
				var name = elems[i].name; 
				var type = elems[i].type;
				if (!validateElementType(type))
					throw new InvalidOptionsException("Form element type is not valid for " + name + ".");
			}
		} else {
			throw new InvalidOptionsException("No form elements provided. Minimum one form element is required.");
		}
	};
	var validateElementType = function (type) {
		return $.inArray(type, VALID_TYPES) > -1;
	};
	/**
	 * Check and set required properties to element.
	 */
	var setPropertiesToElem = function (elem) {
		$(elem).addClass("boot-form-main");
	};
	/**
	 * 
	 */
	var startPreview = function (elem, options) {
		var defaults = { 
			width:false,
			height:false,
			form: {},
			form_elems: []
		},
 		options = $.extend(true, defaults, options);
		var bootform = new FormContainer(options);
		var form = new FormMain(options);
		var mainForm = form.get();

		var elems = options.form_elems;
		if (elems && elems !== undefined && elems.length > 0) {
			for (var i = 0; i < elems.length; i++){
				var formElem = new FormElementWrapper(options, 'boot-form-id', elems[i]);
				mainForm.append(formElem.get());
			}
			var formSubmitButton = new FormSubmitButton(options);
			var formCancelButton = new FormCancelButton(options);
			var formButtonContainer = new FormButtonContainer();
			formButtonContainer.get().append(formSubmitButton.get());
			formButtonContainer.get().append(formCancelButton.get());
			mainForm.append(formButtonContainer.get());
		}

		var mainElem = $(elem);
		mainElem.html("");
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
			this.btn = $("<button></button>").val("Submit").text("Submit")
					.attr('type', 'button').addClass("boot-form-button btn btn-success");
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
	FormCancelButton = function (options) {
		this.btn = undefined;
		this.options = options;
		this.setOptions = function () {
		};
		this.draw = function () {
			this.btn = $("<button></button>").val("Cancel").text("Cancel")
					.attr('type', 'button').addClass("boot-form-button btn btn-danger");
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
			this.elem = $("<input/>").attr('placeholder', this.elemName).attr('type', this.elemType)
					.attr('name', this.elemName).addClass("boot-form-element form-control");
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
})(jQuery);