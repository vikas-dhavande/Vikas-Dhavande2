'use client';

import React, { useState } from 'react';
import { Blobatar } from '@/components/ui/blobatar';

export interface CommentItem {
  id: string;
  authorId: string;
  authorName: string;
  authorAvatar?: string;
  authorProvider: 'google' | 'github' | 'linkedin';
  content: string;
  createdAt: string;
}

interface CommentsSectionProps {
  targetId: string;
  currentUser?: {
    id: string;
    name: string;
    avatar?: string;
    provider: 'google' | 'github' | 'linkedin';
  } | null;
  initialComments?: CommentItem[];
  onLoginOAuth?: (provider: 'google' | 'github' | 'linkedin') => void;
  onPostComment?: (content: string) => Promise<void>;
  onDeleteComment?: (commentId: string) => Promise<void>;
}

export function CommentsSection({
  targetId,
  currentUser = null,
  initialComments = [
    {
      id: 'demo-1',
      authorId: 'user-gh-1',
      authorName: 'Alex Rivera',
      authorProvider: 'github',
      content: 'Remarkable architecture and clean Next.js + Appwrite integration! The semiconductor Hairline component looks crisp.',
      createdAt: '2 hours ago',
    },
  ],
  onLoginOAuth,
  onPostComment,
  onDeleteComment,
}: CommentsSectionProps) {
  const [comments, setComments] = useState<CommentItem[]>(initialComments);
  const [newComment, setNewComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim() || !currentUser) return;

    setIsSubmitting(true);
    try {
      if (onPostComment) {
        await onPostComment(newComment.trim());
      }
      const created: CommentItem = {
        id: `local-${Date.now()}`,
        authorId: currentUser.id,
        authorName: currentUser.name,
        authorAvatar: currentUser.avatar,
        authorProvider: currentUser.provider,
        content: newComment.trim(),
        createdAt: 'Just now',
      };
      setComments((prev) => [created, ...prev]);
      setNewComment('');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (onDeleteComment) {
      await onDeleteComment(id);
    }
    setComments((prev) => prev.filter((c) => c.id !== id));
  };

  const getProviderBadge = (provider: 'google' | 'github' | 'linkedin') => {
    switch (provider) {
      case 'github':
        return <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-muted text-foreground border border-border">GitHub</span>;
      case 'linkedin':
        return <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20">LinkedIn</span>;
      case 'google':
        return <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-red-500/10 text-red-600 dark:text-red-400 border border-red-500/20">Google</span>;
    }
  };

  return (
    <section className="w-full max-w-2xl mt-8 pt-6 border-t border-border">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-semibold tracking-tight text-foreground">
          Discussion ({comments.length})
        </h3>
        {currentUser && (
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <span>Signed in as <strong className="text-foreground">{currentUser.name}</strong></span>
            {getProviderBadge(currentUser.provider)}
          </div>
        )}
      </div>

      {/* Auth Prompt or Comment Form */}
      {currentUser ? (
        <form onSubmit={handleSubmit} className="mb-8 space-y-3">
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Share your thoughts, architectural feedback, or ask a question..."
            rows={3}
            className="w-full p-3 text-sm rounded-xl bg-card border border-input focus:border-ring focus:ring-1 focus:ring-ring outline-none resize-none text-foreground placeholder:text-muted-foreground transition-all"
            required
          />
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={isSubmitting || !newComment.trim()}
              className="px-4 py-2 text-xs font-medium rounded-lg bg-primary text-primary-foreground hover:opacity-90 disabled:opacity-50 transition-opacity"
            >
              {isSubmitting ? 'Posting...' : 'Post Comment'}
            </button>
          </div>
        </form>
      ) : (
        <div className="p-4 mb-8 rounded-xl bg-muted/40 border border-border text-center space-y-3">
          <p className="text-sm text-muted-foreground">
            Sign in with OAuth to join the discussion and share your thoughts:
          </p>
          <div className="flex flex-wrap justify-center gap-2">
            <button
              type="button"
              onClick={() => onLoginOAuth && onLoginOAuth('github')}
              className="px-3 py-1.5 text-xs font-medium rounded-lg bg-card border border-border text-foreground hover:bg-muted transition-colors flex items-center gap-1.5"
            >
              <span>Continue with GitHub</span>
            </button>
            <button
              type="button"
              onClick={() => onLoginOAuth && onLoginOAuth('linkedin')}
              className="px-3 py-1.5 text-xs font-medium rounded-lg bg-card border border-border text-foreground hover:bg-muted transition-colors flex items-center gap-1.5"
            >
              <span>Continue with LinkedIn</span>
            </button>
            <button
              type="button"
              onClick={() => onLoginOAuth && onLoginOAuth('google')}
              className="px-3 py-1.5 text-xs font-medium rounded-lg bg-card border border-border text-foreground hover:bg-muted transition-colors flex items-center gap-1.5"
            >
              <span>Continue with Google</span>
            </button>
          </div>
        </div>
      )}

      {/* Comment List */}
      <div className="space-y-4">
        {comments.map((comment) => (
          <div
            key={comment.id}
            className="p-4 rounded-xl bg-card/60 border border-border/80 space-y-2 text-left"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Blobatar
                  name={comment.authorName}
                  id={comment.authorId}
                  size={32}
                  blobatar={{ animate: 'hover' }}
                />
                <span className="text-sm font-medium text-foreground">{comment.authorName}</span>
                {getProviderBadge(comment.authorProvider)}
                <span className="text-xs text-muted-foreground">{comment.createdAt}</span>
              </div>
              {currentUser && (currentUser.id === comment.authorId || currentUser.name === 'Vikas Dhavande') && (
                <button
                  type="button"
                  onClick={() => handleDelete(comment.id)}
                  aria-label="Delete comment"
                  className="text-xs text-destructive hover:underline"
                >
                  Delete
                </button>
              )}
            </div>
            <p className="text-sm text-foreground/90 pl-9 whitespace-pre-wrap">{comment.content}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
