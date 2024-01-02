import { JSDOM, ResourceLoader, DOMWindow } from 'jsdom';
import sinon, { SinonSandbox, SinonStub } from 'sinon';

describe('JSDOM Resource Loader', () => {
  let sandbox: SinonSandbox;
  let superFetch: SinonStub;

  beforeEach(() => {
    sandbox = sinon.createSandbox();
    superFetch = sandbox
      .stub(ResourceLoader.prototype, 'fetch')
      .returns(null);
  });

  afterEach(() => {
    sandbox.restore();
  });

  describe(`fetch element option`, () => {
    describe(`img`, () => {
      it('calls super.fetch on img elements because the canvas package is a dependency', () => {
        const { window } = createJsdom(`
<html>
    <body>
        <img src="https://picsum.photos/200">
    </body>
</html>
                  `);

        const element = superFetch.getCall(0).args[1]
          ?.element as HTMLScriptElement;

        expect(element).toBeInstanceOf(window.HTMLImageElement);
        expect(element.nodeName).toEqual('IMG');
        expect(element.src).toEqual('https://picsum.photos/200');
        expect(superFetch.calledOnce).toEqual(true);
      });

      it('calls super.fetch on each img element even if they\'re equivalent', () => {
        const { window } = createJsdom(`
<html>
    <body>
        <img src="https://picsum.photos/200">
        <img src="https://picsum.photos/200">
    </body>
</html>
                  `);

        const element1 = superFetch.getCall(0).args[1]
          ?.element as HTMLScriptElement;
        expect(element1).toBeInstanceOf(window.HTMLImageElement);
        expect(element1.nodeName).toEqual('IMG');
        expect(element1.src).toEqual('https://picsum.photos/200');
        
        const element2 = superFetch.getCall(1).args[1]
          ?.element as HTMLScriptElement;
        expect(element2).toBeInstanceOf(window.HTMLImageElement);
        expect(element2.nodeName).toEqual('IMG');
        expect(element2.src).toEqual('https://picsum.photos/200');

        expect(superFetch.calledTwice).toEqual(true);
      });
    });

    describe(`iframe`, () => {
      it('only receives iframe url when super.fetch returns null', () => {
        const embeddedGoogleFormIFrameUrl: string = `https://docs.google.com/forms/d/e/1FAIpQLSc_XJmQM5w3bUW7LbQkbqmSTFm--h9OpU5aJSofcSE04RMITg/viewform?embedded=true`;
        const embeddedGoogleForm: string = `<iframe src="${embeddedGoogleFormIFrameUrl}" width="640" height="646" frameborder="0" marginheight="0" marginwidth="0">Loading…</iframe>`;
        superFetch.returns(null);
        const { window } = createJsdom(`
<html>
<body>
    ${embeddedGoogleForm}
</body>
</html>
    `);

        const element = superFetch.getCall(0).args[1]
          ?.element as HTMLScriptElement;

        expect(element).toBeInstanceOf(window.HTMLIFrameElement);
        expect(element.nodeName).toEqual('IFRAME');
        expect(element.src).toEqual(embeddedGoogleFormIFrameUrl);
        expect(superFetch.calledOnce).toEqual(true);
      });

      it('only receives iframe url when super.fetch allows all', () => {
        superFetch.callThrough();
        const { window } = createJsdom(`
<html>
<body>
    <iframe src="https://dankaplanses.github.io/jsdom-configurable-resource-loader/test/iframe-test.html"></iframe>
</body>
</html>
    `);

        const element = superFetch.getCall(0).args[1]
          ?.element as HTMLScriptElement;

        expect(element).toBeInstanceOf(window.HTMLIFrameElement);
        expect(element.nodeName).toEqual('IFRAME');
        expect(element.src).toEqual(
          `https://dankaplanses.github.io/jsdom-configurable-resource-loader/test/iframe-test.html`
        );
        expect(superFetch.calledOnce).toEqual(true);
      });
    });

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

        expect(element).toBeInstanceOf(window.HTMLScriptElement);
        expect(element.nodeName).toEqual('SCRIPT');
        expect(element.src).toEqual('https://google.com/');
        expect(superFetch.calledOnce).toEqual(true);
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

        expect(element).toBeInstanceOf(window.HTMLScriptElement);
        expect(element.nodeName).toEqual('SCRIPT');
        expect(element.src).toEqual('https://google.com/');
        expect(superFetch.calledOnce).toEqual(true);
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

        expect(element).toBeInstanceOf(window.HTMLScriptElement);
        expect(element.nodeName).toEqual('SCRIPT');
        expect(element.src).toEqual('https://google.com/');
        expect(superFetch.calledOnce).toEqual(true);
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
