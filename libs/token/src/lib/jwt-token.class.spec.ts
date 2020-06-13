import { JwtToken } from './jwt-token.class';

describe('JwtToken', () => {
	const validHeader = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9';
	const validPayload =
		'eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ';
	const validSignature = 'SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c';
	const validToken = [validHeader, validPayload, validSignature].join(
		JwtToken.JWT_TOKEN_SEPARATOR
	);

	const invalidToken = [validHeader, validPayload].join(JwtToken.JWT_TOKEN_SEPARATOR);

	it('can be made from a valid token string', () => {
		const result = JwtToken.from(validToken);
		expect(result).toBeInstanceOf(JwtToken);
	});
	it("can't be made from a valid token string", () => {
		const result = JwtToken.from(invalidToken);
		expect(result).toBeNull();
	});

	it("can't be made from empty segments", () => {
		const result = JwtToken.from('..');
		expect(result).toBeNull();
	});
});
