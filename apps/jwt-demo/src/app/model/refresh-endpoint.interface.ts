export interface RefreshRequest {
	refreshToken: string | null | undefined;
	lifespan?: number;
}

export interface RefreshResponse {
	accessToken: string;
	refreshToken: string;
}
