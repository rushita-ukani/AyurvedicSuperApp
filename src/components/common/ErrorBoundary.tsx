import React, { Component, ErrorInfo, ReactNode } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { AlertOctagon, RotateCcw } from 'lucide-react-native';
import { logger } from '../../utils/logger';
import { Colors, spacing, typography } from '../../theme';

interface Props {
  children: ReactNode;
  fallbackText?: string;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    logger.error('ErrorBoundary', 'Uncaught component crash', { error, errorInfo });
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  public render() {
    if (this.state.hasError) {
      return (
        <View style={styles.container}>
          <AlertOctagon color={Colors.danger} size={48} />
          <Text style={styles.title}>Something went wrong</Text>
          <Text style={styles.message}>
            {this.props.fallbackText || 'An unexpected application error occurred.'}
          </Text>
          {this.state.error && (
            <Text style={styles.errorDetails}>{this.state.error.toString()}</Text>
          )}
          <TouchableOpacity activeOpacity={0.8} onPress={this.handleReset} style={styles.retryBtn}>
            <RotateCcw color="#FFFFFF" size={18} style={{ marginRight: spacing.xs }} />
            <Text style={styles.retryText}>Reload Component</Text>
          </TouchableOpacity>
        </View>
      );
    }

    return this.props.children;
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.xl,
    backgroundColor: '#FFF8F8',
  },
  title: {
    ...typography.h2,
    color: Colors.textPrimary,
    marginTop: spacing.md,
  },
  message: {
    ...typography.body,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginTop: spacing.xs,
  },
  errorDetails: {
    ...typography.caption,
    color: Colors.danger,
    marginTop: spacing.sm,
    textAlign: 'center',
    backgroundColor: '#FFEAEA',
    padding: spacing.sm,
    borderRadius: spacing.borderRadiusSm,
  },
  retryBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.primary,
    paddingVertical: spacing.sm + 2,
    paddingHorizontal: spacing.lg,
    borderRadius: spacing.borderRadiusMd,
    marginTop: spacing.xl,
  },
  retryText: {
    ...typography.bodyBold,
    color: '#FFFFFF',
  },
});
