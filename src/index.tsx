import React from 'react'
import sortBy from 'lodash/sortBy';
import Root, {Direction} from './components/Root';

// Singular datum
export interface Datum {
  id: number | string;
  title: string;
  // levels can be either numbers or strings,
  // order is based on value high-to low then
  // alphabetical A-Z
  level: number | string | null;
  // all data points are expected to have the
  // same hierarchy.
  // i.e. grandparent -> parent -> child
  // NOT  grandparent -> child
  // when searching for an elements parent,
  // it will traverse one level back up the
  // level tree. Top level parent must have a
  // parent_id of null
  parent_id: number | string | null;
  // optional keywords will also be searched
  keywords?: string[];
  // if always_show is true it will always show in the search results
  always_show?: boolean;
}

// Levels are groupings of all datum
// within the same level hierarchy
export interface Level {
  // each level is identified by it's unique
  // level taken from the provided data
  level: Datum['level'];
  // each level contains a group of all the given
  // data at that level
  data: Datum[];
}

interface Props {
  data: Datum[];
  topLevelTitle?: string;
  onSelect?: (value: Datum | null) => void;
  onHover?: (value: Datum | null) => void;
  onTraverseLevel?: (value: Datum, direction: Direction) => void;
  selectedValue?: Datum | null;
  disallowSelectionLevels?: Level['level'][];
  defaultPlaceholderText?: string;
  showCount?: boolean;
  resultsIdentation?: number;
  neverEmpty?: boolean;
  maxResults?: number;
  focusOnRender?: boolean;
  noResultsFoundFormatter?: (value: string) => string;
  matchingKeywordFormatter?: (matched: string[], rest: string[], query: string) => React.ReactNode;
  onClose?: () => void;
}

const PanelSearch = (props: Props) => {
  const {
    data, onSelect, onHover, selectedValue, topLevelTitle, disallowSelectionLevels,
    onTraverseLevel, defaultPlaceholderText, showCount, resultsIdentation, neverEmpty,
    maxResults, focusOnRender, noResultsFoundFormatter, matchingKeywordFormatter, onClose,
  } = props;
  const topLevelItems: Datum[] = [];
  const levels: Level[] = [];
  sortBy(data, ({title}) => title.toLowerCase()).forEach(datum => {
    if (datum.level !== null) {
      let targetIndex = levels.findIndex(({level}) => level === datum.level);
      if (targetIndex === -1) {
        levels.push({
          level: datum.level,
          data: [datum],
        })
      } else {
        levels[targetIndex].data.push(datum);
      }
    } else {
      topLevelItems.push(datum)
    }
  });
  if (levels && levels.length) {
    const sortedLevels = sortBy(levels, ['level']);
    return (
      <Root
        levels={sortedLevels}
        topLevelItems={topLevelItems}
        onSelect={onSelect}
        onHover={onHover}
        onTraverseLevel={onTraverseLevel}
        selectedValue={selectedValue ? selectedValue : null}
        topLevelTitle={topLevelTitle}
        disallowSelectionLevels={disallowSelectionLevels}
        defaultPlaceholderText={defaultPlaceholderText ? defaultPlaceholderText : 'Search'}
        showCount={showCount ? showCount : false}
        resultsIdentation={resultsIdentation !== undefined ? resultsIdentation : 1}
        neverEmpty={neverEmpty ? neverEmpty : false}
        maxResults={maxResults ? maxResults : null}
        focusOnRender={focusOnRender ? focusOnRender : false}
        noResultsFoundFormatter={noResultsFoundFormatter}
        matchingKeywordFormatter={matchingKeywordFormatter}
        onClose={onClose ? onClose : () => {}}
      />
    );
  } else {
    return null;
  }
}

export default PanelSearch;
