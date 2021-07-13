import { flow, filter, groupBy, map, uniq } from 'lodash/fp'
import { useEffect, useMemo, useState } from 'react'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'
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
  let filteredData = useMemo<IAdvertisingRecord[]>(
    () =>
      flow([
        filter(
          (r: IAdvertisingRecord) =>
            (!campaign || r.campaign === campaign) &&
            (!dataSource || r.dataSource === dataSource)
        ),
        groupBy('date'),
        map((group: IAdvertisingRecord[]) =>
          group.reduce((sum, record) => ({
            ...sum,
            clicks: sum.clicks + record.clicks,
            impressions: sum.impressions + record.impressions,
          }))
        ),
      ])(data),
    [data, campaign, dataSource]
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

      <ResponsiveContainer width="100%" height={700}>
        <LineChart
          data={filteredData}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line
            type="monotone"
            dataKey="clicks"
            stroke="#8884d8"
            dot={false}
            animateNewValues={false}
            activeDot={{ r: 8 }}
          />
          <Line
            type="monotone"
            dot={false}
            animateNewValues={false}
            dataKey="impressions"
            stroke="#82ca9d"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}

export default App
