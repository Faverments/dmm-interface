// components/FuseHighlight.jsx
import React from 'react'

import useTheme from 'hooks/useTheme'

// Finds `obj[path][to][key]` from `path.to.key`
const resolveAttribute = (obj: any, key: string) => key.split('.').reduce((prev, curr) => prev?.[curr], obj)

// FuseHighlight component
const FuseHighlight = ({ hit, attribute, style }: { hit: any; attribute: string; style?: React.CSSProperties }) => {
  const matches = typeof hit.item === 'string' ? hit.matches?.[0] : hit.matches?.find((m: any) => m.key === attribute)
  const fallback = typeof hit.item === 'string' ? hit.item : resolveAttribute(hit.item, attribute)
  // Recursively builds JSX output adding `<mark>` tags around matches
  const Highlight = (value: any, indices = [], i = 1): any => {
    const theme = useTheme()
    const pair = indices[indices.length - i]
    return !pair ? (
      value
    ) : (
      <>
        {Highlight(value.substring(0, pair[0]), indices, i + 1)}
        <mark
          style={
            style || {
              color: theme.textReverse,
              backgroundColor: theme.primary,
              borderRadius: '4px',
              padding: '0 1px',
            }
          }
        >
          {value.substring(pair[0], pair[1] + 1)}
        </mark>
        {value.substring(pair[1] + 1)}
      </>
    )
  }
  return Highlight(matches?.value || fallback, matches?.indices)
}

export default FuseHighlight
