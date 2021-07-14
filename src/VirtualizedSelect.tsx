import { ComponentProps, FC } from 'react'
import Select, { SelectComponentsConfig } from 'react-select'
import { FixedSizeList } from 'react-window'

const MENU_WIDTH = 300

let components: SelectComponentsConfig<any, any, any> = {
  MenuList: ({ children, options, maxHeight }) => (
    <FixedSizeList
      height={maxHeight}
      itemCount={options.length}
      itemSize={30}
      width={MENU_WIDTH}
    >
      {({ index, style }) => (
        <div style={style}>{(children as any)[index]}</div>
      )}
    </FixedSizeList>
  ),
}

export let VirtualizedSelect: FC<ComponentProps<typeof Select>> = (props) => (
  <Select
    styles={{
      option: (base) => ({
        ...base,
        maxWidth: MENU_WIDTH,
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap',
        overflow: 'hidden',
      }),
    }}
    components={components}
    {...props}
  />
)
