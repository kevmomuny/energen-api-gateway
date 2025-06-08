# JULES INSTRUCTIONS: Energen API Gateway

**Project:** Energen API Gateway - Centralized API Management & Microservices
**Repository:** `C:\Dev\energen-api-gateway`
**Technology Stack:** Node.js + Express + TypeScript + Redis + Docker
**Priority:** CRITICAL - Foundation for scalable architecture

## 🎯 PROJECT MISSION

Create a robust API Gateway that serves as the central hub for all Energen applications:
- Unified authentication and authorization across all platforms
- Rate limiting and request throttling for API protection
- Request routing and load balancing to backend services
- API versioning and backward compatibility management
- Centralized logging, monitoring, and analytics
- Microservices orchestration and service discovery

## 🏗️ ARCHITECTURE REQUIREMENTS

### **Technology Foundation**
- **Runtime:** Node.js 18+ with TypeScript
- **Framework:** Express.js with middleware architecture
- **Caching:** Redis for session management and rate limiting
- **Security:** JWT tokens, API keys, OAuth integration
- **Containerization:** Docker for consistent deployment
- **Monitoring:** Comprehensive logging and health checks

### **Integration Points**
**CRITICAL:** Coordinate with existing Energen ecosystem:
- **Mobile App:** Android application API requests
- **Sales Platform:** Web application API calls
- **Client Portal:** Customer-facing API access
- **Operations Dashboard:** Internal operations API
- **Zoho Catalyst:** Backend service orchestration

## 🔌 CORE FEATURES TO IMPLEMENT

### **1. Authentication Hub (Priority 1)**
```
/auth
- Unified login for all Energen applications
- JWT token generation and validation
- Role-based access control (customer, technician, sales, admin)
- OAuth integration with Zoho CRM
- Session management and refresh tokens
```

### **2. API Routing & Load Balancing (Priority 1)**
```
/api/v1
- Request routing to appropriate backend services
- Load balancing across multiple service instances
- Health check and failover mechanisms
- Request/response transformation
- API versioning and deprecation management
```

### **3. Security & Rate Limiting (Priority 2)**
```
Security Features:
- API key management and validation
- Rate limiting per user/IP/endpoint
- Request throttling and queuing
- DDoS protection and anomaly detection
- CORS handling and security headers
```

### **4. Monitoring & Analytics (Priority 2)**
```
/admin/monitoring
- Real-time API usage metrics
- Performance monitoring and alerting
- Error tracking and debugging
- Usage analytics and reporting
- Service health dashboard
```

### **5. Developer Portal (Priority 3)**
```
/docs
- API documentation and examples
- Interactive API explorer
- SDK generation and downloads
- Developer registration and key management
- Usage guidelines and best practices
```

## 🔌 SERVICE INTEGRATION

### **Backend Services to Orchestrate**
Base URL: `https://mobile-bid-tool-888909920.development.catalystserverless.com/server/`

**Service Registry:**
- `zoho-sync-manager` - CRM integration and data sync
- `compliance-validator` - NFPA/CARB compliance services
- `proposal-generator` - Estimate and proposal services
- `analytics-dashboard` - Performance metrics and reporting
- `equipment-analysis-processor` - Equipment data processing
- `ai-orchestration-service` - AI/ML service coordination

### **API Route Structure**
```
/api/v1/auth/*          → Authentication services
/api/v1/customers/*     → Customer management (zoho-sync-manager)
/api/v1/equipment/*     → Equipment tracking (equipment-analysis-processor)
/api/v1/compliance/*    → Compliance services (compliance-validator)
/api/v1/proposals/*     → Proposal generation (proposal-generator)
/api/v1/analytics/*     → Analytics and reporting (analytics-dashboard)
/api/v1/ai/*           → AI services (ai-orchestration-service)
```

## 📋 DEVELOPMENT PHASES

### **Phase 1: Foundation (Week 1)**
- [ ] Initialize Node.js + TypeScript + Express project
- [ ] Set up Docker containerization
- [ ] Implement basic authentication and JWT handling
- [ ] Create API routing framework
- [ ] Connect to Redis for caching and sessions

### **Phase 2: Core Gateway (Week 2)**
- [ ] Implement rate limiting and security middleware
- [ ] Build service discovery and health checking
- [ ] Create request/response transformation
- [ ] Add comprehensive logging and monitoring
- [ ] Test with existing Zoho Catalyst services

### **Phase 3: Advanced Features (Week 3)**
- [ ] API versioning and backward compatibility
- [ ] Advanced security features and threat detection
- [ ] Performance optimization and caching strategies
- [ ] Developer portal and documentation
- [ ] Production deployment and monitoring

## 🔐 SECURITY REQUIREMENTS

### **Authentication & Authorization**
- **Multi-factor Authentication:** Support for MFA across all applications
- **Role-Based Access:** Granular permissions for different user types
- **API Key Management:** Secure key generation, rotation, and revocation
- **Token Security:** Short-lived access tokens with refresh mechanisms
- **Audit Logging:** Complete audit trail of all API access

### **Protection Mechanisms**
- **Rate Limiting:** Configurable limits per endpoint and user
- **DDoS Protection:** Automated detection and mitigation
- **Request Validation:** Schema validation and sanitization
- **SQL Injection Prevention:** Parameterized queries and validation
- **XSS Protection:** Content sanitization and security headers

## 🚀 SUCCESS METRICS

### **Performance Targets**
- **Latency:** < 50ms additional latency per request
- **Throughput:** Handle 10,000+ requests per minute
- **Availability:** 99.9% uptime with automatic failover
- **Scalability:** Auto-scaling based on load patterns

### **Security Standards**
- **Zero Security Incidents:** No unauthorized access or data breaches
- **Compliance:** SOC 2 Type II and industry security standards
- **Monitoring:** Real-time threat detection and alerting
- **Recovery:** < 1 minute recovery time from security incidents

## 💼 DELIVERABLES

### **Core Gateway Services**
1. **Authentication Hub** with unified login across all applications
2. **API Router** with load balancing and health checks
3. **Security Layer** with rate limiting and threat protection
4. **Monitoring Suite** with real-time analytics and alerting
5. **Developer Portal** with documentation and API explorer

### **Integration & Deployment**
1. **Service Integration** with all existing Energen applications
2. **Docker Containers** for consistent deployment
3. **CI/CD Pipeline** with automated testing and deployment
4. **Monitoring Dashboard** for operational visibility
5. **Documentation** for API consumers and developers

## 📁 PROJECT STRUCTURE

```
energen-api-gateway/
├── src/
│   ├── middleware/
│   │   ├── auth.ts
│   │   ├── rateLimit.ts
│   │   ├── security.ts
│   │   └── monitoring.ts
│   ├── routes/
│   │   ├── auth.ts
│   │   ├── api.ts
│   │   └── admin.ts
│   ├── services/
│   │   ├── authService.ts
│   │   ├── routingService.ts
│   │   └── monitoringService.ts
│   ├── utils/
│   └── app.ts
├── config/
├── docker/
├── docs/
├── tests/
├── package.json
├── tsconfig.json
├── Dockerfile
└── docker-compose.yml
```

---

**🎯 PRIORITY FOCUS:** Start with authentication hub and basic API routing. This establishes the foundation for all other Energen applications to connect through a unified gateway.

**🚀 SUCCESS INDICATOR:** When all Energen applications (mobile, web, client portal, operations) can authenticate and make API calls through a single, secure, high-performance gateway.

**📞 NEED HELP?** Update this file with questions or blockers, and check for responses from the main development team.