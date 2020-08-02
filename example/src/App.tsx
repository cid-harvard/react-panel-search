import React, {useState} from 'react'

import PanelSearch, {Datum} from 'react-panel-search'
import 'react-panel-search/dist/index.css'

import raw from 'raw.macro';

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
  const clearButton  = selectedValue ? <button onClick={() => setSelectedValue(null)}>Clear</button> : null;

  return (
    <>
      <h1>{selectedText} {clearButton}</h1>
      <PanelSearch
        data={data}
        onSelect={setSelectedValue}
        selectedValue={selectedValue}
      />
    </>
  );
}

export default App
