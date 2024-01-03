export type Matcher = string | RegExp;

export function urlMatches(url: string, matcher: Matcher): boolean {
  switch (typeof matcher) {
    case 'string':
      if (matcher === '') {
        throw new Error(
          `Invalid matcher: Tried to match '${url}' against a blank string.`
        );
      }
      return url === matcher;
    default:
      // Apparently, new RegExp('').source returns "(?:)"
      // I'm not sure if this is subject to change, so this 
      // felt like the safest way to compare a regex to a blank pattern:
      if (matcher.source === new RegExp('').source) {
        throw new Error(
          `Invalid matcher: Tried to match '${url}' against a blank RegExp.`
        );
      }
      return matcher.test(url);
  }
}
