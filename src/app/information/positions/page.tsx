import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { NewOrderButton } from './_components/new-order-button'
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
        <NewOrderButton />
      </CardContent>
    </Card>
  )
}
