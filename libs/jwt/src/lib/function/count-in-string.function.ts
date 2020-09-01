export const countInString = (str: string, char: string): number =>
	(str.match(new RegExp(char, 'g')) || []).length;
