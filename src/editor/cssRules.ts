export function getCss(): CSSStyleRule[] {
  const arrayOfCss = Array.from(document.styleSheets).map((css) => css.rules);

  const cssRules: CSSStyleRule[] = [];

  arrayOfCss.forEach((cssList) => {
    for (let index = 0; index < cssList.length; index++) {
      const element = cssList[index];
      cssRules.push(element as CSSStyleRule);
    }
  });

  return cssRules.filter((css) => isCSStyleRule(css));
}

function isCSStyleRule(rule: CSSStyleRule): rule is CSSStyleRule {
  return rule instanceof CSSStyleRule;
}

export const inliningClassesInDecorator = (
  decorator: Element,
  classNames: string[],
  cssRules: CSSStyleRule[]
) => {
  const defaultFontSize = Number(
    window.getComputedStyle(document.documentElement).fontSize.replace("px", "")
  );

  classNames.forEach((name) => {
    const cssRule = cssRules.find(
      (r) => r instanceof CSSStyleRule && r.selectorText.includes(name)
    );

    if (!cssRule) {
      return;
    }

    Array.from(cssRule.style).forEach((styleName) => {
      // @ts-expect-error
      let value = cssRule.style[styleName];

      if (value.slice(-3) === "rem") {
        value = convertRemToPx(value, defaultFontSize);
        // @ts-expect-error
        decorator.style.color = "red";
      }

      // @ts-expect-error
      decorator.style[styleName] = value;
    });
  });
};

function convertRemToPx(value: string, defaultFontSize: number) {
  return `${parseFloat(value) * defaultFontSize}px`;
}
