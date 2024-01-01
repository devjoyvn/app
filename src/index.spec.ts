import { ResourceLoader } from 'jsdom';
import { ConfigurableResourceLoader } from './index';

describe('Configurable Resource Loader', () => {
  it('extends jsdom.ResourceLoader', () => {
    const subject = new ConfigurableResourceLoader();

    expect(subject).toBeInstanceOf(ResourceLoader);
  });
});
