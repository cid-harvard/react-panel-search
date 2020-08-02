import { debounce } from 'lodash';
import React, { useEffect, useRef } from 'react';
import styled from 'styled-components/macro';

const SearchContainer = styled.label`
  position: relative;
  display: flex;
`;

const SearchBar = styled.input`
  width: 100%;
  box-sizing: border-box;
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
  type?: string;
}

const StandardSearch = (props: Props) => {
  const { placeholder, setSearchQuery, initialQuery, type } = props;

  const searchEl = useRef<HTMLInputElement | null>(null);
  const clearEl = useRef<HTMLButtonElement | null>(null);

  const onChange = debounce(() => {
    if (searchEl !== null && searchEl.current !== null) {
      setSearchQuery(searchEl.current.value);
      if (clearEl && clearEl.current) {
        clearEl.current.style.display = searchEl.current.value.length ? 'block' : 'none';
      }
    }
  }, 400);

  const clearSearch = () => {
    if (searchEl !== null && searchEl.current !== null) {
      searchEl.current.value = '';
      searchEl.current.focus();
      setSearchQuery(searchEl.current.value);
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
        clearEl.current.style.display = node.value.length ? 'block' : 'none';
      }
    }
  }, [searchEl, initialQuery]);

  return (
    <SearchContainer>
      <SearchBar
        ref={searchEl}
        type={type ? type : 'text'}
        placeholder={placeholder}
        onChange={onChange}
        autoComplete={'off'}
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
