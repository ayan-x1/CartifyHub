# 🛒 CartifyHub

A modern full-stack e-commerce platform built with **Next.js**, offering 3D product previews, secure payments, and an admin dashboard.

---

## ✨ Key Features
- 3D product visualization (Three.js)
- Clerk authentication & protected routes
- Shopping cart with Stripe checkout (test mode)
- Order history & tracking
- Admin panel: product + order management
- Sales analytics & inventory tracking
- Fully responsive UI (Tailwind + shadcn/ui)

---

## ⚙️ Tech Stack
- **Frontend**: Next.js 13+, React, TypeScript  
- **Styling**: Tailwind CSS, shadcn/ui  
- **Database**: MongoDB + Mongoose  
- **Auth**: Clerk  
- **Payments**: Stripe (test mode)  
- **Jobs**: Inngest  
- **3D**: Three.js + react-three-fiber  

---

## 🚀 Setup

### Prerequisites
- Node.js 18+, MongoDB, Clerk, Stripe, Inngest

### Installation
```bash
git clone https://github.com/yourname/cartifyhub.git
cd cartifyhub
npm install
````

### Environment

Create `.env.local`:

```env
MONGODB_URI=mongodb://localhost:27017/cartifyhub
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_public_key
CLERK_SECRET_KEY=your_clerk_secret_key
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_stripe_public_key
STRIPE_SECRET_KEY=your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=your_webh_secret_key
NEXT_PUBLIC_BASE_URL=http://localhost:3000
NEXT_PUBLIC_EMAILJS_PUBLIC_KEY=your_emailjs_public_key
NEXT_PUBLIC_EMAILJS_SERVICE_ID=your_service_id
NEXT_PUBLIC_EMAILJS_TEMPLATE_ID=your_template_id
```

### Run

```bash
npm run dev
```

---

## 🏗 Structure

```
app/        → Next.js routes & APIs
components/ → UI components
models/     → Mongoose models
lib/        → Utilities
scripts/    → DB seeding, helpers
```

---

## 🚢 Deployment

* Deploy to **Vercel**
* Use **MongoDB Atlas** in production
* Configure env variables in Vercel
* Add Stripe webhook: `/api/stripe/webhook`

---

## 📞 Contact/Support

* 📧 Email: [pathanayan8347@email.com](mailto:pathanayan8347@email.com)
* Check docs & comments
* Open issues for bugs or questions