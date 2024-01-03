import { ResourceLoader } from 'jsdom';
import { ConfigurableResourceLoader } from './configurable-resource-loader';
import * as urlMatchesModule from './url-matches';
import sinon, { SinonSandbox, SinonStub } from 'sinon';
import { Matcher } from './url-matches';

describe('Configurable Resource Loader', () => {
  let sandbox: SinonSandbox;
  let superFetch: SinonStub;
  let urlMatches: SinonStub;

  beforeEach(() => {
    sandbox = sinon.createSandbox();
    superFetch = sandbox
      .stub(ResourceLoader.prototype, 'fetch')
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .returns({} as any);

    urlMatches = sandbox.stub(urlMatchesModule, 'urlMatches');
  });

  afterEach(() => {
    sandbox.restore();
  });

  it('extends jsdom.ResourceLoader', () => {
    const subject = new ConfigurableResourceLoader();

    expect(subject).toBeInstanceOf(ResourceLoader);
  });

  it('will call super.fetch when there is no configuration', () => {
    urlMatches.returns(false); // this should have no effect
    const subject = new ConfigurableResourceLoader();

    subject.fetch('url', {});

    expect(superFetch.calledOnce).toEqual(true);
  });

  describe(`whitelist only`, () => {
    it('calls super.fetch for whitelisted urls', () => {
      urlMatches.callsFake((url: string, matcher: string) => {
        return matcher.startsWith('whitelist');
      });
      const options = { whitelist: ['whitelist 1'] };
      const subject = new ConfigurableResourceLoader(options);

      subject.fetch('url', {});

      expect(superFetch.calledOnce).toEqual(true);
    });

    it('iterates every whitelist element to look for a match', () => {
      urlMatches.callsFake((url: string, matcher: string) => {
        return false;
      });
      const options = { whitelist: ['whitelist 1', 'whitelist 2'] };
      const subject = new ConfigurableResourceLoader(options);

      subject.fetch('url', {});

      expect(urlMatches.calledWith('url', 'whitelist 1')).toEqual(true);
      expect(urlMatches.calledWith('url', 'whitelist 2')).toEqual(true);
    });

    it('returns null for urls that are not whitelisted', () => {
      urlMatches.callsFake((url: string, matcher: string) => {
        return !matcher.startsWith('whitelist');
      });
      const options = { whitelist: ['whitelist 1'] };
      const subject = new ConfigurableResourceLoader(options);

      const actual = subject.fetch('url', {});

      expect(actual).toBeNull();
      expect(superFetch.notCalled).toEqual(true);
    });
  });

  describe(`whitelist and blacklist`, () => {
    it('returns null when there are no matches', () => {
      urlMatches.callsFake((url: string, matcher: string) => {
        return false;
      });
      const options = {
        whitelist: ['whitelist 1'],
        blacklist: ['blacklist 1'],
      };
      const subject = new ConfigurableResourceLoader(options);

      const actual = subject.fetch('url', {});

      expect(actual).toBeNull();
      expect(superFetch.notCalled).toEqual(true);
    });

    it('returns null for blacklisted urls', () => {
      urlMatches.callsFake((url: string, matcher: string) => {
        return matcher.startsWith('blacklist');
      });
      const options = {
        whitelist: ['whitelist 1'],
        blacklist: ['blacklist 1'],
      };
      const subject = new ConfigurableResourceLoader(options);

      const actual = subject.fetch('url', {});

      expect(actual).toBeNull();
      expect(superFetch.notCalled).toEqual(true);
    });

    it('returns null when whitelist AND blacklist match', () => {
      urlMatches.callsFake((url: string, matcher: string) => {
        return true;
      });
      const options = {
        whitelist: ['whitelist 1'],
        blacklist: ['blacklist 1'],
      };
      const subject = new ConfigurableResourceLoader(options);

      const actual = subject.fetch('url', {});

      expect(actual).toBeNull();
      expect(superFetch.notCalled).toEqual(true);
    });
  });

  describe(`blacklist only`, () => {
    it('returns null if a url is in the blacklist', () => {
      urlMatches.callsFake((url: string, matcher: string) => {
        return matcher.startsWith('blacklist');
      });
      const options = { blacklist: ['blacklist 1'] };
      const subject = new ConfigurableResourceLoader(options);

      const actual = subject.fetch('url', {});

      expect(actual).toBeNull();
      expect(superFetch.notCalled).toEqual(true);
    });

    it('iterates every blacklist element to look for a match', () => {
      urlMatches.callsFake((url: string, matcher: string) => {
        return false;
      });
      const options = { blacklist: ['blacklist 1', 'blacklist 2'] };
      const subject = new ConfigurableResourceLoader(options);

      subject.fetch('url', {});

      expect(urlMatches.calledWith('url', 'blacklist 1')).toEqual(true);
      expect(urlMatches.calledWith('url', 'blacklist 2')).toEqual(true);
    });

    it('calls super.fetch if a url is NOT in the blacklist', () => {
      urlMatches.callsFake((url: string, matcher: string) => {
        return false;
      });
      const options = { blacklist: ['blacklist 1'] };
      const subject = new ConfigurableResourceLoader(options);

      subject.fetch('url', {});

      expect(superFetch.calledOnce).toEqual(true);
    });
  });
});
