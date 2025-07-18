import React from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { 
  Twitter, 
  Linkedin, 
  Github, 
  MapPin, 
  Star, 
  TrendingUp,
  Users,
  ExternalLink,
  Bookmark,
  Mail
} from 'lucide-react'
import type { Signal } from '@/hooks/useSignalData'

interface FounderProfileModalProps {
  signal: Signal | null
  isOpen: boolean
  onClose: () => void
}

const getSourceIcon = (source: string) => {
  switch (source) {
    case 'twitter':
      return <Twitter className="w-4 h-4 text-blue-400" />
    case 'linkedin':
      return <Linkedin className="w-4 h-4 text-blue-600" />
    case 'github':
      return <Github className="w-4 h-4 text-gray-700" />
    default:
      return null
  }
}

export default function FounderProfileModal({ signal, isOpen, onClose }: FounderProfileModalProps) {
  if (!signal) return null

  // Mock additional data for the profile
  const founderData = {
    avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${signal.founder}`,
    email: `${signal.founder.toLowerCase().replace(' ', '.')}@${signal.company.toLowerCase().replace(' ', '')}.com`,
    experience: '8+ years',
    previousCompanies: ['Microsoft', 'Google', 'Amazon'],
    education: 'IIT Delhi, Computer Science',
    totalSignals: Math.floor(Math.random() * 15) + 5,
    lastActive: '2 hours ago',
    socialLinks: {
      twitter: `@${signal.founder.toLowerCase().replace(' ', '')}`,
      linkedin: `/in/${signal.founder.toLowerCase().replace(' ', '-')}`,
      github: `/${signal.founder.toLowerCase().replace(' ', '')}`
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-3">
            <img 
              src={founderData.avatar} 
              alt={signal.founder}
              className="w-12 h-12 rounded-full"
            />
            <div>
              <h2 className="text-xl font-bold">{signal.founder}</h2>
              <p className="text-gray-600">{signal.company}</p>
            </div>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Quick Stats */}
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center p-3 bg-gray-50 rounded-lg">
              <div className="text-2xl font-bold text-primary">{signal.strength}</div>
              <div className="text-sm text-gray-600">Match Score</div>
            </div>
            <div className="text-center p-3 bg-gray-50 rounded-lg">
              <div className="text-2xl font-bold text-primary">{founderData.totalSignals}</div>
              <div className="text-sm text-gray-600">Total Signals</div>
            </div>
            <div className="text-center p-3 bg-gray-50 rounded-lg">
              <div className="text-2xl font-bold text-primary">{signal.followers}</div>
              <div className="text-sm text-gray-600">Followers</div>
            </div>
          </div>

          {/* Latest Signal */}
          <div className="border border-gray-200 rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-2">
              <h3 className="font-semibold">Latest Signal</h3>
              {getSourceIcon(signal.source)}
              <Badge variant="outline" className="text-xs">
                {signal.time}
              </Badge>
            </div>
            <p className="text-primary font-medium mb-2">{signal.signal}</p>
            <p className="text-gray-600 text-sm">{signal.description}</p>
            <div className="flex items-center space-x-4 mt-3 text-sm text-gray-500">
              <div className="flex items-center">
                <MapPin className="w-4 h-4 mr-1" />
                {signal.location}
              </div>
              <div className="flex items-center">
                <TrendingUp className="w-4 h-4 mr-1" />
                {signal.engagement} engagement
              </div>
            </div>
          </div>

          {/* Founder Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold mb-3">Professional Background</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Experience:</span>
                  <span>{founderData.experience}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Education:</span>
                  <span>{founderData.education}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Last Active:</span>
                  <span>{founderData.lastActive}</span>
                </div>
              </div>
              
              <div className="mt-4">
                <h4 className="font-medium mb-2">Previous Companies</h4>
                <div className="flex flex-wrap gap-2">
                  {founderData.previousCompanies.map((company) => (
                    <Badge key={company} variant="outline" className="text-xs">
                      {company}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>

            <div>
              <h3 className="font-semibold mb-3">Social Presence</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Twitter className="w-4 h-4 text-blue-400" />
                    <span className="text-sm">{founderData.socialLinks.twitter}</span>
                  </div>
                  <Button variant="outline" size="sm">
                    <ExternalLink className="w-3 h-3" />
                  </Button>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Linkedin className="w-4 h-4 text-blue-600" />
                    <span className="text-sm">{founderData.socialLinks.linkedin}</span>
                  </div>
                  <Button variant="outline" size="sm">
                    <ExternalLink className="w-3 h-3" />
                  </Button>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Github className="w-4 h-4 text-gray-700" />
                    <span className="text-sm">{founderData.socialLinks.github}</span>
                  </div>
                  <Button variant="outline" size="sm">
                    <ExternalLink className="w-3 h-3" />
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Signal Strength Breakdown */}
          <div>
            <h3 className="font-semibold mb-3">Signal Strength Analysis</h3>
            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Technical Expertise</span>
                  <span>92%</span>
                </div>
                <Progress value={92} className="h-2" />
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Market Traction</span>
                  <span>85%</span>
                </div>
                <Progress value={85} className="h-2" />
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Team Building</span>
                  <span>78%</span>
                </div>
                <Progress value={78} className="h-2" />
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Funding Readiness</span>
                  <span>88%</span>
                </div>
                <Progress value={88} className="h-2" />
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-3 pt-4 border-t">
            <Button className="flex-1">
              <Mail className="w-4 h-4 mr-2" />
              Contact Founder
            </Button>
            <Button variant="outline" className="flex-1">
              <Bookmark className="w-4 h-4 mr-2" />
              Add to Watchlist
            </Button>
            <Button variant="outline">
              <Star className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}