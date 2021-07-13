import { useEffect, useMemo, useState } from 'react'
import { uniq } from 'lodash/fp'
import { AdvertisingChart } from './AdvertisingChart'
import { getAdvertisingData, IAdvertisingRecord } from './api'

let App = () => {
  let [data, setData] = useState<IAdvertisingRecord[]>([])
  let [campaign, setCampaign] = useState('')
  let [dataSource, setDataSource] = useState('')

  useEffect(() => {
    getAdvertisingData().then(setData)
  }, [])

  let campaigns = useMemo(
    () => uniq(data.map((r) => r.campaign)).filter(Boolean),
    [data]
  )
  let dataSources = useMemo(
    () => uniq(data.map((r) => r.dataSource)).filter(Boolean),
    [data]
  )

  return (
    <div>
      <h1>Advertising Data</h1>

      <div>
        <select value={campaign} onChange={(e) => setCampaign(e.target.value)}>
          <option key="" value="">
            All
          </option>
          {campaigns.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>

        <select
          value={dataSource}
          onChange={(e) => setDataSource(e.target.value)}
        >
          <option key="" value="">
            All
          </option>
          {dataSources.map((ds) => (
            <option key={ds} value={ds}>
              {ds}
            </option>
          ))}
        </select>
      </div>

      <AdvertisingChart
        data={data}
        campaigns={campaign ? [campaign] : []}
        dataSources={dataSource ? [dataSource] : []}
      />
    </div>
  )
}

export default App
