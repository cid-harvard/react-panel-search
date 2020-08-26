import { debounce } from 'lodash';
import React, { useEffect, useRef } from 'react';
import styled from 'styled-components/macro';
import usePrevious from 'react-use-previous-hook';
import raw from 'raw.macro';

const magnifyingGlassSVG = raw('../assets/magnifying-glass.svg');
const chevronSVG = raw('../assets/chevron.svg');

const SearchContainer = styled.label`
  position: relative;
  display: flex;
`;

const magnifyingGlassSize = 1.5; // in rem
const magnifyingGlassSpacing = 0.5; // in rem

const SearchIcon = styled.div`
  position: absolute;
  top: 0;
  bottom: 0;
  margin: auto ${magnifyingGlassSpacing}rem;
  width: ${magnifyingGlassSize}rem;
  cursor: pointer;

  svg {
    width: 100%;
    height: 100%;

    path {
      fill: gray;
    }
  }
`;

const SearchBar = styled.input<{$hasSelection: boolean}>`
  width: 100%;
  box-sizing: border-box;
  padding: 0.5rem 0.5rem 0.5rem ${magnifyingGlassSize + (magnifyingGlassSpacing * 2)}rem;
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

const DropDownIcon = styled.div`
  position: absolute;
  top: 2px;
  bottom: 2px;
  right: 2px;
  padding: 0.4rem;
  background-color: #fff;
  border: none;
  width: ${magnifyingGlassSize}rem;
  cursor: pointer;

  svg {
    width: 100%;
    height: 100%;

    polyline {
      stroke: gray;
      stroke-width: 0.6px;
    }
  }
`;

const ClearButton = styled.button`
  position: absolute;
  top: 2px;
  bottom: 2px;
  right: 2px;
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
  const dropdownEl = useRef<HTMLDivElement | null>(null);

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
    if (dropdownEl && dropdownEl.current) {
      dropdownEl.current.style.display = 'block';
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
      if (dropdownEl && dropdownEl.current) {
        dropdownEl.current.style.display = node.value.length || hasSelection ? 'none' : 'block';
      }
      if (node.value && hasSelection && previousPlaceholder !== placeholder) {
        node.value = '';
      }
    }
  }, [searchEl, initialQuery, hasSelection, placeholder, previousPlaceholder]);

  return (
    <SearchContainer
      className={'react-panel-search-search-bar-container'}
    >
      <SearchIcon
        className={'react-panel-search-search-bar-search-icon'}
        dangerouslySetInnerHTML={{__html: magnifyingGlassSVG}}
      />
      <SearchBar
        className={'react-panel-search-search-bar-input'}
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
        className={'react-panel-search-search-bar-clear-button'}
        ref={clearEl}
        style={{
          display: 'none',
          marginRight: type === 'number' ? '1rem' : undefined,
        }}
        onClick={clearSearch}
      >
        ×
      </ClearButton>
      <DropDownIcon
        ref={dropdownEl}
        className={'react-panel-search-search-bar-dropdown-arrow'}
        style={{
          display: 'none',
        }}
        dangerouslySetInnerHTML={{__html: chevronSVG}}
      />
    </SearchContainer>
  );
};

export default StandardSearch;
