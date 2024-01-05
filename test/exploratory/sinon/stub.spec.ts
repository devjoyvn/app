import sinon, { SinonSandbox, SinonStub } from 'sinon';

describe('Sinon Stub', () => {
  let sandbox: SinonSandbox;
  let parentMethod: SinonStub;

  beforeEach(() => {
    sandbox = sinon.createSandbox();
    parentMethod = sandbox.stub(Parent.prototype, 'method').returns(null);
  });

  afterEach(() => {
    sandbox.restore();
  });

  describe('Stubbing parent method but not child method', () => {
    it(`can intercept parent calls`, () => {
      const subject = new (class Child extends Parent {})(3);

      expect(subject.method()).toBeNull();
      expect(subject.methodCallCount).toEqual(3);
    });

    it(`can call through parent calls`, () => {
      parentMethod.callThrough();

      const subject = new (class Child extends Parent {})(4);

      expect(subject.method()).toEqual(5);
      expect(subject.methodCallCount).toEqual(5);
    });
  });

  class Parent {
    methodCallCount: number;

    constructor(initialMethodCallCount?: number) {
      this.methodCallCount = initialMethodCallCount ?? 0;
    }

    method(): number | null {
      this.methodCallCount++;
      return this.methodCallCount;
    }
  }
});
