import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { OrdersTable } from './_components/orders-table'

export default function Orders() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Open orders</CardTitle>
        <CardDescription>Check your open orders.</CardDescription>
      </CardHeader>
      <CardContent>
        <OrdersTable />
      </CardContent>
    </Card>
  )
}
