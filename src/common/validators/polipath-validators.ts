export function isOrganizationEmail(email: string): boolean {
  const regex = new RegExp('^[a-zA-Z]+[.][a-zA-Z]+[0-9]*@epn.edu.ec$');
  return regex.test(email);
}

export function isCorrectPassword(password: string): boolean {
  const regex = new RegExp(
    '(?:(?=.*\\d)|(?=.*\\W+))(?![.\\n])(?=.*[A-Z])(?=.*[a-z]).*$',
  );
  const regex2 = new RegExp('^.{6,50}$');

  return regex.test(password) && regex2.test(password);
}
