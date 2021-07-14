import { useEffect, useMemo, useState } from 'react'
import { uniq } from 'lodash/fp'
import Select, { ValueType } from 'react-select'

import { AdvertisingChart } from './AdvertisingChart'
import { getAdvertisingData, IAdvertisingRecord } from './api'
import { VirtualizedSelect } from './VirtualizedSelect'

import classes from './App.module.css'

let toOption = (value: string) => ({ value, label: value })

type ISelectValue = ValueType<{ label: string; value: string }, true> | null

let App = () => {
  let [data, setData] = useState<IAdvertisingRecord[]>([])
  let [campaign, setCampaign] = useState<ISelectValue>(null)
  let [dataSource, setDataSource] = useState<ISelectValue>(null)

  useEffect(() => {
    getAdvertisingData().then(setData)
  }, [])

  let campaignOptions = useMemo(
    () =>
      uniq(data.map((r) => r.campaign))
        .filter(Boolean)
        .map(toOption),
    [data]
  )
  let dataSourceOptions = useMemo(
    () =>
      uniq(data.map((r) => r.dataSource))
        .filter(Boolean)
        .map(toOption),
    [data]
  )

  return (
    <div className={classes.layout}>
      <header className={classes.header}>
        <h1>Advertising Data</h1>
      </header>

      <aside className={classes.side}>
        <label>
          <span className={classes.fieldLabel}>Campaigns</span>

          <VirtualizedSelect
            defaultValue={campaign}
            onChange={setCampaign as any}
            options={campaignOptions}
            isMulti
          />
        </label>

        <label>
          <span className={classes.fieldLabel}>Data source</span>

          <Select
            defaultValue={dataSource}
            onChange={setDataSource}
            options={dataSourceOptions}
            isMulti
          />
        </label>
      </aside>

      <main className={classes.content}>
        <AdvertisingChart
          data={data}
          campaigns={campaign ? campaign.map((c) => c.value) : []}
          dataSources={dataSource ? dataSource.map((c) => c.value) : []}
        />
      </main>
    </div>
  )
}

export default App
