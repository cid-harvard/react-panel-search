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
  box-sizing: border-box;

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
  top: 0;
  bottom: 0;
  right: 0;
  padding: 1rem;
  line-height: 0;
  font-size: 1.2rem;
  padding: 0.4rem;
  text-transform: uppercase;
  text-align: center;

  &:disabled {
    cursor: not-allowed;
    opacity: 0.5;
  }
`;

interface Props {
  placeholder: string;
  setSearchQuery: (value: string) => void;
  initialQuery: string;
  onClear: () => void;
  hasSelection: boolean;
  type?: string;
}

const StandardSearch = (props: Props) => {
  const { placeholder, setSearchQuery, initialQuery, type, onClear, hasSelection } = props;

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
