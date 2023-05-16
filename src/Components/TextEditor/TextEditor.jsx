import { EditorState, convertToRaw } from "draft-js";
import { Editor } from "react-draft-wysiwyg";
import draftToHtml from "draftjs-to-html";
import "../../../node_modules/react-draft-wysiwyg/dist/react-draft-wysiwyg.css";


const TextEditor = () => {
    const rawContentState = convertToRaw(EditorState.getCurrentContent());

    const markup = draftToHtml(rawContentState, hashtagConfig, directional, customEntityTransform);

    return (
        <div>
            <Editor
                editorState={rawContentState}
                wrapperClassName="demo-wrapper"
                editorClassName="demo-editor"
                onEditorStateChange={this.onEditorStateChange}
            />
            <textarea disabled value={draftToHtml(convertToRaw(EditorState.getCurrentContent()))} />
        </div>
    );
};

export default TextEditor