
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import CopyButton from './CopyButton';

// Mock the toast hook
const mockToast = vi.fn();
vi.mock('@/hooks/use-toast', () => ({
  useToast: () => ({ toast: mockToast }),
}));

// Mock clipboard API
const mockWriteText = vi.fn();
Object.defineProperty(navigator, 'clipboard', {
  value: {
    writeText: mockWriteText,
  },
  writable: true,
});

describe('CopyButton', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockWriteText.mockResolvedValue(undefined);
  });

  it('should render with initial "Copy" text and Copy icon', () => {
    render(<CopyButton text="Test content" />);
    
    expect(screen.getByRole('button')).toHaveTextContent('Copy');
    expect(screen.getByRole('button')).toHaveAttribute('aria-label', 'Copy to clipboard');
  });

  it('should call clipboard API with correct text when clicked', async () => {
    const testText = 'This is test content to copy';
    render(<CopyButton text={testText} />);
    
    const button = screen.getByRole('button');
    fireEvent.click(button);
    
    expect(mockWriteText).toHaveBeenCalledWith(testText);
    expect(mockWriteText).toHaveBeenCalledTimes(1);
  });

  it('should show success toast and change to "Copied" state after successful copy', async () => {
    render(<CopyButton text="Test content" />);
    
    const button = screen.getByRole('button');
    fireEvent.click(button);
    
    await waitFor(() => {
      expect(mockToast).toHaveBeenCalledWith({
        title: "Copied to clipboard",
        description: "Content has been copied to your clipboard.",
      });
    });

    await waitFor(() => {
      expect(button).toHaveTextContent('Copied');
    });
  });

  it('should revert back to "Copy" after timeout', async () => {
    vi.useFakeTimers();
    
    render(<CopyButton text="Test content" />);
    
    const button = screen.getByRole('button');
    fireEvent.click(button);
    
    await waitFor(() => {
      expect(button).toHaveTextContent('Copied');
    });

    // Fast-forward time by 2 seconds
    vi.advanceTimersByTime(2000);
    
    await waitFor(() => {
      expect(button).toHaveTextContent('Copy');
    });
    
    vi.useRealTimers();
  });

  it('should show error toast when clipboard API fails', async () => {
    const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    mockWriteText.mockRejectedValue(new Error('Copy failed'));
    
    render(<CopyButton text="Test content" />);
    
    const button = screen.getByRole('button');
    fireEvent.click(button);
    
    await waitFor(() => {
      expect(mockToast).toHaveBeenCalledWith({
        title: "Failed to copy",
        description: "Content could not be copied to clipboard. Please try again or copy manually.",
        variant: "destructive",
      });
    });

    // Button should still show "Copy" (not "Copied")
    expect(button).toHaveTextContent('Copy');
    
    consoleErrorSpy.mockRestore();
  });

  it('should accept custom props like variant and size', () => {
    render(<CopyButton text="Test" variant="default" size="lg" className="custom-class" />);
    
    const button = screen.getByRole('button');
    expect(button).toHaveClass('custom-class');
  });
});
