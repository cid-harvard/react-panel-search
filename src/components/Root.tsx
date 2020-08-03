import React, {useState, useEffect, useRef} from 'react';
import {Level, Datum} from '../'
import StandardSearch from './StandardSearch';
import sortBy from 'lodash/sortBy';
import usePrevious from 'react-use-previous-hook';
import styled from 'styled-components/macro';

const Container = styled.div`
  position: relative;
  max-width: 500px;
`;

const Backdrop = styled.div`
  position: fixed;
  width: 100vw;
  height: 100vh;
  z-index: -1;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: rgba(0, 0, 0, 0.2);
`;

const SearchBar = styled.div`
  position: relative;
`;

const SearchResults = styled.div`
  position: relative;
  max-height: 300px;
  overflow: auto;
  background-color: #fff;
`;


interface Props {
  levels: Level[];
  onSelect: undefined | ((value: Datum | null) => void);
  selectedValue: Datum | null;
}

interface State {
  level: Datum['level'];
  parent: Datum['parent_id'];
  selected: Datum | null;
  searchQuery: string;
  highlightedIndex: number;
  isOpen: boolean;
}

export default ({levels, onSelect, selectedValue}: Props) => {
  const previousSelectedValue = usePrevious(selectedValue);

  const [state, setState] = useState<State>({
    level: levels[0].level,
    parent: null,
    selected: selectedValue,
    searchQuery: '',
    highlightedIndex: 0,
    isOpen: false,
  });

  const updateState = (newState: State) => {
    setState(newState)
  }

  const clearSearch = () => {
    updateState({...state, selected: null, searchQuery: '', highlightedIndex: 0, isOpen: true})
    if (onSelect) {
      onSelect(null);
    }
  }

  const selectDatum = (value: Datum) => {
    updateState({...state, selected: value, isOpen: false})
    if (onSelect) {
      onSelect(value);
    }
  }

  useEffect(() => {
    if (previousSelectedValue && !selectedValue) {
      updateState({...state, selected: null, searchQuery: ''})
    }
  }, [selectedValue, previousSelectedValue]);

  const resultsRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const node = resultsRef.current;
    if (node) {
      const liElms = Array.from(node.querySelectorAll<HTMLButtonElement>('li .react-panel-search-list-item'));
      for (let li of liElms) {
        li.style.outline = '';
        li.classList.remove('react-panel-search-highlighted-item')
      }
      if (liElms.length) {
        let index: number;
        if (state.highlightedIndex >= liElms.length) {
          index = Math.abs(state.highlightedIndex - liElms.length)
          updateState({...state, highlightedIndex: 0})
        } else if (state.highlightedIndex < 0) {
          index = liElms.length + state.highlightedIndex;
          updateState({...state, highlightedIndex: liElms.length - 1})
        } else {
          index = state.highlightedIndex;
        }
        liElms[index].style.outline = 'solid 1px blue';
        liElms[index].classList.add('react-panel-search-highlighted-item');
        const highlightedTop = liElms[index].offsetTop;
        const highlightedBottom = highlightedTop + liElms[index].offsetHeight;

        const containerScrollTop = node.scrollTop;
        const containerScrollBottom = containerScrollTop + node.offsetHeight;

        if (highlightedBottom > containerScrollBottom) {
          node.scrollTop = highlightedBottom - node.offsetHeight;
        } else if (highlightedTop < containerScrollTop) {
          node.scrollTop = highlightedTop;
        }
      }
    }
  }, [state]);

  let listOutput: React.ReactElement<any>;

  if (state.searchQuery.length) {
    // Loop through each filtered level to make element list
    // For each parent, find the children in the next level down if not the last level
    // For each level, check if a parent exists, if so skip it
    const filteredElms: React.ReactElement<any>[] = [];
    const renderedIds: Array<string | number> = [];
    const getChildren = (index: number, parent: Datum['parent_id']) => {
      const elms: React.ReactElement<any>[] = [];
      sortBy(levels[index].data, ['name']).forEach((child) => {
        if (child.parent_id === parent &&
            !renderedIds.includes(child.id) &&
            child.title.toLowerCase().includes(state.searchQuery.toLowerCase())
          ) {
          renderedIds.push(child.id);
          let childElms: React.ReactElement<any>[] | null;
          if (levels[index + 1] && levels[index + 1].data) {
            childElms = getChildren(index + 1, child.id);
          } else {
            childElms = null;
          }
          const childList = childElms && childElms.length ? (
            <ul>
              {childElms}
            </ul>
          ) : null;
          const onSearch = () => {
            selectDatum(child)
          }
          elms.push(
            <li
              key={'search-' + child.title + child.id}
            >
              <button onClick={onSearch} className={'react-panel-search-list-item'}>{child.title}</button>
              {childList}
            </li>
          );
        }
      });
      return elms;
    }
    levels.forEach(({data}, i) => {
      sortBy(data, ['name']).forEach((datum) => {
        if (!renderedIds.includes(datum.id) && datum.title.toLowerCase().includes(state.searchQuery.toLowerCase())) {
          renderedIds.push(datum.id);
          let childElms: React.ReactElement<any>[] | null;
          if (levels[i + 1] && levels[i + 1].data) {
            childElms = getChildren(i + 1, datum.id);
          } else {
            childElms = null;
          }
          const childList = childElms && childElms.length ? (
            <ul>
              {childElms}
            </ul>
          ) : null;
          const onSearch = () => {
            selectDatum(datum)
          }
          filteredElms.push(
            <li key={'search-' + datum.title + datum.id}>
              <button onClick={onSearch} className={'react-panel-search-list-item'}>{datum.title}</button>
              {childList}
            </li>
          );
        }
      });
    });
    listOutput = (
      <ul>
        {filteredElms}
      </ul>
    );
  } else {
    const targetIndex = levels.findIndex(({level}) => level === state.level);
    const listItems = levels[targetIndex].data.filter(({parent_id}) => parent_id === state.parent).map(d => {
      const onSearch = () => {
        selectDatum(d)
      }
      const continueButton = targetIndex !== levels.length - 1 ? (
        <button
          onClick={() => updateState({
            ...state, level: levels[targetIndex + 1].level, parent: d.id, 
            highlightedIndex: 0,
          })}
        >
          {'>'}
        </button>
      ) : null;
      return (
        <li key={d.id}>
          <button onClick={onSearch} className={'react-panel-search-list-item'}>{d.title}</button> {continueButton}
        </li>
      );
    });

    const parentDatum = parent === null || targetIndex === 0
      ? undefined : levels[targetIndex - 1].data.find(({id}) => id === state.parent);

    const breadCrumb = !parentDatum ? (
      <span
      >
        Industries
      </span>
    ) : (
      <React.Fragment>
        <button
          onClick={() => updateState({
            ...state,
            level: levels[targetIndex - 1].level,
            parent: parentDatum.parent_id,
            highlightedIndex: 0,
          })}
        >
          {'<'}
        </button>
        <span>
          {parentDatum.title}
        </span>
      </React.Fragment>
    )
    listOutput = (
      <React.Fragment>
        <div>
          {breadCrumb}
        </div>
        <ul>
            {listItems}
        </ul>
      </React.Fragment>
    );
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.which === 40 || e.keyCode === 40) {
      updateState({...state, highlightedIndex: state.highlightedIndex + 1})
    } else if (e.which === 38 || e.keyCode === 38) {
      updateState({...state, highlightedIndex: state.highlightedIndex - 1})
    } else if (e.which === 13 || e.keyCode === 13) { 
      const node = resultsRef.current;
      if (node) {
        const highlightedElm = node.querySelector<HTMLButtonElement>('li .react-panel-search-highlighted-item');
        if (highlightedElm) {
          highlightedElm.click();
          const focusedInput = document.activeElement as HTMLElement;
          if (focusedInput) {
            focusedInput.blur();
          }
        }
      }
    }
  }

  const backdrop  = state.isOpen ? (
    <Backdrop
      onClick={() => updateState({...state, highlightedIndex: 0, isOpen: false})}
    />
  ) : null;

  const searchResults = state.isOpen ? (
    <SearchResults ref={resultsRef}>
      {listOutput}
    </SearchResults>
  ) : null;

  return (
    <Container
      style={{zIndex: state.isOpen ? 2000 : undefined}}
    >
      {backdrop}
      <SearchBar>
        <StandardSearch
          placeholder={state.selected ? state.selected.title : 'Search'}
          setSearchQuery={val => updateState({
            ...state,
            searchQuery: val,
            level: levels[0].level,
            parent: null,
            highlightedIndex: 0,
          })}
          initialQuery={''}
          onClear={clearSearch}
          hasSelection={state.selected ? true : false}
          handleKeyDown={handleKeyDown}
          onFocus={() => updateState({...state, isOpen: true})}
        />
      </SearchBar>
      {searchResults}
    </Container>
  );
}
