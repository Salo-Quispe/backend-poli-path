import { registerDecorator, ValidationOptions } from 'class-validator';

export function IsOrganizationEmail(validationOptions?: ValidationOptions) {
  return function (object: NonNullable<unknown>, propertyName: string) {
    registerDecorator({
      name: 'isOrganizationEmail',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: any) {
          const regex = new RegExp('^[a-zA-Z]+[.][a-zA-Z]+[0-9]*@epn.edu.ec$');
          return regex.test(value);
        },
      },
    });
  };
}
