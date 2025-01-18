/// <reference types="vitest" />
/// <reference types="@testing-library/jest-dom" />
import { vi } from 'vitest';

// Mock fetch globally
global.fetch = vi.fn();
