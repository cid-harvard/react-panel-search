import { debounce } from 'lodash';
import React, { useEffect, useRef } from 'react';
import styled from 'styled-components/macro';
import usePrevious from 'react-use-previous-hook';

const SearchContainer = styled.label`
  position: relative;
  display: flex;
`;

const SearchBar = styled.input<{$hasSelection: boolean}>`
  width: 100%;
  max-width: 400px;
  box-sizing: border-box;
  padding: 0.5rem;
  box-sizing: border-box;
  border: solid 1px #dfdfdf;
  font-size: 1.2rem;
  font-weight: 300;

  ${({$hasSelection}) => $hasSelection ? (
    `&::placeholder {
      color: rgb(0, 0, 0);
    }`
  ) : ''}

  &:focus {
    &::placeholder {
      color: rgb(255, 255, 255);
    }
  }
`;

const ClearButton = styled.button`
  position: absolute;
  top: 2px;
  bottom: 2px;
  right: 2px;
  padding: 1rem;
  line-height: 0;
  font-size: 1.2rem;
  padding: 0.4rem;
  text-transform: uppercase;
  text-align: center;
  color: #696969;
  background-color: #fff;
  border: none;

  &:disabled {
    cursor: not-allowed;
    opacity: 0.5;
  }

  &:hover {
    color: #908d8d;
    cursor: pointer;
  }
`;

interface Props {
  placeholder: string;
  setSearchQuery: (value: string) => void;
  initialQuery: string;
  onClear: () => void;
  hasSelection: boolean;
  handleKeyDown: (event: React.KeyboardEvent) => void;
  onFocus: () => void;
  type?: string;
}

const StandardSearch = (props: Props) => {
  const { placeholder, setSearchQuery, initialQuery, type, onClear, hasSelection, handleKeyDown, onFocus } = props;

  const previousPlaceholder = usePrevious(placeholder);

  const searchEl = useRef<HTMLInputElement | null>(null);
  const clearEl = useRef<HTMLButtonElement | null>(null);

  const onChange = debounce(() => {
    if (searchEl !== null && searchEl.current !== null) {
      setSearchQuery(searchEl.current.value);
      if (clearEl && clearEl.current) {
        clearEl.current.style.display = searchEl.current.value.length || hasSelection ? 'block' : 'none';
      }
    }
  }, 400);

  const clearSearch = () => {
    if (searchEl !== null && searchEl.current !== null) {
      searchEl.current.value = '';
      searchEl.current.focus();
      setSearchQuery(searchEl.current.value);
      onClear();
    }
    if (clearEl && clearEl.current) {
      clearEl.current.style.display = 'none';
    }
  };

  useEffect(() => {
    const node = searchEl.current;
    if (node) {
      if (!node.value) {
        node.value = initialQuery;
      }
      if (clearEl && clearEl.current) {
        clearEl.current.style.display = node.value.length || hasSelection ? 'block' : 'none';
      }
      if (node.value && hasSelection && previousPlaceholder !== placeholder) {
        node.value = '';
      }
    }
  }, [searchEl, initialQuery, hasSelection, placeholder, previousPlaceholder]);

  return (
    <SearchContainer>
      <SearchBar
        ref={searchEl}
        type={type ? type : 'text'}
        placeholder={placeholder}
        onChange={onChange}
        autoComplete={'off'}
        $hasSelection={hasSelection}
        onKeyDown={handleKeyDown}
        onFocus={onFocus}
      />
      <ClearButton
        ref={clearEl}
        style={{
          display: 'none',
          marginRight: type === 'number' ? '1rem' : undefined,
        }}
        onClick={clearSearch}
      >
        ×
      </ClearButton>
    </SearchContainer>
  );
};

export default StandardSearch;
