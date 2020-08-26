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

  const data: Datum[] = rawData.map(datum => {
    return {
      id: datum.naics_id,
      title: datum.title,
      level: datum.level,
      parent_id: datum.parent_id,
    }
  })

  const selectedText = selectedValue ? 'Selected: ' + selectedValue.title : 'Nothing selected';
  const clearButton  = selectedValue
    ? <ClearButton onClick={() => setSelectedValue(null)}>Clear</ClearButton>
    : <ClearButton onClick={() => setSelectedValue(data[Math.floor(Math.random() * data.length)])}>Set value randomly</ClearButton>

  return (
    <Root>
      <PageTitle>{selectedText} {clearButton}</PageTitle>
      <SearchContainer>
        <PanelSearch
          data={data}
          topLevelTitle={'All Industries'}
          disallowSelectionLevels={[2]}
          onSelect={setSelectedValue}
          onHover={val => console.log(val)}
          selectedValue={selectedValue}
          onTraverseLevel={(data, direction) => console.log(data.id, direction)}
          showCount={true}
          resultsIdentation={1.75}
        />
      </SearchContainer>
    </Root>
  );
}

export default App
