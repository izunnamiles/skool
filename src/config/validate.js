const Joi = require('joi');

const registerValidation = (data) => {
  const schema = Joi.object().keys({
    first_name: Joi.string()
        .alphanum()
        .min(3)
        .max(30)
        .required(),
    last_name: Joi.string()
        .alphanum()
        .min(3)
        .max(30)
        .required(),
    password: Joi.string()
        .pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')),
  
    //confirm_password: Joi.ref('password'),
  
    email: Joi.string()
        .email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } })
  })
  return schema.validate(data)
}
const loginValidation = (data) => {
    const schema = Joi.object({
      
      email: Joi.string()
          .email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }),
      password: Joi.string()
            .pattern(new RegExp('^[a-zA-Z0-9]{3,30}$'))
            .required(),      
    })
    return schema.validate(data)
  }
module.exports.registerValidation = registerValidation;
module.exports.loginValidation = loginValidation;
