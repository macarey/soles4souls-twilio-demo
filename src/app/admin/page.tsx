'use client'

import { useState } from 'react'
import { Trash2, AlertTriangle, CheckCircle, XCircle, Loader } from 'lucide-react'

interface Conversation {
  sid: string
  friendlyName: string
  state: string
  dateCreated: string
}

export default function AdminPage() {
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [deleteProgress, setDeleteProgress] = useState({ current: 0, total: 0 })
  const [status, setStatus] = useState<{ type: 'success' | 'error' | 'info', message: string } | null>(null)

  const fetchConversations = async () => {
    setIsLoading(true)
    setStatus(null)
    
    try {
      const response = await fetch('/api/admin/conversations', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }
      })

      if (!response.ok) {
        throw new Error('Failed to fetch conversations')
      }

      const data = await response.json()
      setConversations(data.conversations || [])
      setStatus({ type: 'info', message: `Found ${data.conversations?.length || 0} conversations` })
    } catch (error) {
      setStatus({ 
        type: 'error', 
        message: `Error fetching conversations: ${error instanceof Error ? error.message : 'Unknown error'}` 
      })
    } finally {
      setIsLoading(false)
    }
  }

  const deleteAllConversations = async () => {
    if (conversations.length === 0) {
      setStatus({ type: 'error', message: 'No conversations to delete' })
      return
    }

    setIsDeleting(true)
    setDeleteProgress({ current: 0, total: conversations.length })
    setStatus(null)

    let successCount = 0
    let errorCount = 0

    for (let i = 0; i < conversations.length; i++) {
      const conversation = conversations[i]
      
      try {
        const response = await fetch('/api/admin/conversations', {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ conversationSid: conversation.sid })
        })

        if (response.ok) {
          successCount++
        } else {
          errorCount++
          console.error(`Failed to delete conversation ${conversation.sid}`)
        }
      } catch (error) {
        errorCount++
        console.error(`Error deleting conversation ${conversation.sid}:`, error)
      }

      setDeleteProgress({ current: i + 1, total: conversations.length })
    }

    setIsDeleting(false)
    
    if (errorCount === 0) {
      setStatus({ 
        type: 'success', 
        message: `Successfully deleted all ${successCount} conversations` 
      })
      setConversations([])
    } else {
      setStatus({ 
        type: 'error', 
        message: `Deleted ${successCount} conversations, ${errorCount} failed` 
      })
    }
  }

  const StatusIcon = ({ type }: { type: 'success' | 'error' | 'info' }) => {
    switch (type) {
      case 'success':
        return <CheckCircle className="h-5 w-5 text-green-500" />
      case 'error':
        return <XCircle className="h-5 w-5 text-red-500" />
      case 'info':
        return <AlertTriangle className="h-5 w-5 text-blue-500" />
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white shadow rounded-lg">
          <div className="px-6 py-4 border-b border-gray-200">
            <h1 className="text-2xl font-bold text-gray-900">Twilio Admin Panel</h1>
            <p className="mt-1 text-sm text-gray-600">
              Manage Twilio Conversations and other services
            </p>
          </div>

          <div className="p-6">
            {/* Status Message */}
            {status && (
              <div className={`mb-6 p-4 rounded-md flex items-center space-x-3 ${
                status.type === 'success' ? 'bg-green-50 border border-green-200' :
                status.type === 'error' ? 'bg-red-50 border border-red-200' :
                'bg-blue-50 border border-blue-200'
              }`}>
                <StatusIcon type={status.type} />
                <span className={`text-sm font-medium ${
                  status.type === 'success' ? 'text-green-800' :
                  status.type === 'error' ? 'text-red-800' :
                  'text-blue-800'
                }`}>
                  {status.message}
                </span>
              </div>
            )}

            {/* Delete Progress */}
            {isDeleting && (
              <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-md">
                <div className="flex items-center space-x-3">
                  <Loader className="h-5 w-5 text-yellow-600 animate-spin" />
                  <div className="flex-1">
                    <div className="text-sm font-medium text-yellow-800">
                      Deleting conversations... {deleteProgress.current} of {deleteProgress.total}
                    </div>
                    <div className="mt-2 bg-yellow-200 rounded-full h-2">
                      <div 
                        className="bg-yellow-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${(deleteProgress.current / deleteProgress.total) * 100}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <button
                  onClick={fetchConversations}
                  disabled={isLoading || isDeleting}
                  className="btn-primary flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <Loader className="h-4 w-4 animate-spin" />
                  ) : (
                    <AlertTriangle className="h-4 w-4" />
                  )}
                  <span>Load Conversations</span>
                </button>

                <button
                  onClick={deleteAllConversations}
                  disabled={isLoading || isDeleting || conversations.length === 0}
                  className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition-colors duration-200 flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isDeleting ? (
                    <Loader className="h-4 w-4 animate-spin" />
                  ) : (
                    <Trash2 className="h-4 w-4" />
                  )}
                  <span>Delete All Conversations</span>
                </button>
              </div>

              {/* Conversations List */}
              {conversations.length > 0 && (
                <div className="mt-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">
                    Conversations ({conversations.length})
                  </h3>
                  <div className="bg-gray-50 rounded-md p-4 max-h-96 overflow-y-auto">
                    <div className="space-y-2">
                      {conversations.map((conversation) => (
                        <div key={conversation.sid} className="flex items-center justify-between p-3 bg-white rounded border">
                          <div className="flex-1">
                            <div className="font-medium text-gray-900">
                              {conversation.friendlyName || 'Unnamed Conversation'}
                            </div>
                            <div className="text-sm text-gray-500">
                              SID: {conversation.sid}
                            </div>
                            <div className="text-sm text-gray-500">
                              State: {conversation.state} • Created: {new Date(conversation.dateCreated).toLocaleString()}
                            </div>
                          </div>
                          <div className="text-xs text-gray-400">
                            {conversation.state}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
