import React, {useState, useEffect, useRef} from 'react';
import {Level, Datum} from '../'
import StandardSearch from './StandardSearch';
import sortBy from 'lodash/sortBy';
import usePrevious from 'react-use-previous-hook';
import styled from 'styled-components/macro';
import raw from 'raw.macro';

const chevronSVG = raw('../assets/chevron.svg');

const Container = styled.div`
  position: relative;
  width: 100%;
  color: #333;

  ul {
    margin: 0;
    padding: 0;
    list-style: none;
  }

  li {
    li {
      button:before {
        content: '↳';
        margin-right: 0.5rem;
      }
    }
  }

  .react-panel-search-highlighted-item {
    background-color: #f3f3f3;
  }
`;

const SearchBar = styled.div`
  position: relative;
`;

const SearchResults = styled.div`
  position: absolute;
  width: 100%;
  box-sizing: border-box;
  max-height: 300px;
  overflow: auto;
  background-color: #fff;

  &:hover {
    .react-panel-search-highlighted-item:not(:hover) {
      background-color: #fff;
    }
  }

  ::-webkit-scrollbar {
    -webkit-appearance: none;
    width: 7px;
  }
  ::-webkit-scrollbar-thumb {
    border-radius: 4px;
    background-color: rgba(0, 0, 0, .3);
  }
  ::-webkit-scrollbar-track {
    background-color: rgba(0, 0, 0, .1);
  }
`;

const TitleOuter = styled.div`
  font-weight: 600;
  padding: 0.25rem 1.75rem 0.6rem;
  text-transform: uppercase;
  color: #444;
  font-size: 0.85rem;
`;

const BreadCrumbOuter = styled(TitleOuter)`
  &:hover {
    cursor: pointer;
    background-color: #f3f3f3;
  }
`;

const Title = styled.div`
  display: grid;
  grid-column-gap: 0.5rem;
  grid-template-columns: auto 1fr;
  padding: 0.35rem 0;
  border-bottom: solid 1px gray;
`;

const NavButton = styled.button`
  border: none;
  outline: none;
  display: flex;
  justify-content: center;
  height: 100%;
  width: 1.4rem;
  padding: 0.25rem;
  background-color: transparent;

  &:hover {
    cursor: pointer;
  }

  &:focus {
    background-color: #f3f3f3;
  }

  svg {
    width: 100%;
    height: 100%;
    transform: rotate(90deg);

    polyline {
      stroke: gray;
      stroke-width: 0.75px;
    }
  }
`;

const NextButton = styled(NavButton)`
  grid-row: 1;
  grid-column: 2;
  position: relative;
  padding: 0 0.25rem;
  height: 1.5rem;
  background-color: #fff;
  margin: auto 1.75rem auto 0.75rem;

  &:hover {
    cursor: pointer;
    background-color: #f3f3f3;
  }

  svg {
    transform: rotate(-90deg);
  }
`;

const TraverseOnlyButton = styled(NextButton)`
  background-color: transparent;
  pointer-events: none;
`;

const PanelItem = styled.li`
  display: grid;
  grid-template-columns: 1fr auto;
`;

const ButtonBase = styled.button`
  padding: 0.75rem 4rem 0.75rem 2rem;
  font-size: 0.8rem;
  background-color: #fff;
  border: none;
  outline: none;
  display: block;
  width: 100%;
  text-align: left;
  box-sizing: border-box;

  &:hover, &:focus {
    cursor: pointer;
    background-color: #f3f3f3;
  }
`;

const PanelButton = styled(ButtonBase)`
  grid-row: 1;
  grid-column: 1 / 3;
`;

const SearchButton = styled(ButtonBase)`
  padding: 0.6rem 0.75rem
`;

export enum Direction {
  asc = 'asc',
  desc = 'desc',
}

interface Props {
  levels: Level[];
  onSelect: undefined | ((value: Datum | null) => void);
  onTraverseLevel: undefined | ((value: Datum, direction: Direction) => void);
  onHover: undefined | ((value: Datum | null) => void);
  selectedValue: Datum | null;
  topLevelTitle: string | undefined;
  disallowSelectionLevels: undefined | (Level['level'][]);
  defaultPlaceholderText: string;
  showCount: boolean;
  resultsIdentation: number;
  neverEmpty: boolean;
  maxResults: number | null;
}

interface State {
  level: Datum['level'];
  parent: Datum['parent_id'];
  selected: Datum | null;
  searchQuery: string;
  highlightedIndex: number;
  isOpen: boolean;
}

export default (props: Props) => {
  const {
    levels, onSelect, selectedValue, topLevelTitle, disallowSelectionLevels,
    onTraverseLevel, onHover, defaultPlaceholderText, showCount, resultsIdentation,
    neverEmpty, maxResults,
  } = props;

  let initialSelectedValue: Datum | null = selectedValue;
  if (neverEmpty) {
    if (levels.length && initialSelectedValue === null) {
      let i = 0;
      do {
        if (!disallowSelectionLevels || (
          !disallowSelectionLevels.find(l => l === levels[i].level))
          && levels[i].data.length
        ) {
          initialSelectedValue = levels[i].data[0];
          break;
        }
        i++;
      }
      while (i < levels.length)
    }
  }

  const previousSelectedValue = usePrevious(selectedValue);

  const [state, setState] = useState<State>({
    level: levels[0].level,
    parent: null,
    selected: initialSelectedValue,
    searchQuery: '',
    highlightedIndex: 0,
    isOpen: false,
  });

  const updateState = (newState: State) => {
    setState(newState)
  }

  const clearSearch = () => {
    const newSelected = neverEmpty ? state.selected : null;
    updateState({
      level: levels[0].level,
      parent: null,
      selected: newSelected,
      searchQuery: '',
      highlightedIndex: 0,
      isOpen: true,
    })
    if (onSelect) {
      onSelect(newSelected);
    }
  }

  const selectDatum = (value: Datum) => {
    updateState({...state, selected: value, isOpen: false, searchQuery: ''})
    if (onSelect) {
      onSelect(value);
    }
  }

  useEffect(() => {
    if (previousSelectedValue && !selectedValue && !neverEmpty) {
      updateState({...state, selected: null, searchQuery: ''})
    } else if (selectedValue) {
      updateState({...state, selected: selectedValue})
    }
  }, [selectedValue, previousSelectedValue]);

  const closeDropdown = () => setState(current => ({...current, highlightedIndex: 0, isOpen: false}));
  const rootRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    let el: HTMLDivElement;
    const preventClickFromPropagating = (e: MouseEvent) => {
      e.stopPropagation();
    };
    if (rootRef.current !== null) {
      el = rootRef.current;
      el.addEventListener('mousedown', preventClickFromPropagating);
    }

    document.addEventListener('mousedown', closeDropdown);
    return () => {
      document.removeEventListener('mousedown', closeDropdown);
      if (el) {
        el.removeEventListener('mousedown', preventClickFromPropagating);
      }
    };
  }, [rootRef, closeDropdown]);

  const resultsRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const closeOnEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        closeDropdown();
        const focusedElement = document.activeElement as HTMLElement;
        if (focusedElement) {
          focusedElement.blur();
        }
      }
    }
    const node = resultsRef.current;
    if (node) {
      const liElms = Array.from(node.querySelectorAll<HTMLButtonElement>('li .react-panel-search-list-item'));
      for (let li of liElms) {
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
        liElms[index].classList.add('react-panel-search-highlighted-item');
        const highlightedTop = liElms[index].offsetTop;
        const highlightedBottom = highlightedTop + liElms[index].offsetHeight;

        const containerScrollTop = node.scrollTop;
        const containerScrollBottom = containerScrollTop + node.offsetHeight;

        if (highlightedBottom > containerScrollBottom) {
          node.scrollTop = highlightedBottom - node.offsetHeight;
        } else if (highlightedTop < liElms[index].offsetHeight) {
          node.scrollTop = 0;
        } else if (highlightedTop < containerScrollTop) {
          node.scrollTop = highlightedTop;
        }
      }
      document.addEventListener('keydown', closeOnEsc);
    }
    return () => {
      document.removeEventListener('keydown', closeOnEsc);
    }

  }, [state, resultsRef, closeDropdown]);


  const onMouseLeave = () => {
    if (onHover) {
      onHover(null);
    }
  }

  let listOutput: React.ReactElement<any>;

  if (state.searchQuery.length) {
    // Loop through each filtered level to make element list
    // For each parent, find the children in the next level down if not the last level
    // For each level, check if a parent exists, if so skip it
    const filteredElms: React.ReactElement<any>[] = [];
    const renderedIds: Array<string | number> = [];
    const getChildren = (index: number, parent: Datum['parent_id'], depth: number) => {
      const elms: React.ReactElement<any>[] = [];
      sortBy(levels[index].data, ['name']).forEach((child) => {
        if (!maxResults || renderedIds.length < maxResults) {
          if (child.parent_id === parent &&
              !renderedIds.includes(child.id) &&
              child.title.toLowerCase().includes(state.searchQuery.toLowerCase())
            ) {
            renderedIds.push(child.id);
            let childElms: React.ReactElement<any>[] | null;
            if (levels[index + 1] && levels[index + 1].data) {
              childElms = getChildren(index + 1, child.id, depth + 1);
            } else {
              childElms = null;
            }
            const childList = childElms && childElms.length ? (
              <ul
                className={'react-panel-search-list-inner-container'}
              >
                {childElms}
              </ul>
            ) : null;
            const onContinue = () => {
              const targetIndex = levels.findIndex(({level}) => level === child.level);
              updateState({
                ...state, level: levels[targetIndex + 1].level, parent: child.id, 
                highlightedIndex: 0, selected: null, searchQuery: '',
              })
              if (onTraverseLevel !== undefined) {
                onTraverseLevel(child, Direction.desc);
              }
            }
            const onSearch = () => {
              selectDatum(child)
            }
            const onMouseEnter = () => {
              if (onHover) {
                onHover(child);
              }
            }
            const resultElm = disallowSelectionLevels && disallowSelectionLevels.includes(levels[index].level) ? (
              <SearchButton
                onClick={onContinue}
                onMouseEnter={onMouseEnter}
                onMouseLeave={onMouseLeave}
                className={'react-panel-search-list-item traverse-only'}
                style={{paddingLeft: (depth * resultsIdentation) + 'rem', paddingRight: resultsIdentation + 'rem'}}
              >
                {child.title}
              </SearchButton>
            ) : (
              <SearchButton
                onClick={onSearch}
                onMouseEnter={onMouseEnter}
                onMouseLeave={onMouseLeave}
                className={'react-panel-search-list-item'}
                style={{paddingLeft: (depth * resultsIdentation) + 'rem', paddingRight: resultsIdentation + 'rem'}}
              >
                {child.title}
              </SearchButton>
            )
            elms.push(
              <li
                className={'react-panel-search-list-item-container'}
                key={'search-' + child.title + child.id}
              >
                {resultElm}
                {childList}
              </li>
            );
          }
        }
      });
      return elms;
    }
    levels.forEach(({level, data}, i) => {
      sortBy(data, ['name']).forEach((datum) => {
        if (!renderedIds.includes(datum.id) && datum.title.toLowerCase().includes(state.searchQuery.toLowerCase()) && (
              !maxResults || renderedIds.length < maxResults
            )) {
          renderedIds.push(datum.id);
          let childElms: React.ReactElement<any>[] | null;
          if (levels[i + 1] && levels[i + 1].data) {
            childElms = getChildren(i + 1, datum.id, 1);
          } else {
            childElms = null;
          }
          const childList = childElms && childElms.length ? (
            <ul
              className={'react-panel-search-list-inner-container'}
            >
              {childElms}
            </ul>
          ) : null;
          const onContinue = () => {
            const targetIndex = levels.findIndex(target => target.level === level);
            updateState({
              ...state, level: levels[targetIndex + 1].level, parent: datum.id, 
              highlightedIndex: 0, selected: null, searchQuery: '',
            })
            if (onTraverseLevel !== undefined) {
              onTraverseLevel(datum, Direction.desc);
            }
          }
          const onSearch = () => {
            selectDatum(datum)
          }
          const onMouseEnter = () => {
            if (onHover) {
              onHover(datum);
            }
          }
          const resultElm = disallowSelectionLevels && disallowSelectionLevels.includes(level) ? (
            <SearchButton
              onClick={onContinue}
              onMouseEnter={onMouseEnter}
              onMouseLeave={onMouseLeave}
              className={'react-panel-search-list-item traverse-only'}
              style={{paddingLeft: resultsIdentation + 'rem', paddingRight: resultsIdentation + 'rem'}}
            >
              {datum.title}
            </SearchButton>
          ) : (
            <SearchButton
              onClick={onSearch}
              onMouseEnter={onMouseEnter}
              onMouseLeave={onMouseLeave}
              className={'react-panel-search-list-item'}
              style={{paddingLeft: resultsIdentation + 'rem', paddingRight: resultsIdentation + 'rem'}}
            >
              {datum.title}
            </SearchButton>
          )
          filteredElms.push(
            <li
              className={'react-panel-search-list-item-container'}
              key={'search-' + datum.title + datum.id}
            >
              {resultElm}
              {childList}
            </li>
          );
        }
      });
    });
    listOutput = (
      <ul
        className={'react-panel-search-list-root-container'}
      >
        {filteredElms}
      </ul>
    );
  } else {
    const targetIndex = levels.findIndex(({level}) => level === state.level);
    const listItems = levels[targetIndex].data.filter(({parent_id}) => parent_id === state.parent).map(d => {
      const onContinue = () => {
        updateState({
          ...state, level: levels[targetIndex + 1].level, parent: d.id, 
          highlightedIndex: 0,
        })
        if (onTraverseLevel !== undefined) {
          onTraverseLevel(d, Direction.desc);
        }
      }
      const onSearch = () => {
        if (disallowSelectionLevels && disallowSelectionLevels.includes(levels[targetIndex].level)) {
          onContinue();
        } else {
          selectDatum(d)
        }
      }
      const ArrowButton = disallowSelectionLevels && disallowSelectionLevels.includes(levels[targetIndex].level)
        ? TraverseOnlyButton
        : NextButton;
      const className = disallowSelectionLevels && disallowSelectionLevels.includes(levels[targetIndex].level)
        ? 'react-panel-search-list-item traverse-only'
        : 'react-panel-search-list-item';
      const continueButton = targetIndex !== levels.length - 1 ? (
        <ArrowButton
          className={'react-panel-search-next-button'}
          onClick={onContinue}
          dangerouslySetInnerHTML={{__html: chevronSVG}}
        />
      ) : null;

      const onMouseEnter = () => {
        if (onHover) {
          onHover(d);
        }
      }
      const count = showCount && targetIndex !== levels.length - 1
        ? `(${levels[targetIndex + 1].data.filter(({parent_id}) => parent_id === d.id).length})`
        : null;
      return (
        <PanelItem
          key={d.id}
          className={'react-panel-search-panel-item-container'}
        >
          <PanelButton
            onClick={onSearch}
            className={className}
            onMouseEnter={onMouseEnter}
            onMouseLeave={onMouseLeave}
          >{d.title} {count}</PanelButton> {continueButton}
        </PanelItem>
      );
    });

    const parentDatum = parent === null || targetIndex === 0
      ? undefined : levels[targetIndex - 1].data.find(({id}) => id === state.parent);

    const titleText = topLevelTitle ? <span>{topLevelTitle}</span> : null;

    const breadCrumb = !parentDatum ? (
      <TitleOuter
        className={'react-panel-search-current-tier-static-title-outer'}
      >
        <Title
          className={'react-panel-search-current-tier-title'}
        >
          {titleText}
        </Title>
      </TitleOuter>
    ) : (
      <BreadCrumbOuter
        className={'react-panel-search-current-tier-breadcrumb-outer'}
      >
        <Title
          className={'react-panel-search-current-tier-title'}
          onClick={() => {
            updateState({
              ...state,
              level: levels[targetIndex - 1].level,
              parent: parentDatum.parent_id,
              highlightedIndex: 0,
            });
            if (onTraverseLevel !== undefined) {
              onTraverseLevel(parentDatum, Direction.asc);
            }
          }}
        >
          <NavButton
            className={'react-panel-search-previous-button'}
            dangerouslySetInnerHTML={{__html: chevronSVG}}
          />
          <span
            className={'react-panel-search-current-tier-text'}
          >
            {parentDatum.title}
          </span>
        </Title>
      </BreadCrumbOuter>
    )
    listOutput = (
      <React.Fragment>
        {breadCrumb}
        <ul
          className={'react-panel-search-panel-list-root-container'}
        >
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
          if (!highlightedElm.classList.contains('traverse-only')) {
            const focusedInput = document.activeElement as HTMLElement;
            if (focusedInput) {
              focusedInput.blur();
            }
          }
        }
      }
    }
  }

  const searchResults = state.isOpen ? (
    <SearchResults
      ref={resultsRef}
      className={'react-panel-search-search-results'}
    >
      {listOutput}
    </SearchResults>
  ) : null;

  return (
    <Container
      ref={rootRef}
      className={'react-panel-search-root-container'}
      style={{zIndex: state.isOpen ? 2000 : undefined}}
    >
      <SearchBar
        className={'react-panel-search-search-bar'}
      >
        <StandardSearch
          placeholder={state.selected ? state.selected.title : defaultPlaceholderText}
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
          neverEmpty={neverEmpty}
          handleKeyDown={handleKeyDown}
          onFocus={() => updateState({...state, isOpen: true})}
          isOpen={state.isOpen}
          setIsOpen={(isOpen) => updateState({...state, isOpen})}
        />
      </SearchBar>
      {searchResults}
    </Container>
  );
}
