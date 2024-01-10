import sinon, { SinonStub } from 'sinon';

describe('Sinon Stub', () => {
  let parentConstructorCalled = false;

  afterEach(() => {
    sinon.restore();
    parentConstructorCalled = false;
  });

  describe('Stubbing parent method but not child method', () => {
    let parentMethod: SinonStub;

    beforeEach(() => {
      parentMethod = sinon.stub(Parent.prototype, 'method').returns(null);
    });

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

  describe('Stubbing parent constructor but not child constructor', () => {
    it(`can intercept parent calls`, () => {
      let childConstructorCalled = false;
      let stubCalledFake = false;

      class Child extends Parent {
        constructor() {
          super();
          childConstructorCalled = true;
        }
      }

      Object.setPrototypeOf(
        // NOTE: if Child could be reused, it's important to `setPrototypeOf` back to `Parent` when done
        Child,
        sinon.stub().callsFake(function () {
          stubCalledFake = true;
        })
      );
      new Child();

      expect(parentConstructorCalled).toBeFalse();
      expect(childConstructorCalled).toBeTrue();
      expect(stubCalledFake).toBeTrue();
    });
  });

  class Parent {
    methodCallCount: number;

    constructor(initialMethodCallCount?: number) {
      this.methodCallCount = initialMethodCallCount ?? 0;
      parentConstructorCalled = true;
    }

    method(): number | null {
      this.methodCallCount++;
      return this.methodCallCount;
    }
  }
});
