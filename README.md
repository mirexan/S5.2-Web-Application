# 🌿 Boticarium Herbalist - E-commerce API

> Professional E-commerce Solution developed in collaboration with **Boticarium Herbalist Shop**  
> Spring Boot API with Domain-Driven Design, Gamification & Advanced Stock Management

![Java](https://img.shields.io/badge/Java-21-orange)
![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.5.10-brightgreen)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-blue)
![React](https://img.shields.io/badge/React-18-61dafb)
![Docker](https://img.shields.io/badge/Docker-✓-2496ED)
![Production](https://img.shields.io/badge/Production-Ready-success)



## 📋 Project Overview

**Developed in collaboration with Boticarium Herbalist Shop**, this project is a complete E-commerce API that powers Boticarium's online store. The system handles real-world herbalist shop requirements including product inventory with batch tracking, customer loyalty programs, and secure order processing with business-specific rules.

The application implements **Domain-Driven Design** principles tailored to the herbal products industry and is fully Dockerized for reliable deployment. Currently deployed and serving real customers at Boticarium's online store.

**🌐 Live Store:** [Visit Boticarium Online Store](https://boticarium-web.onrender.com)  
**🔧 API (Swagger UI):** [Production Swagger](https://boticarium-api.onrender.com/swagger-ui/index.html)

---


## 🏗️ Architecture: Professional DDD Implementation

Developed with scalability and maintainability in mind, this architecture supports Boticarium's growing product catalog and customer base.


### Project Structure
```
src/main/java/com/boticarium/backend/
├── domain/ # BUSINESS CORE: Herbalist-specific logic
│ ├── model/ # Entities with herbal product behavior
│ │ ├── HerbalProduct.java # Rich domain model with batch tracking
│ │ ├── Customer.java # Customer with loyalty levels
│ │ └── Order.java # Order with herbal-specific rules
│ └── repository/ # Domain repositories
├── application/ # USE CASES: Business workflows
│ ├── service/ # Services implementing shop logic
│ ├── dto/ # Data contracts
│ └── mapper/ # Domain ↔ API mapping
└── infrastructure/ # TECHNICAL IMPLEMENTATION
├── api/ # REST endpoints
├── persistence/ # PostgreSQL + JSONB for product specs
├── external/ # Cloudinary, Payment gateway adapters
└── security/ # JWT, OAuth2, Role-based access
```

## 💼 Business Context & Features

Boticarium is a professional e-commerce platform developed for a real herbalist shop. The system implements business logic specifically designed for managing herbal products, customer relationships, and secure online transactions.

### Core Business Logic Implemented

**Smart Stock Management**
- Product stock is decremented atomically upon order creation
- Automatic status update to `OUT_OF_STOCK` when stock reaches 0
- Transaction rollback on insufficient stock to maintain data consistency

**Customer Gamification System**
- Users earn points based on their purchases
- Three-tier level progression: **Bronze → Silver → Gold**
- Points accumulation tracked in user profiles

**Dynamic Pricing Strategy**
- Automatic price calculation based on user loyalty level
- Configurable discounts applied per user tier
- Real-time price updates in product catalog

**Security & Role-Based Access Control**
- Strict separation between **ADMIN** (shop management) and **USER** (customer) roles
- Admins access sensitive business data: cost prices, profit margins, and management endpoints
- Users access only public catalog and their own orders
- JWT-based stateless authentication supporting business scalability

**Order Processing Workflow**
- Complete order lifecycle management
- Status tracking from creation to delivery
- Email notifications for order updates (optional local configuration)

---

## 🛠️ Technology Stack

### Backend & API
- **Java 21** - Modern Java version for performance
- **Spring Boot 3.5.10** - Production-ready framework
- **PostgreSQL 16** - Robust relational database with JSONB support for flexible product data
- **Spring Security 6** - Comprehensive security framework
- **JWT Authentication** - Secure API access
- **OAuth2** - Google login integration

### Frontend Integration
- **React 18** - Modern user interface library
- **Vite** - Fast build tool and development server

### DevOps & Infrastructure
- **Docker & Docker Compose** - Containerization for consistent environments
- **Maven** - Dependency management and build automation
- **Render** - Cloud platform for production deployment
- **Cloudinary** - Image storage and CDN for product images
- **Swagger/OpenAPI** - API documentation and testing

---

## 📊 API Endpoints

### Authentication
| Method | Endpoint | Description | Access |
|--------|----------|-------------|---------|
| POST | `/auth/register` | Register a new customer | Public |
| POST | `/auth/login` | Login to get a JWT token | Public |

### Product Catalog
| Method | Endpoint | Description | Access |
|--------|----------|-------------|---------|
| GET | `/products` | Browse public product catalog | Public |
| GET | `/products/{id}` | View specific product details | Public |

### Product Management (Admin)
| Method | Endpoint | Description | Access |
|--------|----------|-------------|---------|
| GET | `/products/management` | Get full product details including costs and stock | Admin |
| POST | `/products` | Create a new product entry | Admin |
| PUT | `/products/{id}` | Update product details and stock | Admin |

### Order Processing
| Method | Endpoint | Description | Access |
|--------|----------|-------------|---------|
| POST | `/orders` | Create a new purchase order | User/Admin |
| GET | `/orders/my-orders` | Get current user's order history | User/Admin |

### Order Management (Admin)
| Method | Endpoint | Description | Access |
|--------|----------|-------------|---------|
| PATCH | `/orders/management/{id}/status` | Update order status (e.g., SHIPPED/DELIVERED) | Admin |

### User Management
| Method | Endpoint | Description | Access |
|--------|----------|-------------|---------|
| GET | `/users/profile` | Get current user profile and loyalty status | User/Admin |

---

## 🚀 Production Deployment

The application is deployed on **Render** using a strategic split architecture:

### Backend Deployment
- **Type**: Web Service with Multi-Stage Dockerfile
- **URL**: https://boticarium-api.onrender.com
- **Technology**: Dockerized Spring Boot application
- **Database**: Managed PostgreSQL instance on Render with persistent storage

### Frontend Deployment
- **Type**: Static Site
- **URL**: https://boticarium-web.onrender.com
- **Communication**: REST API calls to backend service
- **Technology**: React build served as static files

### Secrets & Configuration Management
- **Local Development**: `secrets.properties` file (git-ignored)
- **Production**: Environment variables in Render dashboard
- **Security**: JWT secret keys, database credentials, and API keys managed securely

### CI/CD Pipeline
- **Docker Multi-Stage Builds**: Optimized production images
- **Build Stage**: Maven-based compilation and testing
- **Run Stage**: Lightweight JRE Alpine image for execution
- **Automatic Deployments**: Triggered on main branch updates

---

## 🔧 Local Development Setup

### Prerequisites
- Docker Desktop installed and running
- Java 21 (if running without Docker)
- Node.js LTS (for frontend development)
- Git installed

### Step-by-Step Installation

1. **Clone the repository**
```bash
git clone https://github.com/mirexan/S5.2-Web-Application.git
cd S5.2-Web-Application
```

2. **Configure Local Secrets (Optional)**
Create `src/main/resources/secrets.properties` (git-ignored) with your local secrets:

```properties
application.security.jwt.secret-key=YOUR_LOCAL_SECRET_KEY
```

You can also configure credentials via environment variables:

```bash
DB_URL=jdbc:postgresql://localhost:5432/boticarium_db
DB_USERNAME=admin
DB_PASSWORD=admin
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
JWT_SECRET_KEY=your_jwt_secret
CLOUDINARY_URL=your_cloudinary_url
```

3. **Run with the helper script (Windows)**
The project includes a helper script that starts Docker, the backend, and the frontend:

```bash
.\start-dev.bat
```

4. **Run manually (alternative)**
- Start PostgreSQL with Docker Compose:
```bash
docker compose up -d
```
- Start the backend:
```bash
./mvnw spring-boot:run -DskipTests
```
- Start the frontend:
```bash
cd boticarium-front
npm install
npm run dev
```

**Local URLs**
- Backend: `http://localhost:8080`
- Frontend: `http://localhost:5173`
- Swagger UI: `http://localhost:8080/swagger-ui/index.html`

---

## 🔐 Security & Design Decisions

### Identity & Access Management (IAM)
- **Stateless JWT authentication** for horizontal scalability
- **RBAC** with strict separation between **ADMIN** and **USER**
- **OAuth2 (Google Sign-In)** with ID token verification in the backend

### Secrets Management (12-Factor App)
- **Local**: `secrets.properties` (git-ignored)
- **Production**: environment variables in Render
- **Recovery**: admin access can be reset in production via environment variables (DataSeeder)

### Data Consistency
- **Atomic stock updates** inside order transactions with rollback on insufficient stock
- **Hybrid persistence** using PostgreSQL `jsonb` for flexible product attributes

---

## 🧪 Testing

- **API First**: Swagger/OpenAPI to validate contracts before frontend integration
- **Integration Tests**: `MockMvc` + `@SpringBootTest` for critical flows (checkout, login)

---

![Boticarium Bar](/src/main/resources/static/images/barra.jpg)