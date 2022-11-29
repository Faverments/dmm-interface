// components/FuseHighlight.jsx
import React from 'react'

import useTheme from 'hooks/useTheme'

// Finds `obj[path][to][key]` from `path.to.key`

const resolveAttribute = (obj: any, key: string, attributeArrayIndex: number) =>
  key.split('.').reduce(
    (prev, curr) => {
      if (Array.isArray(prev?.[curr])) {
        return prev?.[curr][attributeArrayIndex]
      }

      return prev?.[curr]
    },

    obj,
  )

// FuseHighlight component
const FuseHighlight = ({
  hit,
  attribute,
  style,
  attributeArrayIndex = 0,
  value,
}: {
  hit: any
  attribute: string
  style?: React.CSSProperties
  attributeArrayIndex?: number
  value?: string
}) => {
  const matches =
    typeof hit.item === 'string'
      ? hit.matches?.[0]
      : hit.matches
          ?.filter((m: any) => {
            if (value) {
              return m.value === value
            } else {
              return true
            }
          })
          .find((m: any) => m.key === attribute)
  const fallback = typeof hit.item === 'string' ? hit.item : resolveAttribute(hit.item, attribute, attributeArrayIndex)
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
