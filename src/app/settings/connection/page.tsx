import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { ConnectionForm } from './_components/connection-form'

export default function Connection() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Connection preferences</CardTitle>
        <CardDescription>
          Set the connection type to your Binance account.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ConnectionForm />
      </CardContent>
    </Card>
  )
}
