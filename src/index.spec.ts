import * as jsdom from 'jsdom';
import { ConfigurableResourceLoader } from './index';
import sinon, { SinonSandbox, SinonStub } from 'sinon';

describe('Configurable Resource Loader', () => {
  let sandbox: SinonSandbox;
  let superFetch: SinonStub;

  beforeEach(() => {
    sandbox = sinon.createSandbox();
    superFetch = sandbox
      .stub(jsdom.ResourceLoader.prototype, 'fetch')
      .returns(null);
  });

  afterEach(() => {
    sandbox.restore();
  });

  it('extends jsdom.ResourceLoader', () => {
    const subject = new ConfigurableResourceLoader();

    expect(subject).toBeInstanceOf(jsdom.ResourceLoader);
  });

  it('calls super.fetch for all urls, by default', () => {
    const subject = new ConfigurableResourceLoader();
    subject.fetch('foo', {});

    expect(superFetch.calledOnce).toEqual(true);
  });

  it('calls super.fetch for whitelisted urls', () => {
    const options = { whitelist: [/foo/] };

    const subject = new ConfigurableResourceLoader(options);
    subject.fetch('foo', {});

    expect(superFetch.calledOnce).toEqual(true);
  });
});
