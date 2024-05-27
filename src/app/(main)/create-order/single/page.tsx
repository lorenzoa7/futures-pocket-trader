import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { CreateSingleOrderForm } from './_components/create-single-order-form'

export default function Single() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Create single order</CardTitle>
        <CardDescription>
          Set the parameters and create a single order.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <CreateSingleOrderForm />
      </CardContent>
    </Card>
  )
}
