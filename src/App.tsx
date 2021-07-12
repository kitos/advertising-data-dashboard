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
    () => Array.from(new Set(data.map((r) => r.campaign))),
    [data]
  )
  let dataSources = useMemo(
    () => Array.from(new Set(data.map((r) => r.dataSource))),
    [data]
  )
  let filteredData = useMemo(
    () =>
      data.filter(
        (r) =>
          (!campaign || r.campaign === campaign) &&
          (!dataSource || r.dataSource === dataSource)
      ),
    [data, campaign, dataSource]
  )

  return (
    <div>
      <h1>Advertising Data</h1>

      <div>
        <select value={campaign} onChange={(e) => setCampaign(e.target.value)}>
          <option value="">All</option>
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
          <option value="">All</option>
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
            activeDot={{ r: 8 }}
          />
          <Line
            type="monotone"
            dot={false}
            dataKey="impressions"
            stroke="#82ca9d"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}

export default App
