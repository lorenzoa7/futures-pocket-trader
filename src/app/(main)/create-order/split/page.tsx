import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { CreateSplitOrderForm } from './_components/create-split-order-form'

export default function Split() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Create split orders</CardTitle>
        <CardDescription>
          Set the parameters and create multiple splitted orders.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <CreateSplitOrderForm />
      </CardContent>
    </Card>
  )
}
