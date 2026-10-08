import { useState, KeyboardEvent } from 'react';
import { X, Plus, Check } from 'lucide-react';

interface TagInputProps {
  label: string;
  placeholder?: string;
  suggestions?: string[];
  tags: string[];
  onChange: (tags: string[]) => void;
  icon?: typeof X;
}

export default function TagInput({
  label,
  placeholder = 'Type and press Enter...',
  suggestions = [],
  tags,
  onChange,
  icon: Icon,
}: TagInputProps) {
  const [input, setInput] = useState('');

  const addTag = (tag: string) => {
    const trimmed = tag.trim();
    if (trimmed && !tags.includes(trimmed)) {
      onChange([...tags, trimmed]);
    }
    setInput('');
  };

  const removeTag = (tag: string) => {
    onChange(tags.filter((t) => t !== tag));
  };

  const toggleSuggestion = (sug: string) => {
    if (tags.includes(sug)) {
      removeTag(sug);
    } else {
      addTag(sug);
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addTag(input);
    } else if (e.key === 'Backspace' && input === '' && tags.length > 0) {
      removeTag(tags[tags.length - 1]);
    }
  };

  const availableSuggestions = suggestions.filter((s) => !tags.includes(s));

  return (
    <div>
      <label className="flex items-center gap-2 text-sm font-medium text-slate-300 mb-2">
        {Icon && <Icon className="w-4 h-4 text-indigo-400" />}
        {label}
      </label>

      {/* Tag display + input */}
      <div className="glass-input rounded-xl p-3 min-h-[52px] flex flex-wrap gap-2 items-center cursor-text" onClick={(e) => e.currentTarget.querySelector('input')?.focus()}>
        {tags.map((tag) => (
          <span
            key={tag}
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-indigo-500/15 border border-indigo-400/20 text-sm text-indigo-200 animate-scaleIn"
          >
            {tag}
            <button
              onClick={(e) => {
                e.stopPropagation();
                removeTag(tag);
              }}
              className="hover:text-white transition-colors"
            >
              <X className="w-3 h-3" />
            </button>
          </span>
        ))}
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          onBlur={() => input.trim() && addTag(input)}
          placeholder={tags.length === 0 ? placeholder : ''}
          className="flex-1 min-w-[120px] bg-transparent text-sm text-slate-200 placeholder:text-slate-500 outline-none"
        />
      </div>

      {/* All suggestion chips — always visible, clickable to toggle */}
      {availableSuggestions.length > 0 && (
        <div className="mt-2.5 flex flex-wrap gap-2 animate-fadeInDown">
          {availableSuggestions.map((sug) => (
            <button
              key={sug}
              onClick={() => toggleSuggestion(sug)}
              className="group inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/[0.04] border border-white/[0.08] text-xs text-slate-400 hover:text-indigo-200 hover:bg-indigo-500/10 hover:border-indigo-400/30 transition-all duration-200 active:scale-95"
            >
              <Plus className="w-3 h-3 text-slate-500 group-hover:text-indigo-400 transition-colors" />
              {sug}
            </button>
          ))}
        </div>
      )}

      {/* Selected suggestions with active highlight + checkmark */}
      {tags.length > 0 && tags.some((t) => suggestions.includes(t)) && (
        <div className="mt-2 flex flex-wrap gap-2">
          {tags.filter((t) => suggestions.includes(t)).map((sug) => (
            <button
              key={sug}
              onClick={() => toggleSuggestion(sug)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-500/15 border border-indigo-400/30 text-xs text-indigo-200 transition-all duration-200 active:scale-95"
            >
              <Check className="w-3 h-3 text-indigo-400" />
              {sug}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
