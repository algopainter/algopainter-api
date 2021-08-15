/* eslint-disable @typescript-eslint/no-explicit-any */
import { expect } from 'chai';
import { ICollection } from '../src/domain/collection';
import { IImage } from '../src/domain/image';
import { IUser } from '../src/domain/user';
import Paged from '../src/shared/paged';
import EndpointTest from './api.wrapper';

describe("'api/users' endpoint tests", () => {
  const client = new EndpointTest("/api/users");

  it('PUT|GET /api/users/:account', async function () {
  });
});