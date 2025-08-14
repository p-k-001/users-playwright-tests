import { APIRequestContext, APIResponse } from "@playwright/test";
import { UserDataRequest, UserDataResponse } from "../types";

export class UsersApi {
  constructor(private request: APIRequestContext) {}

  private USERS_ENDPOINT = `/users`;

  async getUsers(): Promise<APIResponse> {
    return await this.request.get(this.USERS_ENDPOINT);
  }

  async getUser(id: number): Promise<APIResponse> {
    return await this.request.get(`${this.USERS_ENDPOINT}/${id}`);
  }

  async postUser(user: UserDataRequest): Promise<APIResponse> {
    return await this.request.post(this.USERS_ENDPOINT, { data: user });
  }

  async putUser(id: number): Promise<APIResponse> {
    return await this.request.put(`${this.USERS_ENDPOINT}/${id}`);
  }

  async deleteUser(id: number): Promise<APIResponse> {
    return await this.request.delete(`${this.USERS_ENDPOINT}/${id}`);
  }

  async deleteAllUsers(): Promise<APIResponse> {
    return await this.request.delete(this.USERS_ENDPOINT);
  }
}
