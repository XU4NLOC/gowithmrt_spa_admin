# GoWithMRT Back Office Dashboard

**GoWithMRT Back Office** is a comprehensive administrative dashboard system designed to manage and monitor the GoWithMRT mobile application ecosystem. Built with Next.js 15 and modern web technologies, it provides powerful analytics, user management, and advertising campaign tools for the GoWithMRT shared transportation platform.

[![Live Demo](https://img.shields.io/badge/Live%20Demo-GoWithMRT%20Back%20Office-blue?style=for-the-badge&logo=vercel)](https://gwmrt-back0ffice.vercel.app)
[![Next.js](https://img.shields.io/badge/Next.js-15.5.3-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-3.4.16-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)
[![RMIT Showcase](https://img.shields.io/badge/RMIT%20Showcase-2025%20Project-green?style=for-the-badge&logo=graduation-cap)](https://www.rmitvn-showcase.com/vskode)

> **📢 Project Showcase**: This project is featured on the [RMIT Vietnam Showcase 2025](https://www.rmitvn-showcase.com/vskode) under **Science, Engineering & Technology > School Projects > 2025**. Visit the showcase to see our complete project presentation and additional resources.

## 🚇 About GoWithMRT

**GoWithMRT** is a mobile application designed to facilitate shared, cost-effective transportation for commuters after their MRT journey, addressing the "last-mile" challenge in Ho Chi Minh City's Metro Rail Transit (MRT) system. The platform connects passengers exiting at the same station who share similar final destinations, increasing convenience, reducing travel time and costs, and encouraging MRT adoption.

This Back Office system serves as the administrative control center, providing comprehensive management capabilities for the GoWithMRT ecosystem.

## 🎯 Project Information

**Academic Institution:** RMIT University Vietnam  
**Project Type:** Capstone Project 2025  
**Development Team:** VsKode  
**Repository:** [https://github.com/tonyvo1989/gowmrt-app-server.git](https://github.com/tonyvo1989/gowmrt-app-server.git)

### Team Members

- **Do Xuan Gia Bao** (s3932184) - Lead Developer
  - School Email: [s3932184@rmit.edu.vn](mailto:s3932184@rmit.edu.vn)
  - Personal Email: [giabaodoxuan0504@gmail.com](mailto:giabaodoxuan0504@gmail.com)
- **Le Xuan Loc** (s3955317) - Developer
- **Kim Minsung** (s3866724) - Developer
- **Do Nhat Thanh** (s3977947) - Developer
- **Han Yeeun** (s3912055) - Developer

### Supervisors

- **Academic Supervisor:** Nguyen Thien Bao
- **Industry Supervisor:** Vo Van Thuan (Tony) - Nextway Technology

## ✨ Key Features

### 📊 **Advanced Analytics Dashboard**

- **Period-based Analytics**: Switch between 7 days, 30 days, 4 quarters, and 12 months views
- **Real-time Metrics**: User growth, transaction growth, and revenue analytics
- **Interactive Charts**: ApexCharts-powered visualizations with responsive design
- **Customizable Timeframes**: Dynamic data filtering and visualization

### 👥 **User Management**

- **Customer Administration**: Comprehensive user account management
- **User Analytics**: Behavior tracking and engagement metrics
- **Bulk Operations**: Efficient management of multiple user accounts
- **Account Status Management**: Enable/disable user accounts and track user activity

### 📱 **Mobile Integration**

- **Advertisement Management**: Create, schedule, and monitor ad campaigns
- **Click Tracking**: Real-time advertisement performance analytics
- **Campaign Scheduling**: Immediate and scheduled advertisement publishing
- **Performance Metrics**: Detailed engagement and conversion tracking

### 🚉 **Transit Analytics**

- **Station-specific Data**: Ben Thanh Station gate distribution analytics
- **Revenue Tracking**: Top users by revenue with dynamic period filtering
- **Growth Metrics**: User and transaction growth visualization
- **Performance Monitoring**: Track system usage and user engagement patterns

### 🔐 **Security & Authentication**

- **Secure Login System**: JWT-based authentication
- **Remember Me Functionality**: Persistent session management
- **Protected Routes**: Authentication-based access control
- **Session Management**: Automatic token refresh and validation

## 🛠️ Technology Stack

- **Frontend Framework**: Next.js 15.5.3 with App Router
- **UI Library**: React 19.0.0 with TypeScript 5.0
- **Styling**: Tailwind CSS 3.4.16
- **Charts**: ApexCharts 4.5.0 with React integration
- **State Management**: React Context API
- **Authentication**: JWT tokens with localStorage persistence
- **Deployment**: Vercel
- **Backend Integration**: RESTful API with Google Cloud Run

## 🚀 Quick Start

### Prerequisites

- Node.js 18.0 or higher
- npm or yarn package manager
- Git

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/tonyvo1989/gowmrt-spa-admin.git
   cd gowmrt-spa-admin
   ```

2. **Install dependencies**

   ```bash
   npm install
   # or
   yarn install
   ```

3. **Environment Configuration**

   ```bash
   cp env.example .env.local
   ```

   Configure your environment variables in `.env.local`:

   ```env
   # Backend API Configuration
   BACKEND_API_BASE=[YOUR PRODUCTION BACKEND API HERE]
   NEXT_PUBLIC_BACKEND_API_BASE=[YOUR PRODUCTION BACKEND API HERE]

   # Next.js Configuration
   NEXT_PUBLIC_API_BASE=http://localhost:3000
   ```

4. **Start development server**

   ```bash
   npm run dev
   # or
   yarn dev
   ```

5. **Access the application**
   Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📁 Project Structure

```
gowmrt-back-office/
├── src/
│   ├── app/                    # Next.js App Router pages
│   │   ├── dashboard/         # Main dashboard page
│   │   ├── management/        # Management pages (ads, customers, transactions)
│   │   ├── auth/             # Authentication pages
│   │   └── api/              # API routes
│   ├── components/           # Reusable UI components
│   │   ├── Charts/           # Chart components
│   │   ├── Auth/             # Authentication components
│   │   ├── Layouts/          # Layout components
│   │   └── ui/               # Base UI components
│   ├── services/             # API service functions
│   ├── contexts/             # React Context providers
│   ├── hooks/                # Custom React hooks
│   ├── lib/                  # Utility functions
│   └── types/                # TypeScript type definitions
├── public/                   # Static assets
├── tailwind.config.ts        # Tailwind CSS configuration
├── next.config.mjs          # Next.js configuration
└── package.json             # Project dependencies
```

## 🔧 Configuration

### Environment Variables

| Variable                       | Description                           | Required |
| ------------------------------ | ------------------------------------- | -------- |
| `BACKEND_API_BASE`             | Backend API URL for server-side calls | Yes      |
| `NEXT_PUBLIC_BACKEND_API_BASE` | Backend API URL for client-side calls | Yes      |
| `NEXT_PUBLIC_API_BASE`         | Next.js API base URL                  | Yes      |

### API Integration

The system integrates with the GoWithMRT backend server hosted on Google Cloud Run:

- **Production Backend**: `your backend production API running on Google Cloud`
- **API Documentation**: Available through the backend server endpoints

## 📊 Dashboard Features

### Analytics Dashboard

- **Period Selection**: Dynamic time period filtering (7 days, 30 days, 4 quarters, 12 months)
- **Metric Cards**: Total users, transactions, revenue, and top contributor metrics
- **Growth Charts**: User growth, transaction growth, and revenue growth visualizations
- **Station Analytics**: Ben Thanh Station gate distribution analysis
- **Top Users**: Revenue-based user ranking with dynamic period filtering

### Management Tools

- **Customer Management**: User account administration and status management
- **Advertisement Management**: Campaign creation, scheduling, and performance tracking
- **Transaction Monitoring**: Comprehensive transaction analytics and reporting

## 🚀 Deployment

### Vercel Deployment

1. **Connect to Vercel**

   ```bash
   npm i -g vercel
   vercel login
   vercel
   ```

2. **Configure Environment Variables**
   Set the following environment variables in your Vercel dashboard:

   - `BACKEND_API_BASE`
   - `NEXT_PUBLIC_BACKEND_API_BASE`
   - `NEXT_PUBLIC_API_BASE`

3. **Deploy**
   ```bash
   vercel --prod
   ```

### Production URL

- **Live Application**: [https://gwmrt-back0ffice.vercel.app](https://gwmrt-back0ffice.vercel.app)

## 🧪 Development

### Available Scripts

```bash
# Development
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint

# Code Quality
npm run lint:fix     # Fix ESLint issues
```

### Code Standards

- **TypeScript**: Strict type checking enabled
- **ESLint**: Next.js recommended configuration
- **Prettier**: Code formatting with Tailwind CSS plugin
- **Conventional Commits**: Standardized commit messages

## 🐛 Troubleshooting

### Common Issues

**Build Errors**

```bash
# Clear Next.js cache
rm -rf .next
npm run build
```

**Environment Variables**

- Ensure all required environment variables are set
- Check `.env.local` file exists and is properly configured
- Verify API endpoints are accessible

**Authentication Issues**

- Clear browser localStorage
- Check JWT token validity
- Verify backend API connectivity

**Chart Rendering Issues**

- Ensure ApexCharts dependencies are installed
- Check data format compatibility
- Verify responsive design breakpoints

### Performance Optimization

- Enable Next.js production optimizations
- Use dynamic imports for large components
- Implement proper loading states
- Optimize chart rendering with proper data structures

## 📞 Support & Contact

### Technical Support

- **Repository Issues**: [GitHub Issues](https://github.com/your-username/gowmrt-back-office/issues)
- **Documentation**: [Project Wiki](https://github.com/your-username/gowmrt-back-office/wiki)

### Team Contact

- **Team Leader & Lead Developer**: Do Xuan Gia Bao (s3932184)
  - School Email: [s3932184@rmit.edu.vn](mailto:s3932184@rmit.edu.vn)
  - Personal Email: [giabaodoxuan0504@gmail.com](mailto:giabaodoxuan0504@gmail.com)
- **Industry Partner & CTO**: Vo Van Thuan (Tony) - Nextway Technology
- **Academic Supervisor**: Nguyen Thien Bao

### Collaboration & Partnerships

For any collaboration opportunities, partnerships, or further development inquiries, please contact:

- **Do Xuan Gia Bao** (Team Leader) - [giabaodoxuan0504@gmail.com](mailto:giabaodoxuan0504@gmail.com)
- **Vo Van Thuan** (CTO, Nextway Technology) - [thuan.vo@nextwaytech.vn](mailto:thuan.vo@nextwaytech.vn)

### Resources

- **Live Demo**: [https://gwmrt-back0ffice.vercel.app](https://gwmrt-back0ffice.vercel.app)
- **Backend API**: [https://gowithmrt-server-641462240791.us-central1.run.app](https://gowithmrt-server-641462240791.us-central1.run.app)
- **Project Repository**: [https://github.com/tonyvo1989/gowmrt-app-server.git](https://github.com/tonyvo1989/gowmrt-app-server.git)
- **Mobile App Repository**: [https://github.com/tonyvo1989/gowmrt-mobile-app.git](https://github.com/tonyvo1989/gowmrt-mobile-app.git) _(Development Version)_
- **RMIT Showcase**: [https://www.rmitvn-showcase.com/vskode](https://www.rmitvn-showcase.com/vskode)

## 📄 License

This project is developed as part of the RMIT University Vietnam Capstone Project 2025 program. All rights reserved by the VsKode development team and RMIT University Vietnam.

## 🙏 Acknowledgments

- **RMIT University Vietnam** for academic guidance and support
- **Nextway Technology** for industry partnership and technical mentorship
- **Next.js Team** for the excellent framework and documentation
- **Vercel** for seamless deployment and hosting services
- **Open Source Community** for the amazing tools and libraries

---

**GoWithMRT Back Office** - Empowering efficient shared transportation management through innovative technology solutions.

_Built with ❤️ by the VsKode team at RMIT University Vietnam - Capstone Project 2025_
