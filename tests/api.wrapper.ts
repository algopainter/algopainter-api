import supertest from 'supertest';
import app from '../src/app';
import { expect } from 'chai';

export default class EndpointTest {
  constructor(public baseUrl: string) {
  }

  private get api() {
    return supertest(app.expressApp);
  }

  public url(uri: string) : string {
    return `${this.baseUrl}${uri}`;
  }

  public async AssertGet<TResult>(endpoint: string, responseCode: number) : Promise<TResult | null | undefined> {
    const response = await this.api.get(this.url(endpoint));
    expect(response).not.be.null;
    expect(response.statusCode).to.be.equal(responseCode);
    return response.body as TResult | null | undefined;
  }

  public async AssertPost<T>(endpoint: string, json: any, responseCode: number) : Promise<T | null | undefined> {
    const response = await this.api.post(this.url(endpoint)).send(json);
    expect(response).not.be.null;
    expect(response.statusCode).to.be.equal(responseCode);
    return response?.body as T | null | undefined;
  }

  public async AssertPut<T>(endpoint: string, json: any, responseCode: number) : Promise<T | null | undefined> {
    const response = await this.api.put(this.url(endpoint)).send(json);
    expect(response).not.be.null;
    expect(response.statusCode).to.be.equal(responseCode);
    return response?.body as T | null | undefined;
  }

  public async AssertDelete(endpoint: string, responseCode: number) : Promise<void> {
    const response = await this.api.delete(this.url(endpoint));
    expect(response).not.be.null;
    expect(response.statusCode).to.be.equal(responseCode);
  }
}