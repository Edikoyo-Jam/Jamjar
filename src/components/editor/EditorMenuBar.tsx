"use client";

import { Editor } from "@tiptap/react";
import {
  AlignCenter,
  AlignJustify,
  AlignLeft,
  AlignRight,
  Bold,
  Code,
  Highlighter,
  Italic,
  LinkIcon,
  Minus,
  Quote,
  Redo,
  Strikethrough,
  Subscript,
  Superscript,
  Underline,
  Undo,
} from "lucide-react";
import EditorMenuButton from "./EditorMenuButton";

type EditorMenuProps = {
  editor: Editor | null;
};

export default function EditorMenuBar({ editor }: EditorMenuProps) {
  if (!editor) return null;

  const addLink = () => {
    const url = prompt("Enter link URL:");
    if (url) {
      editor
        .chain()
        .focus()
        .extendMarkRange("link")
        .setLink({ href: url })
        .run();
    }
  };

  const buttons = [
    {
      icon: <Bold size={20} />,
      onClick: () => editor.chain().focus().toggleBold().run(),
      disabled: false,
      isActive: editor.isActive("bold"),
    },
    {
      icon: <Italic size={20} />,
      onClick: () => editor.chain().focus().toggleItalic().run(),
      disabled: false,
      isActive: editor.isActive("italic"),
    },
    {
      icon: <Underline size={20} />,
      onClick: () => editor.chain().focus().toggleUnderline().run(),
      disabled: false,
      isActive: editor.isActive("underline"),
    },
    {
      icon: <Highlighter size={20} />,
      onClick: () => editor.chain().focus().toggleHighlight().run(),
      disabled: false,
      isActive: editor.isActive("highlight"),
    },
    {
      icon: <Strikethrough size={20} />,
      onClick: () => editor.chain().focus().toggleStrike().run(),
      disabled: false,
      isActive: editor.isActive("strike"),
    },
    {
      icon: <Subscript size={20} />,
      onClick: () => editor.chain().focus().toggleSubscript().run(),
      disabled: false,
      isActive: editor.isActive("subscript"),
    },
    {
      icon: <Superscript size={20} />,
      onClick: () => editor.chain().focus().toggleSuperscript().run(),
      disabled: false,
      isActive: editor.isActive("superscript"),
    },
    {
      icon: <LinkIcon size={20} />,
      onClick: addLink,
      disabled: false,
      isActive: editor.isActive("link"),
    },
    {
      icon: <Minus size={20} />,
      onClick: () => editor.chain().focus().setHorizontalRule().run(),
      disabled: !editor.can().setHorizontalRule(),
      isActive: false,
    },
    {
      icon: <Quote size={20} />,
      onClick: () => editor.chain().focus().toggleBlockquote().run(),
      disabled: !editor.can().toggleBlockquote(),
      isActive: editor.isActive("blockquote"),
    },
    {
      icon: <Code size={20} />,
      onClick: () => editor.chain().focus().toggleCodeBlock().run(),
      disabled: !editor.can().toggleCodeBlock(),
      isActive: editor.isActive("codeblock"),
    },
    {
      icon: <AlignLeft size={20} />,
      onClick: () => editor.chain().focus().setTextAlign("left").run(),
      disabled: !editor.can().setTextAlign("left"),
      isActive: editor.isActive("textalign"),
    },
    {
      icon: <AlignRight size={20} />,
      onClick: () => editor.chain().focus().setTextAlign("right").run(),
      disabled: !editor.can().setTextAlign("right"),
      isActive: editor.isActive("textalign"),
    },
    {
      icon: <AlignCenter size={20} />,
      onClick: () => editor.chain().focus().setTextAlign("center").run(),
      disabled: !editor.can().setTextAlign("center"),
      isActive: editor.isActive("textalign"),
    },
    {
      icon: <AlignJustify size={20} />,
      onClick: () => editor.chain().focus().setTextAlign("justify").run(),
      disabled: !editor.can().setTextAlign("justify"),
      isActive: editor.isActive("textalign"),
    },
    {
      icon: <Undo size={20} />,
      onClick: () => editor.chain().focus().undo().run(),
      disabled: !editor.can().undo(),
      isActive: editor.isActive("undo"),
    },
    {
      icon: <Redo size={20} />,
      onClick: () => editor.chain().focus().redo().run(),
      disabled: !editor.can().redo(),
      isActive: editor.isActive("redo"),
    },
  ];

  return (
    <div className="mb-2 flex space-x-2">
      {buttons.map(({ icon, onClick, disabled, isActive }, index) => (
        <EditorMenuButton
          key={index}
          onClick={onClick}
          isActive={isActive}
          disabled={disabled}
        >
          {icon}
        </EditorMenuButton>
      ))}
    </div>
  );
}
