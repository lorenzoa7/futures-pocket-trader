'use client'

import { useAccountStore } from '@/hooks/store/use-account-store'
import { usePWAInstallPrompt } from '@/hooks/use-pwa-install-prompt'
import { CheckIcon, XIcon } from 'lucide-react'
import { useState } from 'react'
import { Button } from '../ui/button'
import { Checkbox } from '../ui/checkbox'
import { Label } from '../ui/label'

export function PwaInstallButton() {
  const { displayPwaButton } = useAccountStore()
  const [isVisible, setIsVisible] = useState(displayPwaButton)
  const [doNotShowAgain, setDoNotShowAgain] = useState(false)
  const { installPromptEvent } = usePWAInstallPrompt()

  const handleInstallClick = async () => {
    if (installPromptEvent) {
      await installPromptEvent.prompt()

      setIsVisible(false)
      if (doNotShowAgain) {
        useAccountStore.setState((state) => ({
          ...state,
          displayPwaButton: false,
        }))
      }
    }
  }

  const handleDismissClick = () => {
    setIsVisible(false)
    if (doNotShowAgain) {
      useAccountStore.setState((state) => ({
        ...state,
        displayPwaButton: false,
      }))
    }
  }

  if (!isVisible || !installPromptEvent || !displayPwaButton) {
    return null
  }

  return (
    <div className="fixed left-1/2 top-5 z-50 flex w-[75vw] -translate-x-1/2 flex-col items-center gap-4 rounded-lg bg-secondary p-2 shadow-2xl sm:w-fit sm:p-4">
      <h1 className="text-center text-xs font-medium sm:text-sm">
        Do you want to install this application?
      </h1>
      <div className="flex flex-col items-center gap-2">
        <div className="flex items-center gap-2">
          <Checkbox
            checked={doNotShowAgain}
            onCheckedChange={(choice) => {
              if (typeof choice === 'boolean') {
                setDoNotShowAgain(choice)
              }
            }}
            id="doNotShowAgain"
            className="size-4"
          />
          <Label
            htmlFor="doNotShowAgain"
            className="text-xs font-light leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 sm:text-sm"
          >
            {"Don't ask again on this browser"}
          </Label>
        </div>
        <div className="flex items-center gap-2">
          <Button
            size="sm"
            onClick={handleDismissClick}
            className="rounded-lg border-none bg-red-300 px-2 py-1 text-xs uppercase text-primary hover:bg-red-400 dark:bg-red-600 dark:hover:bg-red-700 sm:px-4 sm:text-sm"
          >
            <XIcon className="mr-1 size-4 sm:mr-2" />
            No
          </Button>
          <Button
            size="sm"
            onClick={handleInstallClick}
            className="rounded-lg border-none bg-green-300 px-2 py-1 text-xs uppercase text-primary hover:bg-green-400 dark:bg-green-600 dark:hover:bg-green-700 sm:px-4 sm:text-sm"
          >
            <CheckIcon className="mr-1 size-4 sm:mr-2" />
            Yes
          </Button>
        </div>
      </div>
    </div>
  )
}
