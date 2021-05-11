const Validator = require('validator');

module.exports = function (data) {
    let errors = {};

    /*
    Save an email error message to be sent to the client 
    based on different cases
    */
    
    if (Validator.isEmpty(data.email)) {
        errors.email = 'An Email is required.';
    } else if (!Validator.isEmail(data.email)) {
        errors.email = 'The Email is invalid.';
    }

    /*
    Save a password error message to be sent to the client 
    based on different cases
    */

    if (Validator.isEmpty(data.password)) {
        errors.password = 'A Password is required.';
    } else if (!Validator.isLength(data.password, { min: 6, max: 30 })) {
        errors.password = 'The Password must be between 6 to 30 characters.';
    }

    return {
        errors,
        isValid: Object.keys(errors).length === 0
    }
}
