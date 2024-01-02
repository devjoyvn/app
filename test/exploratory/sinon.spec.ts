import sinon, { SinonSandbox, SinonStub } from 'sinon';

describe('Sinon', () => {
  let sandbox: SinonSandbox;
  let superBark: SinonStub;

  beforeEach(() => {
    sandbox = sinon.createSandbox();
    superBark = sandbox.stub(Dog.prototype, 'bark').returns(null);
  });

  afterEach(() => {
    sandbox.restore();
  });

  it(`can intercept parent calls`, () => {
    const subject = new (class Puppy extends Dog {})(3);

    expect(subject.bark()).toBeNull();
    expect(subject.barkCount).toEqual(3);
  });

  it(`can call through parent calls`, () => {
    superBark.callThrough();

    const subject = new (class Puppy extends Dog {})(4);

    expect(subject.bark()).toEqual(5);
    expect(subject.barkCount).toEqual(5);
  });

  class Dog {
    barkCount;

    constructor(barkCount?: number) {
        this.barkCount = barkCount ?? 0;
    }

    bark(): number | null {
      this.barkCount++;
      return this.barkCount;
    }
  }
});
