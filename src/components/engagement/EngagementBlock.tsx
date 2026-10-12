'use client';

import React, { useEffect, useState } from 'react';
import { ReactionsBar, EmojiType } from './ReactionsBar';
import { CommentsSection, CommentItem } from './CommentsSection';
import { getCurrentUser, loginOAuth, logoutUser, AppwriteUser } from '@/lib/appwrite';
import { Column, Flex, Text } from '@/once-ui/components';

interface EngagementBlockProps {
  targetId: string;
  title?: string;
}

export function EngagementBlock({ targetId, title }: EngagementBlockProps) {
  const [currentUser, setCurrentUser] = useState<AppwriteUser | null>(null);

  useEffect(() => {
    getCurrentUser().then(setCurrentUser);

    const handleAuthChange = () => {
      getCurrentUser().then(setCurrentUser);
    };

    window.addEventListener('auth_state_change', handleAuthChange);
    return () => window.removeEventListener('auth_state_change', handleAuthChange);
  }, []);

  const handleOAuthLogin = (provider: 'google' | 'github' | 'linkedin') => {
    loginOAuth(provider);
  };

  return (
    <Column fillWidth maxWidth="xs" gap="m" paddingY="l" style={{ margin: 'auto' }}>
      <Flex fillWidth borderBottom="neutral-medium" paddingBottom="s" horizontal="space-between" vertical="center">
        <Text variant="heading-strong-xs" onBackground="neutral-strong">
          Community & Discussion
        </Text>
        {currentUser && (
          <Flex gap="8" vertical="center">
            <Text variant="body-default-xs" onBackground="neutral-weak">
              Signed in as <span className="font-semibold">{currentUser.name}</span>
            </Text>
            <button
              type="button"
              onClick={logoutUser}
              className="text-xs text-red-500 hover:underline cursor-pointer ml-1"
            >
              Sign out
            </button>
          </Flex>
        )}
      </Flex>

      <ReactionsBar
        targetId={targetId}
        isAuthenticated={Boolean(currentUser)}
        onRequireAuth={() => handleOAuthLogin('github')}
      />

      <CommentsSection
        targetId={targetId}
        currentUser={
          currentUser
            ? {
                id: currentUser.id,
                name: currentUser.name,
                avatar: currentUser.avatar,
                provider: currentUser.provider,
              }
            : null
        }
        onLoginOAuth={handleOAuthLogin}
      />
    </Column>
  );
}
