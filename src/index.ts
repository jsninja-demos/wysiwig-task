import {debounce} from "./debounce";
import { makeDecorator } from "./decorator";


const editor: HTMLDivElement = document.querySelector<HTMLDivElement>(
  ".edit-area"
)!;

let selectstart = false;


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


// if (e.keyCode === 13) {
//     // insert 2 br tags (if only one br tag is inserted the cursor won't go to the next line)
//     document.execCommand('insertHTML', false, '<br><br>');
//     // prevent the default behaviour of return key pressed
//     return false;
// }




const controls = Array.from(document.querySelector(".toolkit")!.children);
const [hed1, hed2, bold, italic] = controls;


hed1.addEventListener("click", function( ) {console.log(editor)});

hed1.addEventListener("click", () => makeDecorator(editor,'italic',"font-style:italic;","h1"));
hed2.addEventListener("click", () => makeDecorator(editor,'italic',"font-style:italic;","h2"));
bold.addEventListener("click", () => makeDecorator(editor,"bold","font-weight:bold;"));
italic.addEventListener("click", () => makeDecorator(editor,'italic',"font-style:italic;"));


