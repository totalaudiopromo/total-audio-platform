/**
 * MeshOS Insight Router
 * Routes insights to appropriate destinations
 */

import type { Insight, InsightRoute, InsightDestination } from '../types';
import { logger } from '../utils/logger';

export class InsightRouter {
  private workspaceId: string;
  private routes: InsightRoute[] = [];

  constructor(workspaceId: string) {
    this.workspaceId = workspaceId;
    logger.setContext('InsightRouter');
  }

  setRoutes(routes: InsightRoute[]): void {
    this.routes = routes.filter(r => r.enabled).sort((a, b) => b.priority - a.priority);
  }

  async routeInsight(insight: Insight): Promise<InsightDestination[]> {
    logger.info(`Routing insight: ${insight.type}`, { title: insight.title });

    const destinations: InsightDestination[] = [];

    for (const route of this.routes) {
      if (route.insight_type === insight.type) {
        const matches = this.evaluateRule(insight, route.rule);
        if (matches) {
          destinations.push(route.destination);
          logger.debug(`Routing to ${route.destination}`);
        }
      }
    }

    if (destinations.length === 0) {
      logger.warn('No routes found for insight', { type: insight.type });
      destinations.push('dashboard'); // Default fallback
    }

    return [...new Set(destinations)]; // Deduplicate
  }

  private evaluateRule(insight: Insight, rule: InsightRoute['rule']): boolean {
    // Simplified rule evaluation
    if (!rule.conditions) return true;

    // Check conditions
    for (const [key, condition] of Object.entries(rule.conditions)) {
      const value = (insight as any)[key];

      if (typeof condition === 'object') {
        if ('min' in condition && value < condition.min) return false;
        if ('max' in condition && value > condition.max) return false;
      } else {
        if (value !== condition) return false;
      }
    }

    return true;
  }

  async createRoute(route: Omit<InsightRoute, 'id' | 'workspace_id' | 'created_at' | 'updated_at'>): Promise<void> {
    logger.info(`Creating insight route`, { type: route.insight_type, destination: route.destination });
    // Would persist to database
  }
}
