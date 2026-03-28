import { useParams } from "react-router-dom";
import Editor from "./Editor";

const EditorWrapper = () => {
  const { noteId } = useParams();

  return <Editor noteId={noteId} />;
};

export default EditorWrapper;