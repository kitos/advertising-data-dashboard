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
import { filter, flow, groupBy as _groupBy, map } from 'lodash/fp'
import { IAdvertisingRecord } from './api'

export type IGroupBy = 'day' | 'month'

export let AdvertisingChart: FC<{
  data: IAdvertisingRecord[]
  campaigns?: string[]
  dataSources?: string[]
  groupBy?: IGroupBy
}> = ({ data, campaigns = [], dataSources = [], groupBy = 'day' }) => {
  let filteredData = useMemo<IAdvertisingRecord[]>(
    () =>
      flow([
        filter(
          (r: IAdvertisingRecord) =>
            (campaigns.length === 0 || campaigns.includes(r.campaign)) &&
            (dataSources.length === 0 || dataSources.includes(r.dataSource))
        ),
        _groupBy(
          groupBy === 'day'
            ? 'date'
            : (record: IAdvertisingRecord) => record.date.substr(3)
        ),
        map((group: IAdvertisingRecord[]) =>
          group.reduce((sum, record) => ({
            ...sum,
            clicks: sum.clicks + record.clicks,
            impressions: sum.impressions + record.impressions,
          }))
        ),
      ])(data),
    [data, campaigns, dataSources, groupBy]
  )

  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={filteredData} margin={{ left: 50 }}>
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
