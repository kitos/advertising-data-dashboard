import { FC } from 'react'
import { useMemo } from 'react'
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { filter, flow, groupBy, map } from 'lodash/fp'
import { IAdvertisingRecord } from './api'

export let AdvertisingChart: FC<{
  data: IAdvertisingRecord[]
  campaigns?: string[]
  dataSources?: string[]
}> = ({ data, campaigns = [], dataSources = [] }) => {
  let filteredData = useMemo<IAdvertisingRecord[]>(
    () =>
      flow([
        filter(
          (r: IAdvertisingRecord) =>
            (campaigns.length === 0 || campaigns.includes(r.campaign)) &&
            (dataSources.length === 0 || dataSources.includes(r.dataSource))
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
    [data, campaigns, dataSources]
  )

  return (
    <ResponsiveContainer width="100%" height={700}>
      <LineChart
        data={filteredData}
        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
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
  )
}
