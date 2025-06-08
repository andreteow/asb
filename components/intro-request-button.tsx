"use client"

import { useState } from "react"
import { Mail } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { IntroRequestForm } from "@/components/intro-request-form"
import type { Entity } from "@/lib/types"

interface IntroRequestButtonProps {
  entity: Entity
}

export function IntroRequestButton({ entity }: IntroRequestButtonProps) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="bg-primary-700 hover:bg-primary-800">
          <Mail className="mr-2 h-4 w-4" />
          Request Intro
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Request Introduction</DialogTitle>
          <DialogDescription>
            Fill out this form to request an introduction to {entity.name}. We'll get back to you within 24 hours.
          </DialogDescription>
        </DialogHeader>
        <IntroRequestForm entity={entity} onSuccess={() => setIsOpen(false)} />
      </DialogContent>
    </Dialog>
  )
}
