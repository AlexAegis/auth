export interface RefreshRequest {
	refreshToken: string | null | undefined;
}

export interface RefreshResponse {
	accessToken: string;
	refreshToken: string;
}
