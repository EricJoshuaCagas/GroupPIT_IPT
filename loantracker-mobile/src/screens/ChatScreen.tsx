import React, { useCallback, useMemo, useRef, useState } from 'react';
import {
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { chatApi } from '../services/api';
import { colors } from '../theme/colors';
import { AppHeader, Screen } from '../components';
import { radius, spacing } from '../theme/metrics';

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
}

export const ChatScreen: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content: 'Hello! I am the LoanTracker assistant. Ask me about loans, payments, or profiles.',
    },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [loading, setLoading] = useState(false);
  const flatListRef = useRef<FlatList<ChatMessage>>(null);

  const scrollToBottom = useCallback(() => {
    requestAnimationFrame(() => {
      flatListRef.current?.scrollToEnd({ animated: true });
    });
  }, []);

  const handleSend = useCallback(async () => {
    const trimmed = inputValue.trim();
    if (!trimmed || loading) return;

    const userMessage: ChatMessage = {
      id: `${Date.now()}-user`,
      role: 'user',
      content: trimmed,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue('');
    scrollToBottom();
    setLoading(true);

    try {
      const response = await chatApi.sendMessage(trimmed);
      const assistantMessage: ChatMessage = {
        id: `${Date.now()}-assistant`,
        role: 'assistant',
        content: response.data.response,
      };
      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        {
          id: `${Date.now()}-assistant-error`,
          role: 'assistant',
          content: 'Sorry, I could not reach the AI service right now. Please try again.',
        },
      ]);
    } finally {
      setLoading(false);
      scrollToBottom();
    }
  }, [inputValue, loading, scrollToBottom]);

  const listData = useMemo(
    () =>
      loading
        ? [
            ...messages,
            { id: 'typing-indicator', role: 'assistant' as const, content: 'AI is typing...' },
          ]
        : messages,
    [loading, messages]
  );

  const renderMessage = useCallback(
    ({ item }: { item: ChatMessage }) => {
      const isUser = item.role === 'user';
      const isTyping = item.id === 'typing-indicator';

      return (
        <View style={[styles.messageBubble, isUser ? styles.userBubble : styles.assistantBubble]}>
          <Text style={isUser ? styles.userText : styles.assistantText}>
            {isTyping ? 'AI is typing...' : item.content}
          </Text>
        </View>
      );
    },
    []
  );

  return (
    <Screen style={styles.screen} edges={['top']}>
      <KeyboardAvoidingView 
        style={styles.container} 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
      >
        <View style={styles.headerWrap}>
          <AppHeader
            title="Chat Assistant"
            subtitle="Ask about borrowers, payments, loan terms, and account activity."
          />
        </View>

        <FlatList
          ref={flatListRef}
          data={listData}
          keyExtractor={(item) => item.id}
          renderItem={renderMessage}
          contentContainerStyle={styles.chatContent}
          showsVerticalScrollIndicator={false}
          onContentSizeChange={scrollToBottom}
          scrollEventThrottle={16}
        />

        <View style={styles.composerWrapper}>
          <View style={styles.composer}>
            <TextInput
              style={styles.input}
              placeholder="Type a message..."
              placeholderTextColor={colors.textSecondary}
              value={inputValue}
              onChangeText={setInputValue}
              multiline
              maxLength={400}
            />
            <View style={styles.sendButtonWrapper}>
              <Pressable
                onPress={handleSend}
                disabled={!inputValue.trim() || loading}
                style={({ pressed }) => [
                  styles.sendButton,
                  pressed && styles.sendButtonPressed,
                  (!inputValue.trim() || loading) && styles.sendButtonDisabled,
                ]}
              >
                <MaterialCommunityIcons
                  name="send"
                  size={20}
                  color={(!inputValue.trim() || loading) ? colors.textSecondary : colors.white}
                />
              </Pressable>
            </View>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Screen>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
  headerWrap: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    paddingBottom: spacing.xs,
  },
  chatContent: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.md,
  },
  messageBubble: {
    maxWidth: '85%',
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    marginBottom: spacing.sm,
  },
  userBubble: {
    alignSelf: 'flex-end',
    backgroundColor: colors.primary,
    borderBottomRightRadius: 4,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    borderBottomLeftRadius: 20,
  },
  assistantBubble: {
    alignSelf: 'flex-start',
    backgroundColor: colors.background,
    borderBottomLeftRadius: 4,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    borderBottomRightRadius: 20,
  },
  userText: {
    color: colors.white,
    lineHeight: 20,
  },
  assistantText: {
    color: colors.textPrimary,
    lineHeight: 20,
  },
  composer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: spacing.sm,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
  },
  composerWrapper: {
    borderTopWidth: 1,
    borderTopColor: colors.border,
    backgroundColor: colors.background,
  },
  input: {
    flex: 1,
    maxHeight: 100,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 20,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    backgroundColor: colors.cardBackground,
    color: colors.textPrimary,
    fontSize: 15,
    fontWeight: '500',
  },
  sendButtonWrapper: {
    width: 48,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  sendButton: {
    width: 48,
    height: 40,
    borderRadius: radius.md,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendButtonPressed: {
    opacity: 0.8,
  },
  sendButtonDisabled: {
    backgroundColor: colors.background,
  },
});
