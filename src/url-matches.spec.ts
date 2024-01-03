import { urlMatches } from './url-matches';

describe('urlMatches', () => {
  it('requires an exact match for strings', () => {
    expect(urlMatches(`foo`, `foo`)).toEqual(true);
    expect(urlMatches(`foobar`, `foo`)).toEqual(false);
    expect(urlMatches(`o`, `foo`)).toEqual(false);
  });

  it('requires a match for RegExp', () => {
    expect(urlMatches(`foo`, /foo/)).toEqual(true);
    expect(urlMatches(`foobar`, /foo/)).toEqual(true);
    expect(urlMatches(`o`, /foo/)).toEqual(false);
  });

  it('matches everything with /.*/', () => {
    expect(urlMatches(`foo`, /.*/)).toEqual(true);
    expect(urlMatches(`foobar`, /.*/)).toEqual(true);
    expect(urlMatches(`o`, /.*/)).toEqual(true);
  });

  it('throws an error for blank strings', () => {
    expect(() => {
      urlMatches(`foo`, '');
    }).toThrowError(/blank/);
  });
});
