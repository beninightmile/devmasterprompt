
/**
 * Feature guards - Controls access to features based on configuration
 */

import { features } from './registry';

// Check if a feature is enabled
export function isFeatureEnabled(featureId: string): boolean {
  const feature = features.find(f => f.id === featureId);
  return feature ? feature.enabled : false;
}

// Only execute a callback if the feature is enabled
export function withFeature<T>(featureId: string, callback: () => T, fallback: () => T): T {
  return isFeatureEnabled(featureId) ? callback() : fallback();
}

// Throw an error if trying to use a disabled feature
export function guardFeature(featureId: string): void {
  if (!isFeatureEnabled(featureId)) {
    throw new Error(`Feature '${featureId}' is not enabled`);
  }
}
