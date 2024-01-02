import { JSDOM, ResourceLoader, DOMWindow } from 'jsdom';
import sinon, { SinonSandbox, SinonStub } from 'sinon';

describe('JSDOM Resource Loader', () => {
  let sandbox: SinonSandbox;
  let superFetch: SinonStub;

  beforeEach(() => {
    sandbox = sinon.createSandbox();
    superFetch = sandbox
      .stub(ResourceLoader.prototype, 'fetch')
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .returns(null);
  });

  afterEach(() => {
    sandbox.restore();
  });

  describe(`fetch element option`, () => {
    describe(`script element`, () => {
      it('receives a synchronous script element', () => {
        const { window } = createJsdom(`
<html>
    <body>
        <script src="https://google.com"></script>
    </body>
</html>
      `);

        const element = superFetch.getCall(0).args[1]
          ?.element as HTMLScriptElement;

        expect(element.nodeName).toEqual("SCRIPT");
        expect(element.src).toEqual('https://google.com/');
      });

      it('receives a deferred script element', () => {
        const { window } = createJsdom(`
<html>
    <body>
        <script defer src="https://google.com"></script>
    </body>
</html>
      `);

        const element = superFetch.getCall(0).args[1]
          ?.element as HTMLScriptElement;

        expect(element.nodeName).toEqual("SCRIPT");
        expect(element.src).toEqual('https://google.com/');
      });

      it('receives an async script element', () => {
        const { window } = createJsdom(`
<html>
    <body>
        <script async src="https://google.com"></script>
    </body>
</html>
      `);

        const element = superFetch.getCall(0).args[1]
          ?.element as HTMLScriptElement;

        expect(element.nodeName).toEqual("SCRIPT");
        expect(element.src).toEqual('https://google.com/');
      });
    });
  });

  function createJsdom(html: string): {
    jsdom: JSDOM;
    window: DOMWindow;
    document: Document;
  } /*: {jsdom: JSDOM, window}*/ {
    const jsdom = new JSDOM(html, {
      url: `http://localhost/subresource`,
      runScripts: 'dangerously',
      resources: new ResourceLoader(),
      pretendToBeVisual: true,
    });
    const { window } = jsdom;
    const { document } = window;

    return { jsdom, window, document };
  }
});
