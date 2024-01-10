import * as jsdom from 'jsdom';
import { ConfigurableResourceLoader } from './index';
import sinon, { SinonStub } from 'sinon';

describe('Acceptance Test', () => {
  let parentFetch: SinonStub;

  beforeEach(() => {
    parentFetch = sinon
      .stub(jsdom.ResourceLoader.prototype, 'fetch')
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .returns({} as any);
  });

  afterEach(() => {
    sinon.restore();
  });

  it('accepts with whitelisted only', () => {
    const options = { whitelist: [/foo/] };

    const subject = new ConfigurableResourceLoader(options);
    subject.fetch('foo', {});

    expect(parentFetch.calledOnce).toEqual(true);
  });

  it('rejects with whitelisted only', () => {
    const options = { whitelist: [/foo/] };

    const subject = new ConfigurableResourceLoader(options);
    const actual = subject.fetch('bar', {});

    expect(actual).toBeNull();
    expect(parentFetch.notCalled).toEqual(true);
  });

  it('accepts with whitelist and blacklist', () => {
    const options = { whitelist: ['foo'], blacklist: ['bar'] };

    const subject = new ConfigurableResourceLoader(options);
    const actual = subject.fetch('foo', {});

    expect(parentFetch.calledOnce).toEqual(true);
  });

  it('rejects with whitelist and blacklist', () => {
    const options = { whitelist: ['foo'], blacklist: ['bar'] };

    const subject = new ConfigurableResourceLoader(options);
    const actual = subject.fetch('bar', {});

    expect(actual).toBeNull();
    expect(parentFetch.notCalled).toEqual(true);
  });

  it('accepts with blacklist only', () => {
    const options = { blacklist: [/foobar/] };

    const subject = new ConfigurableResourceLoader(options);
    subject.fetch('baz', {});

    expect(parentFetch.calledOnce).toEqual(true);
  });

  it('rejects with blacklist only', () => {
    const options = { blacklist: ['bar'] };

    const subject = new ConfigurableResourceLoader(options);
    const actual = subject.fetch('bar', {});

    expect(actual).toBeNull();
    expect(parentFetch.notCalled).toEqual(true);
  });
});
