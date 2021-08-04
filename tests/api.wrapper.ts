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
    return `${this.baseUrl}/${uri}`;
  }

  public async init(): Promise<void> {
    await this.api.get(this.url("api/diagnostics/seed/AlgoPainter"));
  }

  public async AssertGet<TResult>(endpoint: string, responseCode: number) : Promise<TResult | null | undefined> {
    const response = await this.api.get(this.url(endpoint));
    expect(response).not.be.null;
    expect(response.statusCode).to.be.equal(responseCode);
    return response.body as TResult | null | undefined;
  }

  public async AssertPost(endpoint: string, json: string, responseCode: number) : Promise<void> {
    const response = await this.api.post(this.url(endpoint)).send(json);
    expect(response).not.be.null;
    expect(response.statusCode).to.be.equal(responseCode);
  }

  public async AssertPut(endpoint: string, json: string, responseCode: number) : Promise<void> {
    const response = await this.api.put(this.url(endpoint)).send(json);
    expect(response).not.be.null;
    expect(response.statusCode).to.be.equal(responseCode);
  }

  public async AssertDelete(endpoint: string, responseCode: number) : Promise<void> {
    const response = await this.api.delete(this.url(endpoint));
    expect(response).not.be.null;
    expect(response.statusCode).to.be.equal(responseCode);
  }
}