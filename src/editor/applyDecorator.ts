import {
  DecoratorActions,
  DECORATOR_NAME_ATTRIBUTE,
  IViewDecorator,
  newDecorator,
} from "./decorator";

export function insertDecoratorByRange(
  decorator: IViewDecorator,
  range: Range
) {
  const template = newDecorator(decorator);
  template.appendChild(range.cloneContents());
  range.deleteContents();
  range.insertNode(template);
}

export function getDecoratorStrategy(
  target: Node,
  decorator: IViewDecorator
): DecoratorActions {
  // if (target.parentElement!) {
  //   const parentDecorator = target.parentElement!.getAttribute(
  //     DECORATOR_NAME_ATTRIBUTE
  //   );
  //   return parentDecorator === decorator.decoratorName
  //     ? DecoratorActions.UNWRAP
  //     : DecoratorActions.WRAP;
  // }
  if (target instanceof Element) {
    return target.getAttribute(DECORATOR_NAME_ATTRIBUTE) ===
      decorator.decoratorName
      ? DecoratorActions.UNWRAP
      : DecoratorActions.WRAP;
  }

  return DecoratorActions.WRAP;
}
