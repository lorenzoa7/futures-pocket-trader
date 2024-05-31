import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { CreatePocketSplitOrderForm } from './_components/create-pocket-split-order-form'

export default function Split() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Create pocket split orders</CardTitle>
        <CardDescription>
          Set the parameters and create multiple splitted orders, for each one
          of the symbols in the chosen pocket.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <CreatePocketSplitOrderForm />
      </CardContent>
    </Card>
  )
}
