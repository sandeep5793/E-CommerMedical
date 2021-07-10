class ValidationClass {

	errors = [];

	validate = (data) => {

		this.errors = [];

		for (let item of data) {

			let { field, name, rules, lang } = item;

			// field= field.trim();

			rules = rules.split('|');

			for (let rule of rules) {

				rule = rule.trim();
				validationRules = rule.split(':');

				this.validateData(field, name, lang, validationRules[0], validationRules[1]);
			}
		}

		return this.errors;
	}

	messages = (attribute, lang, rule, ruleData) => {
		
		if (lang == 'en') {
			switch (rule) {
				case 'required':
					return `Please enter ${attribute.toLowerCase()} `
					break;
				case 'email':
					return `Please enter a valid ${attribute.toLowerCase()}`
					break;
				case 'alpha':
					return `The ${attribute} should only consist of alphabetic characters.`
					break;
				case 'max':
					return `The ${attribute} may not be greater than ${ruleData} digits`
					break;
				case 'min':
					if (attribute == 'Mobile Number' || attribute == 'Contact Number') {

						return `The ${attribute} should be of ${ruleData} digits`
					}
					return `${attribute} must be atleast ${ruleData} characters`
					break;
				case 'hasNumber':
					return `The ${attribute} should only consist of alphabets`
					break;

				case 'hasSymbol':
					return `The ${attribute} should only consist of alphabets`
					break;

				case 'numeric':
					return `The ${attribute} should only consist of numeric digits.`
					break;
				case 'startZero':
					return `The ${attribute} can't start with zero.`
					break;

				case 'zero':
					return `The ${attribute} can't be zero. you need to select atleast one`
					break;
				case 'no_space':
					return `Please enter ${attribute}, all blank spaces are not allowed`
					break;
				default:
					break;
			}
		}
		else {
			switch (rule) {
				case 'required':
					if (attribute == 'Email') {
						return `Por favor ingrese su correo electrónico`
					}
					else if (attribute == 'Contraseña') {
						return `Por favor, ingrese contraseña`
					}
					else if (attribute == 'Nombre de pila') {
						return `Por favor ingrese su nombre`
					}
					else if (attribute == 'Apellido') {
						return `por favor ingrese el apellido`
					}
					else if (attribute == 'número de calle') {
						return `Por favor ingrese el número de la calle`
					}
					else if (attribute == 'Número interior') {
						return `Por favor ingrese el número de interior`
					}
					else if (attribute == 'Dirección') {
						return `Por favor ingrese la dirección`
					}
					else if (attribute == 'Nombre de la compania') {
						return `Por favor ingrese el nombre de la empresa`
					}
					else if (attribute == 'Nombre del médico o contacto') {
						return `Por favor ingrese el nombre del doctor o contacto`
					}
					else if (attribute == 'Número exterior') {
						return `Por favor ingrese el número exterior`
					}
					else if (attribute == 'Redes sociales - FB:') {
						return `Por favor ingrese a las redes sociales - FB:`
					}
					else if (attribute == 'Instagram:') {
						return `Por favor ingrese Instagram:`
					}
					else {
						return `Por favor ingrese ${attribute.toLowerCase()}`
					}
					break;
				case 'email':
					return `Por favor introduzca una dirección de correo electrónico válida`
					break;
				case 'alpha':
					return `الـ ${attribute} يجب أن تتكون من الأحرف الأبجدية فقط.`
					break;
				case 'max':
					if (attribute == 'Número de teléfono móvil') {
						return `El número de móvil no puede tener más de  ${ruleData} dígitos.`
					}
					else {
						return `${attribute} de móvil debe ser de ${ruleData} caracteres.`
					}
					break;
				case 'min':
					if (attribute == 'Número de teléfono móvil') {
						return `El número de móvil debe tener al menos ${ruleData} dígitos`
					}
					else {
						return `${attribute} debe tener al menos ${ruleData} caracteres`

					}
					break;
				case 'hasNumber':
					return `${attribute} debe consistir solamente de alfabético`
					break;

				case 'hasSymbol':
					return `${attribute} debe consistir solamente de caracteres alfabéticos`
					break;

				case 'numeric':
					if (attribute == 'Número de teléfono móvil') {
						return `El número de móvil debe consistir únicamente en dígitos numéricos.`
					}
					else {
						return `El ${attribute} debe consistir únicamente en dígitos numéricos.`
					}
					break;
				case 'no_space':
					if (attribute == 'Número de teléfono móvil') {
						return `Por favor ingrese el número de móvil, no se permiten todos los espacios en blanco`
					}
					else {
						return `Por favor ${attribute}, no se permiten todos los espacios en blanco`

					}
					break;
				default:
					return `حدث خطأ`
					break;
			}
		}
	}


	validateData = (field, name, lang, rule, ruleData) => {

		switch (rule) {
			case 'required':
				this.fieldIsRequired(field, name, lang, rule);
				break;
			case 'email':
				this.fieldIsEmail(field, name, lang, rule);
				break;
			case 'alpha':
				this.fieldIsAlpha(field, name, lang, rule);
				break;
			case 'max':
				this.fieldMax(field, name, lang, rule, ruleData);
				break;
			case 'min':
				this.fieldMin(field, name, lang, rule, ruleData);
				break;
			case 'numeric':
				this.isNumeric(field, name, lang, rule);
				break;
			case 'startZero':
				this.isstartZero(field, name, lang, rule);
				break;
			case 'hasNumber':
				this.hasNumber(field, name, lang, rule);
				break;
			case 'hasSymbol':
				this.hasSymbol(field, name, lang, rule);
				break;

			case 'zero':
				this.isZero(field, name, lang, rule);
				break;
			case 'no_space':
				this.noSpace(field, name, lang, rule);
				break;
			default:
				break;
		}
	}

	isZero = (field, name, lang, rule) => {
		if (field == 0) {
			this.errors.push(this.messages(name, lang, rule));
		}
	}

	isstartZero = (field, name, lang, rule) => {
		var regExp = /^0[0-9].*$/
		if (regExp.test(field)) {
			this.errors.push(this.messages(name, lang, rule));
		}
	}

	fieldIsRequired = (field, name, lang, rule) => {

		if (!field)
			this.errors.push(this.messages(name, lang, rule));

	}

	fieldIsEmail = (field, name, lang, rule) => {
		let regex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

		if (!regex.test(field))
			this.errors.push(this.messages(name, lang, rule));

	}

	hasNumber = (field, name, lang, rule) => {
		if (/\d/.test(field)) {
			this.errors.push(this.messages(name, lang, rule));
		}

	}

	hasSymbol = (field, name, lang, rule) => {
		
		var format = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/;
		if (format.test(field)) {
			
			this.errors.push(this.messages(name, lang, rule));
		}
		else {
			
		}

	}



	fieldIsAlpha = (field, name, lang, rule) => {

		let regex = /^$|^[a-zA-Z ]+$/;

		if (!regex.test(field))
			this.errors.push(this.messages(name, lang, rule));

	}

	fieldMax = (field, name, lang, rule, ruleData) => {

		if (field.length > parseInt(ruleData))
			this.errors.push(this.messages(name, lang, rule, ruleData));

	}

	fieldMin = (field, name, lang, rule, ruleData) => {

		if (field.length < parseInt(ruleData))
			this.errors.push(this.messages(name, lang, rule, ruleData));
	}

	isNumeric = (field, name, lang, rule) => {

		let isNumeric = !isNaN(parseFloat(field)) && isFinite(field);

		if (!isNumeric)
			this.errors.push(this.messages(name, lang, rule));
	}

	noSpace = (field, name, lang, rule) => {
		// let regex = /^$|^[^\s]+$/;
		let regex = /\S/
		if (!regex.test(field))
			this.errors.push(this.messages(name, lang, rule));
	}

}

export default Validation = new ValidationClass();
