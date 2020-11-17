# react-panel-search

## by the Growth Lab at Harvard's Center for International Development

A fast and lightweight component for searching and selecting hierarchical tree data.

> This package is part of Harvard Growth Lab’s portfolio of software packages, digital products and interactive data visualizations. To browse our entire portfolio, please visit The Viz Hub at [growthlab.app](https://growthlab.app/). To learn more about our research, please visit [Harvard Growth Lab’s](https://growthlab.cid.harvard.edu/) home page.

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
    - **level**: `number | string | null` The hierarchal level of this datum. The order of levels is automatically calculated based on value going from numeric high-to-low then alphabetical A-Z. If the value is set to `null` it will be considered a [top-level item](#optionaltoplevelitems).
    - **parent_id**: `number | string | null` The id of the parent value, one level higher than the current datum's level. For a top level datum, this should be `null`
    - **keywords** *(optional)*: `string[]` An array of strings that will also be checked when returning results
- **topLevelTitle** *(optional)*: `string` The title text that will appear in the panel when at the highest tier
- **onTraverseLevel** *(optional)*: `(value: Datum, direction: 'asc' | 'desc') => void` Callback function for returning the value of the node being traversed.
- **onSelect** *(optional)*: `(value: Datum | null) => void` Callback function for returning the selected value.
- **onHover** *(optional)*: `(value: Datum | null) => void` Callback function for returning the hovered value.
- **selectedValue** *(optional)*: `Datum | null` This can be used to both set an initially selected value or to clear the current value with an external component
- **disallowSelectionLevels** *(optional)*: `Array<number | string>` An array of values corresponding to levels of datum that should only serve as a hierarchal category and not be selectable.
- **defaultPlaceholderText** *(optional)*: `string` Placeholder text that will appear in the search field when empty
- **showCount** *(optional)*: `boolean` Display the number of child elements next to the parent name. Defaults to `false`.
- **resultsIdentation** *(optional)*: `number` Value, in `rem`, of how much to indent each tier of search results. Defaults to `1`.
- **neverEmpty** *(optional)*: `boolean` If true, the dropdown can never be null and will always be equal to an acceptable value in the dataset. If no initial value is given via `selectedValue` then the first acceptable value in the dataset will be used. Defaults to `false`.
- **maxResults** *(optional)*: `number` Set the maximum number of results to display when the user enters a search term. By default no limit is set.
- **focusOnRender** *(optional)*: `boolean` Focus the dropdown as soon as it is rendered. Defaults to `false`.
- **noResultsFoundFormatter** *(optional)*: `(value: string) => string` Callback that receives the current search query and returns a string that will be shown when no results are found. Defaults to `No results found for { query }`

<a name="optionaltoplevelitems"/>

## Optional top level items

Top-level items can easily be added to react-panel-search. Top-level items are items that appear above the dropdowns title and contain no child elements. See the [live example](https://cid-harvard.github.io/react-panel-search/) for an idea of what this looks like. To include top-level items, an individual datum sent in the `data` prop should have both the `level` and `parent_id` set to `null`.

## Styling

react-panel-search comes out of the box with generic styling. However static class names have been added to all of the elements that make up the component to allow for full customizability of its appearance.

## License

MIT © [The President and Fellows of Harvard College](https://www.harvard.edu/)
