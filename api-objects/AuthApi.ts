import { APIRequestContext, APIResponse } from "@playwright/test";
import { LoginResponse, User } from "../types";

export class AuthApi {
  constructor(private request: APIRequestContext) {}

  private REGISTER_ENDPOINT = `/register`;
  private LOGIN_ENDPOINT = `/login`;

  async register(user: User): Promise<APIResponse> {
    return await this.request.post(this.REGISTER_ENDPOINT, { data: user });
  }

  async login(user: User): Promise<APIResponse> {
    return await this.request.post(this.LOGIN_ENDPOINT, { data: user });
  }

  async getLoginToken(user: User): Promise<string> {
    const res = await this.request.post(this.LOGIN_ENDPOINT, { data: user });
    const resJson = await res.json();
    return resJson.token;
  }

  async registerAndGetLoginToken(user: User): Promise<string> {
    await this.register(user);
    return await this.getLoginToken(user);
  }
}
