import React, { useEffect } from 'react'
import { useSignalData } from '@/hooks/useSignalData'
import { useToast } from '@/hooks/use-toast'
import { Badge } from '@/components/ui/badge'
import { Twitter, Linkedin, Github, Zap } from 'lucide-react'

const getSourceIcon = (source: string) => {
  switch (source) {
    case 'twitter':
      return <Twitter className="w-4 h-4 text-blue-400" />
    case 'linkedin':
      return <Linkedin className="w-4 h-4 text-blue-600" />
    case 'github':
      return <Github className="w-4 h-4 text-gray-700" />
    default:
      return <Zap className="w-4 h-4 text-yellow-600" />
  }
}

export default function SignalNotification() {
  const { signals } = useSignalData()
  const { toast } = useToast()

  useEffect(() => {
    // Find new signals (those marked as new)
    const newSignals = signals.filter(signal => signal.isNew)
    
    newSignals.forEach(signal => {
      toast({
        title: "🚨 New High-Quality Signal Detected!",
        description: (
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <span className="font-semibold">{signal.founder}</span>
              <Badge variant="outline" className="text-xs">
                {signal.company}
              </Badge>
              {getSourceIcon(signal.source)}
            </div>
            <p className="text-sm text-gray-600">{signal.signal}</p>
            <div className="flex items-center space-x-2">
              <Badge 
                variant="secondary" 
                className={`text-xs ${
                  signal.strength >= 90 
                    ? 'text-green-600 bg-green-50 border-green-200' 
                    : 'text-yellow-600 bg-yellow-50 border-yellow-200'
                }`}
              >
                {signal.strength}% match
              </Badge>
              <span className="text-xs text-gray-500">{signal.location}</span>
            </div>
          </div>
        ),
        duration: 8000, // Show for 8 seconds
      })
    })
  }, [signals, toast])

  return null // This component doesn't render anything visible
}