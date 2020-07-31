import React, {useState} from 'react';
import {Level, Datum} from '../'
import StandardSearch from './StandardSearch';

interface Props {
  levels: Level[];
}

interface State {
  level: Datum['level'];
  parent: Datum['parent_id'];
}

export default ({levels}: Props) => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [state, setState] = useState<State>({
    level: levels[0].level,
    parent: null,
  });

  let listOutput: React.ReactElement<any>;

  if (searchQuery.length) {
    // Loop through each filtered level to make element list
    // For each parent, find the children in the next level down if not the last level
    // For each level, check if a parent exists, if so skip it
    const filteredElms: React.ReactElement<any>[] = [];
    levels.forEach(({data}) => {
      data.forEach((datum) => {
        if (datum.title.toLowerCase().includes(searchQuery.toLowerCase())) {
          filteredElms.push(
            <li key={'search-' + datum.title + datum.id}>{datum.title}</li>
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
        console.log({search: d.title})
      }
      const continueButton = targetIndex !== levels.length - 1 ? (
        <button
          onClick={() => setState({level: levels[targetIndex + 1].level, parent: d.id})}
        >
          {'>'}
        </button>
      ) : null;
      return (
        <li onClick={onSearch} key={d.id}>
          {d.title} {continueButton}
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
          onClick={() => setState({level: levels[targetIndex - 1].level, parent: parentDatum.parent_id})}
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


  return (
    <React.Fragment>
      <div>
        <StandardSearch
          placeholder={'Search'}
          setSearchQuery={val => setSearchQuery(val)}
          initialQuery={searchQuery}
        />
      </div>
      {listOutput}
    </React.Fragment>
  );
}
