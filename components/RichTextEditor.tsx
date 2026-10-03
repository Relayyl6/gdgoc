'use client';

import React, { useRef, useCallback, useEffect, useState } from 'react';

interface RichTextEditorProps {
  value: string;
  onChange: (html: string) => void;
  placeholder?: string;
}

type ToolbarButton =
  | { type: 'cmd'; cmd: string; label: string; title: string; mono?: boolean; arg?: string }
  | { type: 'sep' }
  | { type: 'custom'; label: string; title: string; mono?: boolean; action: () => void };

export default function RichTextEditor({
  value,
  onChange,
  placeholder = 'Start writing…',
}: RichTextEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null);
  const isInitialized = useRef(false);
  const [activeFormats, setActiveFormats] = useState<Record<string, boolean>>({});

  // Initialize inner HTML only on first mount
  useEffect(() => {
    if (!isInitialized.current && editorRef.current) {
      editorRef.current.innerHTML = value || '';
      isInitialized.current = true;
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const updateActiveFormats = useCallback(() => {
    const formats: Record<string, boolean> = {};
    const cmds = ['bold', 'italic', 'underline', 'insertUnorderedList', 'insertOrderedList'];
    cmds.forEach((cmd) => {
      try {
        formats[cmd] = document.queryCommandState(cmd);
      } catch {
        formats[cmd] = false;
      }
    });
    setActiveFormats(formats);
  }, []);

  const exec = useCallback((cmd: string, arg?: string) => {
    editorRef.current?.focus();
    document.execCommand(cmd, false, arg ?? undefined);
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML);
    }
    updateActiveFormats();
  }, [onChange, updateActiveFormats]);

  const wrapSelection = useCallback(
    (tagOpen: string, tagClose: string) => {
      editorRef.current?.focus();
      const sel = window.getSelection();
      if (!sel || sel.rangeCount === 0) return;
      const range = sel.getRangeAt(0);
      const selectedText = range.toString();
      if (!selectedText) return;
      const html = `${tagOpen}${selectedText}${tagClose}`;
      document.execCommand('insertHTML', false, html);
      if (editorRef.current) onChange(editorRef.current.innerHTML);
    },
    [onChange],
  );

  const insertHRule = useCallback(() => {
    exec('insertHTML', '<hr style="border:none;border-top:2px solid #374151;margin:1.5rem 0;" />');
  }, [exec]);

  const insertCodeBlock = useCallback(() => {
    wrapSelection(
      '<pre style="background:#1e293b;color:#86efac;padding:1rem;border-radius:0.5rem;overflow-x:auto;font-family:monospace;font-size:0.875rem;margin:1rem 0;"><code>',
      '</code></pre>',
    );
  }, [wrapSelection]);

  const insertInlineCode = useCallback(() => {
    wrapSelection(
      '<code style="background:#1f2937;color:#e5e7eb;padding:0.125rem 0.375rem;border-radius:0.25rem;font-family:monospace;font-size:0.875em;">',
      '</code>',
    );
  }, [wrapSelection]);

  const insertLink = useCallback(() => {
    const url = prompt('Enter URL:', 'https://');
    if (url) exec('createLink', url);
  }, [exec]);

  const buttons: ToolbarButton[] = [
    { type: 'cmd', cmd: 'bold', label: 'B', title: 'Bold (Ctrl+B)' },
    { type: 'cmd', cmd: 'italic', label: 'I', title: 'Italic (Ctrl+I)' },
    { type: 'cmd', cmd: 'underline', label: 'U', title: 'Underline (Ctrl+U)' },
    { type: 'sep' },
    { type: 'cmd', cmd: 'formatBlock', arg: 'h1', label: 'H1', title: 'Heading 1', mono: true },
    { type: 'cmd', cmd: 'formatBlock', arg: 'h2', label: 'H2', title: 'Heading 2', mono: true },
    { type: 'cmd', cmd: 'formatBlock', arg: 'h3', label: 'H3', title: 'Heading 3', mono: true },
    { type: 'sep' },
    {
      type: 'cmd',
      cmd: 'insertUnorderedList',
      label: '• List',
      title: 'Bullet List',
    },
    {
      type: 'cmd',
      cmd: 'insertOrderedList',
      label: '1. List',
      title: 'Numbered List',
    },
    {
      type: 'cmd',
      cmd: 'formatBlock',
      arg: 'blockquote',
      label: '❝ Quote',
      title: 'Blockquote',
    },
    { type: 'sep' },
    {
      type: 'custom',
      label: '`code`',
      title: 'Inline Code',
      mono: true,
      action: insertInlineCode,
    },
    {
      type: 'custom',
      label: '</> Block',
      title: 'Code Block',
      mono: true,
      action: insertCodeBlock,
    },
    {
      type: 'custom',
      label: '🔗 Link',
      title: 'Insert Link',
      action: insertLink,
    },
    {
      type: 'custom',
      label: '— HR',
      title: 'Horizontal Rule',
      action: insertHRule,
    },
    { type: 'sep' },
    {
      type: 'cmd',
      cmd: 'removeFormat',
      label: '✕ Clear',
      title: 'Clear Formatting',
    },
  ];

  return (
    <div className="rounded-xl overflow-hidden border border-white/10 shadow-sm">
      {/* Toolbar */}
      <div className="bg-[#111] border-b border-white/10 px-3 py-2 flex flex-wrap gap-1 items-center">
        {buttons.map((btn, i) => {
          if (btn.type === 'sep') {
            return <span key={i} className="w-px h-5 bg-white/10 mx-1 shrink-0" />;
          }
          if (btn.type === 'cmd') {
            const isActive =
              btn.cmd === 'bold'
                ? activeFormats['bold']
                : btn.cmd === 'italic'
                  ? activeFormats['italic']
                  : btn.cmd === 'underline'
                    ? activeFormats['underline']
                    : btn.cmd === 'insertUnorderedList'
                      ? activeFormats['insertUnorderedList']
                      : btn.cmd === 'insertOrderedList'
                        ? activeFormats['insertOrderedList']
                        : false;
            return (
              <button
                key={i}
                type="button"
                title={btn.title}
                onMouseDown={(e) => {
                  e.preventDefault();
                  exec(btn.cmd, btn.arg);
                }}
                className={`px-2 py-1 rounded text-sm transition-colors select-none ${
                  btn.mono ? 'font-mono' : 'font-sans'
                } ${
                  isActive
                    ? 'bg-blue-600 text-white'
                    : 'hover:bg-white/10 text-gray-300'
                } ${
                  btn.label === 'B' ? 'font-bold' : ''
                } ${
                  btn.label === 'I' ? 'italic' : ''
                } ${
                  btn.label === 'U' ? 'underline' : ''
                }`}
              >
                {btn.label}
              </button>
            );
          }
          if (btn.type === 'custom') {
            return (
              <button
                key={i}
                type="button"
                title={btn.title}
                onMouseDown={(e) => {
                  e.preventDefault();
                  btn.action();
                }}
                className={`px-2 py-1 rounded text-sm transition-colors select-none hover:bg-white/10 text-gray-300 ${
                  btn.mono ? 'font-mono' : 'font-sans'
                }`}
              >
                {btn.label}
              </button>
            );
          }
          return null;
        })}
      </div>

      {/* Editor area */}
      <div className="relative">
        <div
          ref={editorRef}
          contentEditable
          suppressContentEditableWarning
          onInput={() => {
            if (editorRef.current) onChange(editorRef.current.innerHTML);
          }}
          onKeyUp={updateActiveFormats}
          onMouseUp={updateActiveFormats}
          onFocus={updateActiveFormats}
          data-placeholder={placeholder}
          style={{
            minHeight: '300px',
            padding: '1rem',
            outline: 'none',
            lineHeight: '1.75',
            color: '#e5e7eb',
            fontSize: '0.9375rem',
          }}
          className="focus:ring-0 prose-editor bg-[#0f0f0f]"
        />
        {/* Inline prose styles via a style tag trick using a wrapper class */}
      </div>

      {/* Scoped prose styles */}
      <style>{`
        .prose-editor:empty:before {
          content: attr(data-placeholder);
          color: #9ca3af;
          pointer-events: none;
        }
        .prose-editor h1 { font-size: 2rem; font-weight: 800; color: #f9fafb; margin: 1.25rem 0 0.5rem; line-height: 1.2; }
        .prose-editor h2 { font-size: 1.5rem; font-weight: 700; color: #f3f4f6; margin: 1.25rem 0 0.5rem; line-height: 1.3; }
        .prose-editor h3 { font-size: 1.25rem; font-weight: 600; color: #e5e7eb; margin: 1rem 0 0.375rem; line-height: 1.4; }
        .prose-editor p  { margin: 0.5rem 0; }
        .prose-editor ul { list-style: disc; padding-left: 1.5rem; margin: 0.5rem 0; }
        .prose-editor ol { list-style: decimal; padding-left: 1.5rem; margin: 0.5rem 0; }
        .prose-editor li { margin: 0.25rem 0; }
        .prose-editor blockquote {
          border-left: 4px solid #3b82f6;
          padding: 0.25rem 0 0.25rem 1rem;
          color: #9ca3af;
          font-style: italic;
          margin: 0.75rem 0;
          background: rgba(59, 130, 246, 0.1);
          border-radius: 0 0.375rem 0.375rem 0;
        }
        .prose-editor a { color: #60a5fa; text-decoration: underline; }
        .prose-editor hr { border: none; border-top: 2px solid #374151; margin: 1.5rem 0; }
        .prose-editor strong { font-weight: 700; color: #ffffff; }
        .prose-editor em { font-style: italic; }
        .prose-editor u { text-decoration: underline; }
        .prose-editor code {
          background: #1f2937;
          color: #e5e7eb;
          padding: 0.125rem 0.375rem;
          border-radius: 0.25rem;
          font-family: monospace;
          font-size: 0.875em;
        }
        .prose-editor pre {
          background: #1e293b;
          color: #86efac;
          padding: 1rem;
          border-radius: 0.5rem;
          overflow-x: auto;
          font-family: monospace;
          font-size: 0.875rem;
          margin: 1rem 0;
        }
        .prose-editor pre code {
          background: transparent;
          color: inherit;
          padding: 0;
          border-radius: 0;
          font-size: inherit;
        }
      `}</style>
    </div>
  );
}
