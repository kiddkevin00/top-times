const DatabaseService = require('../../../lib/services/database.service');
const storage = require('../../../lib/storage/');
const constants = require('../../../lib/constants/');

describe('Database service', function () {
  let stubFuncs;

  beforeEach(function () {
    stubFuncs = [];
  });

  afterEach(function () {
    for (const stubFunc of stubFuncs) {
      stubFunc.restore();
    }
  });

  it('can execute a strategy for Mongo DB', async () => {
    const insert = stub();

    stubFuncs.push(stub(storage, 'ConnectionPool'));
    stubFuncs.push(stub(storage.RepoFactory, 'manufacture', () => ({ insert })));

    const operationData = [{}];

    process.env.MONGODB_URI = 'mongodb://myDBReader:D1fficultP%40ssw0rd@mongodb0.example.com:27017';

    await DatabaseService.execute({
      storeType: constants.STORE.TYPES.MONGO_DB,
      operation: { type: constants.STORE.OPERATIONS.INSERT, data: operationData },
      tableName: 'test',
    });

    expect(insert).to.have.been.calledWith(match.object, 'test', ...operationData);

    delete process.env.MONGODB_URI;
  });

  it('can execute a strategy for Postgres', async () => {
    const insert = stub();

    stubFuncs.push(stub(storage, 'ConnectionPool'));
    stubFuncs.push(stub(storage.RepoFactory, 'manufacture', () => ({ insert })));

    const operationData = [{}];

    await DatabaseService.execute({
      storeType: constants.STORE.TYPES.POSTGRES,
      operation: { type: constants.STORE.OPERATIONS.INSERT, data: operationData },
      tableName: 'test',
    });

    expect(insert).to.have.been.calledWith(match.object, 'test', ...operationData);
  });
});
