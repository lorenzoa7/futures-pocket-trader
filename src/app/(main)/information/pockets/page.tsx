import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { PocketInformation } from './_components/pocket-information'
import { PocketsList } from './_components/pockets-list'

export default function Pockets() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Your pockets</CardTitle>
        <CardDescription>
          Check, create or edit your pockets. Pockets are like lists of symbols,
          used in some parts of the application as a pre-defined set.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex gap-2">
        <PocketsList />
        <PocketInformation />
      </CardContent>
    </Card>
  )
}
