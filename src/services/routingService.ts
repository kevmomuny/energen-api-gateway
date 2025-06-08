import { serviceRoutes, RouteConfig } from '../../config/routes.config';

class RoutingService {
  getTargetService(path: string): RouteConfig | undefined {
    // Find the most specific match first by sorting routes by pathPrefix length descending
    const sortedRoutes = [...serviceRoutes].sort((a, b) => b.pathPrefix.length - a.pathPrefix.length);

    for (const route of sortedRoutes) {
      if (path.startsWith(route.pathPrefix)) {
        return route;
      }
    }
    return undefined;
  }
}

export default new RoutingService();
