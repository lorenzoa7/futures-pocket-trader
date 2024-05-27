import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { PositionsTable } from './_components/positions-table'

export default function Positions() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Open positions</CardTitle>
        <CardDescription>Check your open positions.</CardDescription>
      </CardHeader>
      <CardContent>
        <PositionsTable />
      </CardContent>
    </Card>
  )
}
