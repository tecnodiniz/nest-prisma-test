import { resetDb } from './utils/db-reset';

beforeEach(async () => {
  await resetDb();
  jest.clearAllMocks();
});
