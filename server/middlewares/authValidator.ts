import Joi, { Schema } from 'joi';
import { joiPasswordExtendCore } from 'joi-password';

const joiPassword = Joi.extend(joiPasswordExtendCore);

const validator = (schema: Schema) => (payload: any) => {
  return schema.validate(payload, { abortEarly: false });
};

const registerSchema = Joi.object({
  username: Joi.string().min(3).max(18).required(),
  email: Joi.string().required(),
  password: joiPassword
    .string()
    .min(8)
    .max(16)
    .minOfSpecialCharacters(1)
    .minOfLowercase(1)
    .minOfUppercase(1)
    .minOfNumeric(1)
    .noWhiteSpaces()
    .onlyLatinCharacters()
    .doesNotInclude(["password"])
    .required(),
  repeat_password: Joi.ref("password"),
});

export const validateReg = validator(registerSchema);