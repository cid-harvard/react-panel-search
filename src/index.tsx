import React from 'react'
import sortBy from 'lodash/sortBy';
import Root from './components/Root';

// Singular datum
export interface Datum {
  id: number | string;
  title: string;
  // levels can be either numbers or strings,
  // order is based on value high-to low then
  // alphabetical A-Z
  level: number | string;
  // all data points are expected to have the
  // same hierarchy.
  // i.e. grandparent -> parent -> child
  // NOT  grandparent -> child
  // when searching for an elements parent,
  // it will traverse one level back up the
  // level tree. Top level parent must have a
  // parent_id of null
  parent_id: number | string | null;
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
  onSelect?: (value: Datum | null) => void;
  selectedValue?: Datum | null;
}

const PanelSearch = ({ data, onSelect, selectedValue }: Props) => {
  const levels: Level[] = [];
  data.forEach(datum => {
    let targetIndex = levels.findIndex(({level}) => level === datum.level);
    if (targetIndex === -1) {
      levels.push({
        level: datum.level,
        data: [datum],
      })
    } else {
      levels[targetIndex].data.push(datum);
    }
  });
  if (levels && levels.length) {
    const sortedLevels = sortBy(levels, ['level']);
    return (
      <div>
        <Root
          levels={sortedLevels}
          onSelect={onSelect}
          selectedValue={selectedValue ? selectedValue : null}
        />
      </div>
    );
  } else {
    return null;
  }
}

export default PanelSearch;
