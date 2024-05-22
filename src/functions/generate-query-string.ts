import { getSignature } from './get-signature'

type Props = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  params: Record<any, any>
  secretKey?: string
}

export function generateQueryString(props: Props) {
  const params = props.params
  if (props.secretKey) {
    params.signature = getSignature({
      params: props.params,
      secretKey: props.secretKey,
    })
  }

  const keys = Object.keys(props.params)
  const keyValuePairs = keys.map((key) => `${key}=${props.params[key]}`)
  return '?' + keyValuePairs.join('&')
}
