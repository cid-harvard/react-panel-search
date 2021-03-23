import React, {useState} from 'react';
import PanelSearch, {Datum} from 'react-panel-search';

import raw from 'raw.macro';
import styled from 'styled-components/macro';

const Root = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const PageTitle = styled.h1`
  font-size: 1.4rem;
  font-weight: 400;
  text-align: center;
  color: #444;
  display: flex;
  align-items: center;
  max-width: 1000px;
  margin-bottom: 3rem;
`;

const ClearButton = styled.button`
  padding: 0.4rem;
  text-transform: uppercase;
  background-color: #444;
  border: none;
  color: #fff;
  text-align: center;
  border-radius: 4px;
  font-weight: 600;
  font-size: 0.8rem;
  margin-left: 0.8rem;
  cursor: pointer;
`;

const SearchContainer = styled.div`
  width: 1000px;
  max-width: 100%;
`;

interface NaicsDatum {
  naics_id: number;
  naics_code: string;
  title: string;
  level: number;
  parent_id: number | null;
  parent_code: string | null;
  code_hierarchy: string;
  naics_id_hierarchy: string;
}

const rawData: NaicsDatum[] = JSON.parse(raw('./naics_data.json'));

const App = () => {
  const [selectedValue, setSelectedValue] = useState<Datum | null>(null);

  const data: Datum[] = rawData.map((datum, i) => {
    const keywords: string[] = [];

    if (i === 5) {
      keywords.push('Apple', 'Orange', 'Banana', 'Mango', 'Pear', 'Tangerine', 'Asparagus', 'Potato')
    }
    if (i === 645) {
      keywords.push('Ford', 'Mustang', 'Hyundai', 'Subaru', 'Honda', 'Toyota', 'BMW', 'Tesla')
    }
    if (i === 800) {
      keywords.push('Evergreen', 'Maple')
    }
    if (i === 48) {
      keywords.push(datum.title)
    }

    return {
      id: datum.naics_id,
      title: datum.title,
      level: datum.level,
      parent_id: datum.parent_id,
      keywords,
    }
  })

  data.push({
    id: 'top-level-industries-id',
    title: 'Top Level Industries',
    level: null,
    parent_id: null,
  },{
    id: 'nearby-industries-id',
    title: 'Nearby Industries',
    level: null,
    parent_id: null,
  },)

  const selectedText = selectedValue ? 'Selected: ' + selectedValue.title : 'Nothing selected';
  const clearButton  = selectedValue
    ? <ClearButton onClick={() => setSelectedValue(null)}>Clear</ClearButton>
    : <ClearButton onClick={() => setSelectedValue(data[Math.floor(Math.random() * data.length)])}>Set value randomly</ClearButton>

  const matchingKeywordFormatter = (match: string[], rest: string[], query: string) => {
    const safeQuery = new RegExp(query.replace(/[^\w\s]/gi, '').trim(), 'gi');
    if (match.length || rest.length) {
      const __html = `Includes ${[...match, ...rest].join(', ')}`.replace(safeQuery, (match: string) => `<strong>${match}</strong>`);
      return <div><small dangerouslySetInnerHTML={{__html}} /></div>
    } else {
      return null;
    }
  }

  return (
    <Root>
      <PageTitle>{selectedText} {clearButton}</PageTitle>
      <SearchContainer>
        <PanelSearch
          data={data}
          topLevelTitle={'All Industries'}
          disallowSelectionLevels={[2]}
          onSelect={setSelectedValue}
          selectedValue={selectedValue}
          showCount={true}
          resultsIdentation={1.75}
          maxResults={500}
          matchingKeywordFormatter={matchingKeywordFormatter}
        />
      </SearchContainer>
    </Root>
  );
}

export default App
