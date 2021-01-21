export function convertHeadings(target: Node) {
  let allNodes = getAllNodes(Array.from(target.cloneNode(true).childNodes));

  const onlyHeadings = allNodes.filter(
    (n) =>
      n instanceof Element && n.getAttribute("data-decorator") === "header1"
  );

  console.log("onlyHeadings", onlyHeadings);

  onlyHeadings.forEach(
    (h) =>
      console.log(h) === undefined ||
      ((h as Element).outerHTML = (h as Element).outerHTML.replace(
        /span/g,
        "h1"
      ))
  );
  // onlyHeadings.forEach((h) => (h as Element).outerHTML("span", "h1"));
  console.log("onlyHeadings", onlyHeadings);
}

function getAllNodes(targets: Node[]): Node[] {
  const result: Node[] = [];

  targets.forEach((n) => {
    if (n instanceof Element && n.hasChildNodes()) {
      const second = getAllNodes(Array.from(n.childNodes));
      second.forEach((c) => result.push(c));
    }
    result.push(n);
  });
  return result;
}
