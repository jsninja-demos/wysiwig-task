import { makeDecorator } from "./decorator";
import { createLine } from "./line";


const editor: HTMLDivElement = document.querySelector<HTMLDivElement>(
  ".edit-area"
)!;

editor.setAttribute("contenteditable","true")

let selectstart = false;


editor.addEventListener(
    "focusin",
    function (this: HTMLDivElement) {
        if(Boolean(this.childElementCount=== 0 )){
            this.appendChild(createLine())
        }
    },
);


document.addEventListener("selectionchange",
    function(){
        if(window.getSelection()!.isCollapsed) {
            selectstart = false;
        }
    }, false);


editor.addEventListener(
  "selectstart",
    function (this: HTMLDivElement, ev: Event) {
        selectstart = true;
    },
);


const controls = Array.from(document.querySelector(".toolkit")!.children);
const [hed1, hed2, bold, italic] = controls;


hed1.addEventListener("click", () => makeDecorator(editor,'italic',"","h1"));
hed2.addEventListener("click", () => makeDecorator(editor,'italic',"","h2"));
bold.addEventListener("click", () => makeDecorator(editor,"bold","font-weight:bold;","b"));
italic.addEventListener("click", () => makeDecorator(editor,'italic',"font-style:italic;","i"));


