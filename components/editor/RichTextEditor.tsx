"use client";

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import Typography from '@tiptap/extension-typography';
import { Bold, Italic, Strikethrough, Heading1, Heading2, List, ListOrdered, Quote } from 'lucide-react';

interface RichTextEditorProps {
  content: string;
  onChange: (html: string) => void;
  editable?: boolean;
}

export default function RichTextEditor({ content, onChange, editable = true }: RichTextEditorProps) {
  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit,
      Typography,
      Placeholder.configure({
        placeholder: 'Start writing your story...',
      }),
    ],
    content,
    editable,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: 'prose prose-invert max-w-none focus:outline-none min-h-[300px]',
      },
    },
  });

  if (!editor) {
    return null;
  }

  return (
    <div className="flex flex-col gap-2">
      {editable && (
        <div className="flex flex-wrap items-center gap-2 p-2 bg-white/5 border border-white/10 rounded-t-lg">
          <button
            onClick={() => editor.chain().focus().toggleBold().run()}
            className={`p-3 rounded hover:bg-white/10 ${editor.isActive('bold') ? 'bg-purple-500/50 text-purple-200' : 'text-gray-400'}`}
            title="Bold"
          >
            <Bold size={20} />
          </button>
          <button
            onClick={() => editor.chain().focus().toggleItalic().run()}
            className={`p-3 rounded hover:bg-white/10 ${editor.isActive('italic') ? 'bg-purple-500/50 text-purple-200' : 'text-gray-400'}`}
            title="Italic"
          >
            <Italic size={20} />
          </button>
          <button
            onClick={() => editor.chain().focus().toggleStrike().run()}
            className={`p-3 rounded hover:bg-white/10 ${editor.isActive('strike') ? 'bg-purple-500/50 text-purple-200' : 'text-gray-400'}`}
            title="Strikethrough"
          >
            <Strikethrough size={20} />
          </button>
          <div className="w-px h-8 bg-white/10 mx-1" />
          <button
            onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
            className={`p-3 rounded hover:bg-white/10 ${editor.isActive('heading', { level: 1 }) ? 'bg-purple-500/50 text-purple-200' : 'text-gray-400'}`}
            title="Heading 1"
          >
            <Heading1 size={20} />
          </button>
          <button
            onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
            className={`p-3 rounded hover:bg-white/10 ${editor.isActive('heading', { level: 2 }) ? 'bg-purple-500/50 text-purple-200' : 'text-gray-400'}`}
            title="Heading 2"
          >
            <Heading2 size={20} />
          </button>
          <div className="w-px h-8 bg-white/10 mx-1" />
          <button
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            className={`p-3 rounded hover:bg-white/10 ${editor.isActive('bulletList') ? 'bg-purple-500/50 text-purple-200' : 'text-gray-400'}`}
            title="Bullet List"
          >
            <List size={20} />
          </button>
          <button
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            className={`p-3 rounded hover:bg-white/10 ${editor.isActive('orderedList') ? 'bg-purple-500/50 text-purple-200' : 'text-gray-400'}`}
            title="Ordered List"
          >
            <ListOrdered size={20} />
          </button>
          <button
            onClick={() => editor.chain().focus().toggleBlockquote().run()}
            className={`p-3 rounded hover:bg-white/10 ${editor.isActive('blockquote') ? 'bg-purple-500/50 text-purple-200' : 'text-gray-400'}`}
            title="Blockquote"
          >
            <Quote size={20} />
          </button>
        </div>
      )}
      <EditorContent editor={editor} className="bg-transparent rounded-b-lg border border-white/10 p-4 min-h-[300px]" />
    </div>
  );
}
