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
      if (isBlankRegExp(matcher)) {
        throw new Error(
          `Invalid matcher: Tried to match '${url}' against a blank RegExp.`
        );
      }
      return matcher.test(url);
  }
}

const isBlankRegExp = (re: RegExp): boolean => {
  // Apparently, new RegExp('').source does not return "", it returns "(?:)"
  // I'm not sure if this is subject to change, so this
  // felt like the safest way to check if a regex was built with a blank pattern:
  return re.source === new RegExp('').source;
};
