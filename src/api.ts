export interface IAdvertisingRecord {
  date: string
  dataSource: string
  campaign: string
  clicks: number
  impressions: number
}

export let getAdvertisingData = async (): Promise<IAdvertisingRecord[]> => {
  let response = await fetch(
    'http://adverity-challenge.s3-website-eu-west-1.amazonaws.com/DAMKBAoDBwoDBAkOBAYFCw.csv'
  )
  let csv = await response.text()

  return csv
    .split('\n')
    .map((row) => {
      let [date, dataSource, campaign, clicks, impressions] = row.split(',')

      return {
        date,
        dataSource,
        campaign,
        clicks: parseInt(clicks) || 0,
        impressions: parseInt(impressions) || 0,
      }
    })
    .slice(1)
}
