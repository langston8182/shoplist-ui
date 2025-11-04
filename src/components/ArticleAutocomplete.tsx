import { useState, useEffect, useRef, useId } from 'react';
import { apiClient } from '../services/api.client';
import type { Article } from '../types/api';

interface ArticleAutocompleteProps {
  value: string;
  onChange: (value: string) => void;
  onSelect?: (article: Article) => void;
  placeholder?: string;
  className?: string;
  autoFocus?: boolean;
}

export function ArticleAutocomplete({
  value,
  onChange,
  onSelect,
  placeholder = "Nom de l'article",
  className = '',
  autoFocus = false,
}: ArticleAutocompleteProps) {
  const [suggestions, setSuggestions] = useState<Article[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const debounceTimerRef = useRef<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const justSelectedRef = useRef(false);
  const lastSearchRef = useRef<string>('');
  const noResultsRef = useRef(false);
  const listboxId = useId();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    // Si on vient de sélectionner un article, ne pas rechercher
    if (justSelectedRef.current) {
      justSelectedRef.current = false;
      return;
    }

    // Nettoyer le timer précédent
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    // Ne pas chercher si moins de 3 caractères
    if (value.trim().length < 3) {
      setSuggestions([]);
      setShowSuggestions(false);
      noResultsRef.current = false;
      lastSearchRef.current = '';
      return;
    }

    const trimmedValue = value.trim();
    
    // Si la dernière recherche n'a rien donné et que le nouveau texte commence par l'ancien, ne pas rechercher
    if (noResultsRef.current && lastSearchRef.current && trimmedValue.startsWith(lastSearchRef.current)) {
      return;
    }

    // Debounce de 300ms
    debounceTimerRef.current = window.setTimeout(async () => {
      setIsLoading(true);
      try {
        const response = await apiClient.searchArticles(trimmedValue);
        setSuggestions(response.articles);
        setShowSuggestions(response.articles.length > 0);
        setSelectedIndex(-1);
        
        // Mémoriser si aucun résultat
        noResultsRef.current = response.articles.length === 0;
        lastSearchRef.current = response.articles.length === 0 ? trimmedValue : '';
      } catch (error) {
        console.error('Erreur lors de la recherche d\'articles:', error);
        setSuggestions([]);
        setShowSuggestions(false);
        noResultsRef.current = false;
        lastSearchRef.current = '';
      } finally {
        setIsLoading(false);
      }
    }, 300);

    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, [value]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    onChange(newValue);
    
    // Si on efface du texte, réinitialiser le flag "pas de résultats"
    if (newValue.length < lastSearchRef.current.length) {
      noResultsRef.current = false;
      lastSearchRef.current = '';
    }
  };

  const handleSelectSuggestion = (article: Article) => {
    justSelectedRef.current = true;
    onChange(article.name);
    setSuggestions([]);
    setShowSuggestions(false);
    setSelectedIndex(-1);
    if (onSelect) {
      onSelect(article);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!showSuggestions || suggestions.length === 0) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex((prev) =>
          prev < suggestions.length - 1 ? prev + 1 : prev
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex((prev) => (prev > 0 ? prev - 1 : -1));
        break;
      case 'Enter':
        e.preventDefault();
        if (selectedIndex >= 0 && selectedIndex < suggestions.length) {
          handleSelectSuggestion(suggestions[selectedIndex]);
        }
        break;
      case 'Escape':
        setShowSuggestions(false);
        setSelectedIndex(-1);
        break;
    }
  };

  const escapeRegExp = (text: string) =>
    text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

  const renderHighlightedName = (name: string) => {
    const query = value.trim();

    if (!query) {
      return name;
    }

    const regex = new RegExp(`(${escapeRegExp(query)})`, 'ig');
    const parts = name.split(regex);
    const loweredQuery = query.toLowerCase();

    return parts.map((part, index) => {
      const isMatch = part.toLowerCase() === loweredQuery;
      return isMatch ? (
        <span key={`${part}-${index}`} className="autocomplete-highlight">
          {part}
        </span>
      ) : (
        <span key={`${part}-${index}`}>{part}</span>
      );
    });
  };

  const activeOptionId =
    selectedIndex >= 0 ? `${listboxId}-option-${selectedIndex}` : undefined;
  const listboxControls = suggestions.length > 0 ? listboxId : undefined;

  return (
    <div ref={containerRef} className="autocomplete-container">
      <input
        ref={inputRef}
        type="text"
        value={value}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        onFocus={() => {
          if (suggestions.length > 0) {
            setShowSuggestions(true);
          }
        }}
        className={className}
        placeholder={placeholder}
        autoFocus={autoFocus}
        autoComplete="off"
        role="combobox"
        aria-autocomplete="list"
        aria-expanded={showSuggestions}
        aria-controls={listboxControls}
        aria-activedescendant={activeOptionId}
      />
      
      {isLoading && value.trim().length >= 3 && (
        <div className="autocomplete-loading" role="status" aria-live="polite">
          <span className="autocomplete-loading-icon" aria-hidden="true">🔍</span>
          Recherche...
        </div>
      )}

      {showSuggestions && suggestions.length > 0 && (
        <ul
          id={listboxId}
          className="autocomplete-suggestions"
          role="listbox"
        >
          {suggestions.map((article, index) => (
            <li
              key={article._id}
              className={`autocomplete-suggestion ${
                index === selectedIndex ? 'selected' : ''
              }`}
              onClick={() => handleSelectSuggestion(article)}
              onMouseEnter={() => setSelectedIndex(index)}
              role="option"
              aria-selected={index === selectedIndex}
              id={`${listboxId}-option-${index}`}
            >
              <div className="autocomplete-suggestion-content">
                <span className="autocomplete-suggestion-name">
                  {renderHighlightedName(article.name)}
                </span>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
