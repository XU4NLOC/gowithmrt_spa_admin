# GoWithMRT Admin Panel - Deployment Guide

This guide will walk you through deploying the GoWithMRT Admin Panel to Vercel.

## Prerequisites

- Node.js 18+ installed locally
- A Vercel account (free tier available)
- Access to your backend server
- Git repository hosted on GitHub, GitLab, or Bitbucket

## Environment Variables

Before deploying, you need to set up the following environment variables:

### Required Environment Variables

1. **BACKEND_API_BASE** (Server-side only)
   - Used by Next.js API routes to communicate with your backend
   - Example: `https://gowithmrt-server-641462240791.us-central1.run.app`

2. **NEXT_PUBLIC_BACKEND_API_BASE** (Client-side accessible)
   - Used by client-side code for direct backend API calls
   - Example: `https://gowithmrt-server-641462240791.us-central1.run.app`

3. **NEXT_PUBLIC_API_BASE** (Optional)
   - Used for internal Next.js API routes
   - If not set, the app will auto-detect the current domain
   - Example: `https://your-app.vercel.app`

## Deployment Steps

### Step 1: Prepare Your Repository

1. Ensure all changes are committed and pushed to your Git repository
2. Make sure your `package.json` has the correct build scripts:
   ```json
   {
     "scripts": {
       "build": "next build",
       "start": "next start"
     }
   }
   ```

### Step 2: Deploy to Vercel

#### Option A: Using Vercel Dashboard (Recommended)

1. Go to [vercel.com](https://vercel.com) and sign in
2. Click "New Project"
3. Import your Git repository
4. Configure the project:
   - **Framework Preset**: Next.js
   - **Root Directory**: `./` (if your Next.js app is in the root)
   - **Build Command**: `npm run build` (should be auto-detected)
   - **Output Directory**: `.next` (should be auto-detected)

#### Option B: Using Vercel CLI

1. Install Vercel CLI:
   ```bash
   npm i -g vercel
   ```

2. Login to Vercel:
   ```bash
   vercel login
   ```

3. Deploy from your project directory:
   ```bash
   vercel
   ```

### Step 3: Configure Environment Variables

In your Vercel project dashboard:

1. Go to **Settings** → **Environment Variables**
2. Add the following variables:

   | Name | Value | Environment |
   |------|-------|-------------|
   | `BACKEND_API_BASE` | `https://gowithmrt-server-641462240791.us-central1.run.app` | Production |
   | `NEXT_PUBLIC_BACKEND_API_BASE` | `https://gowithmrt-server-641462240791.us-central1.run.app` | Production |
   | `NEXT_PUBLIC_API_BASE` | `https://your-app.vercel.app` | Production (Optional) |

3. Click **Save** for each variable

### Step 4: Redeploy

After adding environment variables:
1. Go to **Deployments** tab
2. Click the **...** menu on the latest deployment
3. Select **Redeploy**

## Architecture Overview

### Smart API Routing

The application uses intelligent API routing that adapts to the environment:

- **Development Environment**: Direct API calls to backend server for optimal performance
- **Production Environment**: Proxy API routes through Next.js to avoid CORS issues

### API Endpoints

The following endpoints are automatically configured:

- **Authentication**: Direct backend calls
- **Advertisements**: Environment-aware routing (proxy in production, direct in development)
- **Customer Management**: Direct backend calls
- **Transactions**: Direct backend calls
- **Analytics**: Direct backend calls

## Troubleshooting

### Common Issues

1. **"Failed to fetch" errors**
   - Check that your backend server is accessible from Vercel
   - Verify environment variables are set correctly
   - Check browser console for CORS errors

2. **Environment variables not working**
   - Ensure variables starting with `NEXT_PUBLIC_` are used for client-side code
   - Redeploy after adding new environment variables
   - Check the Environment Variables section in Vercel dashboard

3. **Build failures**
   - Check that all dependencies are listed in `package.json`
   - Ensure TypeScript types are correct
   - Review build logs in Vercel dashboard

### Debug Information

The application includes debug logging to help troubleshoot issues:
- Check browser console for API endpoint information
- Environment detection logs show which endpoints are being used
- API proxy routes include detailed logging

## Production Checklist

Before going live:

- [ ] All environment variables are set correctly
- [ ] Backend server is accessible and responding
- [ ] Authentication is working properly
- [ ] All admin features are functional
- [ ] CORS is properly configured on your backend
- [ ] SSL certificates are valid
- [ ] Database connections are stable

## Security Considerations

1. **Environment Variables**: Never commit sensitive environment variables to your repository
2. **CORS**: Ensure your backend only allows requests from your Vercel domain
3. **Authentication**: Verify that authentication tokens are properly secured
4. **API Access**: Consider rate limiting for your backend APIs

## Custom Domain (Optional)

To use a custom domain:

1. In Vercel dashboard, go to **Settings** → **Domains**
2. Add your custom domain
3. Configure DNS records as instructed by Vercel
4. Update `NEXT_PUBLIC_API_BASE` if needed

## Support

If you encounter issues:
1. Check the Vercel deployment logs
2. Review browser console for client-side errors
3. Verify backend server logs
4. Ensure all environment variables are correctly set

---

## Local Development

For local development, use these environment variables in your `.env.local` file:

```env
BACKEND_API_BASE=http://localhost:8080
NEXT_PUBLIC_BACKEND_API_BASE=http://localhost:8080
NEXT_PUBLIC_API_BASE=http://localhost:3000
```

Run the development server:
```bash
npm run dev
```

The application will automatically use direct backend API calls in development for optimal performance.
