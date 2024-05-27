import { capitalizeFirstLetter } from './capitalize-first-letter'

export function formatPathname(value: string) {
  return capitalizeFirstLetter(value.replace(/^\//, '').replace(/-/g, ' '))
}
