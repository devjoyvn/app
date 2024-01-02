import { ResourceLoader } from 'jsdom';
import { ConfigurableResourceLoader } from '.';

describe('Configurable Resource Loader', () => {
  it('extends jsdom.ResourceLoader', () => {
    const subject = new ConfigurableResourceLoader();

    expect(subject).toBeInstanceOf(ResourceLoader);
  });
});
