import { useEditor, EditorContent, Editor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Placeholder from '@tiptap/extension-placeholder'
import { Bold, Italic, List, ListOrdered, Quote, Undo, Redo } from 'lucide-react'

interface RichTextEditorProps {
  content: string;
  onChange: (content: string) => void;
  placeholder?: string;
}

const MenuBar = ({ editor }: { editor: Editor | null }) => {
  if (!editor) {
    return null
  }

  return (
    <div className="flex flex-wrap gap-2 p-2 border-b border-white/10 bg-white/5 rounded-t-lg">
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleBold().run()}
        disabled={!editor.can().chain().focus().toggleBold().run()}
        className={`p-1.5 rounded hover:bg-white/10 transition ${editor.isActive('bold') ? 'bg-purple-600/50 text-white' : 'text-gray-400'}`}
        title="Bold"
      >
        <Bold size={16} />
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleItalic().run()}
        disabled={!editor.can().chain().focus().toggleItalic().run()}
        className={`p-1.5 rounded hover:bg-white/10 transition ${editor.isActive('italic') ? 'bg-purple-600/50 text-white' : 'text-gray-400'}`}
        title="Italic"
      >
        <Italic size={16} />
      </button>
      <div className="w-px h-6 bg-white/10 mx-1" />
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        className={`p-1.5 rounded hover:bg-white/10 transition ${editor.isActive('bulletList') ? 'bg-purple-600/50 text-white' : 'text-gray-400'}`}
        title="Bullet List"
      >
        <List size={16} />
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        className={`p-1.5 rounded hover:bg-white/10 transition ${editor.isActive('orderedList') ? 'bg-purple-600/50 text-white' : 'text-gray-400'}`}
        title="Ordered List"
      >
        <ListOrdered size={16} />
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleBlockquote().run()}
        className={`p-1.5 rounded hover:bg-white/10 transition ${editor.isActive('blockquote') ? 'bg-purple-600/50 text-white' : 'text-gray-400'}`}
        title="Quote"
      >
        <Quote size={16} />
      </button>
      <div className="w-px h-6 bg-white/10 mx-1" />
      <button
        type="button"
        onClick={() => editor.chain().focus().undo().run()}
        disabled={!editor.can().chain().focus().undo().run()}
        className="p-1.5 rounded hover:bg-white/10 transition text-gray-400 disabled:opacity-50"
        title="Undo"
      >
        <Undo size={16} />
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().redo().run()}
        disabled={!editor.can().chain().focus().redo().run()}
        className="p-1.5 rounded hover:bg-white/10 transition text-gray-400 disabled:opacity-50"
        title="Redo"
      >
        <Redo size={16} />
      </button>
    </div>
  )
}

export default function RichTextEditor({ content, onChange, placeholder }: RichTextEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({
        placeholder: placeholder || 'Write something...',
        emptyEditorClass: 'is-editor-empty before:content-[attr(data-placeholder)] before:text-gray-500 before:float-left before:pointer-events-none',
      }),
    ],
    content: content,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML())
    },
    editorProps: {
      attributes: {
        class: 'prose prose-invert max-w-none focus:outline-none min-h-[150px] p-4 text-gray-200',
      },
    },
    immediatelyRender: false,
  })

  return (
    <div className="border border-white/10 rounded-lg overflow-hidden bg-black/20 focus-within:border-purple-500/50 transition-colors">
      <MenuBar editor={editor} />
      <EditorContent editor={editor} />
    </div>
  )
}
