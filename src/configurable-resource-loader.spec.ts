import { ResourceLoader } from 'jsdom';
import { ConfigurableResourceLoader } from './configurable-resource-loader';
import sinon, { SinonSandbox, SinonStub } from 'sinon';

describe('Configurable Resource Loader', () => {
  let sandbox: SinonSandbox;
  let superFetch: SinonStub;

  beforeEach(() => {
    sandbox = sinon.createSandbox();
    superFetch = sandbox
      .stub(ResourceLoader.prototype, 'fetch')
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .returns({} as any);
  });

  afterEach(() => {
    sandbox.restore();
  });

  it('extends jsdom.ResourceLoader', () => {
    const subject = new ConfigurableResourceLoader();

    expect(subject).toBeInstanceOf(ResourceLoader);
  });

  it('calls super.fetch for all urls, by default', () => {
    const subject = new ConfigurableResourceLoader();
    subject.fetch('foo', {});

    expect(superFetch.calledOnce).toEqual(true);
  });

  describe(`whitelist only`, () => {
    it('calls super.fetch for whitelisted urls', () => {
      const options = { whitelist: [/foo/] };

      const subject = new ConfigurableResourceLoader(options);
      subject.fetch('foo', {});

      expect(superFetch.calledOnce).toEqual(true);
    });

    it('returns null for urls that are not whitelisted', () => {
      const options = { whitelist: [/foo/] };

      const subject = new ConfigurableResourceLoader(options);
      const actual = subject.fetch('bar', {});

      expect(actual).toBeNull();
      expect(superFetch.notCalled).toEqual(true);
    });
  });

  describe(`whitelist and blacklist`, () => {
    it('returns null when there are no matches', () => {
      const options = { whitelist: ['foo'], blacklist: ['bar'] };

      const subject = new ConfigurableResourceLoader(options);
      const actual = subject.fetch('baz', {});

      expect(actual).toBeNull();
      expect(superFetch.notCalled).toEqual(true);
    });

    it('returns null for blacklisted urls', () => {
      const options = { whitelist: [/foo/], blacklist: ['bar'] };

      const subject = new ConfigurableResourceLoader(options);
      const actual = subject.fetch('bar', {});

      expect(actual).toBeNull();
      expect(superFetch.notCalled).toEqual(true);
    });

    it('returns null when whitelist and blacklist match', () => {
      const options = { whitelist: [/foo/], blacklist: [/bar/] };

      const subject = new ConfigurableResourceLoader(options);
      const actual = subject.fetch('foobar', {});

      expect(actual).toBeNull();
      expect(superFetch.notCalled).toEqual(true);
    });

    it('returns null when whitelist and blacklist are equal', () => {
      const options = { whitelist: [/foo/], blacklist: [/foo/] };

      const subject = new ConfigurableResourceLoader(options);
      const actual = subject.fetch('foo', {});

      expect(actual).toBeNull();
      expect(superFetch.notCalled).toEqual(true);
    });

    it('requires an exact match for whitelisted strings', () => {
      const options = { whitelist: ['foobar'], blacklist: ['foo'] };

      const subject = new ConfigurableResourceLoader(options);
      subject.fetch('foobar', {});

      expect(superFetch.calledOnce).toEqual(true);
    });

    it('returns null when whitelist is an exact match but blacklist matches too', () => {
      const options = { whitelist: ['foobar'], blacklist: [/foo/] };

      const subject = new ConfigurableResourceLoader(options);
      const actual = subject.fetch('foobar', {});

      expect(actual).toBeNull();
      expect(superFetch.notCalled).toEqual(true);
    });
  });

  describe(`blacklist only`, () => {
    it('returns null if a url is in the blacklist', () => {
      const options = { blacklist: [/ooba/] };

      const subject = new ConfigurableResourceLoader(options);
      const actual = subject.fetch('foobar', {});

      expect(actual).toBeNull();
      expect(superFetch.notCalled).toEqual(true);
    });

    it('calls super.fetch if a url is NOT in the blacklist', () => {
      const options = { blacklist: [/foo/] };

      const subject = new ConfigurableResourceLoader(options);
      subject.fetch('bar', {});

      expect(superFetch.calledOnce).toEqual(true);
    });
  });
});
