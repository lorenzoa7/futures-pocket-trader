import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'

export default function Split() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Create split orders</CardTitle>
        <CardDescription>
          Set the parameters and create multiple splitted orders.
        </CardDescription>
      </CardHeader>
      <CardContent>Split</CardContent>
    </Card>
  )
}
