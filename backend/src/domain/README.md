# Domain Model for Vecino Marketplace

This directory contains the core domain model for the Vecino Marketplace application, following Domain-Driven Design principles.

## Bounded Contexts

The application is divided into the following bounded contexts:

1. **Identity Context** - User management, authentication, and authorization
2. **Catalog Context** - Product listings, categories, and reviews
3. **Ordering Context** - Order processing, checkout, and payment
4. **Messaging Context** - Communication between buyers and sellers
5. **Notification Context** - User notifications and alerts

## Context Map

The following diagram shows how the bounded contexts interact with each other:

```mermaid
graph TD
    Identity[Identity Context]
    Catalog[Catalog Context]
    Ordering[Ordering Context]
    Messaging[Messaging Context]
    Notification[Notification Context]

    Identity -->|User data| Catalog
    Identity -->|User data| Ordering
    Identity -->|User data| Messaging

    Catalog -->|Product data| Ordering
    Catalog -->|Product data| Messaging

    Ordering -->|Order events| Notification
    Messaging -->|Message events| Notification

    style Identity fill:#f9f,stroke:#333,stroke-width:2px
    style Catalog fill:#bbf,stroke:#333,stroke-width:2px
    style Ordering fill:#bfb,stroke:#333,stroke-width:2px
    style Messaging fill:#fbf,stroke:#333,stroke-width:2px
    style Notification fill:#fbb,stroke:#333,stroke-width:2px
```

## Core Entities

### Identity Context

- `User` - Users of the system with roles (buyer, seller, admin)

### Catalog Context

- `Product` - Items for sale in the marketplace
- `Category` - Product categories for organization
- `Review` - User reviews for products

### Ordering Context

- `Order` - A purchase transaction
- `OrderItem` - Individual items within an order

### Messaging Context

- `Conversation` - Communication thread between users
- `Message` - Individual messages within a conversation

### Notification Context

- `Notification` - User alerts and notifications

## Aggregates

- `UserAggregate` - User and related information
- `ProductAggregate` - Product and related specifications/images
- `CategoryAggregate` - Category and related attributes
- `OrderAggregate` - Order and its line items
- `ConversationAggregate` - Conversation and its messages
- `NotificationAggregate` - Standalone notification

## Value Objects

- `Address` - Structure for storing location data
- `Money` - Represents monetary values with currency
- `GeoLocation` - Latitude and longitude for location-based services
- `ProductSpecification` - Key-value pairs for product attributes
- `ImageMetadata` - Information about product images

## Domain Model Diagram

```mermaid
classDiagram
    class User {
        +id: string
        +email: string
        +name: string
        +passwordHash: string
        +role: UserRole
        +address?: Address
        +phone?: string
        +createdAt: Date
        +updatedAt: Date
    }

    class Product {
        +id: string
        +title: string
        +description: string
        +price: Money
        +sellerId: string
        +categoryId: string
        +status: ProductStatus
        +condition: ProductCondition
        +location?: GeoLocation
        +specifications?: ProductSpecification[]
        +images: ImageMetadata[]
        +tags?: string[]
        +createdAt: Date
        +updatedAt: Date
    }

    class Category {
        +id: string
        +name: string
        +description?: string
        +parentCategoryId?: string
        +attributes?: string[]
        +createdAt: Date
        +updatedAt: Date
    }

    class Order {
        +id: string
        +buyerId: string
        +sellerId: string
        +status: OrderStatus
        +items: OrderItem[]
        +subtotal: Money
        +tax: Money
        +total: Money
        +shippingAddress: Address
        +paymentMethod?: string
        +paymentId?: string
        +createdAt: Date
        +updatedAt: Date
    }

    class OrderItem {
        +id: string
        +orderId: string
        +productId: string
        +productSnapshot: Partial~Product~
        +quantity: number
        +unitPrice: Money
        +totalPrice: Money
    }

    class Conversation {
        +id: string
        +participants: string[]
        +productId?: string
        +lastMessageId?: string
        +lastMessageAt: Date
        +createdAt: Date
    }

    class Message {
        +id: string
        +conversationId: string
        +senderId: string
        +recipientId: string
        +content: string
        +attachments?: string[]
        +read: boolean
        +createdAt: Date
    }

    class Review {
        +id: string
        +productId: string
        +reviewerId: string
        +rating: number
        +title?: string
        +comment?: string
        +createdAt: Date
        +updatedAt: Date
    }

    class Notification {
        +id: string
        +userId: string
        +type: NotificationType
        +title: string
        +message: string
        +read: boolean
        +data?: object
        +createdAt: Date
    }

    User "1" --> "0..*" Product : sells
    User "1" --> "0..*" Order : places/receives
    User "1" --> "0..*" Review : writes
    User "1" --> "0..*" Message : sends
    User "1" --> "0..*" Notification : receives

    Product "0..*" --> "1" Category : belongs to
    Product "1" --> "0..*" Review : receives
    Product "0..*" --> "0..*" OrderItem : purchased in

    Order "1" --> "1..*" OrderItem : contains

    Conversation "1" --> "0..*" Message : contains
    Conversation "0..*" --> "1" Product : about

    OrderItem "0..*" --> "1" Product : references
```

## Repository Structure

The domain model is structured as follows:

- `domain-model.ts` - Core domain model interfaces and types
- `domain-contexts.ts` - Definition of bounded contexts and their relationships
- `repositories/` - Repository interfaces for persistence operations
