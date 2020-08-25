# react-panel-search

## by the Growth Lab at Harvard's Center for International Development

A fast and lightweight component for searching and selecting hierarchical tree data.

> This package is part of Harvard Growth Lab’s portfolio of software packages, digital products and interactive data visualizations.  To browse our entire portfolio, please visit [growthlab.app](https://growthlab.app/).  To learn more about our research, please visit [Harvard Growth Lab’s](https://growthlab.cid.harvard.edu/) home page.

[![NPM](https://img.shields.io/npm/v/react-panel-search.svg)](https://www.npmjs.com/package/react-panel-search) [![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

### [View live example ↗](https://cid-harvard.github.io/react-panel-search/)

## Install

```bash
npm install --save react-panel-search
```

## Usage

```tsx
import React from 'react'
import PanelSearch from 'react-panel-search'

const App = () => {

  ...

  return <PanelSearch data={data} />
}

export default App

```

The only required prop for react-panel-search is `data`, which is an array of type `Datum`. Several additional props allow for greater control and customization, as outlined below.

- **data**: `Datum[]` An array of type Datum -
    - **id**: `number | string` A unique identifier for this particular datum
    - **title**: `string` The title that will be rendered
    - **level**: `number | string` The hierarchal level of this datum. The order of levels is automatically calculated based on value going from numeric high-to-low then alphabetical A-Z
    - **parent_id**: `number | string | null` The id of the parent value, one level higher than the current datum's level. For a top level datum, this should be `null`
- **topLevelTitle** *(optional)*: `string` The title text that will appear in the panel when at the highest tier
- **onTraverseLevel** *(optional)*: `(value: Datum, direction: 'asc' | 'desc') => void` Callback function for returning the value of the node being traversed.
- **onSelect** *(optional)*: `(value: Datum | null) => void` Callback function for returning the selected value.
- **selectedValue** *(optional)*: `Datum | null` This can be used to both set an initially selected value or to clear the current value with an external component
- **disallowSelectionLevels** *(optional)*: `Array<number | string>` An array of values corresponding to levels of datum that should only serve as a hierarchal category and not be selectable.

## License

MIT © [The President and Fellows of Harvard College](https://www.harvard.edu/)
