import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { CredentialsForm } from './_components/credentials-form'

export default function Credentials() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Keys</CardTitle>
        <CardDescription>
          Set your binance keys to use the application. This information is
          secured and will only be used inside the app.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <CredentialsForm />
      </CardContent>
    </Card>
  )
}
