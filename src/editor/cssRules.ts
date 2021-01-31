import { DECORATOR_NAME_ATTRIBUTE } from "./decorator";

export function inlineDecoratorClasses(target: Node[], decoratorName: string) {
  const cssRules = getCss();

  target
    .filter(
      (el) =>
        (el as Element).getAttribute(DECORATOR_NAME_ATTRIBUTE) === decoratorName
    )
    .forEach((el) => {
      inliningClassesInDecorator(
        el as Element,
        (el as Element).className.toLowerCase(),
        cssRules
      );
    });
}

function getCss(): CSSStyleRule[] {
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

const inliningClassesInDecorator = (
  decorator: Element,
  className: string,
  cssRules: CSSStyleRule[]
) => {
  const defaultFontSize = Number(
    window.getComputedStyle(document.documentElement).fontSize.replace("px", "")
  );

  const classNames = className.split(" ");

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
      }

      // @ts-expect-error
      decorator.style[styleName] = value;
    });
  });
  // decorator.style.color = "black";
};

function convertRemToPx(value: string, defaultFontSize: number) {
  return `${parseFloat(value) * defaultFontSize}px`;
}
