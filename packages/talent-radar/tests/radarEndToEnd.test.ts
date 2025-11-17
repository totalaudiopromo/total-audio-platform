/**
 * Talent Radar End-to-End Tests
 */

import { describe, it, expect } from '@jest/globals';
import {
  calculateMomentumScore,
  calculateBreakoutScore,
  calculateRiskScore,
} from '../src/utils/scoring';

describe('Talent Radar - Scoring Functions', () => {
  describe('Momentum Scoring', () => {
    it('should calculate high momentum for strong signals', () => {
      const score = calculateMomentumScore({
        campaignVelocity: 1.5, // +150% growth
        coverageVelocity: 1.2, // +120% growth
        creativeShift: 0.8,
        audienceChange: 0.9, // +90% growth
        playlistVelocity: 0.7, // +70% growth
      });

      expect(score).toBeGreaterThan(70);
      expect(score).toBeLessThanOrEqual(100);
    });

    it('should calculate low momentum for weak signals', () => {
      const score = calculateMomentumScore({
        campaignVelocity: -0.2, // -20% decline
        coverageVelocity: -0.1, // -10% decline
        creativeShift: 0.1,
        audienceChange: -0.3, // -30% decline
        playlistVelocity: 0, // No change
      });

      expect(score).toBeLessThan(40);
    });
  });

  describe('Breakout Scoring', () => {
    it('should predict high breakout for strong combined signals', () => {
      const score = calculateBreakoutScore({
        momentum: 85,
        migConnectivity: 0.8,
        pressQuality: 0.75,
        creativeShift: 0.7,
        sceneHotness: 82,
        identityAlignment: 0.8,
      });

      expect(score).toBeGreaterThan(0.7);
      expect(score).toBeLessThanOrEqual(1);
    });

    it('should predict low breakout for weak signals', () => {
      const score = calculateBreakoutScore({
        momentum: 30,
        migConnectivity: 0.2,
        pressQuality: 0.3,
        creativeShift: 0.2,
        sceneHotness: 35,
        identityAlignment: 0.4,
      });

      expect(score).toBeLessThan(0.4);
    });
  });

  describe('Risk Scoring', () => {
    it('should detect high risk for declining signals', () => {
      const score = calculateRiskScore({
        momentum: 25, // Low
        coverageVelocity: -0.4, // Declining
        creativeShift: 0.1, // Stagnant
        identityAlignment: 0.3, // Misaligned
        sceneHotness: 30, // Declining scene
        audienceChange: -0.5, // Losing audience
      });

      expect(score).toBeGreaterThan(0.6);
      expect(score).toBeLessThanOrEqual(1);
    });

    it('should detect low risk for healthy signals', () => {
      const score = calculateRiskScore({
        momentum: 75,
        coverageVelocity: 0.5, // Growing
        creativeShift: 0.7, // Evolving
        identityAlignment: 0.8, // Coherent
        sceneHotness: 80, // Hot scene
        audienceChange: 0.6, // Growing audience
      });

      expect(score).toBeLessThan(0.3);
    });
  });

  describe('Data Validation', () => {
    it('should handle edge cases in momentum calculation', () => {
      const score = calculateMomentumScore({
        campaignVelocity: 0,
        coverageVelocity: 0,
        creativeShift: 0,
        audienceChange: 0,
        playlistVelocity: 0,
      });

      expect(score).toBeGreaterThanOrEqual(0);
      expect(score).toBeLessThanOrEqual(100);
    });

    it('should clamp breakout score to 0-1 range', () => {
      const score = calculateBreakoutScore({
        momentum: 100,
        migConnectivity: 1,
        pressQuality: 1,
        creativeShift: 1,
        sceneHotness: 100,
        identityAlignment: 1,
      });

      expect(score).toBeGreaterThanOrEqual(0);
      expect(score).toBeLessThanOrEqual(1);
    });
  });
});

describe('Talent Radar - Integration Scenarios', () => {
  it('should identify a breakout candidate correctly', () => {
    // Scenario: Rising artist with strong signals across the board
    const momentum = calculateMomentumScore({
      campaignVelocity: 1.8,
      coverageVelocity: 1.5,
      creativeShift: 0.75,
      audienceChange: 1.2,
      playlistVelocity: 0.9,
    });

    const breakout = calculateBreakoutScore({
      momentum,
      migConnectivity: 0.75,
      pressQuality: 0.8,
      creativeShift: 0.75,
      sceneHotness: 85,
      identityAlignment: 0.8,
    });

    const risk = calculateRiskScore({
      momentum,
      coverageVelocity: 1.5,
      creativeShift: 0.75,
      identityAlignment: 0.8,
      sceneHotness: 85,
      audienceChange: 1.2,
    });

    // Artist should have high momentum, high breakout, low risk
    expect(momentum).toBeGreaterThan(75);
    expect(breakout).toBeGreaterThan(0.7);
    expect(risk).toBeLessThan(0.3);
  });

  it('should identify an at-risk artist correctly', () => {
    // Scenario: Artist experiencing stagnation and decline
    const momentum = calculateMomentumScore({
      campaignVelocity: -0.3,
      coverageVelocity: -0.4,
      creativeShift: 0.15,
      audienceChange: -0.2,
      playlistVelocity: -0.1,
    });

    const breakout = calculateBreakoutScore({
      momentum,
      migConnectivity: 0.3,
      pressQuality: 0.35,
      creativeShift: 0.15,
      sceneHotness: 40,
      identityAlignment: 0.4,
    });

    const risk = calculateRiskScore({
      momentum,
      coverageVelocity: -0.4,
      creativeShift: 0.15,
      identityAlignment: 0.4,
      sceneHotness: 40,
      audienceChange: -0.2,
    });

    // Artist should have low momentum, low breakout, high risk
    expect(momentum).toBeLessThan(35);
    expect(breakout).toBeLessThan(0.3);
    expect(risk).toBeGreaterThan(0.6);
  });
});
